import type { Metadata } from "next";
import Link from "next/link";

import { FAQAccordion, type FaqAccordionItem, type FaqCategory } from "@/components/faq/FAQAccordion";
import { Container } from "@/components/layout/container";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { portableTextToBoldMarkdown } from "@/lib/content/portableTextBold";
import { getFAQItems } from "@/lib/sanityClient";

const FAQ_CATEGORIES: FaqCategory[] = ["General", "Ordering", "Shipping", "Payment", "Products", "Compliance"];

export const metadata: Metadata = {
  title: `FAQs | ${SITE_NAME}`,
  description: `Frequently asked questions about wholesale ordering, shipping, payment options, products, and compliance at ${SITE_NAME}.`,
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/faq`,
    title: `FAQs | ${SITE_NAME}`,
    description: `Frequently asked questions about wholesale ordering, shipping, payment options, products, and compliance at ${SITE_NAME}.`,
    siteName: SITE_NAME,
  },
};

function normalizeFaqItems(items: Awaited<ReturnType<typeof getFAQItems>>): FaqAccordionItem[] {
  return items
    .map((item): FaqAccordionItem | null => {
      const question = item.question?.trim();
      const answer = portableTextToBoldMarkdown(item.answer);
      const rawCategory = item.category;
      const category = FAQ_CATEGORIES.includes(rawCategory as FaqCategory)
        ? (rawCategory as FaqCategory)
        : "General";

      if (!question || !answer) {
        return null;
      }

      return {
        id: item._id,
        question,
        answer,
        category,
      };
    })
    .filter((item): item is FaqAccordionItem => Boolean(item));
}

export default async function FAQPage() {
  const items = await getFAQItems();
  const normalizedItems = normalizeFaqItems(items);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: normalizedItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="relative overflow-hidden bg-background pb-14 text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-24 h-80 w-80 rounded-full bg-highlight/10 blur-3xl" />
        <div className="absolute -right-28 top-40 h-96 w-96 rounded-full bg-foreground/5 blur-3xl" />
        <div className="absolute inset-x-0 top-96 h-px bg-linear-to-r from-transparent via-border/50 to-transparent" />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <SectionReveal y={14}>
        <section className="border-section-b bg-surface-elevated backdrop-blur-sm">
          <Container className="py-10 sm:py-12 lg:py-14">
            <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.22em] text-muted-foreground/90">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="underline-offset-4 hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-foreground">FAQ</li>
              </ol>
            </nav>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-highlight shadow-sm">
              <span className="h-2 w-2 rounded-full bg-highlight animate-pulse" />
              Support Desk
            </div>

            <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Fast answers on ordering, shipping, payment options, product quality, and compliance requirements.
            </p>
          </Container>
        </section>
      </SectionReveal>

      <SectionReveal delay={0.02}>
        <Container className="pt-8 sm:pt-10">
          <FAQAccordion items={normalizedItems} />
        </Container>
      </SectionReveal>
    </main>
  );
}
