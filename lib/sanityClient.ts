import groq from "groq";
import { cache } from "react";

import { HOME_PAGE_DOCUMENT_ID } from "@/config/sanitySingletons";
import { enrichSupportingPageRelations } from "@/lib/enrichSupportingPageRelations";
import { normalizeSupportingPage } from "@/lib/supportingPageParent";
import { sanityReadClient, sanityConfig } from "@/lib/sanity";
import type {
  Brand,
  BlogPost,
  Category,
  CompliancePageDoc,
  AboutPageDoc,
  ContactPageDoc,
  FAQItem,
  HomePage,
  LocationsPageDoc,
  MoqPageDoc,
  Product,
  SupportingPage,
  SupportingPageParent,
  ShopPage,
  ShippingPageDoc,
  SiteSettings,
  WholesalePageDoc,
  Testimonial,
  ProgrammaticPage,
  Slug,
} from "@/types/sanity";

type QueryParams = Record<string, string | number | boolean | null | undefined>;

/** Seconds between refetching Sanity content (avoids stale CMS copy from indefinite Next.js Data Cache). */
const SANITY_FETCH_REVALIDATE_SEC = Math.max(
  10,
  Number(process.env.SANITY_FETCH_REVALIDATE_SECONDS ?? 60) || 60,
);

export async function fetchSanity<T>(query: string, params: QueryParams = {}) {
  return sanityReadClient.fetch<T>(query, params, {
    cache: "force-cache",
    next: { tags: ["sanity"], revalidate: SANITY_FETCH_REVALIDATE_SEC },
  });
}

