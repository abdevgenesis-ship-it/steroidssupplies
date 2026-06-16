import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SupportingPageTemplate } from "@/components/supporting/SupportingPageTemplate";
import { ensureKeywordPrefix, getSupportingExactKeyword } from "@/components/supporting/supportingPageUtils";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { getSupportingPageBySlug, getSupportingPageSiblings } from "@/lib/sanityClient";

type WholesaleSupportingPageRouteProps = {
  params: Promise<{
    supportingPageSlug: string;
  }>;
};

export async function generateMetadata({ params }: WholesaleSupportingPageRouteProps): Promise<Metadata> {
  const { supportingPageSlug } = await params;
  const page = await getSupportingPageBySlug(supportingPageSlug, "wholesalePage");

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
  const canonical = `${SITE_URL}/wholesale/${supportingPageSlug}`;

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

export default async function WholesaleSupportingPageRoute({ params }: WholesaleSupportingPageRouteProps) {
  const { supportingPageSlug } = await params;
  const page = await getSupportingPageBySlug(supportingPageSlug, "wholesalePage");

  if (!page) {
    notFound();
  }

  const parentRef = page._parentRef || page.parentPage?._id;
  const siblings = parentRef ? await getSupportingPageSiblings(parentRef, page._id) : [];

  const pageWithSiblings = {
    ...page,
    siblingLinks: siblings || [],
  };

  return (
    <SupportingPageTemplate
      page={pageWithSiblings}
      parentHref="/wholesale"
      parentLabel="Wholesale"
      currentHref={`/wholesale/${supportingPageSlug}`}
    />
  );
}
