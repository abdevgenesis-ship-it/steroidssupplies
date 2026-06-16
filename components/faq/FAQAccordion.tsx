"use client";

import { useMemo, useState } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { renderTextWithBold } from "@/lib/content/renderTextWithBold";

export type FaqCategory =
  | "General"
  | "Ordering"
  | "Shipping"
  | "Payment"
  | "Products"
  | "Compliance"
  | "Injectables"
  | "Orals"
  | "PCT"
  | "Steroids"
  | "Wholesale";

export type FaqAccordionItem = {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
};

type FAQAccordionProps = {
  items: FaqAccordionItem[];
};

const CATEGORY_ORDER: FaqCategory[] = [
  "General",
  "Ordering",
  "Shipping",
  "Payment",
  "Products",
  "Compliance",
  "Injectables",
  "Orals",
  "PCT",
  "Steroids",
  "Wholesale",
];

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("General");

  const filteredItems = useMemo(
    () => items.filter((item) => item.category === activeCategory),
    [items, activeCategory],
  );

  return (
    <section aria-label="Frequently asked questions" className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {CATEGORY_ORDER.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={
                isActive
                  ? "rounded-full border border-highlight/30 bg-highlight/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-highlight backdrop-blur-md"
                  : "rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-highlight/30 hover:text-highlight"
              }
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="glass-surface rounded-3xl px-5 py-2 sm:px-6">
        {filteredItems.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {filteredItems.map((item, index) => (
              <AccordionItem key={item.id} value={`faq-${activeCategory}-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{renderTextWithBold(item.answer)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="py-6 text-sm text-muted-foreground">
            No FAQ items are available for this category yet.
          </div>
        )}
      </div>
    </section>
  );
}
