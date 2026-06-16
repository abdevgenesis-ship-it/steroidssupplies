import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { WholesaleBenefitsSection } from "@/components/wholesale/WholesaleBenefitsSection";
import { WholesaleDiscountSection } from "@/components/wholesale/WholesaleDiscountSection";
import { WholesaleFaqSection } from "@/components/wholesale/WholesaleFaqSection";
import { WholesaleHeroSection } from "@/components/wholesale/WholesaleHeroSection";
import { WholesaleHowItWorksSection } from "@/components/wholesale/WholesaleHowItWorksSection";
import { WholesaleInquirySection } from "@/components/wholesale/WholesaleInquirySection";
import { WholesaleTestimonialsSection } from "@/components/wholesale/WholesaleTestimonialsSection";
import { SITE_URL } from "@/config/seo";
import { getWholesalePageData } from "@/lib/wholesale/content";
import { getWholesaleFormClientConfig } from "@/lib/wholesale/formConfig";

const wholesalePath = "/wholesale";

const FALLBACK_TITLE = "Wholesale page";
const FALLBACK_DESCRIPTION = "Wholesale page description.";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getWholesalePageData();
  const title = content.seoTitle?.trim() || FALLBACK_TITLE;
  const description = content.seoDescription?.trim() || FALLBACK_DESCRIPTION;
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${wholesalePath}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${wholesalePath}`,
    },
  };
}

export default async function WholesalePage() {
  const [{ content }, formConfig] = await Promise.all([
    getWholesalePageData(),
    getWholesaleFormClientConfig(),
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.replace(/\s+/g, " ").trim(),
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Wholesale",
        item: `${SITE_URL}${wholesalePath}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        suppressHydrationWarning
      />

      <main className="bg-background pb-14 text-foreground">
        <SectionReveal y={18}>
          <WholesaleHeroSection content={content} />
        </SectionReveal>

        <SectionReveal delay={0.03}>
          <WholesaleBenefitsSection content={content} />
        </SectionReveal>

        <Container className="section-y stack-lg">
          <SectionReveal delay={0.04}>
            <WholesaleHowItWorksSection content={content} />
          </SectionReveal>
        </Container>

        <SectionReveal delay={0.05}>
          <WholesaleDiscountSection content={content} />
        </SectionReveal>

        <Container className="section-y stack-lg pt-0">
          <SectionReveal delay={0.06}>
            <WholesaleInquirySection content={content} formConfig={formConfig} />
          </SectionReveal>

          <SectionReveal delay={0.07}>
            <WholesaleTestimonialsSection content={content} />
          </SectionReveal>

          <SectionReveal delay={0.08}>
            <WholesaleFaqSection content={content} />
          </SectionReveal>
        </Container>
      </main>
    </>
  );
}
