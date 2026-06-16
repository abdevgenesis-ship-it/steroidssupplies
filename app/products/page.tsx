import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Container } from "@/components/layout/container";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { ProductsCatalogClient } from "@/components/shop/ProductsCatalogClient";
import type { ShopProductCardData } from "@/components/shop/ProductCard";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { mapSanityProductToShopCard } from "@/lib/mapSanityProductToShopCard";
import { getProducts, getShopPage } from "@/lib/sanityClient";

type ProductsSearchParams = {
  page?: string | string[];
  category?: string | string[];
  brand?: string | string[];
};

type ProductsPageProps = {
  searchParams: Promise<ProductsSearchParams>;
};

function firstSearchParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getSafePageNumber(value?: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

function getInitialCategoryFilter(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function getInitialBrandFilter(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const page = getSafePageNumber(firstSearchParam(sp.page));
  const isPaginated = page > 1;
  const canonical = isPaginated ? `${SITE_URL}/products?page=${page}` : `${SITE_URL}/products`;

  const baseTitle = "Shop Anabolic Steroids | Injectable, Oral & PCT Wholesale Catalog";
  const title = isPaginated ? `${baseTitle} | Page ${page}` : baseTitle;
  const description =
    `Buy anabolic steroids online from ${SITE_NAME}. Browse HPLC-verified injectable steroids, oral tablets, and PCT supplements. Compare compounds and request B2B wholesale pricing.`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: SITE_NAME,
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;
  const initialPage = getSafePageNumber(firstSearchParam(sp.page));
  const initialCategoryFilter = getInitialCategoryFilter(firstSearchParam(sp.category));
  const initialBrandFilter = getInitialBrandFilter(firstSearchParam(sp.brand));
  const products = await getProducts();
  const productCards = products.map(mapSanityProductToShopCard);
  const shopPage = await getShopPage();

  const productPrices = productCards.map((product) => product.price).filter((price) => Number.isFinite(price));
  const productPuffCounts = productCards
    .map((product) => product.puffCount)
    .filter((puffs) => Number.isFinite(puffs));

  const dataPriceMin = productPrices.length > 0 ? Math.floor(Math.min(...productPrices)) : 0;
  const dataPriceMax = productPrices.length > 0 ? Math.ceil(Math.max(...productPrices)) : 1000;
  const dataPuffMin = productPuffCounts.length > 0 ? Math.floor(Math.min(...productPuffCounts)) : 0;
  const dataPuffMax = productPuffCounts.length > 0 ? Math.ceil(Math.max(...productPuffCounts)) : 20000;

  const cmsPriceMin = Number(shopPage?.priceRange?.min);
  const cmsPriceMax = Number(shopPage?.priceRange?.max);
  const cmsPuffMin = Number(shopPage?.puffRange?.min);
  const cmsPuffMax = Number(shopPage?.puffRange?.max);

  const safePriceRange = {
    min: Math.min(Number.isFinite(cmsPriceMin) ? cmsPriceMin : dataPriceMin, dataPriceMin),
    max: Math.max(Number.isFinite(cmsPriceMax) ? cmsPriceMax : dataPriceMax, dataPriceMax),
  };

  const safePuffRange = {
    min: Math.min(Number.isFinite(cmsPuffMin) ? cmsPuffMin : dataPuffMin, dataPuffMin),
    max: Math.max(Number.isFinite(cmsPuffMax) ? cmsPuffMax : dataPuffMax, dataPuffMax),
  };

  const cmsCategories =
    Array.isArray(shopPage?.categories) && shopPage.categories.length > 0
      ? shopPage.categories
      : ["Injectable Steroids", "Oral Steroids", "PCT Supplements"];

  const safeCategories = initialCategoryFilter
    ? Array.from(new Set([...cmsCategories, initialCategoryFilter]))
    : cmsCategories;

  const cmsBrands =
    Array.isArray(shopPage?.brands) && shopPage.brands.length > 0
      ? shopPage.brands
      : ["Generic", "Premium", "House Brand"];

  const safeBrands = initialBrandFilter
    ? Array.from(new Set([...cmsBrands, initialBrandFilter]))
    : cmsBrands;

  // Fallbacks if CMS is empty
  const filterOptions = {
    categories: safeCategories,
    brands: safeBrands,
    productTypes: Array.isArray(shopPage?.types) && shopPage.types.length > 0 ? shopPage.types : ["Disposable", "Cartridge", "Pod"],
    priceRange: safePriceRange,
    puffRange: safePuffRange,
  };

  const initialFilters = {
    ...(initialCategoryFilter ? { categories: [initialCategoryFilter] } : {}),
    ...(initialBrandFilter ? { brands: [initialBrandFilter] } : {}),
  };

  return (
    <main className="overflow-x-clip bg-background pb-14 text-foreground">
      <SectionReveal y={18}>
        <section className="border-section-b bg-muted/50">
          <Container className="py-10 sm:py-12">
            <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-widest text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="underline-offset-4 hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-foreground">Shop</li>
              </ol>
            </nav>

            <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-highlight sm:text-[11px] sm:tracking-[0.18em]">
              <span className="h-px w-8 bg-highlight/70" />
              Shop Inventory
              <span className="h-px w-8 bg-highlight/70" />
            </p>
            <h1 className="mt-2 font-heading text-3xl leading-tight sm:text-4xl">Wholesale Products</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Browse wholesale inventory by category and brand. Use filters to narrow results and build
              your order mix.
            </p>
          </Container>
        </section>
      </SectionReveal>

      <Suspense
        fallback={
          <Container className="pt-6 sm:pt-8">
            <div className="glass-listing rounded-2xl p-4 text-sm text-muted-foreground">
              Loading products...
            </div>
          </Container>
        }
      >
        <ProductsCatalogClient
          products={productCards}
          initialPage={initialPage}
          productsPerPage={6}
          filterOptions={filterOptions}
          initialFilters={Object.keys(initialFilters).length > 0 ? initialFilters : undefined}
        />
      </Suspense>
    </main>
  );
}
