import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL } from "@/config/seo";

export const metadata: Metadata = {
  title: `Order Received | ${SITE_NAME}`,
  description: "Your order was received. Our team will confirm payment and dispatch details shortly.",
  alternates: {
    canonical: `${SITE_URL}/checkout/thank-you`,
  },
};

export default async function CheckoutThankYouPage() {
  return (
    <main>
      <Container className="section-y stack-lg">
        <div className="max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Order confirmed
          </p>
          <h1 className="mt-3 font-heading text-3xl leading-tight sm:text-4xl">Thank you for your order</h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            We received your order and will send payment instructions shortly. Most orders dispatch within 48
            hours after payment is confirmed.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-4">
              <h2 className="text-sm font-semibold">What happens next</h2>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                <li>1) We confirm your order and payment details.</li>
                <li>2) You complete payment using your chosen method.</li>
                <li>3) Your order ships with tracked delivery.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <h2 className="text-sm font-semibold">Need help?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Reply to your confirmation email or contact us at{" "}
                <a
                  className="underline-offset-4 hover:underline"
                  href="mailto:support@thcpensbulk.com"
                >
                  support@thcpensbulk.com
                </a>
                .
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/products">Continue shopping</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/wholesale">Bulk / wholesale orders</Link>
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
