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
    "Review the regulatory framework, age verification requirements, and compliance standards governing THCPensBulk's B2B wholesale distribution of THC vape products.",
  sections: [
    {
      title: "Overview of Our Compliance Operations",
      paragraphs: [
        "Operating a transparent and legally sound supply pipeline is foundational to THCPensBulk. As a licensed B2B wholesale distributor of THC vape hardware and cartridges, our compliance department continuously audits inventory against federal, state, and destination-market legal standards.",
        "We take full responsibility for ensuring that all products distributed from our facilities are sold only to licensed retailers, dispensaries, and qualified wholesale buyers in jurisdictions where such products are legally permitted.",
      ],
    },
    {
      title: "1. Age Verification & Buyer Qualification",
      paragraphs: [
        "All wholesale accounts are subject to business verification and must confirm that they operate in a jurisdiction where the sale and distribution of THC products is legally permitted. THCPensBulk does not sell to individuals under 21 years of age, nor to unlicensed retailers.",
      ],
    },
    {
      title: "2. PACT Act & Interstate Commerce Compliance",
      paragraphs: [
        "THCPensBulk complies with applicable provisions of the Prevent All Cigarette Trafficking (PACT) Act and related federal and state regulations governing the interstate shipment of vape and THC products.",
        "**Important Buyer Responsibility:** Buyers are solely responsible for ensuring that products purchased from THCPensBulk may be lawfully received and resold in their jurisdiction. State and local laws governing THC product distribution vary significantly. THCPensBulk does not provide legal advice and recommends all buyers consult qualified legal counsel prior to placing wholesale orders.",
      ],
    },
    {
      title: "3. COA Verification & Quality Assurance",
      paragraphs: ["Every product in our catalog is supported by a Certificate of Analysis (COA) from an accredited third-party laboratory. Our QA process includes:"],
      bullets: [
        "Verification of cannabinoid potency (THC, CBD, and minor cannabinoids) against labeled specifications.",
        "Residual solvent testing to confirm compliance with safety thresholds.",
        "Batch number reconciliation between manufacturer documentation and COA records.",
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
