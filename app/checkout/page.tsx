import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutForm } from "@/components/CheckoutForm";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { getWholesaleFormClientConfig } from "@/lib/wholesale/formConfig";
import { normalizeOrderItems, type WholesaleOrderItem } from "@/lib/wholesale/orderItems";

export const metadata: Metadata = {
  title: `Checkout | ${SITE_NAME}`,
  description: "Complete your order with delivery details and payment preference.",
  alternates: {
    canonical: `${SITE_URL}/checkout`,
  },
};

type CheckoutPageProps = {
  searchParams?: Promise<{
    cart?: string | string[];
    product?: string | string[];
    qty?: string | string[];
    unitPrice?: string | string[];
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

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const formConfig = await getWholesaleFormClientConfig();
  const resolvedSearchParams = (await searchParams) ?? {};
  const product = firstValue(resolvedSearchParams.product);
  const qty = firstValue(resolvedSearchParams.qty);
  const unitPrice = firstValue(resolvedSearchParams.unitPrice);
  const cart = parseCart(firstValue(resolvedSearchParams.cart));
  const orderItems = buildOrderItems(cart, product, qty, unitPrice);

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
              <Link href="/products" className="underline-offset-4 hover:underline">
                Shop
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground">Checkout</li>
          </ol>
        </nav>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Secure checkout
          </p>
          <h1 className="mt-2 font-heading text-3xl leading-tight sm:text-4xl">Complete your order</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Fill in your delivery details and payment preference. For bulk or trade orders, visit our{" "}
            <Link href="/wholesale" className="font-medium text-foreground underline-offset-4 hover:underline">
              wholesale page
            </Link>
            .
          </p>
        </div>

        {orderItems.length === 0 ? (
          <div className="max-w-xl rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="font-heading text-xl">Your cart is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add products from the shop before checking out.
            </p>
            <Button asChild className="mt-5">
              <Link href="/products">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="max-w-6xl">
            <CheckoutForm formConfig={formConfig} orderItems={orderItems} />
          </div>
        )}
      </Container>
    </main>
  );
}
