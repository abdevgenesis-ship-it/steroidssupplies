import { RevealItem } from "@/components/motion/RevealItem";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { renderTextWithBold } from "@/lib/content/renderTextWithBold";
import type { MergedWholesalePage } from "@/lib/wholesale/content";
import { WHOLESALE_ICON_MAP } from "@/lib/wholesale/icons";

type WholesaleBenefitsSectionProps = {
  content: MergedWholesalePage;
};

export function WholesaleBenefitsSection({ content }: WholesaleBenefitsSectionProps) {
  return (
    <section
      aria-labelledby="why-wholesale-heading"
      className="border-section-y relative bg-background py-10 sm:py-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgb(86_204_242/0.1),transparent_55%)]"
      />
      <div className="relative mx-auto w-full max-w-300 px-4 sm:px-6 lg:px-8">
        <div className="stack-md">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-[11px] sm:tracking-[0.18em]">
              <span className="h-px w-8 bg-linear-to-r from-transparent to-primary/70" />
              Built For Repeat Buyers
              <span className="h-px w-8 bg-linear-to-l from-transparent to-primary/70" />
            </p>
            <h2 id="why-wholesale-heading" className="mt-2 font-heading text-2xl text-foreground sm:text-3xl lg:text-4xl">
              {content.whyHeading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {renderTextWithBold(content.whyIntro)}
            </p>
          </div>
          <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.benefits.map((benefit, index) => {
              const Icon = WHOLESALE_ICON_MAP[benefit.iconKey] ?? WHOLESALE_ICON_MAP.package;
              return (
                <RevealItem key={`${benefit.title}-${benefit.description}`} delay={index * 0.05}>
                  <Card
                    size="sm"
                    className="group/card relative h-full overflow-hidden border-primary/28 transition-all duration-300 hover:-translate-y-1 hover:border-primary/48"
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-primary/0 via-primary/50 to-highlight/0 opacity-60 transition-opacity duration-300 group-hover/card:opacity-100" />
                    <CardHeader>
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex size-11 items-center justify-center rounded-2xl border border-highlight/32 bg-muted/50 text-highlight backdrop-blur-md transition-all duration-300 group-hover/card:border-primary/40 group-hover/card:text-primary">
                          <Icon className="size-5 transition-transform duration-300 group-hover/card:-translate-y-0.5" aria-hidden />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground/80">
                          0{index + 1}
                        </span>
                      </div>
                      <CardTitle className="text-base sm:text-[1.05rem]">
                        {benefit.title}
                      </CardTitle>
                      <CardDescription className="leading-relaxed">
                        {renderTextWithBold(benefit.description)}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </RevealItem>
              );
            })}
          </div>
          <p className="text-center text-xs text-muted-foreground sm:text-sm">
            Designed for gym networks, private labels, independent distributors, and high-volume retail buyers.
          </p>
        </div>
      </div>
    </section>
  );
}