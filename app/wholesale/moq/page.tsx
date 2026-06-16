import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleDollarSign, PackageCheck, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { getMoqPage } from "@/lib/sanityClient";
import type { LegalSection } from "@/lib/siteContent";

const moqSections: LegalSection[] = [
  {
    title: "MOQ Content Placeholder",
    paragraphs: [
      "MOQ content is managed in Sanity.",
      "Update this section with finalized order minimum terms and examples.",
    ],
  },
];

const MOQ_FALLBACK = {
  title: "Wholesale MOQ",
  description: "MOQ content is managed in Sanity.",
  heroTitle: "MOQ Page Content",
  heroIntro: "MOQ page content is managed in Sanity.",
  sections: moqSections,
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getMoqPage();
  const title = page?.title?.trim() || MOQ_FALLBACK.title;
  const description = page?.description?.trim() || MOQ_FALLBACK.description;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "website",
      url: `${SITE_URL}/wholesale/moq`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function WholesaleMoqPage() {
  const page = await getMoqPage();

  const title = page?.title?.trim() || MOQ_FALLBACK.title;
  const description = page?.description?.trim() || MOQ_FALLBACK.description;
  const heroTitle = page?.heroTitle?.trim() || MOQ_FALLBACK.heroTitle;
  const heroIntro = page?.heroIntro?.trim() || MOQ_FALLBACK.heroIntro;
  const sections = page?.sections && page.sections.length > 0 ? page.sections : MOQ_FALLBACK.sections;
  const lastUpdated = page?.lastUpdated
    ? new Date(page.lastUpdated).toLocaleDateString()
    : new Date().toLocaleDateString();

  const standardSection = sections[0];
  const mixSection = sections[1];
  const paymentSection = sections[3];
  const reviewSection = sections[4];

  const exampleRows = page?.moqExamples?.length
    ? page.moqExamples.map((item) => ({
        label: item.title?.trim() || "MOQ Example",
        body: item.description?.trim() || "Example details are managed in Sanity.",
        total: item.totalBadge?.trim() || "MOQ",
      }))
    : [
        { label: "MOQ Example", body: "Example details are managed in Sanity.", total: "MOQ" },
      ];

  const faqItems = [
    {
      question: "What is the standard MOQ?",
      answer:
        standardSection?.paragraphs?.join(" ") ||
        "MOQ details are managed in Sanity.",
    },
    {
      question: "Can I mix products to reach MOQ?",
      answer:
        mixSection?.paragraphs?.join(" ") ||
        "Mix-and-match details are managed in Sanity.",
    },
    {
      question: "What happens if an item is restricted?",
      answer:
        reviewSection?.paragraphs?.join(" ") ||
        "Order review details are managed in Sanity.",
    },
  ];

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: `${SITE_URL}/wholesale/moq`,
    description,
  };

  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-24 h-96 w-96 rounded-full bg-highlight/10 blur-3xl" />
        <div className="absolute -right-28 top-36 h-112 w-md rounded-full bg-foreground/5 blur-3xl" />
        <div className="absolute inset-x-0 top-96 h-px bg-linear-to-r from-transparent via-border/50 to-transparent" />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      <SectionReveal y={16}>
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
                <li>
                  <Link href="/wholesale" className="underline-offset-4 hover:underline">
                    Wholesale
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-foreground">MOQ</li>
              </ol>
            </nav>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-highlight shadow-sm">
              <span className="h-2 w-2 rounded-full bg-highlight animate-pulse" />
              Minimum Order Guide
            </div>

            <div className="mt-5 max-w-4xl">
              <h1 className="font-heading text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">{heroTitle}</h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {heroIntro}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <article className="group relative overflow-hidden rounded-3xl border border-border bg-background p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-highlight/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CircleDollarSign className="h-5 w-5 text-highlight" aria-hidden="true" />
                <h2 className="mt-3 font-heading text-lg font-semibold">MOQ baseline</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {standardSection?.paragraphs?.[0] || "MOQ baseline details are managed in Sanity."}
                </p>
              </article>
              <article className="group relative overflow-hidden rounded-3xl border border-border bg-background p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-highlight/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <PackageCheck className="h-5 w-5 text-highlight" aria-hidden="true" />
                <h2 className="mt-3 font-heading text-lg font-semibold">Mix and match</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {mixSection?.paragraphs?.[0] || "Mix-and-match policy details are managed in Sanity."}
                </p>
              </article>
              <article className="group relative overflow-hidden rounded-3xl border border-border bg-background p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-highlight/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <ShieldCheck className="h-5 w-5 text-highlight" aria-hidden="true" />
                <h2 className="mt-3 font-heading text-lg font-semibold">Order review</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {reviewSection?.paragraphs?.[0] || "Order review details are managed in Sanity."}
                </p>
              </article>
            </div>
          </Container>
        </section>
      </SectionReveal>

      <SectionReveal y={18} delay={0.03}>
        <Container className="section-y">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-highlight/80">Example baskets</p>
              <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">How to hit MOQ</h2>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {exampleRows.map((example) => (
              <Card key={`${example.label}-${example.total}`} className="group relative overflow-hidden border border-border bg-surface-panel shadow-[0_12px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-highlight/35 hover:shadow-[0_22px_48px_rgba(0,0,0,0.12)]">
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-highlight/8 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardContent className="p-5">
                  <p className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground shadow-sm">{example.total}</p>
                  <h3 className="mt-2 font-heading text-xl font-semibold">{example.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{example.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </SectionReveal>

      <SectionReveal y={18} delay={0.05}>
        <section className="border-section-y bg-surface-elevated">
          <Container className="section-y">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-highlight/80">Policy details</p>
                <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">
                  {paymentSection?.title || "Payment and invoice timing"}
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {paymentSection?.paragraphs?.[0] || "Payment timeline details are managed in Sanity."}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {(mixSection?.bullets?.length ? mixSection.bullets : ["Policy details are managed in Sanity."]).map((bullet) => (
                    <span key={bullet} className="rounded-full border border-border bg-background px-4 py-2 text-xs font-medium text-foreground shadow-sm">
                      {bullet}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-background p-5 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-highlight/80">Helpful links</p>
                <div className="mt-4 space-y-3">
                  <Link href="/wholesale" className="group flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-highlight/30 hover:bg-highlight/5 hover:shadow-[0_10px_22px_rgba(0,0,0,0.1)]">
                    <span>Back to Wholesale</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                  <Link href="/wholesale-request" className="group flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-highlight/30 hover:bg-highlight/5 hover:shadow-[0_10px_22px_rgba(0,0,0,0.1)]">
                    <span>Request a Wholesale Invoice</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                  <Link href="/how-to-buy" className="group flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-highlight/30 hover:bg-highlight/5 hover:shadow-[0_10px_22px_rgba(0,0,0,0.1)]">
                    <span>See Crypto Payment Discounts</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </SectionReveal>

      <SectionReveal y={18} delay={0.07}>
        <Container className="section-y">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-highlight/80">FAQ</p>
              <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">Common MOQ questions</h2>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface-panel px-5 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.06)] sm:px-6">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={item.question} value={`moq-faq-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </SectionReveal>

      <SectionReveal y={18} delay={0.09}>
        <Container className="pb-16 pt-0">
          <div className="rounded-3xl border border-border bg-surface-soft p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-highlight/80">Ready to order</p>
                <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">Start your wholesale basket</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Build your order mix and submit the wholesale inquiry form to get pricing and next steps.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="group/button">
                  <Link href="/wholesale-request" className="inline-flex items-center gap-2">
                    <span>Request Invoice</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/wholesale">Back to Wholesale</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </SectionReveal>
    </main>
  );
}
