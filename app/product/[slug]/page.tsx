import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ShieldCheck, Truck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductInfoTabs } from "@/components/product/ProductInfoTabs";
import { ProductVariantPurchasePanel } from "@/components/product/ProductVariantPurchasePanel";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL, categoryPublicPath } from "@/config/seo";
import { urlFor } from "@/lib/sanity";
import { getProductBySlug, getRelatedProductsByCategorySlug } from "@/lib/sanityClient";
import type { Product, ProductVariant } from "@/types/sanity";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function getLiveProductTypeCategory(product: Product): "disposable" | "cartridge" | "thc" {
  const productType = product.productType || "Disposable";
  const category = product.category;
  const categoryName =
    category && "name" in category && typeof category.name === "string"
      ? category.name.toLowerCase()
      : "";
  const categoryGroup =
    category && "group" in category && typeof category.group === "string"
      ? category.group
      : undefined;

  if (productType === "Cartridge" || categoryName.includes("cart")) {
    return "cartridge";
  }

  if (categoryGroup === "THC" || categoryGroup === "THCA" || productType === "Pod") {
    return "thc";
  }

  return "disposable";
}

function getProductBasePrice(variants?: ProductVariant[]) {
  if (!variants?.length) {
    return 0;
  }

  const defaultPrice = variants.find((variant) => variant.isDefault && typeof variant.price === "number")?.price;
  if (typeof defaultPrice === "number") {
    return defaultPrice;
  }

  const prices = variants.map((variant) => variant.price).filter((price): price is number => typeof price === "number");
  if (prices.length === 0) {
    return 0;
  }

  return Math.min(...prices);
}

function getCategoryBreadcrumb(product: Product, category: "disposable" | "cartridge" | "thc") {
  const categoryRef = product.category;
  const categoryLabel =
    categoryRef && "name" in categoryRef && typeof categoryRef.name === "string"
      ? categoryRef.name
      : category === "cartridge"
        ? "Cartridges"
        : category === "thc"
          ? "THC"
          : "Disposables";
  const categorySlug =
    categoryRef && "slug" in categoryRef && categoryRef.slug?.current
      ? categoryRef.slug.current
      : undefined;

  return {
    label: categoryLabel,
    href: categorySlug ? categoryPublicPath(categorySlug) : "/products",
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: `Product Not Found | ${SITE_NAME}`,
      description: "The requested product could not be found.",
    };
  }

  const productName = product.name;
  const canonical = `${SITE_URL}/product/${slug}`;
  const fallbackDescription = `Browse ${productName} details and wholesale availability at ${SITE_NAME}.`;

  return {
    title: `${product.seoTitle || productName} | ${SITE_NAME}`,
    description: product.seoDescription || product.shortDescription || fallbackDescription,
    alternates: {
      canonical,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productName = product.name;
  const category = getLiveProductTypeCategory(product);
  const categoryCrumb = getCategoryBreadcrumb(product, category);
  const categoryRef = product.category;
  const categorySlug =
    categoryRef && "slug" in categoryRef && categoryRef.slug?.current
      ? categoryRef.slug.current
      : undefined;
  const relatedProducts = categorySlug
    ? await getRelatedProductsByCategorySlug(categorySlug, slug, 4)
    : [];
  const brandRef = product.brand;
  const brand =
    brandRef && "name" in brandRef && typeof brandRef.name === "string"
      ? brandRef.name
      : "Brand";
  const galleryImages =
    product.images
      ?.map((image) => (image.asset ? urlFor(image).width(1200).height(1200).fit("crop").url() : undefined))
      .filter((url): url is string => Boolean(url)) || [];

  const activeVariants =
    product.variants?.filter((variant) => variant.isActive !== false) || product.variants || [];
  const basePrice = getProductBasePrice(activeVariants);
  const productDescription = product.shortDescription?.trim();
  const productUrl = `${SITE_URL}/product/${slug}`;
  const productOffer =
    basePrice > 0
      ? {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "USD",
          price: basePrice.toFixed(2),
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
        }
      : undefined;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    image: galleryImages,
    description: productDescription || undefined,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    category: categoryCrumb.label,
    offers: productOffer,
  };

  return (
    <main className="bg-background pb-14 text-foreground">
      <Container className="section-y">
        <SectionReveal y={14}>
          <nav aria-label="Breadcrumb" className="mb-3 text-xs uppercase tracking-widest text-muted-foreground sm:mb-4">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="underline-offset-4 hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/products" className="underline-offset-4 hover:underline">
                  Shop
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href={categoryCrumb.href} className="underline-offset-4 hover:underline">
                  {categoryCrumb.label}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-foreground">{productName}</li>
            </ol>
          </nav>
        </SectionReveal>

        <SectionReveal delay={0.02}>
          <div className="glass-listing grid gap-6 rounded-3xl p-5 sm:p-6 lg:grid-cols-2 lg:gap-8 lg:p-8">
            <ProductImageGallery productName={productName} images={galleryImages} />

            <section aria-label="Product details" className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-highlight/15 text-highlight">
                  {brand}
                </Badge>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Verified Product
                </span>
              </div>

              <h1 className="font-heading text-3xl leading-tight sm:text-4xl">{productName}</h1>

              {productDescription ? (
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{productDescription}</p>
              ) : null}

              <ProductVariantPurchasePanel
                productId={product._id}
                productName={productName}
                variants={activeVariants}
              />

              <div className="glass-field grid gap-2 rounded-2xl p-3 sm:grid-cols-3">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-highlight" aria-hidden={true} />
                  Verified Products
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <Truck className="h-4 w-4 text-highlight" aria-hidden={true} />
                  Fast Shipping
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <BadgeCheck className="h-4 w-4 text-highlight" aria-hidden={true} />
                  Secure Order
                </div>
              </div>

              <p className="rounded-2xl border border-highlight/30 bg-highlight/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-foreground">
                Pay with BTC/ETH/USDT for 10% off
              </p>

              <div className="grid gap-2 sm:grid-cols-1">
                <Button asChild variant="outline" className="w-full text-xs">
                  <Link href="/products">Back to Shop</Link>
                </Button>
              </div>
            </section>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.04}>
          <ProductInfoTabs
            productName={productName}
            descriptionBlocks={product.description}
            variants={activeVariants}
            specs={product.specs}
            shippingInfo={product.shippingInfo}
          />
        </SectionReveal>

        <SectionReveal delay={0.06}>
          <RelatedProducts products={relatedProducts} categoryLabel={categoryCrumb.label} />
        </SectionReveal>
      </Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
    </main>
  );
}
