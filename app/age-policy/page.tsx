import type { Metadata } from "next";
import { AgeVerificationPolicy } from "@/components/AgeVerificationPolicy";
import { NicotineTHCWarning } from "@/components/NicotineTHCWarning";
import { ComplianceBanner } from "@/components/ComplianceBanner";
import { Container } from "@/components/layout/container";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { getSiteContent } from "@/lib/siteContent";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    title: `${content.legal.agePolicy.title} | ${SITE_NAME}`,
    description: content.legal.agePolicy.description,
    openGraph: {
      title: `${content.legal.agePolicy.title} | ${SITE_NAME}`,
      description: content.legal.agePolicy.description,
      type: "website",
      url: `${SITE_URL}/age-policy`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function AgeVerificationPolicyPage() {
  const content = await getSiteContent();
  const agePolicy = content.legal.agePolicy;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-section-b bg-card section-y-tight">
        <Container>
          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">{agePolicy.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: {agePolicy.lastUpdated || new Date().toLocaleDateString()}
          </p>
        </Container>
      </section>

      {/* Content */}
      <main className="section-y">
        <Container>
          <div className="max-w-3xl space-y-10 sm:space-y-12">
            {/* Age Verification Policy Component */}
            <section>
              <AgeVerificationPolicy
                sections={agePolicy.sections}
                supportEmail={content.legal.supportEmail}
              />
            </section>

            {/* Warnings Section */}
            <section>
              <h2 className="mb-5 font-heading text-2xl font-bold text-foreground sm:mb-6">Product Warnings & Disclaimers</h2>
              <NicotineTHCWarning
                nicotineWarning={content.legal.nicotineWarning}
                thcWarning={content.legal.thcWarning}
                fdaDisclaimer={content.legal.fdaDisclaimer}
              />
            </section>

            {/* Additional Info */}
            <section className="rounded-md border border-border bg-card p-5 sm:p-6">
              <h3 className="text-base font-semibold text-foreground sm:text-lg">Need Help?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                If you have any questions about our age verification policies, shipping restrictions, or product compliance,
                please don&apos;t hesitate to reach out. Our team is here to help.
              </p>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                <strong>Contact:</strong>{" "}
                <a href={`mailto:${content.legal.supportEmail}`} className="text-accent-foreground underline">
                  {content.legal.supportEmail}
                </a>
              </p>
            </section>
          </div>
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
