export function blocksToParagraphs(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  const paragraphs: string[] = [];

  for (const block of value) {
    const text = blockToPlainText(block);
    if (text) {
      paragraphs.push(text);
    }
  }

  return paragraphs;
}

export type ContentBlock = {
  style: "normal" | "h2" | "h3" | string;
  text: string;
};

export function blocksToContentBlocks(value: unknown): ContentBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const blocks: ContentBlock[] = [];

  for (const block of value) {
    if (!block || typeof block !== "object") continue;
    const text = blockToPlainText(block);
    if (!text) continue;
    const style = (block as { style?: unknown }).style;
    blocks.push({
      style: typeof style === "string" ? style : "normal",
      text,
    });
  }

  return blocks;
}

function blockToPlainText(block: unknown): string {
  if (!block || typeof block !== "object") return "";
  const maybeChildren = (block as { children?: unknown }).children;
  if (!Array.isArray(maybeChildren)) return "";

  return maybeChildren
    .map((child) => {
      if (!child || typeof child !== "object") return "";
      const childText = (child as { text?: unknown }).text;
      return typeof childText === "string" ? childText : "";
    })
    .join("")
    .trim();
}

export function getSupportingSubH1(page: {
  subH1?: string;
  supportingTerm?: string;
  exactKeyword?: string;
}) {
  const subH1 = normalizeKeyword(page.subH1);
  if (subH1) return subH1;

  const keyword = normalizeKeyword(page.exactKeyword);
  const legacyTerm = normalizeKeyword(page.supportingTerm);
  if (keyword && legacyTerm) {
    return legacyTerm.toLowerCase().startsWith(keyword.toLowerCase())
      ? legacyTerm
      : `${keyword}${legacyTerm.startsWith(":") ? "" : " "}${legacyTerm}`;
  }

  return legacyTerm || keyword;
}

export function getSubH1HighlightSuffix(subH1: string, keyword: string): string {
  const normalizedSub = subH1.trim();
  const normalizedKeyword = keyword.trim();
  if (!normalizedSub || !normalizedKeyword) return "";

  if (normalizedSub.toLowerCase().startsWith(normalizedKeyword.toLowerCase())) {
    return normalizedSub.slice(normalizedKeyword.length).trim();
  }

  return normalizedSub;
}

export function getIntroParagraphs(page: {
  introParagraphs?: string[];
  heroParagraph?: string;
}): string[] {
  const intro = page.introParagraphs?.map((p) => p.trim()).filter(Boolean) ?? [];
  if (intro.length > 0) return intro.slice(0, 2);

  const legacy = normalizeKeyword(page.heroParagraph);
  return legacy ? [legacy] : [];
}

function normalizeKeyword(value?: string) {
  return typeof value === "string" ? value.trim() : "";
}

export function getSupportingExactKeyword(page: {
  exactKeyword?: string;
  title?: string;
  slug?: { current?: string };
}) {
  const exactKeyword = normalizeKeyword(page.exactKeyword);
  if (exactKeyword) {
    return exactKeyword;
  }

  const fromTitle = normalizeKeyword(page.title);
  if (fromTitle) {
    return fromTitle;
  }

  const fromSlug = normalizeKeyword(page.slug?.current).replace(/-/g, " ");
  return fromSlug || "anabolic steroids";
}

export function ensureKeywordPrefix(keyword: string, value: string, separator = " - ") {
  const normalizedKeyword = normalizeKeyword(keyword);
  const normalizedValue = normalizeKeyword(value);

  if (!normalizedValue) {
    return normalizedKeyword;
  }
  if (!normalizedKeyword) {
    return normalizedValue;
  }

  return normalizedValue.toLowerCase().startsWith(normalizedKeyword.toLowerCase())
    ? normalizedValue
    : `${normalizedKeyword}${separator}${normalizedValue}`;
}