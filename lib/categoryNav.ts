import { categoryPublicPath } from "@/config/seo";

/** True when `pathname` is this category's hub, a programmatic city page, or a supporting guide under the category. */
export function isCategorySectionActive(pathname: string, categorySlug: string | undefined): boolean {
  if (!categorySlug) {
    return false;
  }

  const pub = categoryPublicPath(categorySlug);
  const internalPrefix = `/category/${categorySlug}`;

  return (
    pathname === pub ||
    pathname === internalPrefix ||
    pathname.startsWith(`${pub}/`) ||
    pathname.startsWith(`${internalPrefix}/`)
  );
}

export function isAnyCategorySectionActive(pathname: string, categorySlugs: Array<string | undefined>): boolean {
  return categorySlugs.some((slug) => isCategorySectionActive(pathname, slug));
}
