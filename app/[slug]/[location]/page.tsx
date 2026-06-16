import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProgrammaticPageTemplate } from "@/components/programmatic/ProgrammaticPageTemplate";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import {
  getCategoriesForLanding,
  getProductsByCategorySlug,
  getProgrammaticPageByCategoryAndLocation,
  getProgrammaticPagesForStaticParams,
} from "@/lib/sanityClient";

type ProgrammaticPageRouteProps = {
  params: Promise<{
    slug: string;
    location: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const pages = await getProgrammaticPagesForStaticParams();

  return pages.map((page) => ({
    slug: page.category,
    location: page.location,
  }));
}

export async function generateMetadata({ params }: ProgrammaticPageRouteProps): Promise<Metadata> {
  const { slug: categorySlug, location } = await params;
  const page = await getProgrammaticPageByCategoryAndLocation(categorySlug, location);

  if (!page) {
    return {
      title: `Programmatic Page | ${SITE_NAME}`,
      description: "The requested programmatic page could not be found.",
    };
  }

  const categoryLabel = page.category.name || "Bulk THC Vapes";
  const title = `${categoryLabel} wholesale in ${page.locationName} | ${SITE_NAME}`;
  const description = page.seoDescription || `Wholesale bulk ${categoryLabel.toLowerCase()} in ${page.locationName}.`;
  const canonical = `${SITE_URL}/${categorySlug}/${location}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: SITE_NAME,
    },
  };
}

export default async function ProgrammaticPageRoute({ params }: ProgrammaticPageRouteProps) {
  const { slug: categorySlug, location } = await params;
  const [page, products, categories] = await Promise.all([
    getProgrammaticPageByCategoryAndLocation(categorySlug, location),
    getProductsByCategorySlug(categorySlug),
    getCategoriesForLanding(),
  ]);

  if (!page) {
    notFound();
  }

  return (
    <ProgrammaticPageTemplate
      page={page}
      products={products}
      categories={categories}
      currentHref={`/${categorySlug}/${location}`}
    />
  );
}