export const sanityQueries = {
  shopPage: groq`*[_type == "shopPage" && _id == "1e60b814-d8d6-41ff-93f8-79daffccc974"][0]{
    ...,
    "brands": brands[]->name,
    "categories": categories[]->name,
    priceRange,
    puffRange,
    types
  }`,
  siteSettings: groq`*[_type == "siteSettings"][0]`,
  homePage: groq`*[_type == "homePage" && _id == $homePageId][0]{
    ...,
    "featuredCategories": featuredCategories[]->{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      name,
      slug,
      group,
      shortDescription,
      image,
      heroImage
    },
    "featuredBrands": featuredBrands[]->{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      name,
      slug,
      shortDescription,
      logo,
      website,
      isActive,
      sortOrder
    }
  }`,
  products: groq`*[_type == "product" && coalesce(isActive, true) == true] | order(publishedAt desc){
    ...,
    "brand": brand->{name, slug},
    "category": category->{name, slug, group}
  }`,
  brandsForDirectory: groq`*[_type == "brand" && coalesce(isActive, true) == true] | order(sortOrder asc, name asc){
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    name,
    slug,
    shortDescription,
    logo,
    website,
    isActive,
    sortOrder
  }`,
  categoriesForLanding: groq`*[_type == "category" && coalesce(isActive, true) == true] | order(navOrder asc, name asc)`,
  categoryProductsBySlug: groq`*[_type == "product" && category->slug.current == $slug] | order(publishedAt desc){
    ...,
    "brand": brand->{name, slug},
    "category": category->{name, slug, group}
  }`,
  bestSellerProductsByCategorySlug: groq`*[_type == "product" && coalesce(isActive, true) == true && isBestSeller == true && category->slug.current == $slug] | order(coalesce(publishedAt, _updatedAt) desc)[0...4]{
    ...,
    "brand": brand->{name, slug},
    "category": category->{name, slug, group}
  }`,
  relatedProductsByCategorySlug: groq`*[_type == "product" && coalesce(isActive, true) == true && category->slug.current == $categorySlug && slug.current != $currentSlug] | order(publishedAt desc)[0...$limit]{
    ...,
    "brand": brand->{name, slug},
    "category": category->{name, slug, group}
  }`,
  productBySlug: groq`*[_type == "product" && slug.current == $slug && coalesce(isActive, true) == true][0]{
    ...,
    "brand": brand->{name, slug},
    "category": category->{name, slug, group}
  }`,
  categories: groq`*[_type == "category" && coalesce(isActive, true) == true && showInHeader == true] | order(navOrder asc, name asc)`,
  categoryBySlug: groq`*[_type == "category" && slug.current == $slug][0]{
    ...,
    relatedGuides,
    "categoryFaqItems": categoryFaqItems[]->{
      _id,
      _type,
      question,
      answer,
      category,
      ctaLabel,
      ctaHref,
      order,
      isActive,
      "productCategories": productCategories[]->{
        _id,
        name,
        slug
      }
    },
    "relatedCategories": relatedCategories[]->{
      _id,
      name,
      slug
    }
  }`,
  wholesalePage: groq`*[_type == "wholesalePage" && _id == "wholesalePage"][0]`,
  shippingPage: groq`*[_type == "shippingPage" && _id == "shippingPage"][0]`,
  compliancePage: groq`*[_type == "compliancePage" && _id == "compliancePage"][0]`,
  moqPage: groq`*[_type == "moqPage" && _id == "moqPage"][0]`,
  locationsPage: groq`*[_type == "locationsPage" && _id == "locationsPage"][0]`,
  aboutPage: groq`*[_type == "aboutPage" && _id == "aboutPage"][0]`,
  contactPage: groq`*[_type == "contactPage" && _id == "contactPage"][0]`,
  testimonials: groq`*[_type == "testimonial" && coalesce(isActive, true) == true] | order(sortOrder asc, _createdAt desc)`,
  testimonialsByPlacement: groq`*[_type == "testimonial" && coalesce(isActive, true) == true && $placement in placements] | order(sortOrder asc, _createdAt desc)`,
  latestBlogPosts: groq`*[_type == "blogPost" && coalesce(isActive, true) == true] | order(coalesce(publishedAt, _createdAt) desc) [0...$limit]{
    ...,
    "category": category->{name, slug, group},
    "author": author->{name, slug, role, bio, image}
  }`,
  allBlogPosts: groq`*[_type == "blogPost" && coalesce(isActive, true) == true] | order(coalesce(publishedAt, _createdAt) desc){
    ...,
    "category": category->{name, slug, group},
    "author": author->{name, slug, role, bio, image}
  }`,
  blogPostBySlug: groq`*[_type == "blogPost" && slug.current == $slug && coalesce(isActive, true) == true][0]{
    ...,
    "category": category->{name, slug, group},
    "author": author->{name, slug, role, bio, image},
    "relatedPosts": relatedPosts[]->{
      _id,
      title,
      slug,
      heroImage,
      publishedAt
    }
  }`,
  faqItems: groq`*[_type == "faqItem" && coalesce(isActive, true) == true] | order(category asc, order asc)`,
  allSupportingPagesNav: groq`
    *[_type == "supportingPage" && defined(slug.current)]{
      _id,
      title,
      slug,
      "parentPage": parentPage->{_id, _type, title, slug}
    } | order(title asc)
  `,
  supportingPageBySlug: groq`
    *[_type == "supportingPage" && slug.current == $slug && parentPage->_type == $parentType][0]{
      ...,
      "parentPage": parentPage->{_id, _type, title, slug},
      "relatedProducts": relatedProducts[]->{
        ...,
        "brand": brand->{name, slug},
        "category": category->{name, slug, group}
      }[defined(_id)],
      "categories": categories[]->{
        _id,
        name,
        slug,
        shortDescription,
        image
      }[defined(_id)],
      "_parentRef": parentPage._ref,
      "_hasEmptyParent": !defined(parentPage),
      "siblingLinks": []
    }
  `,
  supportingPageRootBySlug: groq`
    *[_type == "supportingPage" && slug.current == $slug && (!defined(parentPage) || parentPage == null)][0]{
      ...,
      "parentPage": parentPage->{_id, _type, title, slug},
      "relatedProducts": relatedProducts[]->{
        ...,
        "brand": brand->{name, slug},
        "category": category->{name, slug, group}
      }[defined(_id)],
      "categories": categories[]->{
        _id,
        name,
        slug,
        shortDescription,
        image
      }[defined(_id)],
      "_parentRef": parentPage._ref,
      "_hasEmptyParent": true,
      "siblingLinks": []
    }
  `,
  supportingPageBySlugAndCategorySlug: groq`
    *[_type == "supportingPage" && slug.current == $slug && parentPage->_type == "category" && parentPage->slug.current == $categorySlug][0]{
      ...,
      "parentPage": parentPage->{_id, _type, title, slug},
      "relatedProducts": relatedProducts[]->{
        ...,
        "brand": brand->{name, slug},
        "category": category->{name, slug, group}
      }[defined(_id)],
      "categories": categories[]->{
        _id,
        name,
        slug,
        shortDescription,
        image
      }[defined(_id)],
      "_parentRef": parentPage._ref,
      "_hasEmptyParent": !defined(parentPage),
      "siblingLinks": []
    }
  `,
  supportingPageSiblingsByParent: groq`
    *[_type == "supportingPage" && _id != $currentId && (
      ($emptyParentOnly == true && (!defined(parentPage) || parentPage == null))
      || ($emptyParentOnly != true && parentPage._ref == $parentRef)
    )]{
      _id,
      title,
      slug
    }[0..2]
  `,
  programmaticPageBySlug: groq`*[_type == "programmaticPage" && slug.current == $slug][0]{
    ...,
    "category": category->{_id, name, slug, group}
  }`,
  programmaticPageByCategoryAndLocation: groq`*[_type == "programmaticPage" && slug.current == $locationSlug && category->slug.current == $categorySlug][0]{
    ...,
    "category": category->{_id, name, slug, group}
  }`,
  programmaticPagesForStaticParams: groq`*[_type == "programmaticPage" && defined(slug.current) && defined(category->slug.current)]{
    "category": category->slug.current,
    "location": slug.current
  }`,
};

