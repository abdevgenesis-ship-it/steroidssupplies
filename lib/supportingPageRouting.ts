import { getHomeRootSupportingPath, getHomepageSupportingPath, hasEmptyParentPage } from "@/lib/supportingPageParent";
import type { SupportingPage } from "@/types/sanity";

export function getCanonicalSupportingPath(page: SupportingPage): string | null {
  const pageSlug = page.slug?.current;
  if (!pageSlug) {
    return null;
  }

  if (hasEmptyParentPage(page)) {
    return getHomeRootSupportingPath(pageSlug);
  }

  if (page.parentPage?._type === "category") {
    const categorySlug = page.parentPage.slug?.current;
    return categorySlug ? `/category/${categorySlug}/${pageSlug}` : null;
  }

  if (page.parentPage?._type === "wholesalePage") {
    return `/wholesale/${pageSlug}`;
  }

  if (page.parentPage?._type === "homePage") {
    return getHomepageSupportingPath(pageSlug);
  }

  return null;
}
