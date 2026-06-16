import { countWords as countWordsInPortableText } from "./portableText";
import type { GeneratedSupportingPageContent } from "./types";

export function getCombinedCopy(content: GeneratedSupportingPageContent): string {
  const faqText = content.pageFaqs.map((faq) => `${faq.question} ${faq.answer}`).join(" ");
  const deepText = content.aboveFoldDeepContent.map((section) => section.text).join(" ");
  return [content.introParagraphs.join(" "), deepText, faqText].join(" ");
}

export function countWords(text: string): number {
  return countWordsInPortableText(text);
}

export function textIncludesPhrase(haystack: string, phrase: string): boolean {
  const needle = phrase.trim().toLowerCase();
  if (!needle) return false;
  return haystack.toLowerCase().includes(needle);
}
