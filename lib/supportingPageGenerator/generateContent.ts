import type { GeneratedSupportingPageContent } from "./types";
import { buildSupportingPagePrompt } from "./prompt";

const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
];

const OPENROUTER_MODELS = [
  "openai/gpt-4o-mini",
  "meta-llama/llama-3.3-70b-instruct",
  "meta-llama/llama-3.1-8b-instruct",
  "mistralai/mistral-7b-instruct",
];

// Tried in order: primary → low-resource fallback → higher-quality options
const OLLAMA_MODELS = [
  "gemma3:12b",
  "gemma3:4b",
  "gemma3:27b",
  "gpt-oss:20b",
];

type RateLimitError = Error & { isRateLimit?: boolean };

function isRateLimitHttpError(status: number, detail: string): boolean {
  if (status === 429) return true;
  const lower = detail.toLowerCase();
  return (
    lower.includes("quota") ||
    lower.includes("rate_limit") ||
    lower.includes("rate limit") ||
    lower.includes("resource_exhausted") ||
    lower.includes("too many requests")
  );
}

function extractJsonObject(text: string): string {
  const start = text.indexOf("{");
  if (start === -1) throw new Error("Malformed JSON: no opening brace found");
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const char = text[i];
    if (escape) { escape = false; continue; }
    if (char === "\\" && inString) { escape = true; continue; }
    if (char === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (char === "{") depth++;
    else if (char === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  throw new Error("Malformed JSON: no matching closing brace");
}

function buildPrompt(keyword: string, retryErrors?: string[]): string {
  const basePrompt = buildSupportingPagePrompt(keyword);
  if (!retryErrors?.length) return basePrompt;
  return `${basePrompt}\n\nFix these validation errors from the previous attempt:\n- ${retryErrors.join("\n- ")}`;
}

// ─── Gemini ────────────────────────────────────────────────────────────────

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
};

async function generateWithGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err: RateLimitError = new Error("GEMINI_API_KEY is not configured");
    err.isRateLimit = true;
    throw err;
  }

  const envModel = process.env.GEMINI_MODEL;
  const models = envModel ? [envModel] : GEMINI_MODELS;
  let lastErr: RateLimitError = Object.assign(new Error("Gemini: all models exhausted"), { isRateLimit: true });

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.7 },
          }),
        },
      );

      const detail = await response.text();

      if (!response.ok) {
        if (isRateLimitHttpError(response.status, detail)) {
          console.warn(`[gemini] rate limit on ${model}, trying next model`);
          lastErr = Object.assign(new Error(`Gemini rate limit (${response.status})`), { isRateLimit: true });
          continue;
        }
        throw new Error(`Gemini API error (${response.status}): ${detail.slice(0, 400)}`);
      }

      const data = JSON.parse(detail) as GeminiResponse;
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error(`Gemini (${model}) returned empty content`);
      return text;
    } catch (err) {
      if ((err as RateLimitError).isRateLimit) {
        lastErr = err as RateLimitError;
        continue;
      }
      throw err;
    }
  }

  throw lastErr;
}

// ─── Groq ──────────────────────────────────────────────────────────────────

type GroqResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

async function generateWithGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    const err: RateLimitError = new Error("GROQ_API_KEY is not configured");
    err.isRateLimit = true;
    throw err;
  }

  const envModel = process.env.GROQ_MODEL;
  const models = envModel ? [envModel] : GROQ_MODELS;
  let lastErr: RateLimitError = Object.assign(new Error("Groq: all models exhausted"), { isRateLimit: true });

  for (const model of models) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "Return only valid JSON matching the requested schema. No markdown." },
            { role: "user", content: prompt },
          ],
        }),
      });

      const detail = await response.text();

      if (!response.ok) {
        if (isRateLimitHttpError(response.status, detail)) {
          console.warn(`[groq] rate limit on ${model}, trying next model`);
          lastErr = Object.assign(new Error(`Groq rate limit (${response.status})`), { isRateLimit: true });
          continue;
        }
        throw new Error(`Groq API error (${response.status}): ${detail.slice(0, 400)}`);
      }

      const data = JSON.parse(detail) as GroqResponse;
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error(`Groq (${model}) returned empty content`);
      return text;
    } catch (err) {
      if ((err as RateLimitError).isRateLimit) {
        lastErr = err as RateLimitError;
        continue;
      }
      throw err;
    }
  }

  throw lastErr;
}

// ─── Ollama ────────────────────────────────────────────────────────────────

type OllamaResponse = {
  message?: { content?: string };
};

