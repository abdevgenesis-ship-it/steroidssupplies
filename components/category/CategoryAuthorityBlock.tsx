import type { Category } from "@/types/sanity";

import {
  blockToPlainText,
  renderPortableTextBlockChildren,
  type PortableTextBlockLike,
} from "@/lib/content/portableTextBold";
import { renderTextWithBold } from "@/lib/content/renderTextWithBold";

type CategoryAuthorityBlockProps = {
  categoryName: string;
  seoContent?: Category["seoContent"];
  heading: string;
};

function blocksFromSeoContent(value: Category["seoContent"]): PortableTextBlockLike[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (block): block is PortableTextBlockLike =>
      Boolean(block && typeof block === "object" && (block as PortableTextBlockLike)._type === "block"),
  );
}

function renderBlock(block: PortableTextBlockLike, index: number) {
  const style = block.style || "normal";
  const text = blockToPlainText(block);

  if (!text) {
    return null;
  }

  if (style === "h2") {
    return (
      <h3 key={`h2-${index}`} className="mt-6 font-heading text-xl font-semibold text-foreground first:mt-0 sm:text-2xl">
        {renderPortableTextBlockChildren(block, `h2-${index}`)}
      </h3>
    );
  }

  if (style === "h3") {
    return (
      <h4 key={`h3-${index}`} className="mt-4 font-heading text-lg font-semibold text-foreground first:mt-0">
        {renderPortableTextBlockChildren(block, `h3-${index}`)}
      </h4>
    );
  }

  return (
    <p key={`p-${index}`} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
      {renderPortableTextBlockChildren(block, `p-${index}`)}
    </p>
  );
}

function fallbackAuthorityCopy(categoryName: string): string[] {
  return [
    `${categoryName} sits at the center of high-intent wholesale demand because it combines repeat purchase behavior with strong shelf turnover. Retailers and distributors usually prioritize this category when they need predictable movement, clear product positioning, and price consistency across reorder cycles.`,
  ];
}

export function CategoryAuthorityBlock({ categoryName, seoContent, heading }: CategoryAuthorityBlockProps) {
  const cmsBlocks = blocksFromSeoContent(seoContent);

  if (cmsBlocks.length > 0) {
    const [leadBlock, ...tailBlocks] = cmsBlocks;
    const leadText = blockToPlainText(leadBlock);
    const useLeadThenHeading = leadText.length > 0 && typeof heading === "string" && heading.trim().length > 0;

    if (useLeadThenHeading) {
      return (
        <section aria-label="Category authority content" className="glass-listing mt-10 rounded-2xl p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {renderPortableTextBlockChildren(leadBlock, "lead")}
          </p>
          <h2 className="mt-6 font-heading text-2xl leading-tight sm:mt-7 sm:text-3xl">{renderTextWithBold(heading)}</h2>
          <div className="mt-4 space-y-4">{tailBlocks.map((block, index) => renderBlock(block, index))}</div>
        </section>
      );
    }

    return (
      <section aria-label="Category authority content" className="glass-listing mt-10 rounded-2xl p-5 sm:p-6">
        <h2 className="font-heading text-2xl leading-tight sm:text-3xl">{renderTextWithBold(heading)}</h2>
        <div className="mt-4 space-y-4">{cmsBlocks.map((block, index) => renderBlock(block, index))}</div>
      </section>
    );
  }

  const paragraphs = fallbackAuthorityCopy(categoryName);

  return (
    <section aria-label="Category authority content" className="glass-listing mt-10 rounded-2xl p-5 sm:p-6">
      <h2 className="font-heading text-2xl leading-tight sm:text-3xl">{renderTextWithBold(heading)}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {paragraphs.map((paragraph, index) => (
          <p key={`fb-${index}-${paragraph.slice(0, 24)}`}>{renderTextWithBold(paragraph)}</p>
        ))}
      </div>
    </section>
  );
}
