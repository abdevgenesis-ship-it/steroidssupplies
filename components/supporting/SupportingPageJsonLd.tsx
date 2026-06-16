import { SITE_URL } from "@/config/seo";
import type { SupportingPageFaq } from "@/types/sanity";

type SupportingPageJsonLdProps = {
  pageTitle: string;
  pageDescription?: string;
  currentHref: string;
  parentHref: string;
  parentLabel: string;
  pageFaqs?: SupportingPageFaq[];
};

export function SupportingPageJsonLd({
  pageTitle,
  pageDescription,
  currentHref,
  parentHref,
  parentLabel,
  pageFaqs = [],
}: SupportingPageJsonLdProps) {
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
        name: parentLabel,
        item: `${SITE_URL}${parentHref}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: pageTitle,
        item: `${SITE_URL}${currentHref}`,
      },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    url: `${SITE_URL}${currentHref}`,
    description: pageDescription || `Read ${pageTitle} from SteroidsSupplies.`,
    isPartOf: {
      "@type": "WebSite",
      name: "SteroidsSupplies",
      url: SITE_URL,
    },
    breadcrumb: breadcrumbJsonLd,
  };

  const faqJsonLd =
    pageFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: pageFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
        suppressHydrationWarning
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          suppressHydrationWarning
        />
      ) : null}
    </>
  );
}
