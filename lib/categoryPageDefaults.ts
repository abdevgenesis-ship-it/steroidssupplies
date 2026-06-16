import type { Category } from "@/types/sanity";

export type ResolvedCategoryPageContent = {
  breadcrumbCategoriesLabel: string;
  filterLoadingMessage: string;
  hero: {
    eyebrow: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    fallbackDescription: string;
  };
  filterBar: {
    label: string;
    viewAllLabel: string;
  };
  products: {
    heading: string;
    emptyMessage: string;
  };
  authority: {
    heading: string;
  };
  supportingLinks: {
    heading: string;
    description: string;
    emptyMessage: string;
  };
  trustWall: {
    heading: string;
  };
  faq: {
    heading: string;
    description: string;
    emptyMessage: string;
  };
  crossLinks: {
    heading: string;
    description: string;
    emptyMessage: string;
  };
  bestsellers: {
    eyebrow: string;
    heading: string;
    description: string;
    viewAllLabel: string;
  };
  browseAllLabel: string;
};

function renderTemplate(template: string, categoryName: string) {
  return template.replaceAll("{categoryName}", categoryName);
}

export function resolveCategoryPageContent(category: Category): ResolvedCategoryPageContent {
  const categoryName = category.name;

  return {
    breadcrumbCategoriesLabel: category.categoryBreadcrumbCategoriesLabel?.trim() || "Categories",
    filterLoadingMessage: category.categoryFilterLoadingMessage?.trim() || "Loading category controls...",
    hero: {
      eyebrow: category.categoryHeroEyebrow?.trim() || "Category Page",
      primaryCtaLabel: category.categoryHeroPrimaryCtaLabel?.trim() || "Shop This Category",
      secondaryCtaLabel: category.categoryHeroSecondaryCtaLabel?.trim() || "Wholesale Inquiry",
      fallbackDescription:
        renderTemplate(
          category.categoryHeroFallbackDescription?.trim() ||
            "Browse {categoryName} with authentic, lab-verified stock, consistent UK & Ireland supply, and retail or bulk wholesale pricing.",
          categoryName,
        ),
    },
    filterBar: {
      label: category.categoryFilterLabel?.trim() || "Filtered Category:",
      viewAllLabel: category.categoryFilterViewAllLabel?.trim() || "View all products",
    },
    products: {
      heading: renderTemplate(
        category.categoryProductsHeadingTemplate?.trim() || "Products in {categoryName}",
        categoryName,
      ),
      emptyMessage: category.categoryProductsEmptyMessage?.trim() || "No products found for this category yet.",
    },
    authority: {
      heading: renderTemplate(
        category.categoryAuthorityHeadingTemplate?.trim() ||
          "Why {categoryName} Sell Across the UK & Ireland",
        categoryName,
      ),
    },
    supportingLinks: {
      heading: category.categorySupportingHeading?.trim() || "Related Guides",
      description:
        category.categorySupportingDescription?.trim() ||
        "Explore supporting pages that cover dosage, ingredients, and buying strategy for this category.",
      emptyMessage:
        category.categorySupportingEmptyMessage?.trim() ||
        "No related guides configured for this category yet.",
    },
    trustWall: {
      heading: category.categoryTrustWallHeading?.trim() || "The Trust Wall",
    },
    faq: {
      heading: category.categoryFaqHeading?.trim() || "Frequently Asked Questions",
      description:
        category.categoryFaqDescription?.trim() ||
        "Answers to product quality, ingredients, and retail or wholesale ordering questions for this category.",
      emptyMessage:
        category.categoryFaqEmptyMessage?.trim() ||
        "No FAQ items are configured for this category yet.",
    },
    crossLinks: {
      heading: category.categoryCrossLinksHeading?.trim() || "Explore Related Categories",
      description:
        category.categoryCrossLinksDescription?.trim() ||
        "Compare nearby high-intent categories to plan your retail or wholesale product mix.",
      emptyMessage:
        category.categoryCrossLinksEmptyMessage?.trim() ||
        "No related categories configured for this category yet.",
    },
    bestsellers: {
      eyebrow: category.categoryBestsellersEyebrow?.trim() || "Top Moving Inventory",
      heading: category.categoryBestsellersHeading?.trim() || "Bestsellers",
      description:
        category.categoryBestsellersDescription?.trim() ||
        "Browse high-performing THC vapes trusted by dispensaries, smoke shops, and repeat wholesale buyers.",
      viewAllLabel: category.categoryBestsellersViewAllLabel?.trim() || "View All Products",
    },
    browseAllLabel: category.categoryBrowseAllLabel?.trim() || "Browse All Products",
  };
}
