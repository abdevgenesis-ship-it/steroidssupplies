import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { SITE_NAME, categoryPublicPath } from "@/config/seo";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { urlFor } from "@/lib/sanity";
import { brandFallbackGradient, purpleImageOverlay } from "@/lib/theme";
import type { Category, Product, ProgrammaticPage } from "@/types/sanity";

type ProgrammaticPageTemplateProps = {
  page: ProgrammaticPage;
  currentHref: string;
  products: Product[];
  categories: Category[];
};

function normalizeCategoryLabel(name: string) {
  return name.replace(/^(Bulk|Wholesale)\s+/i, "").trim() || name;
}

function getShippingEstimate(regionCode: string) {
  const fastRegions = new Set(["ENG", "SCT", "WLS", "NIR", "IE"]);
  return fastRegions.has(regionCode) ? "48-hour tracked delivery" : "3–5 business days after dispatch";
}

function getComplianceNote(categoryGroup?: string, regionCode?: string) {
  if (categoryGroup === "Injectable Steroids" || categoryGroup === "Oral Steroids") {
    return `Verify local import laws and prescription requirements for ${categoryGroup.toLowerCase()} before ordering into ${regionCode || "this market"}.`;
  }

  return `All orders remain subject to age verification (18+) and destination regulations for ${regionCode || "this market"}. AAS are only sold where legally permitted — verify local compliance before ordering.`;
}

function blocksToParagraphs(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  const paragraphs: string[] = [];

  for (const block of value) {
    if (!block || typeof block !== "object") {
      continue;
    }

    const maybeChildren = (block as { children?: unknown }).children;
    if (!Array.isArray(maybeChildren)) {
      continue;
    }

    const text = maybeChildren
      .map((child) => {
        if (!child || typeof child !== "object") {
          return "";
        }

        const childText = (child as { text?: unknown }).text;
        return typeof childText === "string" ? childText : "";
      })
      .join("")
      .trim();

    if (text) {
      paragraphs.push(text);
    }
  }

  return paragraphs;
}

