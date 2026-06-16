import { enrichGeneratedContent } from "./enrichContent";
import { generateSupportingPageContent } from "./generateContent";
import { validateGeneratedContent } from "./validators";
import type { GeneratedSupportingPageContent } from "./types";

const MAX_GENERATION_ATTEMPTS = 3;

export type ValidatedGenerationResult =
  | { ok: true; content: GeneratedSupportingPageContent; provider: string }
  | { ok: false; errors: string[] };

export async function generateValidatedSupportingPageContent(
  keyword: string,
  slug: string,
  exhaustedProviders: Set<string>,
): Promise<ValidatedGenerationResult> {
  let lastErrors: string[] = [];

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    try {
      const { content: raw, provider } = await generateSupportingPageContent(
        keyword,
        attempt > 0 ? lastErrors : undefined,
        exhaustedProviders,
      );
      const content = enrichGeneratedContent(raw);
      const validation = validateGeneratedContent(content, slug);
      if (validation.ok) {
        return { ok: true, content, provider };
      }
      lastErrors = validation.errors;
    } catch (err) {
      lastErrors = [err instanceof Error ? err.message : "Generation failed"];
      if (attempt === MAX_GENERATION_ATTEMPTS - 1) {
        return { ok: false, errors: lastErrors };
      }
    }
  }

  return { ok: false, errors: lastErrors };
}