export const getSiteSettings = () => fetchSanity<SiteSettings | null>(sanityQueries.siteSettings);
export const getShopPage = () => fetchSanity<ShopPage | null>(sanityQueries.shopPage);
export const getHomePage = cache(() =>
  fetchSanity<HomePage | null>(sanityQueries.homePage, { homePageId: HOME_PAGE_DOCUMENT_ID }),
);
export const getProducts = () => fetchSanity<Product[]>(sanityQueries.products);
export const getBrandsForDirectory = () => fetchSanity<Brand[]>(sanityQueries.brandsForDirectory);
export const getProductsByCategorySlug = (slug: string) =>
  fetchSanity<Product[]>(sanityQueries.categoryProductsBySlug, { slug });
export const getBestSellerProductsByCategorySlug = (slug: string) =>
  fetchSanity<Product[]>(sanityQueries.bestSellerProductsByCategorySlug, { slug });
export const getRelatedProductsByCategorySlug = (
  categorySlug: string,
  currentSlug: string,
  limit = 4,
) => fetchSanity<Product[]>(sanityQueries.relatedProductsByCategorySlug, { categorySlug, currentSlug, limit });
export const getProductBySlug = (slug: string) =>
  fetchSanity<Product | null>(sanityQueries.productBySlug, { slug });
export const getCategoriesForLanding = () => fetchSanity<Category[]>(sanityQueries.categoriesForLanding);
export const getCategories = () => fetchSanity<Category[]>(sanityQueries.categories);
export const getCategoryBySlug = (slug: string) =>
  fetchSanity<Category | null>(sanityQueries.categoryBySlug, { slug });
export const getWholesalePage = () => fetchSanity<WholesalePageDoc | null>(sanityQueries.wholesalePage);
export const getShippingPage = () => fetchSanity<ShippingPageDoc | null>(sanityQueries.shippingPage);
export const getCompliancePage = () =>
  fetchSanity<CompliancePageDoc | null>(sanityQueries.compliancePage);
