import { Container } from "@/components/layout/container";
import { renderTextWithBold } from "@/lib/content/renderTextWithBold";
import type { MergedWholesalePage } from "@/lib/wholesale/content";

type WholesaleSemanticContentSectionProps = {
  content: MergedWholesalePage;
};

export function WholesaleSemanticContentSection({
  content,
}: WholesaleSemanticContentSectionProps) {
  return (
    <section className="border-section-b bg-surface-elevated py-10 sm:py-12">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-highlight sm:text-[11px]">
              {content.introSectionHeading}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {renderTextWithBold(content.introSectionText)}
            </p>
          </div>

          <div className="space-y-7">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-[11px]">
                {content.semanticContentHeading}
              </p>
              <div className="mt-4 space-y-6">
                {content.semanticContentSections.map((section) => (
                  <article key={section.heading} className="border-t border-border pt-5 first:border-t-0 first:pt-0">
                    <h2 className="font-heading text-2xl leading-tight text-foreground sm:text-3xl">
                      {section.heading}
                    </h2>
                    <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{renderTextWithBold(paragraph)}</p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {content.wholesaleTargetRows.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-border bg-background">
                <div className="grid grid-cols-1 border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-[0.12em] text-foreground sm:grid-cols-3">
                  <div className="border-b border-border px-4 py-3 sm:border-b-0 sm:border-r">
                    Wholesale Target
                  </div>
                  <div className="border-b border-border px-4 py-3 sm:border-b-0 sm:border-r">
                    Asset Advantage
                  </div>
                  <div className="px-4 py-3">Logistical Dispatch</div>
                </div>
                {content.wholesaleTargetRows.map((row) => (
                  <div
                    key={`${row.target}-${row.assetAdvantage}-${row.logisticalDispatch}`}
                    className="grid grid-cols-1 border-b border-border text-sm last:border-b-0 sm:grid-cols-3"
                  >
                    <div className="border-b border-border px-4 py-3 font-medium text-foreground sm:border-b-0 sm:border-r">
                      {row.target}
                    </div>
                    <div className="border-b border-border px-4 py-3 text-muted-foreground sm:border-b-0 sm:border-r">
                      {row.assetAdvantage}
                    </div>
                    <div className="px-4 py-3 text-muted-foreground">{row.logisticalDispatch}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
