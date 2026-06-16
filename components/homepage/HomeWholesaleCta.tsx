import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

type HomeWholesaleCtaProps = {
  eyebrow: string;
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export function HomeWholesaleCta({ eyebrow, heading, description, ctaLabel, ctaHref }: HomeWholesaleCtaProps) {
  return (
    <section className="border-section-y-primary bg-background text-foreground">
      <Container className="section-y">
        <div className="mx-auto w-full max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-highlight sm:text-[11px] sm:tracking-[0.18em]">
            <span className="h-px w-8 bg-highlight/70" />
            {eyebrow}
            <span className="h-px w-8 bg-highlight/70" />
          </p>
          <h2 className="mt-2 font-heading text-2xl leading-tight sm:text-3xl lg:text-4xl">
            {heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>

          <Button
            asChild
            size="lg"
            className="group/button mt-7 px-7 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Link href={ctaHref} className="inline-flex items-center gap-2">
              <span>{ctaLabel}</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
