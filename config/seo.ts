const getSiteUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (envUrl && envUrl.length > 0) {
    return envUrl.replace(/\/$/, '');
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
};

export const SITE_URL = getSiteUrl();

export const SITE_NAME = 'Steroids Supplies';

export const SITE_DOMAIN = 'steroidssupplies.co.uk';

export const SUPPORT_EMAIL = `support@${SITE_DOMAIN}`;

export const WHOLESALE_EMAIL = `sales@${SITE_DOMAIN}`;

/** All-caps label for footer copyright line */
export const FOOTER_BRAND_LABEL = 'STEROIDS SUPPLIES';

/** Footer compliance sentence prefix (before "complies with…") */
export const FOOTER_COMPLIANCE_PREFIX = 'STEROIDS SUPPLIES';

/** Public marketing URL for a category hub (matches sitemap / client URLs). */
export function categoryPublicPath(slug: string): `/${string}` {
  return `/category/${slug}`;
}

export const SEO_DEFAULTS = {
  title: 'Buy Steroids Online | Premium Anabolic Steroids For Sale UK & Global',
  description:
    'Looking to buy steroids online with guaranteed delivery? Steroids Supplies delivers certified anabolic steroids for sale. Order premium gear with lightning-fast 48h international shipping and secure checkout today.',
  canonical: SITE_URL,
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — premium anabolic steroids for sale UK & worldwide`,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    handle: '@steroidssupplies',
    site: '@steroidssupplies',
    cardType: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    maxSnippet: -1,
    maxImagePreview: 'large',
    maxVideoPreview: -1,
  },
  languageAlternates: [
    {
      hrefLang: 'en-GB',
      href: SITE_URL,
    },
  ],
};

/**
 * Organization Schema for JSON-LD
 */
export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: SEO_DEFAULTS.description,
  sameAs: [
    'https://www.facebook.com/steroidssupplies',
    'https://twitter.com/steroidssupplies',
    'https://www.instagram.com/steroidssupplies',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Sales',
    email: 'sales@steroidssupplies.co.uk',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'GB',
  },
};

/**
 * Website Schema for JSON-LD
 * Enables site search results in Google SERP
 */
export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};
