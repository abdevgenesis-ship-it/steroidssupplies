import { revalidateTag } from "next/cache";
import groq from "groq";

import { buildSupportingPageDocument } from "@/lib/supportingPageGenerator/buildDocument";
import { generateValidatedSupportingPageContent } from "@/lib/supportingPageGenerator/generateValidatedContent";
import {
  buildSupportingPageUrl,
  getSupportingPagePath,
} from "@/lib/supportingPageGenerator/parentPageRef";
import type { RelatedContentPools } from "@/lib/supportingPageGenerator/pickRandomRelatedContent";
import { slugifyKeyword } from "@/lib/supportingPageGenerator/slugify";
import type {
  GenerateRequestOptions,
  GenerationResult,
  ParentSelection,
} from "@/lib/supportingPageGenerator/types";
import { checkRateLimit, getRateLimitKey } from "@/lib/supportingPageGenerator/rateLimit";
import { corsHeaders, getGeneratorPublicSiteUrl, jsonWithCors } from "@/lib/supportingPageGenerator/cors";
import { sanityWriteClient } from "@/lib/sanity";

type GenerateRequestBody = {
  keywords: string[];
  parent: ParentSelection;
  categorySlug?: string;
  options?: GenerateRequestOptions;
};

function unauthorized(request: Request) {
  return jsonWithCors(request, { error: "Unauthorized" }, { status: 401 });
}

function getBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim();
}

async function fetchRelatedPools(): Promise<RelatedContentPools> {
  const data = await sanityWriteClient.fetch<{ categoryIds: string[]; productIds: string[] }>(groq`{
    "categoryIds": *[_type == "category" && defined(slug.current)]._id,
    "productIds": *[_type == "product" && defined(slug.current)]._id
  }`);
  return {
    categoryIds: data.categoryIds ?? [],
    productIds: data.productIds ?? [],
  };
}

async function slugExistsForOtherDoc(slug: string, documentId: string): Promise<boolean> {
  const existingId = await sanityWriteClient.fetch<string | null>(
    groq`*[_type == "supportingPage" && slug.current == $slug && _id != $documentId][0]._id`,
    { slug, documentId },
  );
  return Boolean(existingId);
}

const ALL_PROVIDERS = ["gemini", "groq", "ollama", "openrouter"] as const;

async function generateOneKeyword(
  keyword: string,
  parent: ParentSelection,
  pools: RelatedContentPools,
  options: GenerateRequestOptions,
  siteUrl: string,
  exhaustedProviders: Set<string>,
  categorySlug?: string,
): Promise<GenerationResult> {
  const trimmedKeyword = keyword.trim();
  const slug = slugifyKeyword(trimmedKeyword);
  const url = buildSupportingPageUrl(siteUrl, slug, parent, categorySlug);

  if (!trimmedKeyword) {
    return { keyword, slug, url, status: "error", errors: ["Keyword is empty"] };
  }

  try {
    const generated = await generateValidatedSupportingPageContent(trimmedKeyword, slug, exhaustedProviders);
    if (!generated.ok) {
      return { keyword: trimmedKeyword, slug, url, status: "error", errors: generated.errors };
    }

    const content = generated.content;

    const { document, documentId, categoryIds, productIds } = buildSupportingPageDocument(
      content,
      slug,
      parent,
      pools,
      options,
    );

    if (await slugExistsForOtherDoc(slug, documentId)) {
      return {
        keyword: trimmedKeyword,
        slug,
        url,
        status: "error",
        errors: [`Slug "${slug}" is already used by another supporting page`],
      };
    }

    if (options.dryRun) {
      return {
        keyword: trimmedKeyword,
        slug,
        url,
        status: "dry_run",
        provider: generated.provider,
        documentId,
        categoryIds,
        productIds,
      };
    }

    await sanityWriteClient.createOrReplace(document);
    if (parent.type === "root") {
      await sanityWriteClient.patch(documentId).unset(["parentPage"]).commit();
    }

    return {
      keyword: trimmedKeyword,
      slug,
      url,
      status: "success",
      provider: generated.provider,
      documentId,
      categoryIds,
      productIds,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown generation error";
    return { keyword: trimmedKeyword, slug, url, status: "error", errors: [message] };
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  const secret = process.env.GENERATOR_ADMIN_SECRET;
  if (!secret || getBearerToken(request) !== secret) {
    return unauthorized(request);
  }

  const rateLimit = checkRateLimit(getRateLimitKey(request));
  if (!rateLimit.ok) {
    return jsonWithCors(
      request,
      { error: `Rate limit exceeded. Try again in ${rateLimit.retryAfterSec}s.` },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSec) } },
    );
  }

  if (!process.env.SANITY_API_TOKEN) {
    return jsonWithCors(request, { error: "SANITY_API_TOKEN is not configured" }, { status: 500 });
  }

  let body: GenerateRequestBody;
  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
    return jsonWithCors(request, { error: "Invalid JSON body" }, { status: 400 });
  }

  const keywords = (body.keywords || []).map((k) => k.trim()).filter(Boolean);
  if (keywords.length === 0) {
    return jsonWithCors(request, { error: "No keywords provided" }, { status: 400 });
  }

  if (keywords.length > 50) {
    return jsonWithCors(request, { error: "Maximum 50 keywords per batch" }, { status: 400 });
  }

  const parent = body.parent || { type: "root" };
  if (parent.type === "category" && !parent.categoryId) {
    return jsonWithCors(request, { error: "categoryId is required when parent type is category" }, { status: 400 });
  }

  const siteUrl = getGeneratorPublicSiteUrl();
  const options = body.options || {};
  const pools = await fetchRelatedPools();
  const results: GenerationResult[] = [];

  // Pre-populate exhaustedProviders so only the requested provider is tried.
  // When options.provider is unset ("auto"), all providers are available.
  const exhaustedProviders = new Set<string>(
    options.provider ? ALL_PROVIDERS.filter((p) => p !== options.provider) : [],
  );

  for (const keyword of keywords) {
    results.push(
      await generateOneKeyword(keyword, parent, pools, options, siteUrl, exhaustedProviders, body.categorySlug),
    );
  }

  if (!options.dryRun && results.some((result) => result.status === "success")) {
    revalidateTag("sanity", "max");
  }

  return jsonWithCors(request, {
    results,
    paths: results
      .filter((r) => r.status === "success" || r.status === "dry_run")
      .map((r) => getSupportingPagePath(r.slug, parent, body.categorySlug)),
  });
}
