import { SiBitcoin, SiEthereum, SiRevolut, SiTether } from "react-icons/si";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MergedWholesalePage } from "@/lib/wholesale/content";

type WholesaleDiscountSectionProps = {
  content: MergedWholesalePage;
};

export function WholesaleDiscountSection({ content }: WholesaleDiscountSectionProps) {
  return (
    <section
      aria-labelledby="discount-heading"
      className="stack-md relative overflow-hidden border-section-y bg-primary py-8 text-white sm:py-10"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_100%_0%,rgb(196_30_58/0.16),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_100%,rgb(127_29_29/0.12),transparent_50%)]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-300 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-highlight sm:text-[11px] sm:tracking-[0.18em]">
            <span className="h-px w-8 bg-highlight/70" />
            Payment Incentives
            <span className="h-px w-8 bg-highlight/70" />
          </p>
          <h2 id="discount-heading" className="mt-2 font-heading text-2xl sm:text-3xl">
            {content.discountHeading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base">
            {content.discountIntro}
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card className="group/card overflow-hidden border border-border bg-card text-foreground shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)]">
            <CardHeader className="border-b border-border/60 bg-linear-to-r from-primary/5 to-highlight/5">
              <CardTitle className="text-primary">{content.paymentCardTitle}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {content.paymentCardDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6 pt-5">
              <article className="rounded-xl border border-border bg-muted/30 p-3.5 transition-all duration-300 hover:border-primary/25 hover:bg-primary/5 sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm">
                      <SiBitcoin className="h-4.5 w-4.5 text-[#F7931A]" />
                    </span>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm">
                      <SiEthereum className="h-4.5 w-4.5 text-[#627EEA]" />
                    </span>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm">
                      <SiTether className="h-4.5 w-4.5 text-[#26A17B]" />
                    </span>
                  </div>
                  <span className="rounded-full border border-highlight/35 bg-highlight/12 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-highlight">
                    {content.cryptoDiscountLabel}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  {content.cryptoRowLabel}
                </p>
              </article>

              <article className="rounded-xl border border-border bg-muted/30 p-3.5 transition-all duration-300 hover:border-primary/25 hover:bg-primary/5 sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm">
                    <SiRevolut className="h-4.5 w-4.5 text-primary" />
                  </span>
                  <span className="rounded-full border border-highlight/35 bg-highlight/12 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-highlight">
                    {content.revolutDiscountLabel}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  {content.revolutRowLabel}
                </p>
              </article>
            </CardContent>
          </Card>

          <Card className="group/card overflow-hidden border border-border bg-card text-foreground shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)]">
            <CardHeader className="border-b border-border/60 bg-linear-to-r from-sky/8 to-orange/8">
              <CardTitle className="text-primary">{content.volumeCardTitle}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {content.volumeCardDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6 pt-5">
              {content.volumeTiers.map((row, index) => (
                <div
                  key={`${row.tier}-${row.note}`}
                  className="flex flex-col justify-between gap-1 rounded-2xl border border-border bg-muted/25 px-4 py-3 transition-colors duration-300 group-hover/card:border-primary/20 group-hover/card:bg-primary/5 sm:flex-row sm:items-center"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/80 sm:min-w-24">
                    Tier {index + 1}
                  </span>
                  <span className="font-medium text-foreground">{row.tier}</span>
                  <span className="text-sm text-muted-foreground">{row.note}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {content.discountSeeAlso ? (
          <p className="mt-5 text-center text-sm text-white/80">{content.discountSeeAlso}</p>
        ) : null}
      </div>
    </section>
  );
}
