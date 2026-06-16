import { HOME_PAGE_DOCUMENT_ID } from "@/config/sanitySingletons";

import type { ParentSelection } from "./types";

const WHOLESALE_PAGE_ID = "wholesalePage";

export function resolveParentRef(parent: ParentSelection): { _type: "reference"; _ref: string } | undefined {
  switch (parent.type) {
    case "root":
      return undefined;
    case "homePage":
      return { _type: "reference", _ref: HOME_PAGE_DOCUMENT_ID };
    case "wholesalePage":
      return { _type: "reference", _ref: WHOLESALE_PAGE_ID };
    case "category":
      return { _type: "reference", _ref: parent.categoryId };
  }
}

export function buildSupportingPageId(parent: ParentSelection, slug: string): string {
  const parentKey =
    parent.type === "root"
      ? "root"
      : parent.type === "homePage"
        ? "home"
        : parent.type === "wholesalePage"
          ? "wholesale"
          : `cat-${parent.categoryId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)}`;

  return `supporting-${parentKey}-${slug}`;
}

export function buildSupportingPageUrl(
  siteUrl: string,
  slug: string,
  parent: ParentSelection,
  categorySlug?: string,
): string {
  const path = getSupportingPagePath(slug, parent, categorySlug);
  return `${siteUrl.replace(/\/$/, "")}${path}`;
}

export function getSupportingPagePath(slug: string, parent: ParentSelection, categorySlug?: string): string {
  switch (parent.type) {
    case "root":
      return `/${slug}`;
    case "homePage":
      return `/homepage/${slug}`;
    case "wholesalePage":
      return `/wholesale/${slug}`;
    case "category":
      return categorySlug ? `/category/${categorySlug}/${slug}` : `/category/_/${slug}`;
  }
}
