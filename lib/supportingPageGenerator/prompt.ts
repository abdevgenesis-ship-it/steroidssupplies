export function buildSupportingPagePrompt(keyword: string): string {
  return `You are an expert SEO copywriter for SteroidsSupplies, a certified global B2C and B2B wholesale supplier of pharmaceutical-grade anabolic steroids serving athletes, bodybuilders, and commercial buyers across the UK, USA, and worldwide.

Generate supporting page content for the exact keyword: "${keyword}"

RULES (strict):
1. slug must be the keyword lowercased with spaces replaced by hyphens (exact URL match).
2. metaTitle, metaDescription, subH1, and the FIRST intro paragraph MUST start with the exact keyword "${keyword}" (same wording).
3. subH1 is a full sub-headline that STARTS with the exact keyword and continues naturally (e.g. "${keyword} for premium bulk orders").
4. introParagraphs: 1–2 paragraphs, moderate length. First paragraph MUST start with the exact keyword.
5. aboveFoldDeepContent: commercial/transactional wholesale copy with H2 and H3 sections. Latest SEO + AI-search friendly (clear entities, scannable headings, natural language, no stuffing).
6. keywordVariations: exactly 10 distinct main keyword variations. Every variation MUST appear at least once in introParagraphs, aboveFoldDeepContent, or FAQ text (minimum 8 of 10 must be present in the final body copy).
7. pageFaqs: exactly 3 FAQs; each question must mention the exact keyword or one variation; answers should be transactional (bulk order, pricing, shipping, MOQ).
8. whyChooseUsPoints: 5–6 short wholesale selling points.
9. Total readable word count across intro + deep content + FAQ answers roughly 600–900 words.

Return ONLY valid JSON with this shape (no markdown):
{
  "exactKeyword": "${keyword}",
  "subH1": "...",
  "metaTitle": "...",
  "metaDescription": "...",
  "introParagraphs": ["...", "..."],
  "aboveFoldDeepContent": [
    { "style": "h2", "text": "..." },
    { "style": "normal", "text": "..." },
    { "style": "h3", "text": "..." }
  ],
  "keywordVariations": ["...", "..."],
  "pageFaqs": [
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." }
  ],
  "primaryCtaLabel": "Visit shop",
  "primaryCtaHref": "/shop",
  "whyChooseUsHeading": "Why choose us",
  "whyChooseUsPoints": ["...", "..."]
}`;
}
