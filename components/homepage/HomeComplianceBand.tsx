import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

type HomeComplianceBandProps = {
  shopCtaLabel: string;
  shopCtaHref: string;
  contactCtaLabel: string;
  contactCtaHref: string;
  disclaimerPlain?: string;
};

export function HomeComplianceBand({
  shopCtaLabel,
  shopCtaHref,
  contactCtaLabel,
  contactCtaHref,
  disclaimerPlain,
}: HomeComplianceBandProps) {
  return (
    <section className="relative overflow-hidden border-section-y bg-primary text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgb(196_30_58/0.18),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_100%,rgb(127_29_29/0.14),transparent_50%)]"
        aria-hidden
      />

      <Container className="section-y-tight relative">
        <div className="mx-auto max-w-3xl lg:max-w-none">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <Button
              asChild
              size="lg"
              className="w-full border-white bg-white text-primary shadow-md hover:border-white hover:bg-white/92 hover:text-primary"
            >
              <Link href={shopCtaHref}>{shopCtaLabel}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-white/75 bg-transparent text-white hover:border-white hover:bg-white/12 hover:text-white"
            >
              <Link href={contactCtaHref}>{contactCtaLabel}</Link>
            </Button>
          </div>

          {disclaimerPlain ? (
            <p className="mt-5 text-center text-xs leading-relaxed text-white/80 sm:mt-6 sm:text-sm">
              {disclaimerPlain}
            </p>
          ) : (
            <p className="mt-5 text-center text-xs leading-relaxed text-white/80 sm:mt-6 sm:text-sm lg:whitespace-nowrap">
              Food supplements — not a substitute for a balanced diet. Please review our{" "}
              <Link
                href="/terms"
                className="font-medium text-white underline-offset-4 transition hover:text-yellow hover:underline"
              >
                Terms
              </Link>
              ,{" "}
              <Link
                href="/privacy"
                className="font-medium text-white underline-offset-4 transition hover:text-yellow hover:underline"
              >
                Privacy Policy
              </Link>
              , and{" "}
              <Link
                href="/age-policy"
                className="font-medium text-white underline-offset-4 transition hover:text-yellow hover:underline"
              >
                Safety &amp; Warning Note
              </Link>
              .
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
