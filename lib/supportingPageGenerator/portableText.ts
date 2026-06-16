import type { ContentSection } from "./types";

let blockKeyCounter = 0;

function nextBlockKey(): string {
  blockKeyCounter += 1;
  return `gen-${blockKeyCounter}`;
}

export function portableTextFromStrings(paragraphs: string[]) {
  return paragraphs
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({
      _type: "block" as const,
      _key: nextBlockKey(),
      style: "normal" as const,
      markDefs: [] as unknown[],
      children: [{ _type: "span" as const, _key: nextBlockKey(), text, marks: [] as string[] }],
    }));
}

export function portableTextFromSections(sections: ContentSection[]) {
  return sections
    .map((section) => ({ ...section, text: section.text.trim() }))
    .filter((section) => section.text)
    .map((section) => ({
      _type: "block" as const,
      _key: nextBlockKey(),
      style: section.style,
      markDefs: [] as unknown[],
      children: [{ _type: "span" as const, _key: nextBlockKey(), text: section.text, marks: [] as string[] }],
    }));
}

export function portableTextToPlainText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      if (!block || typeof block !== "object") return "";
      const children = (block as { children?: unknown }).children;
      if (!Array.isArray(children)) return "";
      return children
        .map((child) => {
          if (!child || typeof child !== "object") return "";
          const text = (child as { text?: unknown }).text;
          return typeof text === "string" ? text : "";
        })
        .join("");
    })
    .filter(Boolean)
    .join("\n");
}

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
