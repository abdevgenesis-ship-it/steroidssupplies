import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { getWholesalePageData } from "@/lib/wholesale/content";

export const metadata: Metadata = {
  title: `Wholesale Inquiry Received | ${SITE_NAME}`,
  description:
    "Your wholesale inquiry was received. Our team typically replies within one business day with next steps and pricing details.",
  alternates: {
    canonical: `${SITE_URL}/wholesale-request/thank-you`,
  },
};

type ThankYouPageProps = {
  searchParams?: {
    email?: string | string[];
  };
};

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function WholesaleRequestThankYouPage({ searchParams }: ThankYouPageProps) {
  const { content } = await getWholesalePageData();
  const email = firstValue(searchParams?.email);

  return (
    <main>
      <Container className="section-y stack-lg">
        <div className="max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {content.wholesaleRequestPage.badge}
          </p>
          <h1 className="mt-3 font-heading text-3xl leading-tight sm:text-4xl">
            {content.wholesaleRequestPage.thankYouHeading}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {content.wholesaleRequestPage.thankYouIntro}
          </p>
          {email ? (
            <p className="mt-3 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
              Confirmation has been sent to <span className="font-semibold">{email}</span>.
            </p>
          ) : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background p-4">
              <h2 className="text-sm font-semibold">
                {content.wholesaleRequestPage.thankYouNextStepsTitle}
              </h2>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                <li>1) We review your business details and product interests.</li>
                <li>2) We send a tailored quote with MOQ and discount options.</li>
                <li>3) You confirm payment method and shipping details.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <h2 className="text-sm font-semibold">
                {content.wholesaleRequestPage.thankYouUrgentHelpTitle}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {content.wholesaleRequestPage.thankYouUrgentHelpBody}{" "}
                <a
                  className="underline-offset-4 hover:underline"
                  href={`mailto:${content.wholesaleRequestPage.supportEmail}`}
                >
                  {content.wholesaleRequestPage.supportEmail}
                </a>{" "}
                and reference your business name.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/products">Browse products</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/wholesale">Back to wholesale page</Link>
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
