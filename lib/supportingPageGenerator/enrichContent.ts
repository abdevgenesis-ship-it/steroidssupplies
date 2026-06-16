import { countWords, getCombinedCopy, textIncludesPhrase } from "./contentText";
import { slugifyKeyword } from "./slugify";
import type { GeneratedSupportingPageContent } from "./types";

const TRANSACTIONAL_TERMS = ["buy", "bulk", "wholesale", "order", "quote", "stock", "pricing", "purchase"];
const MIN_WORD_COUNT = 400;

function ensureTenVariations(keyword: string, variations: string[]): string[] {
  const deduped: string[] = [];
  const seen = new Set<string>();

  for (const variation of variations) {
    const trimmed = variation.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(trimmed);
  }

  const base = keyword.trim();
  const slugPhrase = slugifyKeyword(base).replace(/-/g, " ");
  const seeds = [
    base,
    `${base} wholesale`,
    `wholesale ${base}`,
    `bulk ${base}`,
    `${base} bulk`,
    `${base} supplier`,
    `${base} distributor`,
    `buy ${base}`,
    `${base} pricing`,
    `order ${base}`,
    slugPhrase,
    `${slugPhrase} wholesale`,
  ];

  for (const seed of seeds) {
    if (deduped.length >= 10) break;
    const key = seed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(seed);
  }

  while (deduped.length < 10) {
    deduped.push(`${base} wholesale option ${deduped.length + 1}`);
  }

  return deduped.slice(0, 10);
}

function getNormalSectionIndexes(content: GeneratedSupportingPageContent): number[] {
  return content.aboveFoldDeepContent
    .map((section, index) => (section.style === "normal" ? index : -1))
    .filter((index) => index >= 0);
}

function appendToSection(content: GeneratedSupportingPageContent, sectionIndex: number, sentence: string): void {
  const section = content.aboveFoldDeepContent[sectionIndex];
  const existing = section.text.trim();
  content.aboveFoldDeepContent[sectionIndex] = {
    ...section,
    text: existing ? `${existing} ${sentence}` : sentence,
  };
}

function ensureNormalSection(content: GeneratedSupportingPageContent): number[] {
  let indexes = getNormalSectionIndexes(content);
  if (indexes.length > 0) return indexes;

  content.aboveFoldDeepContent.push({ style: "normal", text: "" });
  indexes = getNormalSectionIndexes(content);
  return indexes;
}

function weaveVariationSentence(variation: string): string {
  return `Retailers sourcing ${variation} can request bulk wholesale pricing, check stock availability, and place orders with dependable USA fulfillment.`;
}

function weaveMissingVariations(content: GeneratedSupportingPageContent): void {
  const missing = content.keywordVariations.filter(
    (variation) => !textIncludesPhrase(getCombinedCopy(content), variation),
  );
  if (missing.length === 0) return;

  const targets = ensureNormalSection(content);

  for (const [index, variation] of missing.entries()) {
    const sectionIndex = targets[index % targets.length];
    appendToSection(content, sectionIndex, weaveVariationSentence(variation));
  }
}

function ensureFaqKeywordReferences(content: GeneratedSupportingPageContent): void {
  const keyword = content.exactKeyword.trim();
  const variations = content.keywordVariations;

  for (const faq of content.pageFaqs) {
    const question = faq.question.trim();
    const mentionsKeyword =
      textIncludesPhrase(question, keyword) ||
      variations.some((variation) => textIncludesPhrase(question, variation));

    if (mentionsKeyword) continue;

    const variation = variations.find((item) => item.toLowerCase() !== keyword.toLowerCase()) ?? keyword;
    faq.question = `${variation} wholesale: ${question}`;
  }
}

function ensureTransactionalLanguage(content: GeneratedSupportingPageContent): void {
  const copy = getCombinedCopy(content).toLowerCase();
  if (TRANSACTIONAL_TERMS.some((term) => copy.includes(term))) return;

  const targets = ensureNormalSection(content);
  appendToSection(
    content,
    targets[0],
    "Request a bulk wholesale quote, review pricing, confirm stock, and place your order with our team.",
  );
}

function ensureMinimumWordCount(content: GeneratedSupportingPageContent): void {
  let words = countWords(getCombinedCopy(content));
  if (words >= MIN_WORD_COUNT) return;

  const targets = ensureNormalSection(content);
  const expansion =
    "Our wholesale program supports gym networks and distributors with bulk compound options, competitive tiered pricing, HPLC-verified stock, and guaranteed 48h international shipping for qualified buyers.";

  let guard = 0;
  while (words < MIN_WORD_COUNT && guard < 5) {
    appendToSection(content, targets[guard % targets.length], expansion);
    words = countWords(getCombinedCopy(content));
    guard += 1;
  }
}

function ensureH2Section(content: GeneratedSupportingPageContent): void {
  const hasH2 = content.aboveFoldDeepContent.some((section) => section.style === "h2");
  if (hasH2) return;

  content.aboveFoldDeepContent.unshift({
    style: "h2",
    text: `${content.exactKeyword.trim()} wholesale options for retailers`,
  });
}

export function enrichGeneratedContent(content: GeneratedSupportingPageContent): GeneratedSupportingPageContent {
  const enriched: GeneratedSupportingPageContent = structuredClone(content);

  enriched.keywordVariations = ensureTenVariations(enriched.exactKeyword, enriched.keywordVariations ?? []);
  ensureH2Section(enriched);
  weaveMissingVariations(enriched);
  ensureFaqKeywordReferences(enriched);
  ensureTransactionalLanguage(enriched);
  ensureMinimumWordCount(enriched);

  return enriched;
}
