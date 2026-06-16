import { Fragment, type ReactNode } from "react";

const BOLD_PATTERN = /\*\*([^*]+)\*\*/g;

export function stripBoldMarkers(text: string) {
  return text.replace(BOLD_PATTERN, "$1");
}

export function renderTextWithBold(text: string, keyPrefix = "t"): ReactNode {
  const parts = text.split(BOLD_PATTERN);

  if (parts.length === 1) {
    return text;
  }

  return parts.map((part, index) => {
    if (!part) {
      return null;
    }

    if (index % 2 === 1) {
      return (
        <strong key={`${keyPrefix}-b-${index}`} className="font-semibold text-foreground">
          {part}
        </strong>
      );
    }

    return <Fragment key={`${keyPrefix}-t-${index}`}>{part}</Fragment>;
  });
}

export function splitParagraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);
}

/** Splits authority outro when CMS merged lines into one paragraph (space-separated). */
export function splitAuthorityOutro(text: string) {
  const paragraphs = splitParagraphs(text);
  if (paragraphs.length > 1) {
    return paragraphs;
  }

  const trimmed = text.trim();
  const headlineMatch = trimmed.match(/^(\*\*[^*]+\*\*)\s*([\s\S]*)$/);
  if (!headlineMatch?.[2]?.trim()) {
    return paragraphs;
  }

  const bodyParts = headlineMatch[2]
    .split(/(?<=\.)\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return [headlineMatch[1], ...bodyParts];
}

/** Pulls a `**bold**` outro heading into a card title, matching other authority feature cards. */
export function parseAuthorityOutroCard(text: string) {
  const segments = splitAuthorityOutro(text);
  if (segments.length === 0) {
    return { title: undefined, paragraphs: [] as string[] };
  }

  const first = segments[0].trim();
  const titleMatch = first.match(/^\*\*([^*]+)\*\*$/);
  if (titleMatch) {
    return {
      title: titleMatch[1],
      paragraphs: segments.slice(1),
    };
  }

  return { title: undefined, paragraphs: segments };
}
