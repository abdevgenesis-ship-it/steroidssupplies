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
    question: "Where can I buy bulk THC vapes at wholesale prices?",
    answer:
      "You can source **COA-verified bulk THC vapes** and wholesale 510 cartridges directly through **THCPensBulk**. We are a licensed B2B distributor supplying dispensaries and retailers with authentic inventory at competitive wholesale pricing.",
    ctaLabel: "Browse catalog",
    ctaHref: "/products",
  },
  {
    question: "What is the minimum order quantity for wholesale THC vapes?",
    answer:
      "Our minimum order quantity is **50 units per SKU**. Volume price breaks apply from 200 units and 500+ units. Submit a wholesale inquiry and a dedicated account manager will respond within one business day.",
    ctaLabel: "Request a quote",
    ctaHref: "/wholesale",
  },
  {
    question: "Do your THC cartridges come with a Certificate of Analysis?",
    answer:
      "Yes. Every SKU ships with a **Certificate of Analysis (COA)** from an accredited third-party lab, confirming cannabinoid potency and residual solvent levels. COA documentation is available on request prior to placing your order.",
  },
  {
    question: "How fast will my wholesale order ship?",
    answer:
      "Orders confirmed before our daily cutoff are packaged and dispatched within **48 hours**. USA domestic orders ship via tracked courier with priority options available. International orders to the UK and worldwide ship fully tracked and insured.",
    ctaLabel: "Shipping info",
    ctaHref: "/shipping",
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
