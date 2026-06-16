import type { Metadata } from "next";
import Link from "next/link";

import { WholesaleForm } from "@/components/WholesaleForm";
import { Container } from "@/components/layout/container";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { getWholesalePageData } from "@/lib/wholesale/content";
import { getWholesaleFormClientConfig, type WholesaleFormClientConfig } from "@/lib/wholesale/formConfig";
import { type WholesaleInquiryInput } from "@/lib/wholesale/formSchema";
import { normalizeOrderItems, type WholesaleOrderItem } from "@/lib/wholesale/orderItems";

export const metadata: Metadata = {
  title: `Wholesale Request | ${SITE_NAME}`,
  description:
    "Submit your B2B wholesale inquiry. 24-unit MOQ, mix-and-match categories, and priority trade account onboarding.",
  alternates: {
    canonical: `${SITE_URL}/wholesale-request`,
  },
};

type WholesaleRequestPageProps = {
  searchParams?: Promise<{
    product?: string | string[];
    qty?: string | string[];
    unitPrice?: string | string[];
    cart?: string | string[];
  }>;
};

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

type CartItemQuery = {
  id?: string;
  name?: string;
  quantity?: number;
  price?: number;
};

type InterestKeyword = "disposable-vapes" | "510-carts" | "hardware";

const PRODUCT_INTEREST_KEYWORDS: Array<{
  id: InterestKeyword;
  patterns: RegExp[];
}> = [
  { id: "disposable-vapes", patterns: [/\bdisposable\b/i, /\bthc\b/i, /\bvape\b/i] },
  { id: "510-carts", patterns: [/\b510\b/i, /\bcartridge\b/i, /\bcart\b/i] },
  { id: "hardware", patterns: [/\bhardware\b/i, /\bbattery\b/i, /\bmod\b/i] },
];

function inferProductInterests(lines: string[]) {
  const source = lines.join(" ");
  return PRODUCT_INTEREST_KEYWORDS.filter(({ patterns }) =>
    patterns.some((pattern) => pattern.test(source)),
  ).map(({ id }) => id);
}

function mapKeywordInterestsToOptionIds(
  keywords: InterestKeyword[],
  formConfig: WholesaleFormClientConfig,
) {
  if (keywords.length === 0) {
    return [] as string[]
  }

  const optionByKeyword = new Map<InterestKeyword, string>()
  for (const option of formConfig.productInterests) {
    const label = option.label.toLowerCase()
    if (label.includes("disposable") && !optionByKeyword.has("disposable-vapes")) optionByKeyword.set("disposable-vapes", option.value)
    if ((label.includes("510") || label.includes("cart")) && !optionByKeyword.has("510-carts")) optionByKeyword.set("510-carts", option.value)
    if (label.includes("hardware") && !optionByKeyword.has("hardware")) optionByKeyword.set("hardware", option.value)
  }

  return keywords
    .map((keyword) => optionByKeyword.get(keyword))
    .filter((value): value is string => Boolean(value))
}

function buildOrderItems(
  cart: CartItemQuery[],
  product?: string,
  qty?: string,
  unitPrice?: string,
): WholesaleOrderItem[] {
  const items: WholesaleOrderItem[] = [];

  for (const item of cart) {
    if (!item.name) {
      continue;
    }

    items.push({
      id: item.id,
      name: item.name,
      quantity:
        typeof item.quantity === "number" && Number.isFinite(item.quantity) && item.quantity > 0
          ? Math.floor(item.quantity)
          : 1,
      price:
        typeof item.price === "number" && Number.isFinite(item.price) && item.price >= 0
          ? item.price
          : 0,
    });
  }

  if (items.length === 0 && product) {
    const parsedQty = qty ? Number.parseInt(qty, 10) : 1;
    const parsedPrice = unitPrice ? Number.parseFloat(unitPrice) : 0;

    items.push({
      name: product,
      quantity: Number.isFinite(parsedQty) && parsedQty > 0 ? parsedQty : 1,
      price: Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0,
    });
  }

  return normalizeOrderItems(items);
}

function parseCart(rawCart?: string): CartItemQuery[] {
  if (!rawCart) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawCart) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((item): item is CartItemQuery => typeof item === "object" && item !== null)
      .slice(0, 20);
  } catch {
    return [];
  }
}

export default async function WholesaleRequestPage({ searchParams }: WholesaleRequestPageProps) {
  const [{ content }, formConfig] = await Promise.all([
    getWholesalePageData(),
    getWholesaleFormClientConfig(),
  ]);
  const resolvedSearchParams = (await searchParams) ?? {};
  const product = firstValue(resolvedSearchParams.product);
  const qty = firstValue(resolvedSearchParams.qty);
  const unitPrice = firstValue(resolvedSearchParams.unitPrice);
  const cart = parseCart(firstValue(resolvedSearchParams.cart));
  const orderItems = buildOrderItems(cart, product, qty, unitPrice);

  // Only infer from actual product names to avoid matching boilerplate text like "Cart"
  const inferenceSources: string[] = [];
  if (product) inferenceSources.push(product);
  for (const item of cart) {
    if (item.name) inferenceSources.push(item.name);
  }

  const inferredInterestKeywords = inferProductInterests(inferenceSources);
  const inferredInterests = mapKeywordInterestsToOptionIds(inferredInterestKeywords, formConfig);
  const initialValues: Partial<WholesaleInquiryInput> | undefined =
    inferredInterests.length > 0
      ? {
          productInterests: inferredInterests,
        }
      : undefined;

  return (
    <main>
      <Container className="section-y stack-lg">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-widest text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/wholesale" className="underline-offset-4 hover:underline">
                Wholesale
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground">Request</li>
          </ol>
        </nav>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {content.wholesaleRequestPage.badge}
          </p>
          <h1 className="mt-2 font-heading text-3xl leading-tight sm:text-4xl">
            {content.wholesaleRequestPage.heading}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {content.wholesaleRequestPage.intro}{" "}
            <Link href="/wholesale" className="font-medium text-foreground underline-offset-4 hover:underline">
              wholesale overview
            </Link>
            .
          </p>
        </div>
        <div className={orderItems.length > 0 ? "max-w-6xl" : "max-w-3xl"}>
          <WholesaleForm
            bare
            formConfig={formConfig}
            initialValues={initialValues}
            orderItems={orderItems}
            successRedirectPath="/wholesale-request/thank-you"
          />
        </div>
      </Container>
    </main>
  );
}
