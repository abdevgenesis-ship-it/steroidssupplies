import groq from "groq";

import { pickRandomRelatedContent } from "@/lib/supportingPageGenerator/pickRandomRelatedContent";
import { sanityReadClient } from "@/lib/sanity";
import type { Product, SupportingPage } from "@/types/sanity";

const supportingRelationsQuery = groq`
  *[_type == "supportingPage" && slug.current == $slug][0]{
    "relatedProducts": relatedProducts[]->{
      ...,
      "brand": brand->{name, slug},
      "category": category->{name, slug, group}
    },
    "categories": categories[]->{
      _id,
      name,
      slug,
      shortDescription,
      image
    }
  }
`;

const productByIdsQuery = groq`
  *[_type == "product" && _id in $ids]{
    ...,
    "brand": brand->{name, slug},
    "category": category->{name, slug, group}
  }
`;

const categoryByIdsQuery = groq`
  *[_type == "category" && _id in $ids]{
    _id,
    name,
    slug,
    shortDescription,
    image
  }
`;

const relationPoolsQuery = groq`{
  "categoryIds": *[_type == "category" && defined(slug.current) && !(_id in path("drafts.**"))]._id,
  "productIds": *[_type == "product" && defined(slug.current) && defined(name) && !(_id in path("drafts.**"))]._id
}`;

function isResolvedProduct(product: Product | null | undefined): product is Product {
  return Boolean(product?._id && typeof product.name === "string" && product.name.trim().length > 0);
}

type SupportingCategory = NonNullable<SupportingPage["categories"]>[number];

function isResolvedCategory(category: SupportingCategory | null | undefined) {
  return Boolean(category?._id && category.slug?.current);
}

function cleanRelations(page: SupportingPage): SupportingPage {
  return {
    ...page,
    relatedProducts: (page.relatedProducts ?? []).filter(isResolvedProduct).slice(0, 4),
    categories: (page.categories ?? []).filter(isResolvedCategory).slice(0, 4),
  };
}

/** Ensures supporting pages always have resolvable product/category cards (bypasses stale CDN cache). */
export async function enrichSupportingPageRelations(page: SupportingPage): Promise<SupportingPage> {
  const cleaned = cleanRelations(page);
  const hasProducts = (cleaned.relatedProducts?.length ?? 0) > 0;
  const hasCategories = (cleaned.categories?.length ?? 0) > 0;

  if (hasProducts && hasCategories) {
    return cleaned;
  }

  const slug = page.slug?.current?.trim();
  if (!slug) {
    return cleaned;
  }

  const fresh = await sanityReadClient.fetch<{
    relatedProducts?: Product[];
    categories?: SupportingPage["categories"];
  }>(supportingRelationsQuery, { slug }, { cache: "no-store" });

  let relatedProducts = (fresh?.relatedProducts ?? []).filter(isResolvedProduct);
  let categories = (fresh?.categories ?? []).filter(isResolvedCategory);

  if (relatedProducts.length === 0 || categories.length === 0) {
    const pools = await sanityReadClient.fetch<{ categoryIds: string[]; productIds: string[] }>(
      relationPoolsQuery,
      {},
      { cache: "no-store" },
    );

    if (pools.categoryIds.length > 0 && pools.productIds.length > 0) {
      const picked = pickRandomRelatedContent(pools, slug);

      if (relatedProducts.length === 0) {
        relatedProducts = await sanityReadClient.fetch<Product[]>(
          productByIdsQuery,
          { ids: picked.productIds },
          { cache: "no-store" },
        );
        relatedProducts = relatedProducts.filter(isResolvedProduct);
      }

      if (categories.length === 0) {
        categories = await sanityReadClient.fetch<NonNullable<SupportingPage["categories"]>>(
          categoryByIdsQuery,
          { ids: picked.categoryIds },
          { cache: "no-store" },
        );
        categories = categories.filter(isResolvedCategory);
      }
    }
  }

  return {
    ...page,
    relatedProducts: relatedProducts.slice(0, 4),
    categories: categories.slice(0, 4),
  };
}
