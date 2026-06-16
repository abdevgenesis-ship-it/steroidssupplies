export type ParsedKeywordRow = {
  keyword: string;
  supportingTerm?: string;
  primaryCtaHref?: string;
};

export function parseKeywordsText(text: string): ParsedKeywordRow[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((keyword) => ({ keyword }));
}

export function parseKeywordsCsv(text: string): ParsedKeywordRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const header = lines[0].split(",").map((cell) => cell.trim().toLowerCase());
  const keywordIndex = header.indexOf("keyword");
  if (keywordIndex === -1) {
    return parseKeywordsText(text);
  }

  const supportingTermIndex = header.indexOf("supportingterm");
  const primaryCtaIndex = header.indexOf("primaryctahref");

  return lines.slice(1).flatMap((line) => {
    const cells = line.split(",").map((cell) => cell.trim());
    const keyword = cells[keywordIndex]?.trim();
    if (!keyword) return [];

    return [
      {
        keyword,
        supportingTerm: supportingTermIndex >= 0 ? cells[supportingTermIndex] : undefined,
        primaryCtaHref: primaryCtaIndex >= 0 ? cells[primaryCtaIndex] : undefined,
      },
    ];
  });
}
