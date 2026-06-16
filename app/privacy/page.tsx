import type { Metadata } from "next";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { LegalPageBody } from "@/components/LegalPageBody";
import { Container } from "@/components/layout/container";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { getSiteContent } from "@/lib/siteContent";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    title: `${content.legal.privacy.title} | ${SITE_NAME}`,
    description: content.legal.privacy.description,
    openGraph: {
      title: `${content.legal.privacy.title} | ${SITE_NAME}`,
      description: content.legal.privacy.description,
      type: "website",
      url: `${SITE_URL}/privacy`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PrivacyPage() {
  const content = await getSiteContent();
  const privacy = content.legal.privacy;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-section-b bg-card section-y-tight">
        <Container>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">{privacy.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {privacy.lastUpdated || new Date().toLocaleDateString()}
          </p>
        </Container>
      </section>

      {/* Content */}
      <main className="section-y">
        <Container>
          <LegalPageBody sections={privacy.sections} supportEmail={content.legal.supportEmail} />
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
