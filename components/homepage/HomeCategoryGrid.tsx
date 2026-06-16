import Link from "next/link";
import { ArrowUpRight, Moon, Sparkles, Pill, Package } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { categoryPublicPath } from "@/config/seo";
import { CategoryBestsellerRail } from "@/components/category/CategoryBestsellerRail";
import { getBestSellerProductsByCategorySlug } from "@/lib/sanityClient";
import { urlFor } from "@/lib/sanity";
import { brandFallbackGradient } from "@/lib/theme";
import type { Category, Product } from "@/types/sanity";

type CategoryCard = {
  slug: string;
  title: string;
  description: string;
  href: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
};

type CategorySection = CategoryCard & {
  bestSellers: Product[];
};

type HomeCategoryGridProps = {
  categories: Category[];
  eyebrow: string;
  heading: string;
  description: string;
  emptyMessage: string;
};

function iconByGroup(group?: string) {
  switch (group) {
    case "Injectable Steroids":
      return Sparkles;
    case "Oral Steroids":
      return Pill;
    case "PCT Supplements":
      return Package;
    case "Performance Bundles":
      return Moon;
    default:
      return Package;
  }
}

function toCategoryCard(category: Category): CategoryCard | null {
  const slug = category.slug?.current;

  if (!slug) {
    return null;
  }

  const image = category.image?.asset
    ? urlFor(category.image).width(1200).height(720).fit("crop").url()
    : "";

  return {
    slug,
    title: category.name,
    description: category.shortDescription || "",
    href: categoryPublicPath(slug),
    image,
    icon: iconByGroup(category.group),
  };
}

async function buildCategorySections(categories: Category[]) {
  const cards = categories.map(toCategoryCard).filter((item): item is CategoryCard => Boolean(item));

  return Promise.all(
    cards.map(async (card): Promise<CategorySection> => {
      const bestSellers = await getBestSellerProductsByCategorySlug(card.slug);
      return {
        ...card,
        bestSellers,
      };
    }),
  );
}

export async function HomeCategoryGrid({
  categories,
  eyebrow,
  heading,
  description,
  emptyMessage,
}: HomeCategoryGridProps) {
  const categorySections = await buildCategorySections(categories);

  return (
    <section className="overflow-x-clip bg-background text-foreground">
      <Container className="section-y">
        <div className="mx-auto max-w-3xl px-1 text-center">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-highlight">
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
        </div>

        {categorySections.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:mt-10">
            {categorySections.map((category, index) => {
              const Icon = category.icon;
              const isReversed = index % 2 === 1;

              return (
                <article key={category.title} className="glass-surface group overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/35">
                  <div className="grid lg:grid-cols-2">
                    <div className={isReversed ? "h-full lg:order-2" : "h-full"}>
                      <Link href={category.href} className="block h-full" aria-label={`Browse ${category.title}`}>
                        <div
                          className="relative h-full min-h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 sm:min-h-72 lg:min-h-0"
                          style={{
                            backgroundImage: category.image
                              ? `url('${category.image}')`
                              : brandFallbackGradient(),
                          }}
                        />
                      </Link>
                    </div>

                    <div className="flex h-full flex-col gap-2.5 bg-card p-5 sm:p-6 lg:p-7">
                      <div>
                        <div className="mb-1.5 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-2 py-0.5">
                          <Icon className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />
                          <span className="text-[10px] font-semibold uppercase tracking-[0.11em] text-muted-foreground">
                            Category
                          </span>
                        </div>
                        <h3 className="font-heading text-xl leading-tight sm:text-2xl">{category.title}</h3>
                        <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {category.description}
                        </p>
                      </div>

                      <div className="mt-2 space-y-3">
                        <CategoryBestsellerRail categoryName={category.title} products={category.bestSellers} />

                        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2 sm:pt-3">
                          <Button asChild variant="default" className="group/button w-full sm:w-auto">
                            <Link href={category.href} className="inline-flex items-center gap-1.5">
                              <span>Browse Category</span>
                              <ArrowUpRight
                                className="h-4 w-4 transition-transform duration-200 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                                aria-hidden="true"
                              />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground sm:mt-10">
            {emptyMessage}
          </div>
        )}
      </Container>
    </section>
  );
}
