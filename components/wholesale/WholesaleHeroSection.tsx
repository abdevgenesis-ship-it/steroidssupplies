import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { renderTextWithBold } from "@/lib/content/renderTextWithBold";
import type { MergedWholesalePage } from "@/lib/wholesale/content";

type WholesaleHeroSectionProps = {
  content: MergedWholesalePage;
};

export function WholesaleHeroSection({ content }: WholesaleHeroSectionProps) {
  return (
    <section className="border-section-b relative overflow-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 22%, color-mix(in oklch, var(--highlight) 32%, transparent) 0%, transparent 44%), radial-gradient(circle at 82% 58%, color-mix(in oklch, var(--primary) 22%, transparent) 0%, transparent 42%)",
        }}
        aria-hidden
      />
      <Container className="section-y relative">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-widest text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="underline-offset-4 hover:text-primary hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground">Wholesale</li>
          </ol>
        </nav>
        <p className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-highlight sm:text-[11px] sm:tracking-[0.18em]">
          <span className="h-px w-8 bg-highlight/70" />
          {content.heroBadge}
          <span className="h-px w-8 bg-highlight/70" />
        </p>
        <h1 className="mt-2 max-w-4xl font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
          {content.heroHeading}
        </h1>
        {content.heroSecondaryHeading.trim() ? (
          <h2 className="mt-4 max-w-4xl font-heading text-xl font-semibold leading-snug text-foreground sm:text-2xl">
            {content.heroSecondaryHeading}
          </h2>
        ) : null}
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {renderTextWithBold(content.heroSubhead)}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="group/button">
            <Link href="/wholesale-request" className="inline-flex items-center gap-2">
              <span>Submit wholesale inquiry</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="group/button">
            <Link href="#wholesale-inquiry" className="inline-flex items-center gap-2">
              <span>Fill form on this page</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <p className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-highlight" aria-hidden />
            {content.heroTrustLine1}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="size-4 text-highlight" aria-hidden />
            {content.heroTrustLine2}
          </span>
        </p>
      </Container>
    </section>
  );
}