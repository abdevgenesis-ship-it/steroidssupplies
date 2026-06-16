import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

import { RevealItem } from "@/components/motion/RevealItem";
import { Button } from "@/components/ui/button";

export type HowToOrderStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type HowToOrderContentProps = {
  badgeText: string;
  heading: string;
  intro?: string;
  steps: HowToOrderStep[];
  ctaHref: string;
  ctaLabel: string;
};

export function HowToOrderContent({
  badgeText,
  heading,
  intro,
  steps,
  ctaHref,
  ctaLabel,
}: HowToOrderContentProps) {
  return (
    <>
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-highlight sm:text-[11px] sm:tracking-[0.18em]">
          <span className="h-px w-8 bg-highlight/70" />
          {badgeText}
          <span className="h-px w-8 bg-highlight/70" />
        </p>
        <h2 className="mt-2 font-heading text-2xl leading-tight text-foreground sm:text-3xl lg:text-4xl">
          {heading}
        </h2>
        {intro ? (
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {intro}
          </p>
        ) : null}
      </div>

      <div className="relative mx-auto mt-10 max-w-6xl lg:mt-14">
        {/* Connector line — runs through icon circle centres on desktop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[8%] top-[2.75rem] z-0 hidden h-px bg-primary/20 lg:block sm:top-[3.125rem]"
        />

        <div className="relative z-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <RevealItem key={`${step.title}-${index}`} delay={index * 0.08}>
                <article className="group/step flex h-full flex-col items-center text-center">
                  <div className="mb-6 flex w-full justify-center">
                    <div className="relative inline-flex">
                      <span className="relative z-10 grid h-[5.5rem] w-[5.5rem] shrink-0 place-items-center rounded-full border border-border/80 bg-muted/70 ring-[5px] ring-background transition-transform duration-300 group-hover/step:-translate-y-0.5 sm:h-[6.25rem] sm:w-[6.25rem]">
                        <Icon
                          className="size-9 shrink-0 text-primary sm:size-10"
                          aria-hidden="true"
                          strokeWidth={1.5}
                        />
                      </span>
                      <span
                        className="absolute -right-0.5 -top-0.5 z-20 inline-flex size-7 items-center justify-center rounded-full border border-border bg-muted text-xs font-bold text-primary shadow-sm"
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  <h3 className="min-h-[3.25rem] font-sans text-lg font-bold leading-snug text-foreground sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-[17.5rem] text-pretty text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </article>
              </RevealItem>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex justify-center lg:mt-12">
        <Button
          asChild
          size="lg"
          variant="default"
          className="group/button min-h-12 w-full px-8 sm:w-auto"
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
    </>
  );
}
