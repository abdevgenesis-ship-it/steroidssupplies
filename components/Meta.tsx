import { Metadata } from 'next';
import { SEO_DEFAULTS, SITE_NAME } from '@/config/seo';

/**
 * Helper function to generate metadata for individual pages.
 * Use this in page.tsx files to override defaults.
 *
 * @example
 * export const metadata: Metadata = generateMetadata({
 *   title: "Buy Anabolic Steroids Online | SteroidsSupplies",
 *   description: "Browse our COA-verified anabolic steroids and performance compounds...",
 *   url: "https://example.com/products"
 * })
 */
export function generateMetadata({
  title = SEO_DEFAULTS.title,
  description = SEO_DEFAULTS.description,
  url = SEO_DEFAULTS.canonical,
  image,
  noindex = false,
}: {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    robots: {
      index: !noindex,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: SITE_NAME,
      images: image ? [image] : SEO_DEFAULTS.openGraph.images,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}
