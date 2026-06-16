import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity";
import { renderTextWithBold } from "@/lib/content/renderTextWithBold";
import type { Category } from "@/types/sanity";

type CategoryHeroProps = {
  category: Category;
  eyebrow: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  fallbackDescription: string;
};

function getCategoryKeyword(name: string) {
  const normalized = name.trim();
  if (!normalized.toLowerCase().includes("bulk")) {
    return `Bulk ${normalized} Wholesale`;
  }
  return `${normalized} Wholesale`;
}

export function CategoryHero({
  category,
  eyebrow,
  primaryCtaLabel,
  secondaryCtaLabel,
  fallbackDescription,
}: CategoryHeroProps) {
  const backgroundImage = category.heroImage?.asset
    ? urlFor(category.heroImage).width(2000).height(900).fit("crop").url()
    : null;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border">
      {backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
          aria-hidden="true"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-muted to-background" aria-hidden="true" />
      )}

      <Container className="relative flex min-h-[18rem] items-end py-6 sm:min-h-[22rem] sm:py-8">
        <div className="max-w-3xl rounded-2xl border border-border/70 bg-card/95 p-6 shadow-sm backdrop-blur-sm sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {category.categoryHeroHeading?.trim() || getCategoryKeyword(category.name)}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {renderTextWithBold(category.shortDescription?.trim() || fallbackDescription)}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href={`/products?category=${encodeURIComponent(category.name)}`}>{primaryCtaLabel}</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/wholesale">{secondaryCtaLabel}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
