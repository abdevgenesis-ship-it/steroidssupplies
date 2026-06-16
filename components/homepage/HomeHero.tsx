import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import type { ResolvedHomeHero } from "@/lib/homePageDefaults";

export function HomeHero({
  badge,
  heading,
  subheading,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  backgroundImageUrl,
  backgroundImageAlt,
}: ResolvedHomeHero) {
  const heroSrc = backgroundImageUrl || "/images/home-hero-thc.png";

  return (
    <section className="relative isolate z-0 w-full overflow-hidden border-section-b-primary">
      <div
        className="relative w-full"
        style={{
          height: "clamp(620px, 65vh, 740px)",
          minHeight: "clamp(620px, 65vh, 740px)",
        }}
      >
        <Image
          src={heroSrc}
          alt={backgroundImageAlt || ""}
          fill
          priority
          sizes="100vw"
          unoptimized
          className="object-cover object-center"
        />

        <Container className="relative z-10 flex h-full items-center">
          <div className="w-full max-w-xl lg:max-w-[46%]">
            <div className="-mt-1 inline-flex flex-col items-center gap-1 sm:-mt-1.5 sm:gap-1.5">
              <span className="flex items-center gap-1.5" aria-hidden>
                <span className="text-base leading-none text-orange sm:text-lg">★</span>
                <span className="text-xl leading-none text-orange sm:text-2xl">★</span>
                <span className="text-base leading-none text-orange sm:text-lg">★</span>
              </span>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase leading-none tracking-[0.18em] text-foreground sm:text-sm sm:tracking-[0.2em]">
                <span className="h-px w-6 shrink-0 bg-primary sm:w-8" aria-hidden />
                {badge}
                <span className="h-px w-6 shrink-0 bg-primary sm:w-8" aria-hidden />
              </p>
            </div>

            <h1 className="mt-3 font-sans text-[clamp(1.75rem,3.4vw,2.625rem)] font-bold leading-[1.12] tracking-tight text-foreground">
              {heading}
            </h1>

            <p className="mt-3 max-w-lg text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
              {subheading}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="w-full px-7 sm:w-auto">
                <Link href={primaryCtaHref} className="inline-flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  <span>{primaryCtaLabel}</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full px-7 sm:w-auto">
                <Link href={secondaryCtaHref} className="inline-flex items-center justify-center gap-2">
                  {secondaryCtaLabel}
                  <ArrowRight className="h-4 w-4 opacity-80" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
