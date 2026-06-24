import type { Metadata } from "next";

import { HomeHero } from "@/components/homepage/HomeHero";
import { HomeComplianceBand } from "@/components/homepage/HomeComplianceBand";
import { HomeAuthorityBlock } from "@/components/homepage/HomeAuthorityBlock";
import { HomePromoBanner } from "@/components/homepage/HomePromoBanner";
import { HomeHowToOrder } from "@/components/homepage/HomeHowToOrder";
import { HomeBrandPartners } from "@/components/homepage/HomeBrandPartners";
import { HomeBlogPreview } from "@/components/homepage/HomeBlogPreview";
import { HomeFaqAccordion } from "@/components/homepage/HomeFaqAccordion";
import { HomeTestimonials } from "@/components/homepage/HomeTestimonials";
import { HomeTrustStrip } from "@/components/homepage/HomeTrustStrip";
import { HomeSupportingPageLinks } from "@/components/homepage/HomeSupportingPageLinks";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { SITE_URL, SITE_NAME } from "@/config/seo";
import { resolveHomeHeroBackgroundAlt, resolveHomeHeroBackgroundUrl } from "@/lib/homeHeroImage";
import { resolveHomePageContent } from "@/lib/homePageDefaults";
import { portableTextToBoldMarkdown } from "@/lib/content/portableTextBold";
import { getFAQItems, getHomePage, getAllSupportingPagesNav } from "@/lib/sanityClient";
import { getCanonicalSupportingPath } from "@/lib/supportingPageRouting";

type FaqJsonLdItem = {
  question: string;
  answer: string;
};

const fallbackFaqItems: FaqJsonLdItem[] = [
  {
    question: "Where can I buy anabolic steroids online with guaranteed delivery?",
    answer:
      "You can buy certified anabolic steroids online safely right here at SteroidsSupplies. We provide an ironclad delivery guarantee on all orders, utilizing advanced routing and discrete packaging to ensure your package arrives within 48 hours globally.",
  },
  {
    question: "Are your anabolic steroids verified by laboratory testing?",
    answer:
      "Yes. Every product listed across our Anavar, Trenbolone, and wholesale categories undergoes strict third-party HPLC analysis to guarantee absolute purity, correct ester weight, and zero bacterial contamination. COA documentation is available on request.",
  },
  {
    question: "Do you offer same-day priority dispatch for international orders?",
    answer:
      "Yes. If you select our Same-Day Priority Delivery option at checkout, your order is picked, vacuum-sealed, and dispatched through our priority international express courier network within hours of order confirmation.",
  },
  {
    question: "What is the minimum order for wholesale pricing?",
    answer:
      "Volume discounts begin at our tier-two level. Adding bulk volumes of Anavar, Trenbolone, or mixed performance lines automatically reduces the individual unit price in real time at checkout — no separate wholesale account required.",
  },
];

