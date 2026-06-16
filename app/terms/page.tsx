import type { Metadata } from "next";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { LegalPageBody } from "@/components/LegalPageBody";
import { Container } from "@/components/layout/container";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { getSiteContent } from "@/lib/siteContent";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    title: `${content.legal.terms.title} | ${SITE_NAME}`,
    description: content.legal.terms.description,
    openGraph: {
      title: `${content.legal.terms.title} | ${SITE_NAME}`,
      description: content.legal.terms.description,
      type: "website",
      url: `${SITE_URL}/terms`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TermsPage() {
  const content = await getSiteContent();
  const terms = content.legal.terms;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-section-b bg-card section-y-tight">
        <Container>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">{terms.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {terms.lastUpdated || new Date().toLocaleDateString()}
          </p>
        </Container>
      </section>

      {/* Content */}
      <main className="section-y">
        <Container>
          <LegalPageBody sections={terms.sections} supportEmail={content.legal.supportEmail} />
        </Container>
      </main>

      {/* Compliance Banner */}
      <ComplianceBanner
        pactActNotice={content.legal.pactActNotice}
        nicotineWarning={content.legal.nicotineWarning}
        thcWarning={content.legal.thcWarning}
        fdaDisclaimer={content.legal.fdaDisclaimer}
      />
    </div>
  );
}
