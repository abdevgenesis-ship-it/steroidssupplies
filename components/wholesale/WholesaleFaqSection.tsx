import Link from "next/link";
import { CircleHelp } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { renderTextWithBold } from "@/lib/content/renderTextWithBold";
import type { MergedWholesalePage } from "@/lib/wholesale/content";

type WholesaleFaqSectionProps = {
  content: MergedWholesalePage;
};

function FaqAnswer({ text }: { text: string }) {
  const parts = text.split(/\n+/).filter((p) => p.trim().length > 0);
  return (
    <div className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
      {parts.map((para, i) => (
        <p key={i}>{renderTextWithBold(para.trim())}</p>
      ))}
    </div>
  );
}

export function WholesaleFaqSection({ content }: WholesaleFaqSectionProps) {
  return (
    <section
      aria-labelledby="faq-heading"
      className="stack-md border-section-t pb-4 pt-12 sm:pt-14 lg:pt-16"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 id="faq-heading" className="font-heading text-2xl sm:text-3xl">
          {content.faqHeading}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {content.faqIntro}
        </p>
      </div>
      <div className="mx-auto max-w-3xl rounded-3xl border border-foreground/10 bg-card px-5 py-2 shadow-sm sm:px-6">
        <Accordion type="single" collapsible className="w-full">
          {content.faqs.map((item, index) => (
            <AccordionItem key={item.question} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>
                <FaqAnswer text={item.answer} />
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
          View all FAQs
        </Link>
      </div>
    </section>
  );
}