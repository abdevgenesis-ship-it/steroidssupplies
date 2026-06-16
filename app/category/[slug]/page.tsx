import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CategoryAuthorityBlock } from "@/components/category/CategoryAuthorityBlock";
import { CategoryBestsellers } from "@/components/category/CategoryBestsellers";
import { CategoryCrossLinks } from "@/components/category/CategoryCrossLinks";
import { CategoryFaqSection } from "@/components/category/CategoryFaqSection";
import { CategoryFilterSortBar } from "@/components/category/CategoryFilterSortBar";
import { CategoryHero } from "@/components/category/CategoryHero";
import { CategorySupportingLinks } from "@/components/category/CategorySupportingLinks";
import { CategoryTrustWall } from "@/components/category/CategoryTrustWall";
import { Container } from "@/components/layout/container";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { type ShopProductCardData } from "@/components/shop/ProductCard";
import { SupportingPageProductsGrid } from "@/components/supporting/SupportingPageProductsGrid";
import { SITE_NAME, SITE_URL, categoryPublicPath } from "@/config/seo";
import { portableTextToBoldMarkdown } from "@/lib/content/portableTextBold";
import { resolveCategoryPageContent } from "@/lib/categoryPageDefaults";
import { urlFor } from "@/lib/sanity";
import {
  getBestSellerProductsByCategorySlug,
  getCategoriesForLanding,
  getCategoryBySlug,
  getProductsByCategorySlug,
} from "@/lib/sanityClient";
import type { Product } from "@/types/sanity";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategoriesForLanding();

  return categories
    .map((category) => category.slug?.current)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: `Category Not Found | ${SITE_NAME}`,
      description: "The requested category could not be found.",
    };
  }

  const title = category.seoTitle?.trim() || `${category.name} | ${SITE_NAME}`;
  const description =
    category.seoDescription?.trim() ||
    category.shortDescription?.trim() ||
    `Shop ${category.name.toLowerCase()} with wholesale pricing, consistent inventory, and B2B-focused fulfillment from ${SITE_NAME}.`;
  const canonical = `${SITE_URL}${categoryPublicPath(slug)}`;

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

