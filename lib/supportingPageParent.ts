import { HOME_PAGE_DOCUMENT_ID } from "@/config/sanitySingletons";
import type { SupportingPage, SupportingPageParent } from "@/types/sanity";

const DEFAULT_HOME_PARENT: SupportingPageParent = {
  _id: HOME_PAGE_DOCUMENT_ID,
  _type: "homePage",
  title: "Homepage",
};

/** True only when parentPage was not set in Sanity (NDJSON omit or empty field). */
export function hasEmptyParentPage(page: SupportingPage): boolean {
  return page._hasEmptyParent === true || (!page._parentRef && !page.parentPage?._id);
}

export function getHomeRootSupportingPath(slug: string): string {
  return `/${slug}`;
}

export function getHomepageSupportingPath(slug: string): string {
  return `/homepage/${slug}`;
}

/**
 * Injects the homepage singleton as parent only when parentPage is unset.
 * Explicit wholesale/category/homePage references are left unchanged.
 */
export function normalizeSupportingPage(page: SupportingPage | null): SupportingPage | null {
  if (!page) {
    return null;
  }

  if (!hasEmptyParentPage(page)) {
    return page;
  }

  return {
    ...page,
    parentPage: DEFAULT_HOME_PARENT,
    _parentRef: HOME_PAGE_DOCUMENT_ID,
  };
}
