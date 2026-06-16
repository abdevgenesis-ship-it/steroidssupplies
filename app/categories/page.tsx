import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { RevealItem } from "@/components/motion/RevealItem";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { SITE_NAME, SITE_URL, categoryPublicPath } from "@/config/seo";
import { urlFor } from "@/lib/sanity";
import { brandFallbackGradient, purpleImageOverlay } from "@/lib/theme";
import { getCategoriesForLanding } from "@/lib/sanityClient";

export const metadata: Metadata = {
  title: `THC Vape Categories & 510 Cartridges | ${SITE_NAME}`,
  description:
    `Browse all bulk THC vape and 510 cartridge categories from ${SITE_NAME} and jump directly to category-specific inventory and wholesale inquiry paths.`,
  alternates: {
    canonical: `${SITE_URL}/categories`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/categories`,
    title: `THC Vape Categories & 510 Cartridges | ${SITE_NAME}`,
    description:
      `Browse all bulk THC vape and 510 cartridge categories from ${SITE_NAME} and jump directly to category-specific inventory and wholesale inquiry paths.`,
    siteName: SITE_NAME,
  },
};

export default async function CategoriesPage() {
  const categories = await getCategoriesForLanding();

  return (
    <main className="bg-background pb-14 text-foreground">
      <SectionReveal y={14}>
        <section className="border-section-b bg-muted/50">
          <Container className="py-8 sm:py-10">
            <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-widest text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="underline-offset-4 hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-foreground">Categories</li>
              </ol>
            </nav>
            <h1 className="mt-3 font-heading text-3xl leading-tight sm:text-4xl">Browse Categories</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Pick a category to view products and go directly to the category page.
            </p>
          </Container>
        </section>
      </SectionReveal>

      <SectionReveal delay={0.02}>
        <Container className="pt-8 sm:pt-10">
        {categories.length > 0 ? (
          <section aria-label="All categories" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const slug = category.slug?.current;

              if (!slug) {
                return null;
              }

              const image = category.image?.asset
                ? urlFor(category.image).width(1200).height(760).fit("crop").url()
                : "";

              return (
                <RevealItem key={category._id} delay={index * 0.05}>
                  <article className="glass-surface group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/35">
                    <Link href={categoryPublicPath(slug)} className="block" aria-label={`Browse ${category.name}`}>
                      <div
                        className="h-44 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 sm:h-48"
                        style={{
                          backgroundImage: image
                            ? `${purpleImageOverlay(0.08, 0.38)}, url('${image}')`
                            : brandFallbackGradient(),
                        }}
                      />

                      <div className="p-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          {category.group || "Category"}
                        </p>
                        <h2 className="mt-1 font-heading text-xl leading-tight">{category.name}</h2>
                        <p className="mt-2 min-h-12 text-sm leading-relaxed text-muted-foreground">
                          {category.shortDescription?.trim() ||
                            "Wholesale-focused inventory with category-specific pricing and ordering support."}
                        </p>
                        <p className="mt-4 text-sm font-medium text-highlight">Browse Category</p>
                      </div>
                    </Link>
                  </article>
                </RevealItem>
              );
            })}
          </section>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            No categories are currently available. Add and publish category documents in Sanity to populate this page.
          </div>
        )}
        </Container>
      </SectionReveal>
    </main>
  );
}
