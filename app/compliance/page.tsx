import type { Metadata } from "next";

import { ComplianceBanner } from "@/components/ComplianceBanner";
import { LegalPageBody } from "@/components/LegalPageBody";
import { Container } from "@/components/layout/container";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { getCompliancePage } from "@/lib/sanityClient";
import { getSiteContent, type LegalSection } from "@/lib/siteContent";

const COMPLIANCE_FALLBACK = {
  title: "Compliance, Legal Terms & Safety Notices",
  pageHeading: "Legality, Jurisdictional Compliance, and Chemical Safety Documentation",
  subtitle:
    "Crucial legal frameworks and safety disclosures regarding the purchase, possession, and application of anabolic compounds.",
  description:
    "Review the mandatory legal compliance documentation, local jurisdictional guidelines, and chemical safety warnings for Steroids Supplies.",
  sections: [
    {
      title: "Jurisdictional Compliance",
      paragraphs: [
        "The purchase, import, and possession of anabolic androgenic steroids (AAS) are governed by distinct regional, domestic, and international laws that vary significantly from one country to another. It is the sole responsibility of the individual customer or wholesale purchaser to understand, evaluate, and adhere to the precise legal statutes, import restrictions, and prescription requirements enforced within their own country or local jurisdiction before initiating an order through our storefront. Steroids Supplies assumes zero legal liability for cross-border customs items that run contrary to localized laws.",
      ],
    },
    {
      title: "⚠️ MANDATORY MEDICAL WARNING AND ACCIDENTAL MISUSE NOTICE",
      paragraphs: [
        "Anabolic steroids are highly active, potent hormonal compounds that profoundly alter human endocrinology. Unsupervised, excessive, or unverified administration can result in severe and potentially permanent health complications. These include cardiovascular strain, left ventricular hypertrophy, severe hepatic toxicity, profound suppression of the natural hypothalamic-pituitary-gonadal axis (HPGA), dyslipidemia, and psychiatric alterations.",
        "All materials, chemical profiles, and descriptions hosted across this domain are intended strictly for educational, research, and informational contexts. They do not constitute professional medical advice, diagnosis, or treatment protocols. Never implement any compound without direct medical supervision from an independent, licensed clinical professional.",
      ],
    },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCompliancePage();
  const metaTitle = (page as { title?: string } | null)?.title?.trim() || COMPLIANCE_FALLBACK.title;
  const description = page?.description?.trim() || COMPLIANCE_FALLBACK.description;

  return {
    title: `${metaTitle} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: `${metaTitle} | ${SITE_NAME}`,
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

  const pageHeading = (page as { pageHeading?: string } | null)?.pageHeading?.trim() || COMPLIANCE_FALLBACK.pageHeading;
  const subtitle = (page as { subtitle?: string } | null)?.subtitle?.trim() || COMPLIANCE_FALLBACK.subtitle;
  const sections = page?.sections && page.sections.length > 0 ? page.sections : COMPLIANCE_FALLBACK.sections;
  const lastUpdated = page?.lastUpdated
    ? new Date(page.lastUpdated).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-background">
      <section className="border-section-b bg-card section-y-tight">
        <Container>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">{pageHeading}</h1>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">{subtitle}</p>
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
