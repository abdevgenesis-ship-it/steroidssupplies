import type { ShopProductCardData } from "@/components/shop/ProductCard";
import { urlFor } from "@/lib/sanity";
import type { Product } from "@/types/sanity";

/** Maps a Sanity product document to the shape used by `ProductCard` on the shop catalog. */
export function mapSanityProductToShopCard(product: Product): ShopProductCardData {
  const categorySource = product.category;
  const brandSource = product.brand;
  const defaultVariant = product.variants?.find((variant) => variant.isDefault);
  const firstVariant = defaultVariant || product.variants?.find((variant) => typeof variant.price === "number");
  const firstVariantWithPuffs =
    product.variants?.find((variant) => typeof variant.puffCount === "number") || defaultVariant;
  const price = typeof firstVariant?.price === "number" ? firstVariant.price : 0;
  const nicotinePercent =
    typeof firstVariant?.nicotinePercent === "number"
      ? firstVariant.nicotinePercent
      : typeof product.nicotinePercent === "number"
        ? product.nicotinePercent
        : undefined;
  const puffCount =
    typeof firstVariantWithPuffs?.puffCount === "number"
      ? firstVariantWithPuffs.puffCount
      : typeof product.puffCount === "number"
        ? product.puffCount
        : 0;

  const imageSource = product.images?.[0];
  const image = imageSource?.asset
    ? urlFor(imageSource).width(960).height(720).fit("crop").url()
    : undefined;

  const brandName =
    brandSource && "name" in brandSource && typeof brandSource.name === "string"
      ? brandSource.name
      : "Brand";

  const categoryGroup =
    product.categoryGroup ||
    (categorySource && "group" in categorySource ? categorySource.group : undefined) ||
    "Disposable Vapes";

  const categoryName =
    categorySource && "name" in categorySource && typeof categorySource.name === "string"
      ? categorySource.name
      : "";

  const productType = product.productType || "Disposable";
  const displayType = product.productType || "Disposable";
  const specParts = [
    puffCount > 0 ? `${puffCount} puffs` : undefined,
    typeof nicotinePercent === "number" ? `${nicotinePercent}mg THC` : undefined,
    displayType,
  ].filter(Boolean);

  const normalizedCategory =
    categorySource && "name" in categorySource && typeof categorySource.name === "string"
      ? categorySource.name
      : categoryName.toLowerCase().includes("510") || categoryName.toLowerCase().includes("disposable")
        ? categoryGroup
        : categoryGroup;

  return {
    id: product._id,
    name: product.name,
    image,
    brand: brandName,
    category: normalizedCategory,
    productType,
    puffCount,
    price,
    publishedAt: product.publishedAt || product._updatedAt,
    specLine: specParts.join(" • "),
    priceText: price > 0 ? `From £${price.toFixed(2)}` : "Request Pricing",
    href: product.slug?.current ? `/product/${product.slug.current}` : "/products",
  };
}
