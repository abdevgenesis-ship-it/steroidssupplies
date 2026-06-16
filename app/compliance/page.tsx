import type { Metadata } from "next";

import { ComplianceBanner } from "@/components/ComplianceBanner";
import { LegalPageBody } from "@/components/LegalPageBody";
import { Container } from "@/components/layout/container";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { getCompliancePage } from "@/lib/sanityClient";
import { getSiteContent, type LegalSection } from "@/lib/siteContent";

const COMPLIANCE_FALLBACK = {
  title: "Legality, Compliance, and Distribution Policies",
  description:
    "Review the mandatory legal compliance documentation, jurisdictional guidelines, and chemical safety warnings governing SteroidsSupplies' global distribution of performance compounds.",
  sections: [
    {
      title: "Overview of Our Compliance Operations",
      paragraphs: [
        "Operating a transparent and legally sound supply pipeline is foundational to SteroidsSupplies. As a global supplier of performance compounds, our compliance department continuously audits inventory against destination-market legal standards.",
        "We take full responsibility for ensuring that all products distributed from our facilities comply with applicable quality and safety standards. Buyers are solely responsible for compliance with local and national laws in their jurisdiction.",
      ],
    },
    {
      title: "1. Age Verification & Buyer Qualification",
      paragraphs: [
        "All buyers must confirm they are 18 years of age or older and that they operate in a jurisdiction where the purchase of anabolic steroids is legally permitted. SteroidsSupplies does not sell to individuals under 18 years of age.",
      ],
    },
    {
      title: "2. Jurisdictional Compliance",
      paragraphs: [
        "The purchase, import, and possession of anabolic androgenic steroids (AAS) are governed by distinct regional, domestic, and international laws that vary significantly from one country to another. SteroidsSupplies assumes zero legal liability for cross-border customs items contrary to localised laws.",
        "**Important Buyer Responsibility:** Buyers are solely responsible for ensuring that products purchased from SteroidsSupplies may be lawfully received in their jurisdiction. We do not provide legal advice and recommend all buyers consult qualified legal counsel prior to placing orders.",
      ],
    },
    {
      title: "3. COA Verification & Quality Assurance",
      paragraphs: ["Every product in our catalog is supported by a Certificate of Analysis (COA) from an accredited third-party laboratory. Our QA process includes:"],
      bullets: [
        "HPLC verification of active compound potency and correct ester weight against labeled specifications.",
        "Heavy metals, residual solvent, and bacterial contamination testing to confirm pharmaceutical safety thresholds.",
        "Batch number reconciliation between manufacturing documentation and independent COA records.",
      ],
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCompliancePage();
  const title = page?.title?.trim() || COMPLIANCE_FALLBACK.title;
  const description = page?.description?.trim() || COMPLIANCE_FALLBACK.description;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "website",
      url: `${SITE_URL}/compliance`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
};

export default async function CompliancePage() {
  const [content, page] = await Promise.all([getSiteContent(), getCompliancePage()]);

  const title = page?.title?.trim() || COMPLIANCE_FALLBACK.title;
  const sections = page?.sections && page.sections.length > 0 ? page.sections : COMPLIANCE_FALLBACK.sections;
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
