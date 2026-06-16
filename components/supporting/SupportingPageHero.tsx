import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type SupportingPageHeroProps = {
  title: string;
  keyword: string;
  subH1: string;
  subH1Suffix: string;
  introParagraphs: string[];
  heroImageUrl?: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

export function SupportingPageHero({
  title,
  keyword,
  subH1,
  subH1Suffix,
  introParagraphs,
  heroImageUrl,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: SupportingPageHeroProps) {
  const imageSrc = heroImageUrl || "/images/supporting-page-hero.png";
  const suffix = subH1Suffix ? (subH1Suffix.startsWith(":") ? subH1Suffix : ` ${subH1Suffix}`) : "";

  return (
    <section className="mt-6 overflow-hidden rounded-[2rem] border border-border bg-surface-elevated shadow-[0_18px_50px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-primary/25 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
      <div
        className="relative h-64 w-full overflow-hidden bg-black sm:h-80 lg:h-[26rem]"
        style={{ backgroundImage: `url('${imageSrc}')`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <Image src={imageSrc} alt={title} fill priority unoptimized sizes="100vw" className="object-contain" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_42%)]" />
      </div>

      <HeroContent
        keyword={keyword}
        suffix={suffix}
        subH1={subH1}
        introParagraphs={introParagraphs}
        primaryCtaLabel={primaryCtaLabel}
        primaryCtaHref={primaryCtaHref}
        secondaryCtaLabel={secondaryCtaLabel}
        secondaryCtaHref={secondaryCtaHref}
      />
    </section>
  );
}

function HeroContent({
  keyword,
  suffix,
  subH1,
  introParagraphs,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: {
  keyword: string;
  suffix: string;
  subH1: string;
  introParagraphs: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}) {
  return (
    <div className="bg-gradient-to-b from-background/30 to-background p-5 sm:p-8">
      <h1 className="w-full font-heading text-2xl leading-snug transition-colors duration-300 sm:text-3xl md:text-4xl lg:text-5xl">
        <span>{keyword}</span>
        {suffix ? <span className="text-highlight">{suffix}</span> : null}
      </h1>

      {subH1 ? (
        <p className="mt-2 w-full font-heading text-lg text-foreground/90 sm:text-xl md:text-2xl">{subH1}</p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href={primaryCtaHref}>{primaryCtaLabel}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
        </Button>
      </div>

      {introParagraphs.length > 0 ? (
        <div className="mt-6 w-full space-y-3 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 sm:text-base md:text-lg">
          {introParagraphs.map((paragraph, index) => (
            <p key={`intro-${index}`}>{paragraph}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