async function generateWithOllama(prompt: string): Promise<string> {
  const apiKey = process.env.OLLAMA_API_KEY;
  if (!apiKey) {
    const err: RateLimitError = new Error("OLLAMA_API_KEY is not configured");
    err.isRateLimit = true;
    throw err;
  }

  const baseUrl = (process.env.OLLAMA_BASE_URL ?? "https://api.ollama.com").replace(/\/$/, "");
  let lastErr: RateLimitError = Object.assign(new Error("Ollama: all models exhausted"), { isRateLimit: true });

  for (const model of OLLAMA_MODELS) {
    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: "Return only valid JSON matching the requested schema. No markdown." },
            { role: "user", content: prompt },
          ],
          stream: false,
          format: "json",
        }),
      });

      const detail = await response.text();

      if (!response.ok) {
        if (isRateLimitHttpError(response.status, detail)) {
          console.warn(`[ollama] rate limit on ${model}, trying next model`);
          lastErr = Object.assign(new Error(`Ollama rate limit (${response.status})`), { isRateLimit: true });
          continue;
        }
        throw new Error(`Ollama API error (${response.status}): ${detail.slice(0, 400)}`);
      }

      const data = JSON.parse(detail) as OllamaResponse;
      const text = data.message?.content;
      if (!text) throw new Error(`Ollama (${model}) returned empty content`);
      return text;
    } catch (err) {
      if ((err as RateLimitError).isRateLimit) {
        lastErr = err as RateLimitError;
        continue;
      }
      // Network / connection refused → skip entire provider
      if (err instanceof TypeError) {
        const e: RateLimitError = new Error(`Ollama unavailable: ${(err as Error).message}`);
        e.isRateLimit = true;
        throw e;
      }
      throw err;
    }
  }

  throw lastErr;
}

// ─── OpenRouter ────────────────────────────────────────────────────────────

type OpenRouterResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

async function generateWithOpenRouter(prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    const err: RateLimitError = new Error("OPENROUTER_API_KEY is not configured");
    err.isRateLimit = true;
    throw err;
  }

  const envModel = process.env.OPENROUTER_MODEL;
  const models = envModel ? [envModel] : OPENROUTER_MODELS;
  let lastErr: RateLimitError = Object.assign(new Error("OpenRouter: all models exhausted"), { isRateLimit: true });

  for (const model of models) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          messages: [
            { role: "system", content: "Return only valid JSON matching the requested schema. No markdown." },
            { role: "user", content: prompt },
          ],
        }),
      });

      const detail = await response.text();

      if (!response.ok) {
        // 400/404 = invalid or missing model ID; treat same as rate limit (skip)
        if (isRateLimitHttpError(response.status, detail) || response.status === 400 || response.status === 404) {
          console.warn(`[openrouter] skipping ${model} (HTTP ${response.status}), trying next model`);
          lastErr = Object.assign(
            new Error(`OpenRouter skip (${response.status}) for ${model}`),
            { isRateLimit: true },
          );
          continue;
        }
        throw new Error(`OpenRouter API error (${response.status}): ${detail.slice(0, 400)}`);
      }

      const data = JSON.parse(detail) as OpenRouterResponse;
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error(`OpenRouter (${model}) returned empty content`);
      return text;
    } catch (err) {
      if ((err as RateLimitError).isRateLimit) {
        lastErr = err as RateLimitError;
        continue;
      }
      throw err;
    }
  }

  throw lastErr;
}

// ─── Provider orchestration ────────────────────────────────────────────────

const PROVIDER_GENERATORS: Record<string, (prompt: string) => Promise<string>> = {
  gemini: generateWithGemini,
  groq: generateWithGroq,
  ollama: generateWithOllama,
  openrouter: generateWithOpenRouter,
};

const DEFAULT_PROVIDER_ORDER = ["gemini", "groq", "ollama", "openrouter"];

function getProviderOrder(): string[] {
  const envOrder = process.env.AI_PROVIDER_ORDER;
  if (envOrder) {
    const parsed = envOrder.split(",").map((p) => p.trim().toLowerCase()).filter((p) => p in PROVIDER_GENERATORS);
    if (parsed.length > 0) return parsed;
  }
  return DEFAULT_PROVIDER_ORDER;
}

async function generateRawContent(
  prompt: string,
  exhaustedProviders: Set<string>,
): Promise<{ text: string; provider: string }> {
  const order = getProviderOrder();

  for (const provider of order) {
    if (exhaustedProviders.has(provider)) continue;

    try {
      const text = await PROVIDER_GENERATORS[provider](prompt);
      return { text, provider };
    } catch (err) {
      if ((err as RateLimitError).isRateLimit) {
        console.warn(`[supporting-page-generator] ${provider} exhausted, moving to next provider`);
        exhaustedProviders.add(provider);
        continue;
      }
      throw err;
    }
  }

  throw new Error("All AI providers exhausted. Configure API keys or wait for rate limits to reset.");
}

// ─── Public API ────────────────────────────────────────────────────────────

export async function generateSupportingPageContent(
  keyword: string,
  retryErrors?: string[],
  exhaustedProviders: Set<string> = new Set(),
): Promise<{ content: GeneratedSupportingPageContent; provider: string }> {
  const prompt = buildPrompt(keyword, retryErrors);
  const { text, provider } = await generateRawContent(prompt, exhaustedProviders);
  const jsonStr = extractJsonObject(text);
  const content = JSON.parse(jsonStr) as GeneratedSupportingPageContent;
  content.exactKeyword = keyword.trim();
  return { content, provider };
}