async function getFaqJsonLdItems() {
  try {
    const items = await getFAQItems();
    const normalized = items
      .map((item): FaqJsonLdItem | null => {
        const question = item.question?.trim();
        const answer = portableTextToBoldMarkdown(item.answer).replace(/\*\*/g, "");

        if (!question || !answer) {
          return null;
        }

        return { question, answer };
      })
      .filter((item): item is FaqJsonLdItem => Boolean(item));

    if (normalized.length >= 3) {
      return normalized.slice(0, 8);
    }

    return fallbackFaqItems;
  } catch {
    return fallbackFaqItems;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePage();
  const { seo } = resolveHomePageContent(homePage);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      type: "website",
      url: SITE_URL,
      title: seo.title,
      description: seo.description,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} homepage`,
        },
      ],
    },
  };
}

export default async function Page() {
  const [faqItems, homePage, rawSupportingPages] = await Promise.all([
    getFaqJsonLdItems(),
    getHomePage(),
    getAllSupportingPagesNav(),
  ]);

  const supportingPageLinks = rawSupportingPages
    .map((page) => {
      const href = getCanonicalSupportingPath(page as Parameters<typeof getCanonicalSupportingPath>[0])
      if (!href || !page.title) return null
      return { title: page.title, href }
    })
    .filter((l): l is { title: string; href: string } => l !== null)
  const homepageBrands = homePage?.featuredBrands ?? [];
  const content = resolveHomePageContent(homePage);
  const heroBackgroundImageUrl = resolveHomeHeroBackgroundUrl();
  const heroBackgroundImageAlt = resolveHomeHeroBackgroundAlt();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "SteroidsSupplies is a certified global B2C and B2B wholesale supplier of pharmaceutical-grade anabolic steroids, serving athletes and commercial buyers worldwide with COA-verified compounds and guaranteed 48h international delivery.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "sales@steroidssupplies.co.uk",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
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
    ],
  };

  return (
    <main className="bg-background pb-14 text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HomeHero
        {...content.hero}
        backgroundImageUrl={heroBackgroundImageUrl}
        backgroundImageAlt={heroBackgroundImageAlt}
      />
      <HomeTrustStrip items={content.trustStrip} />
      <SectionReveal delay={0.04}>
        <HomeAuthorityBlock
          eyebrow={content.authority.eyebrow}
          heading={content.authority.heading}
          intro={content.authority.intro}
          points={content.authority.points}
          ctaLabel={content.authority.ctaLabel}
          ctaHref={content.authority.ctaHref}
          imageAlt={content.authority.imageAlt}
        />
      </SectionReveal>
      <SectionReveal delay={0.04}>
        <HomePromoBanner
          variant="crypto"
          eyebrow={content.crypto.eyebrow}
          heading={content.crypto.heading}
          description={content.crypto.description}
          ctaLabel={content.crypto.ctaLabel}
          ctaHref={content.crypto.ctaHref}
        />
      </SectionReveal>
      <SectionReveal delay={0.05}>
        <HomeHowToOrder
          badge={content.howTo.badge}
          heading={content.howTo.heading}
          intro={content.howTo.intro}
          steps={content.howTo.steps}
          ctaLabel={content.howTo.ctaLabel}
          ctaHref={content.howTo.ctaHref}
        />
      </SectionReveal>
      <SectionReveal delay={0.06}>
        <HomeBrandPartners
          brands={homepageBrands}
          eyebrow={content.brands.eyebrow}
          heading={content.brands.heading}
          emptyMessage={content.brands.emptyMessage}
        />
      </SectionReveal>
      <SectionReveal delay={0.07}>
        <HomeTestimonials
          badge={content.testimonials.badge}
          heading={content.testimonials.heading}
          intro={content.testimonials.intro}
        />
      </SectionReveal>
      <SectionReveal delay={0.07}>
        <HomeBlogPreview
          eyebrow={content.blog.eyebrow}
          heading={content.blog.heading}
          description={content.blog.description}
          emptyMessage={content.blog.emptyMessage}
          viewAllLabel={content.blog.viewAllLabel}
        />
      </SectionReveal>
      <SectionReveal delay={0.08}>
        <HomeFaqAccordion
          eyebrow={content.faq.eyebrow}
          heading={content.faq.heading}
          description={content.faq.description}
          viewAllLabel={content.faq.viewAllLabel}
        />
      </SectionReveal>
      {supportingPageLinks.length > 0 && (
        <SectionReveal delay={0.08}>
          <HomeSupportingPageLinks links={supportingPageLinks} initialCount={15} />
        </SectionReveal>
      )}
      <SectionReveal delay={0.08}>
        <HomeComplianceBand
          shopCtaLabel={content.compliance.shopCtaLabel}
          shopCtaHref={content.compliance.shopCtaHref}
          contactCtaLabel={content.compliance.contactCtaLabel}
          contactCtaHref={content.compliance.contactCtaHref}
          disclaimerPlain={content.compliance.disclaimerPlain}
        />
      </SectionReveal>
    </main>
  );
}