export const getMoqPage = () => fetchSanity<MoqPageDoc | null>(sanityQueries.moqPage);
export const getLocationsPage = () =>
  fetchSanity<LocationsPageDoc | null>(sanityQueries.locationsPage);
export const getAboutPage = () => fetchSanity<AboutPageDoc | null>(sanityQueries.aboutPage);
export const getContactPage = () => fetchSanity<ContactPageDoc | null>(sanityQueries.contactPage);
export const getTestimonials = () => fetchSanity<Testimonial[]>(sanityQueries.testimonials);
export const getTestimonialsByPlacement = (placement: "homepage" | "wholesale") =>
  fetchSanity<Testimonial[]>(sanityQueries.testimonialsByPlacement, { placement });
export const getLatestBlogPosts = (limit = 3) =>
  fetchSanity<BlogPost[]>(sanityQueries.latestBlogPosts, { limit });
export const getAllBlogPosts = () => fetchSanity<BlogPost[]>(sanityQueries.allBlogPosts);
export const getBlogPostBySlug = (slug: string) =>
  fetchSanity<BlogPost | null>(sanityQueries.blogPostBySlug, { slug });
export const getFAQItems = () => fetchSanity<FAQItem[]>(sanityQueries.faqItems);
export const getAllSupportingPagesNav = () =>
  fetchSanity<Array<{ _id: string; title: string; slug: Slug; parentPage?: SupportingPageParent }>>(
    sanityQueries.allSupportingPagesNav,
  );
type SupportingPageParentType = "homePage" | "wholesalePage" | "category";

async function finalizeSupportingPage(page: SupportingPage | null) {
  const normalized = normalizeSupportingPage(page);
  if (!normalized) return null;
  return enrichSupportingPageRelations(normalized);
}

export async function getSupportingPageBySlug(
  slug: string,
  parentType: SupportingPageParentType,
) {
  const page = await fetchSanity<SupportingPage | null>(sanityQueries.supportingPageBySlug, {
    slug,
    parentType,
  });
  return finalizeSupportingPage(page);
}

export async function getSupportingPageBySlugAndCategory(
  slug: string,
  categorySlug: string,
) {
  const page = await fetchSanity<SupportingPage | null>(
    sanityQueries.supportingPageBySlugAndCategorySlug,
    { slug, categorySlug },
  );
  return finalizeSupportingPage(page);
}

/** Root /:slug pages only — parentPage must be unset in Sanity. */
export async function getRootSupportingPageBySlug(slug: string) {
  const page = await fetchSanity<SupportingPage | null>(sanityQueries.supportingPageRootBySlug, {
    slug,
  });
  return finalizeSupportingPage(page);
}

export const getSupportingPageSiblings = (
  parentRef: string,
  currentId: string,
  options?: { emptyParentOnly?: boolean },
) =>
  fetchSanity<Array<{ _id: string; title?: string; slug?: Slug }>>(
    sanityQueries.supportingPageSiblingsByParent,
    {
      parentRef,
      currentId,
      emptyParentOnly: options?.emptyParentOnly === true,
    },
  );
export const getProgrammaticPageBySlug = (slug: string) =>
  fetchSanity<ProgrammaticPage | null>(sanityQueries.programmaticPageBySlug, {slug});
export const getProgrammaticPageByCategoryAndLocation = (categorySlug: string, locationSlug: string) =>
  fetchSanity<ProgrammaticPage | null>(sanityQueries.programmaticPageByCategoryAndLocation, {
    categorySlug,
    locationSlug,
  });
export const getProgrammaticPagesForStaticParams = () =>
  fetchSanity<Array<{ category: string; location: string }>>(sanityQueries.programmaticPagesForStaticParams);

export async function testSanityConnection() {
  const query = groq`{
    "dataset": "${sanityConfig.dataset}",
    "projectId": "${sanityConfig.projectId}",
    "documentCount": count(*[])
  }`;

  return fetchSanity<{
    dataset: string;
    projectId: string;
    documentCount: number;
  }>(query);
}
