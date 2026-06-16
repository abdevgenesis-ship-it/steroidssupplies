import Link from "next/link";
import { CircleHelp } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { portableTextToBoldMarkdown } from "@/lib/content/portableTextBold";
import { renderTextWithBold } from "@/lib/content/renderTextWithBold";
import { getFAQItems } from "@/lib/sanityClient";
import type { FAQItem } from "@/types/sanity";

type HomeFaq = {
  question: string;
  answer: string;
  ctaLabel?: string;
  ctaHref?: string;
};

const fallbackFaqs: HomeFaq[] = [
  {
    question: "Where can I buy anabolic steroids online with guaranteed delivery?",
    answer:
      "You can buy **certified anabolic steroids online** safely right here at **SteroidsSupplies**. We provide an ironclad delivery guarantee on all orders, utilizing advanced routing and discrete packaging to ensure your package arrives within 48 hours globally.",
    ctaLabel: "Browse catalog",
    ctaHref: "/products",
  },
  {
    question: "Are your anabolic steroids verified by laboratory testing?",
    answer:
      "Yes. Every product undergoes strict third-party **HPLC analysis** guaranteeing absolute purity, correct ester weight, and zero bacterial contamination. **Certificate of Analysis (COA)** documentation is available on request prior to placing your order.",
    ctaLabel: "Shop products",
    ctaHref: "/products",
  },
  {
    question: "Do you offer same-day priority dispatch for international orders?",
    answer:
      "Yes. Orders are picked, vacuum-sealed, and dispatched through our priority international express courier network — with **48-hour tracked delivery** globally as standard. Same-day dispatch is available for qualifying orders.",
    ctaLabel: "Shipping info",
    ctaHref: "/shipping",
  },
  {
    question: "What wholesale pricing tiers are available?",
    answer:
      "Our system automatically applies **three progressive tiered discount levels** based on your total order volume. No separate wholesale registration required — the more you order, the lower your per-unit cost at checkout.",
    ctaLabel: "Apply for wholesale",
    ctaHref: "/wholesale",
  },
];

function normalizeFaqItems(items: FAQItem[]) {
  return items
    .map((item): HomeFaq | null => {
      const question = item.question?.trim();
      const answer = portableTextToBoldMarkdown(item.answer);

      if (!question || !answer) {
        return null;
      }

      return {
        question,
        answer,
        ctaLabel: item.ctaLabel?.trim(),
        ctaHref: item.ctaHref?.trim(),
      };
    })
    .filter((item): item is HomeFaq => Boolean(item));
}

async function getHomepageFaqs() {
  try {
    const items = await getFAQItems();
    const generalItems = items.filter((item) => item.category === "General");
    const normalized = normalizeFaqItems(generalItems);

    if (normalized.length >= 3) {
      return normalized.slice(0, 8);
    }

    return fallbackFaqs;
  } catch {
    return fallbackFaqs;
  }
}

type HomeFaqAccordionProps = {
  eyebrow: string;
  heading: string;
  description: string;
  viewAllLabel: string;
};

export async function HomeFaqAccordion({ eyebrow, heading, description, viewAllLabel }: HomeFaqAccordionProps) {
  const faqs = await getHomepageFaqs();

  return (
    <section className="bg-muted/50 text-foreground">
      <Container className="section-y">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-highlight sm:text-[11px] sm:tracking-[0.18em]">
            <span className="h-px w-8 bg-highlight/70" />
            {eyebrow}
            <span className="h-px w-8 bg-highlight/70" />
          </p>
          <h2 className="mt-2 font-heading text-2xl leading-tight sm:text-3xl lg:text-4xl">
            {heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>

        <div className="glass-surface mx-auto mt-8 max-w-3xl rounded-3xl px-5 py-2 sm:px-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p>{renderTextWithBold(item.answer)}</p>
                  {item.ctaLabel && item.ctaHref ? (
                    <Link href={item.ctaHref} className="mt-2 inline-flex text-sm font-medium text-highlight hover:underline">
                      {item.ctaLabel}
                    </Link>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-7 flex justify-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 transition hover:text-highlight hover:underline"
          >
            <CircleHelp className="h-4 w-4" aria-hidden="true" />
            {viewAllLabel}
          </Link>
        </div>
      </Container>
    </section>
  );
}
