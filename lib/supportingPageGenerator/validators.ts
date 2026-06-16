import { countWords, getCombinedCopy, textIncludesPhrase } from "./contentText";
import { slugifyKeyword, startsWithKeyword } from "./slugify";
import type { GeneratedSupportingPageContent } from "./types";

const TRANSACTIONAL_TERMS = ["buy", "bulk", "wholesale", "order", "quote", "stock", "pricing", "purchase"];

export type ValidationResult = { ok: true } | { ok: false; errors: string[] };

export function validateGeneratedContent(
  content: GeneratedSupportingPageContent,
  slug: string,
): ValidationResult {
  const errors: string[] = [];
  const keyword = content.exactKeyword.trim();

  if (slugifyKeyword(keyword) !== slug) {
    errors.push(`Slug "${slug}" must exactly match slugified keyword "${slugifyKeyword(keyword)}"`);
  }

  if (!startsWithKeyword(content.metaTitle, keyword)) {
    errors.push("Meta title must start with the exact keyword");
  }

  if (!startsWithKeyword(content.metaDescription, keyword)) {
    errors.push("Meta description must start with the exact keyword");
  }

  if (!startsWithKeyword(content.subH1, keyword)) {
    errors.push("Sub H1 must start with the exact keyword");
  }

  if (content.introParagraphs.length === 0 || content.introParagraphs.length > 2) {
    errors.push("Intro paragraphs must contain 1–2 items");
  } else if (!startsWithKeyword(content.introParagraphs[0], keyword)) {
    errors.push("First intro paragraph must start with the exact keyword");
  }

  if (content.keywordVariations.length !== 10) {
    errors.push("keywordVariations must contain exactly 10 items");
  }

  if (content.pageFaqs.length !== 3) {
    errors.push("pageFaqs must contain exactly 3 items");
  }

  const hasH2 = content.aboveFoldDeepContent.some((section) => section.style === "h2");
  if (!hasH2) {
    errors.push("aboveFoldDeepContent must include at least one H2 section");
  }

  const copy = getCombinedCopy(content);
  const wordCount = countWords(copy);
  if (wordCount < 400 || wordCount > 1200) {
    errors.push(`Combined content word count should be ~600–900 (got ${wordCount})`);
  }

  const variationsFound = content.keywordVariations.filter((variation) =>
    textIncludesPhrase(copy, variation),
  ).length;
  if (variationsFound < 8) {
    errors.push(`At least 8 keyword variations must appear in content (found ${variationsFound})`);
  }

  const hasTransactional = TRANSACTIONAL_TERMS.some((term) => copy.toLowerCase().includes(term));
  if (!hasTransactional) {
    errors.push("Content should include transactional wholesale language (buy, bulk, order, etc.)");
  }

  for (const faq of content.pageFaqs) {
    const question = faq.question.toLowerCase();
    const mentionsKeyword =
      question.includes(keyword.toLowerCase()) ||
      content.keywordVariations.some((variation) => question.includes(variation.toLowerCase()));
    if (!mentionsKeyword) {
      errors.push(`FAQ question should reference the keyword: "${faq.question}"`);
    }
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true };
}
