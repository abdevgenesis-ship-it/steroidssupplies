import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-03-01";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity environment variables. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.",
  );
}

export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  token,
};

export const sanityReadClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: {
    enabled: false,
  },
});

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: "published",
  stega: {
    enabled: false,
  },
});

const builder = createImageUrlBuilder(sanityReadClient);

export const urlFor = (source: Parameters<typeof builder.image>[0]) =>
  builder.image(source);

export const isSanityConfigured = Boolean(projectId && dataset);
