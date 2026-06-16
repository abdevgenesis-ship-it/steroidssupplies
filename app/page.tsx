import type { Metadata } from "next";

import { HomeHero } from "@/components/homepage/HomeHero";
import { HomeCategoryGrid } from "@/components/homepage/HomeCategoryGrid";
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
    question: "Where can I buy bulk THC vapes at wholesale prices?",
    answer:
      "You can source COA-verified bulk THC vapes and wholesale 510 cartridges directly through THCPensBulk. We are a licensed B2B distributor supplying dispensaries, smoke shops, and online cannabis retailers with authentic inventory, competitive wholesale pricing, and fast tracked delivery to the USA, UK and worldwide.",
  },
  {
    question: "What is the minimum order quantity for wholesale THC vapes?",
    answer:
      "Our minimum order quantity is 50 units per SKU. Volume price breaks apply from 200 units and 500+ units. Submit a wholesale inquiry via our form and a dedicated account manager will provide a proforma invoice within one business day.",
  },
  {
    question: "Do your THC cartridges come with a Certificate of Analysis?",
    answer:
      "Yes. Every SKU in our catalog is shipped with a Certificate of Analysis (COA) from an accredited third-party lab, confirming cannabinoid potency and residual solvent levels. COA documentation is available on request prior to placing your order.",
  },
  {
    question: "How fast will my wholesale order ship?",
    answer:
      "Wholesale orders confirmed before our daily cutoff are packaged and dispatched within 48 hours. USA domestic orders ship via tracked courier with priority options available. International wholesale shipments to the UK, Europe and beyond ship fully tracked and insured.",
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
  const homepageCategories = homePage?.featuredCategories ?? [];
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
      "THCPensBulk is a licensed B2B wholesale distributor of bulk THC vapes and 510 cartridges, serving dispensaries and cannabis retailers worldwide with COA-verified inventory and fast tracked delivery.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "sales@thcpensbulk.com",
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
    <main className="bg-white pb-14 text-foreground">
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
      <SectionReveal delay={0.03} amount={0.08}>
        <HomeCategoryGrid
          categories={homepageCategories}
          eyebrow={content.categories.eyebrow}
          heading={content.categories.heading}
          description={content.categories.description}
          emptyMessage={content.categories.emptyMessage}
        />
      </SectionReveal>
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