function mapSanityProductToCard(product: Product): ShopProductCardData {
  const categorySource = product.category;
  const brandSource = product.brand;

  const firstVariantPrice = product.variants?.find((variant) => typeof variant.price === "number")?.price;
  const price = typeof firstVariantPrice === "number" ? firstVariantPrice : 0;

  const imageSource = product.images?.[0];
  const image = imageSource?.asset
    ? urlFor(imageSource).width(960).height(720).fit("crop").url()
    : "/images/categories/bulk-thc-vapes.png";

  const brandName =
    brandSource && "name" in brandSource && typeof brandSource.name === "string"
      ? brandSource.name
      : "Brand";

  const categoryGroup =
    product.categoryGroup ||
    (categorySource && "group" in categorySource ? categorySource.group : undefined) ||
    "Nicotine";

  const productType = product.productType || "Disposable";
  const puffCount = typeof product.puffCount === "number" ? product.puffCount : 0;

  return {
    id: product._id,
    name: product.name,
    image,
    brand: brandName,
    category: categoryGroup,
    productType,
    puffCount,
    price,
    publishedAt: product.publishedAt || product._updatedAt,
    specLine: `${puffCount > 0 ? `${puffCount} puffs` : "Wholesale ready"} • ${productType}`,
    priceText: price > 0 ? `From $${price.toFixed(2)}` : "Request Pricing",
    href: product.slug?.current ? `/product/${product.slug.current}` : "/products",
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, queriedProducts, allCategories, bestSellerProducts] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategorySlug(slug),
    getCategoriesForLanding(),
    getBestSellerProductsByCategorySlug(slug),
  ]);

  const categoryProducts = queriedProducts.map(mapSanityProductToCard);

  if (!category) {
    notFound();
  }
  const content = resolveCategoryPageContent(category);
  const normalizeBlockToText = portableTextToBoldMarkdown;

  const relatedGuideLinks =
    category.relatedGuides
      ?.filter((guide) => guide?.title && guide?.href)
      .map((guide) => ({ title: guide.title as string, href: guide.href as string })) ?? [];

  const trustTestimonials =
    category.categoryTrustWallTestimonials
      ?.filter((item) => item?.quote?.trim() && item?.source?.trim())
      .map((item) => ({
        quote: item.quote!.trim(),
        source: item.source!.trim(),
      })) ?? [];

  const trustShields =
    category.categoryTrustWallShields
      ?.map((item) => item?.trim())
      .filter((item): item is string => Boolean(item)) ?? [];

  const categoryFaqItems =
    category.categoryFaqItems
      ?.filter((item) => {
        if (item?.isActive === false) return false;
        const mappedCategories = item?.productCategories ?? [];
        if (mappedCategories.length === 0) return true;
        return mappedCategories.some((mapped) => mapped?.slug?.current === slug);
      })
      .map((item) => ({
        id: item._id,
        question: item.question?.trim() || "",
        answer: normalizeBlockToText(item.answer),
        ctaLabel: item.ctaLabel?.trim(),
        ctaHref: item.ctaHref?.trim(),
      }))
      .filter((item) => item.question && item.answer) ?? [];

  const relatedCategoryLinks =
    category.relatedCategories
      ?.filter(
        (linkedCategory): linkedCategory is typeof linkedCategory & { slug: { current: string } } =>
          Boolean(linkedCategory?.slug?.current && linkedCategory.slug.current !== slug),
      )
      .map((linkedCategory) => ({
        title: linkedCategory.name || "Category",
        href: categoryPublicPath(linkedCategory.slug.current),
      })) ?? [];

  const fallbackCategoryLinks = allCategories
    .filter((item) => item.slug?.current && item.slug.current !== slug)
    .slice(0, 3)
    .map((item) => ({
      title: item.name,
      href: categoryPublicPath(item.slug.current),
    }));

  const resolvedCategoryLinks =
    relatedCategoryLinks.length > 0 ? relatedCategoryLinks : fallbackCategoryLinks;

  const categoryUrl = `${SITE_URL}${categoryPublicPath(slug)}`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categories",
        item: `${SITE_URL}/categories`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: categoryUrl,
      },
    ],
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Wholesale`,
    url: categoryUrl,
    description:
      category.seoDescription?.trim() ||
      category.shortDescription ||
      `${category.name} wholesale collection for retailers and distributors.`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <main className="bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />

      <Container className="section-y">
        <SectionReveal y={14}>
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>{content.breadcrumbCategoriesLabel}</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">{category.name}</span>
          </nav>
        </SectionReveal>

        <SectionReveal delay={0.02}>
          <CategoryHero
            category={category}
            eyebrow={content.hero.eyebrow}
            primaryCtaLabel={content.hero.primaryCtaLabel}
            secondaryCtaLabel={content.hero.secondaryCtaLabel}
            fallbackDescription={content.hero.fallbackDescription}
          />
        </SectionReveal>

        <SectionReveal delay={0.03}>
          <Suspense
            fallback={
              <section
                aria-label="Category filter and sort controls"
                className="glass-listing mt-6 rounded-2xl p-4 text-sm text-muted-foreground"
              >
                {content.filterLoadingMessage}
              </section>
            }
          >
            <CategoryFilterSortBar
              categoryName={category.name}
              label={content.filterBar.label}
              viewAllLabel={content.filterBar.viewAllLabel}
            />
          </Suspense>
        </SectionReveal>

        <SectionReveal delay={0.04} amount={0.05}>
          <section aria-label="Category products" className="mt-8">
            <h2 className="font-heading text-2xl leading-tight sm:text-3xl">{content.products.heading}</h2>

            {categoryProducts.length > 0 ? (
              <SupportingPageProductsGrid products={categoryProducts} />
            ) : (
              <div className="glass-listing mt-5 rounded-2xl p-4 text-sm text-muted-foreground">
                {content.products.emptyMessage}
              </div>
            )}
          </section>
        </SectionReveal>

        <SectionReveal delay={0.05}>
          {bestSellerProducts.length > 0 ? (
            <CategoryBestsellers
              products={bestSellerProducts}
              eyebrow={content.bestsellers.eyebrow}
              heading={content.bestsellers.heading}
              description={content.bestsellers.description}
              viewAllLabel={content.bestsellers.viewAllLabel}
            />
          ) : null}
        </SectionReveal>

        <SectionReveal delay={0.06}>
          <CategoryAuthorityBlock
            categoryName={category.name}
            seoContent={category.seoContent}
            heading={content.authority.heading}
          />
        </SectionReveal>

        <SectionReveal delay={0.07}>
          <CategorySupportingLinks
            links={relatedGuideLinks}
            heading={content.supportingLinks.heading}
            description={content.supportingLinks.description}
            emptyMessage={content.supportingLinks.emptyMessage}
          />
        </SectionReveal>

        <SectionReveal delay={0.08}>
          <CategoryTrustWall
            heading={content.trustWall.heading}
            testimonials={trustTestimonials}
            shields={trustShields}
          />
        </SectionReveal>

        <SectionReveal delay={0.09}>
          <CategoryFaqSection
            heading={content.faq.heading}
            description={content.faq.description}
            emptyMessage={content.faq.emptyMessage}
            items={categoryFaqItems}
          />
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <CategoryCrossLinks
            links={resolvedCategoryLinks}
            heading={content.crossLinks.heading}
            description={content.crossLinks.description}
            emptyMessage={content.crossLinks.emptyMessage}
          />
        </SectionReveal>

        <SectionReveal delay={0.11}>
          <div className="mt-6">
            <Link href="/products" className="text-sm font-medium text-highlight hover:underline">
              {content.browseAllLabel}
            </Link>
          </div>
        </SectionReveal>
      </Container>
    </main>
  );
}
