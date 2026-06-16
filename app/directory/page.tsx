import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe2, Package2, Search, ShieldCheck, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { urlFor } from "@/lib/sanity";
import { getBrandsForDirectory, getProducts } from "@/lib/sanityClient";

export const metadata: Metadata = {
  title: `Brand Directory | ${SITE_NAME}`,
  description: `Browse the ${SITE_NAME} brand directory and jump into pre-filtered product listings by brand.`,
  openGraph: {
    title: `Brand Directory | ${SITE_NAME}`,
    description: `Browse the ${SITE_NAME} brand directory and jump into pre-filtered product listings by brand.`,
    type: "website",
    url: `${SITE_URL}/directory`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

type BrandDirectoryItem = {
  name: string;
  count: number;
  href: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  logoAlt?: string;
};

function buildBrandDirectory(
  products: Array<{ brandName: string }>,
  brands: Array<{
    name: string;
    shortDescription?: string;
    website?: string;
    logo?: {
      _type?: "image";
      alt?: string;
      asset?: { _type: "reference"; _ref: string };
    };
  }>,
) {
  const counts = new Map<string, number>();

  for (const item of products) {
    const name = item.brandName.trim();

    if (!name) {
      continue;
    }

    counts.set(name, (counts.get(name) || 0) + 1);
  }

  const brandInfo = new Map(
    brands.map((brand) => [brand.name.trim(), brand]),
  );

  const allBrandNames = new Set<string>([
    ...counts.keys(),
    ...[...brandInfo.keys()].filter(Boolean),
  ]);

  const directoryBrands: BrandDirectoryItem[] = [...allBrandNames]
    .sort((a, b) => a.localeCompare(b))
    .map((name) => {
      const info = brandInfo.get(name);
      const logoUrl = info?.logo?.asset
        ? urlFor({
            _type: "image",
            asset: info.logo.asset,
            alt: info.logo.alt,
          } as never)
            .width(240)
            .height(120)
            .fit("clip")
            .url()
        : undefined;

      return {
        name,
        count: counts.get(name) || 0,
        href: `/products?brand=${encodeURIComponent(name)}`,
        description: info?.shortDescription?.trim(),
        website: info?.website?.trim(),
        logoUrl,
        logoAlt: info?.logo?.alt || `${name} logo`,
      };
    });

  const groups = new Map<string, BrandDirectoryItem[]>();

  for (const brand of directoryBrands) {
    const first = brand.name.charAt(0).toUpperCase();
    const key = /[A-Z]/.test(first) ? first : "#";
    const existing = groups.get(key) || [];
    existing.push(brand);
    groups.set(key, existing);
  }

  return [...groups.entries()].sort(([a], [b]) => {
    if (a === "#") {
      return 1;
    }

    if (b === "#") {
      return -1;
    }

    return a.localeCompare(b);
  });
}

export default async function DirectoryPage() {
  const [products, brands] = await Promise.all([getProducts(), getBrandsForDirectory()]);

  const brandsByLetter = buildBrandDirectory(
    products.map((product) => {
      const source = product.brand;
      const brandName =
        source && "name" in source && typeof source.name === "string" ? source.name : "Unknown Brand";

      return { brandName };
    }),
    brands,
  );

  const totalBrands = brandsByLetter.reduce((sum, [, brands]) => sum + brands.length, 0);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Bulk Vape Brand Directory",
    url: `${SITE_URL}/directory`,
    description: "Alphabetical directory of wellness and sleep gummy brands with direct links to filtered product search.",
  };

  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-highlight/10 blur-3xl" />
        <div className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-foreground/5 blur-3xl" />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />

      <SectionReveal y={16}>
        <section className="border-section-b bg-surface-elevated">
          <Container className="py-10 sm:py-12 lg:py-14">
            <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.22em] text-muted-foreground/90">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="underline-offset-4 hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-foreground">Directory</li>
              </ol>
            </nav>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-highlight shadow-sm">
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              Brand Index
            </div>

            <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">
              Wholesale Vape Brand Directory
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Browse brands alphabetically and jump directly into product listings filtered by the brand you want to source.
            </p>

            <div className="mt-6 inline-flex rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
              {totalBrands} brands indexed
            </div>
          </Container>
        </section>
      </SectionReveal>

      <SectionReveal y={18} delay={0.03}>
        <Container className="section-y">
          {brandsByLetter.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
              Brand directory data is not available yet. Please check back after products are synced from Sanity.
            </div>
          ) : (
            <div className="space-y-8">
              {brandsByLetter.map(([letter, brands]) => (
                <section key={letter} className="rounded-3xl border border-border bg-card p-5 shadow-[0_16px_40px_rgba(0,0,0,0.06)] sm:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background font-heading text-xl font-semibold">
                      {letter}
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {brands.length} {brands.length === 1 ? "brand" : "brands"}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {brands.map((brand) => (
                      <article
                        key={brand.name}
                        className="group relative overflow-hidden rounded-2xl border border-border bg-surface-panel p-4 transition-all duration-300 hover:-translate-y-1 hover:border-highlight/35 hover:shadow-[0_18px_38px_rgba(0,0,0,0.12)]"
                      >
                        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-highlight/10 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            <Package2 className="h-3 w-3" aria-hidden="true" />
                            {brand.count} {brand.count === 1 ? "Product" : "Products"}
                          </span>
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                        </div>

                        <div className="mt-3 min-h-[2.2rem]">
                          {brand.logoUrl ? (
                            <Image
                              src={brand.logoUrl}
                              alt={brand.logoAlt || `${brand.name} logo`}
                              width={140}
                              height={56}
                              className="h-8 w-auto object-contain"
                            />
                          ) : (
                            <h3 className="font-heading text-xl font-semibold text-foreground">{brand.name}</h3>
                          )}
                        </div>

                        <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">{brand.name}</h3>
                        <p className="mt-1.5 line-clamp-2 min-h-[2.6rem] text-sm leading-relaxed text-muted-foreground">
                          {brand.description || "Premium wholesale assortment with strong retail demand."}
                        </p>

                        <div className="mt-4 flex items-center gap-2">
                          {brand.website ? (
                            <a
                              href={brand.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-highlight/30 hover:text-highlight"
                            >
                              <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                              Official Site
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                              Verified Brand
                            </span>
                          )}
                        </div>

                        <Link
                          href={brand.href}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors group-hover:text-highlight"
                        >
                          Browse {brand.name}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </Container>
      </SectionReveal>

      <SectionReveal y={18} delay={0.05}>
        <Container className="pb-16 pt-0">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold sm:text-3xl">Need help building a mixed-brand order?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Start with the directory, then submit your wholesale request with selected brands and target budget.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="group/button">
                  <Link href="/products" className="inline-flex items-center gap-2">
                    Browse All Products
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/wholesale-request">Request Wholesale Quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </SectionReveal>
    </main>
  );
}
