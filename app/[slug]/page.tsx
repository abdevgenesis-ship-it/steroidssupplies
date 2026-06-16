import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SupportingPageTemplate } from "@/components/supporting/SupportingPageTemplate";
import { ensureKeywordPrefix, getSupportingExactKeyword } from "@/components/supporting/supportingPageUtils";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { getHomeRootSupportingPath } from "@/lib/supportingPageParent";
import { getRootSupportingPageBySlug, getSupportingPageSiblings } from "@/lib/sanityClient";

type RootSupportingPageRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

/** Supporting pages are CMS-driven; avoid serving long-lived stale relation data. */
export const revalidate = 60;

export async function generateMetadata({ params }: RootSupportingPageRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getRootSupportingPageBySlug(slug);

  if (!page) {
    return {
      title: `Supporting Page | ${SITE_NAME}`,
      description: "The requested supporting page could not be found.",
    };
  }

  const keyword = getSupportingExactKeyword(page);
  const title = `${ensureKeywordPrefix(keyword, page.metaTitle || page.title, " | ")} | ${SITE_NAME}`;
  const description = ensureKeywordPrefix(
    keyword,
    page.metaDescription || page.seoDescription || `Read ${page.title.toLowerCase()} from ${SITE_NAME}.`,
    " - ",
  );
  const canonical = `${SITE_URL}${getHomeRootSupportingPath(slug)}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      siteName: SITE_NAME,
    },
  };
}

export default async function RootSupportingPageRoute({ params }: RootSupportingPageRouteProps) {
  const { slug } = await params;
  const page = await getRootSupportingPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const siblings = await getSupportingPageSiblings("", page._id, { emptyParentOnly: true });

  const pageWithSiblings = {
    ...page,
    siblingLinks: siblings || [],
  };

  return (
    <SupportingPageTemplate
      page={pageWithSiblings}
      parentHref="/"
      parentLabel="Homepage"
      currentHref={getHomeRootSupportingPath(slug)}
    />
  );
}
