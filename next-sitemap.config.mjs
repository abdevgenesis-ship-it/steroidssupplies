import { createClient } from "@sanity/client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://steroidssupplies.co.uk";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-03-01";

const supportingPagesQuery = `*[_type == "supportingPage" && defined(slug.current)]{
  "slug": slug.current,
  "parentType": parentPage->_type,
  "parentSlug": parentPage->slug.current,
  "hasEmptyParent": !defined(parentPage)
}`;

const productSlugsQuery = `*[_type == "product" && defined(slug.current)]{ "slug": slug.current }`;
const blogSlugsQuery = `*[_type == "blogPost" && defined(slug.current)]{ "slug": slug.current }`;

function mapSupportingLoc(page) {
  if (!page?.slug) {
    return null;
  }

  if (page.parentType === "category" && page.parentSlug) {
    return `/category/${page.parentSlug}/${page.slug}`;
  }

  if (page.parentType === "wholesalePage") {
    return `/wholesale/${page.slug}`;
  }

  if (page.hasEmptyParent) {
    return `/${page.slug}`;
  }

  if (page.parentType === "homePage") {
    return `/homepage/${page.slug}`;
  }

  return null;
}

async function getSanityPaths() {
  if (!projectId || !dataset) {
    return [];
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: "published",
    stega: {
      enabled: false,
    },
  });

  const [supportingPages, products, blogs] = await Promise.all([
    client.fetch(supportingPagesQuery),
    client.fetch(productSlugsQuery),
    client.fetch(blogSlugsQuery),
  ]);

  const paths = [];

  for (const page of supportingPages || []) {
    const loc = mapSupportingLoc(page);
    if (loc) {
      paths.push(loc);
    }
  }

  for (const product of products || []) {
    if (product?.slug) {
      paths.push(`/product/${product.slug}`);
    }
  }

  for (const blog of blogs || []) {
    if (blog?.slug) {
      paths.push(`/blog/${blog.slug}`);
    }
  }

  return [...new Set(paths)];
}

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl,
  generateRobotsTxt: true,
  outDir: "public",
  changefreq: "weekly",
  priority: 0.7,
  autoLastmod: true,
  exclude: ["/api/*", "/_not-found"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
  additionalPaths: async (config) => {
    const paths = await getSanityPaths();
    return paths.map((loc) => ({
      loc,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }));
  },
};

export default config;
