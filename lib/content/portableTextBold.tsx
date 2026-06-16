import type { ReactNode } from "react";

import { renderTextWithBold } from "@/lib/content/renderTextWithBold";

export type PortableTextSpan = {
  _type?: string;
  text?: string;
  marks?: string[];
};

export type PortableTextBlockLike = {
  _type?: string;
  style?: string;
  children?: PortableTextSpan[];
  markDefs?: unknown[];
};

export function blockToPlainText(block: PortableTextBlockLike) {
  return (block.children || [])
    .map((child) => child.text || "")
    .join("")
    .trim();
}

export function renderPortableTextBlockChildren(block: PortableTextBlockLike, keyPrefix: string): ReactNode {
  const children = block.children || [];

  return children.map((child, index) => {
    const text = child.text || "";
    if (!text) {
      return null;
    }

    if (child.marks?.includes("strong")) {
      return (
        <strong key={`${keyPrefix}-s-${index}`} className="font-semibold text-foreground">
          {text}
        </strong>
      );
    }

    return <span key={`${keyPrefix}-n-${index}`}>{renderTextWithBold(text, `${keyPrefix}-${index}`)}</span>;
  });
}

export function portableTextToParagraphs(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const paragraphs: string[] = [];

  for (const block of value) {
    if (!block || typeof block !== "object") {
      continue;
    }

    const typed = block as PortableTextBlockLike;
    if (typed._type !== "block") {
      continue;
    }

    const text = blockToPlainText(typed);
    if (text) {
      paragraphs.push(text);
    }
  }

  return paragraphs;
}

/** Converts Sanity portable text blocks to plain text with `**bold**` markers for keyword rendering. */
export function portableTextToBoldMarkdown(value: unknown): string {
  if (!Array.isArray(value)) {
    return "";
  }

  const paragraphs: string[] = [];

  for (const block of value) {
    if (!block || typeof block !== "object") {
      continue;
    }

    const typed = block as PortableTextBlockLike;
    if (typed._type !== "block") {
      continue;
    }

    const line = (typed.children || [])
      .map((child) => {
        const text = child.text || "";
        if (!text) {
          return "";
        }

        return child.marks?.includes("strong") ? `**${text}**` : text;
      })
      .join("")
      .trim();

    if (line) {
      paragraphs.push(line);
    }
  }

  return paragraphs.join(" ");
}
