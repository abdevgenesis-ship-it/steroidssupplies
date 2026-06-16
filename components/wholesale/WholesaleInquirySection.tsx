import Link from "next/link";
import { Clock3, FileCheck2, ShieldCheck } from "lucide-react";

import { WholesaleForm } from "@/components/WholesaleForm";
import { Badge } from "@/components/ui/badge";
import type { MergedWholesalePage } from "@/lib/wholesale/content";
import type { WholesaleFormClientConfig } from "@/lib/wholesale/formConfig";

type WholesaleInquirySectionProps = {
  content: MergedWholesalePage;
  formConfig: WholesaleFormClientConfig;
};

export function WholesaleInquirySection({ content, formConfig }: WholesaleInquirySectionProps) {
  return (
    <section
      id="wholesale-inquiry"
      aria-labelledby="inquiry-form-heading"
      className="scroll-mt-24 border-section-t pt-12 sm:pt-14 lg:pt-16"
    >
      <div className="mx-auto max-w-4xl text-center">
        <Badge variant="outline" className="rounded-full border-highlight/30 bg-highlight/10 text-highlight">
          Request A Quote
        </Badge>
        <h2 id="inquiry-form-heading" className="mt-3 font-heading text-2xl sm:text-3xl">
          {content.formHeading}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {content.formIntro}{" "}
          <Link
            href="/wholesale-request"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            full wholesale request form
          </Link>
          .
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-foreground/90 sm:text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 backdrop-blur-md">
            <Clock3 className="size-3.5 text-primary" aria-hidden="true" />
            Fast response time
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-highlight/38 bg-highlight/12 px-3 py-1.5 backdrop-blur-md">
            <FileCheck2 className="size-3.5 text-highlight" aria-hidden="true" />
            Tailored quote sheet
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 backdrop-blur-md">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
            Verified B2B trade accounts
          </span>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-3xl">
        <WholesaleForm formConfig={formConfig} />
      </div>
    </section>
  );
}