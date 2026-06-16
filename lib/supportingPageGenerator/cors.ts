const DEFAULT_ALLOWED_ORIGIN_PATTERNS = [
  /^http:\/\/localhost:\d+$/,
  /^https:\/\/localhost:\d+$/,
  /^https:\/\/[a-z0-9-]+\.sanity\.studio$/,
  /^https:\/\/[a-z0-9-]+\.sanity\.dev$/,
];

function isAllowedOrigin(origin: string): boolean {
  const extra = (process.env.GENERATOR_ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (extra.includes(origin)) return true;
  return DEFAULT_ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
}

export function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("origin");
  if (!origin || !isAllowedOrigin(origin)) {
    return {};
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    Vary: "Origin",
  };
}

export function jsonWithCors(request: Request, body: unknown, init?: ResponseInit) {
  return Response.json(body, {
    ...init,
    headers: {
      ...corsHeaders(request),
      ...(init?.headers || {}),
    },
  });
}

export function normalizeSiteUrl(raw?: string): string {
  const value = raw?.trim() || "http://localhost:3000";
  if (value.startsWith("https://localhost") || value.startsWith("https://127.0.0.1")) {
    return value.replace("https://", "http://");
  }
  return value.replace(/\/$/, "");
}

const DEFAULT_PUBLIC_SITE_URL = "https://www.steroidssupplies.co.uk";

function isPreviewSiteUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1|\.vercel\.app/i.test(url);
}

/** Canonical live-site origin for generator result links (not the Vercel preview host). */
export function getGeneratorPublicSiteUrl(): string {
  const explicit = normalizeSiteUrl(process.env.GENERATOR_PUBLIC_SITE_URL);
  if (process.env.GENERATOR_PUBLIC_SITE_URL?.trim()) {
    return explicit;
  }

  const configured = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (!isPreviewSiteUrl(configured)) {
    return configured;
  }

  return DEFAULT_PUBLIC_SITE_URL;
}
