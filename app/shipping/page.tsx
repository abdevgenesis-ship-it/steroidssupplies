import type { Metadata } from "next";

import { ComplianceBanner } from "@/components/ComplianceBanner";
import { LegalPageBody } from "@/components/LegalPageBody";
import { Container } from "@/components/layout/container";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { getShippingPage } from "@/lib/sanityClient";
import { getSiteContent, type LegalSection } from "@/lib/siteContent";

const shippingSections: LegalSection[] = [
  {
    title: "Shipping Policy Content",
    paragraphs: [
      "Shipping policy details are managed in Sanity and will appear here once configured.",
    ],
  },
];

const SHIPPING_FALLBACK = {
  title: "Shipping Policy",
  description: "Shipping policy content is managed in Sanity.",
  sections: shippingSections,
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getShippingPage();
  const title = page?.title?.trim() || SHIPPING_FALLBACK.title;
  const description = page?.description?.trim() || SHIPPING_FALLBACK.description;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "website",
      url: `${SITE_URL}/shipping`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
};

export default async function ShippingPage() {
  const [content, page] = await Promise.all([getSiteContent(), getShippingPage()]);

  const title = page?.title?.trim() || SHIPPING_FALLBACK.title;
  const sections = page?.sections && page.sections.length > 0 ? page.sections : SHIPPING_FALLBACK.sections;
  const lastUpdated = page?.lastUpdated
    ? new Date(page.lastUpdated).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-background">
      <section className="border-section-b bg-card section-y-tight">
        <Container>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </Container>
      </section>

      <main className="section-y">
        <Container>
          <LegalPageBody sections={sections} supportEmail={content.legal.supportEmail} />
        </Container>
      </main>

      <ComplianceBanner
        pactActNotice={content.legal.pactActNotice}
        nicotineWarning={content.legal.nicotineWarning}
        thcWarning={content.legal.thcWarning}
        fdaDisclaimer={content.legal.fdaDisclaimer}
      />
    </div>
  );
}