export function ProgrammaticPageTemplate({ page, currentHref, products, categories }: ProgrammaticPageTemplateProps) {
  const bodyParagraphs = blocksToParagraphs(page.body);
  const introParagraphs = blocksToParagraphs(page.customIntro);
  const categorySlug = page.category.slug?.current;
  const categoryHref = categorySlug ? categoryPublicPath(categorySlug) : "/wholesale";
  const categoryLabel = normalizeCategoryLabel(page.category.name || "Category");
  const locationLabel = page.locationName;
  const heroImageUrl = page.heroImage?.asset
    ? urlFor(page.heroImage).width(2000).height(900).fit("crop").url()
    : null;
  const shippingEstimate = getShippingEstimate(page.stateCode);
  const complianceNote = getComplianceNote(page.category.group, page.stateCode);
  const relatedCategories = categories
    .filter((category) => category.slug?.current)
    .slice(0, 6);
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://steroidssupplies.co.uk"}${currentHref}`,
    areaServed: locationLabel,
    description: page.seoDescription || `Wholesale ${categoryLabel.toLowerCase()} in ${locationLabel}.`,
  };

  return (
    <main className="bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <Container className="section-y">
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:text-xs sm:tracking-[0.2em]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={categoryHref} className="hover:text-foreground">
                {categoryLabel}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground">{page.locationName}</li>
          </ol>
        </nav>

        <section className="relative mt-6 overflow-hidden rounded-3xl border border-border">
          {heroImageUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${heroImageUrl}')` }}
              aria-hidden="true"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-muted to-background" aria-hidden="true" />
          )}

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(196_30_58/0.45),rgb(196_30_58/0.62))]" aria-hidden="true" />

          <Container className="relative py-16 sm:py-20">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">Programmatic page</p>
              <h1 className="mt-3 font-heading text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
                Bulk {categoryLabel} in {locationLabel} — Wholesale Supplier
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
                {page.seoDescription || `Location-focused wholesale landing page for ${locationLabel}.`}
              </p>
            </div>
          </Container>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
          <article className="rounded-3xl border border-border bg-card p-5 shadow-[0_16px_40px_rgba(0,0,0,0.05)] sm:rounded-[2rem] sm:p-8">
            <div className="space-y-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {bodyParagraphs.length > 0 ? (
                bodyParagraphs.map((paragraph, index) => <p key={`${currentHref}-body-${index}`}>{paragraph}</p>)
              ) : (
                <p>
                  This page is ready for location-specific wholesale content, shipping notes, and
                  product filtering tied to Sanity data.
                </p>
              )}
            </div>

            {introParagraphs.length > 0 ? (
              <section className="mt-8 rounded-3xl border border-border bg-surface-elevated/60 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-highlight/80">Local intro</p>
                <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  {introParagraphs.map((paragraph, index) => (
                    <p key={`${currentHref}-intro-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3">
              {(products.length > 0 ? products.slice(0, 3) : []).map((product) => {
                const imageSource = product.images?.[0];
                const imageUrl = imageSource?.asset ? urlFor(imageSource).width(640).height(480).fit("crop").url() : undefined;

                return (
                  <Card key={product._id} tone="listing" className="gap-4 p-0">
                    {imageUrl ? (
                      <Image src={imageUrl} alt={product.name} width={640} height={480} className="h-40 w-full object-cover sm:h-44" />
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-muted/40 text-sm text-muted-foreground sm:h-44">
                        Product image pending
                      </div>
                    )}
                    <div className="space-y-2 px-4 pb-4 sm:px-5 sm:pb-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-highlight/70">Category product</p>
                      <h2 className="font-heading text-base leading-snug sm:text-lg">{product.name}</h2>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {product.shortDescription || "Wholesale product available from Sanity data."}
                      </p>
                      <Link href={`/product/${product.slug.current}`} className="inline-flex text-sm font-medium text-highlight hover:underline">
                        View product
                      </Link>
                    </div>
                  </Card>
                );
              })}
              {products.length === 0 ? (
                <Card tone="listing" className="gap-4 p-5 md:col-span-3">
                  <p className="text-sm text-muted-foreground">No category products found yet. Add products to Sanity to populate this grid.</p>
                </Card>
              ) : null}
            </section>

            <section className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2">
              <Card tone="listing" className="p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-highlight/80">Shipping estimate</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {locationLabel} orders typically ship in {shippingEstimate}.
                </p>
              </Card>
              <Card tone="listing" className="p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-highlight/80">Compliance note</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{complianceNote}</p>
              </Card>
            </section>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={categoryHref} className="inline-flex w-full items-center justify-center gap-2 sm:w-auto">
                  View {categoryLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/wholesale" className="inline-flex w-full items-center justify-center gap-2 sm:w-auto">
                  Wholesale Page
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {relatedCategories.length > 0 ? (
              <section className="mt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-highlight/80">Browse categories</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {relatedCategories.map((category) => {
                    const slug = category.slug?.current;

                    if (!slug) {
                      return null;
                    }

                    const imageUrl = category.image?.asset
                      ? urlFor(category.image).width(900).height(560).fit("crop").url()
                      : "";

                    return (
                      <article key={category._id} className="glass-surface overflow-hidden rounded-2xl border border-border/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35">
                        <Link href={categoryPublicPath(slug)} className="block" aria-label={`Browse ${category.name}`}>
                          <div
                            className="h-28 bg-cover bg-center sm:h-32"
                            style={{
                              backgroundImage: imageUrl
                                ? `${purpleImageOverlay(0.1, 0.4)}, url('${imageUrl}')`
                                : brandFallbackGradient(),
                            }}
                          />
                          <div className="p-4">
                            <h3 className="font-heading text-base leading-snug text-card-foreground">{category.name}</h3>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">
                              {category.shortDescription || "Explore products and wholesale details in this category."}
                            </p>
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <Card className="rounded-3xl border border-border bg-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.05)] sm:rounded-[2rem] sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-highlight/80">Location</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{locationLabel}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-highlight/80">State</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{page.stateCode}</p>
            </Card>
          </aside>
        </section>
      </Container>
    </main>
  )
}