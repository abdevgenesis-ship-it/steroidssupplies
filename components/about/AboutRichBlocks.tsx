import type { PortableTextBlock } from "@/components/blog/BlogBody";

import { renderPortableTextBlockChildren } from "@/lib/content/portableTextBold";

type AboutRichBlocksProps = {
  blocks: PortableTextBlock[];
  className?: string;
};

export function AboutRichBlocks({ blocks, className }: AboutRichBlocksProps) {
  if (!blocks.length) {
    return null;
  }

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block._type === "block" && block.style === "h2") {
          const heading = (block.children || []).map((child) => child.text || "").join("").trim();
          if (!heading) {
            return null;
          }

          return (
            <h3 key={`h2-${index}`} className="mt-6 font-heading text-xl font-semibold text-foreground first:mt-0">
              {renderPortableTextBlockChildren(block, `h2-${index}`)}
            </h3>
          );
        }

        if (block._type === "block" && block.style === "h3") {
          const heading = (block.children || []).map((child) => child.text || "").join("").trim();
          if (!heading) {
            return null;
          }

          return (
            <h4 key={`h3-${index}`} className="mt-4 font-heading text-lg font-semibold text-foreground first:mt-0">
              {renderPortableTextBlockChildren(block, `h3-${index}`)}
            </h4>
          );
        }

        const paragraph = (block.children || []).map((child) => child.text || "").join("").trim();
        if (!paragraph) {
          return null;
        }

        return (
          <p key={`p-${index}`} className="mt-3 text-base leading-relaxed text-muted-foreground first:mt-0">
            {renderPortableTextBlockChildren(block, `p-${index}`)}
          </p>
        );
      })}
    </div>
  );
}
