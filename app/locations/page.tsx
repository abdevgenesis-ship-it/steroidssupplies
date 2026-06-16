import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe2, MapPinned, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { getLocationsPage } from "@/lib/sanityClient";

const genericFallbackStates = ["State coverage details available in Sanity"];

const genericFallbackInternationalCoverage = [
  {
    title: "International Coverage",
    details: "International shipping details are managed in Sanity.",
  },
];

const genericFallbackComplianceNotes = [
  {
    region: "Regional Compliance",
    note: "Compliance notes are managed in Sanity.",
  },
];

const LOCATIONS_FALLBACK = {
  title: "Locations",
  description: `View ${SITE_NAME} 48-hour delivery coverage across the UK, Ireland, and approved international lanes.`,
  heroTitle: "Delivery Coverage Across the UK, Ireland & International Markets",
  heroIntro:
    "We support England, Scotland, Wales, Northern Ireland, the Republic of Ireland, and approved international lanes. Final shipment eligibility is confirmed per order based on destination compliance and product type.",
  mapEmbedUrl: "https://www.google.com/maps?q=United+Kingdom&output=embed",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLocationsPage();
  const title = page?.title?.trim() || LOCATIONS_FALLBACK.title;
  const description = page?.description?.trim() || LOCATIONS_FALLBACK.description;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "website",
      url: `${SITE_URL}/locations`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocationsPage() {
  const page = await getLocationsPage();

  const title = page?.title?.trim() || LOCATIONS_FALLBACK.title;
  const description = page?.description?.trim() || LOCATIONS_FALLBACK.description;
  const heroTitle = page?.heroTitle?.trim() || LOCATIONS_FALLBACK.heroTitle;
  const heroIntro = page?.heroIntro?.trim() || LOCATIONS_FALLBACK.heroIntro;
  const lastUpdated = page?.lastUpdated
    ? new Date(page.lastUpdated).toLocaleDateString()
    : new Date().toLocaleDateString();
  const mapEmbedUrl = page?.mapEmbedUrl?.trim() || LOCATIONS_FALLBACK.mapEmbedUrl;
  const states = page?.usStates && page.usStates.length > 0 ? page.usStates : genericFallbackStates;
  const international =
    page?.internationalCoverage && page.internationalCoverage.length > 0
      ? page.internationalCoverage
      : genericFallbackInternationalCoverage;
  const notes =
    page?.complianceNotes && page.complianceNotes.length > 0
      ? page.complianceNotes
      : genericFallbackComplianceNotes;

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: `${SITE_URL}/locations`,
    description,
  };

  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-highlight/10 blur-3xl" />
        <div className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-foreground/5 blur-3xl" />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      <SectionReveal y={16}>
        <section className="border-section-b bg-surface-elevated">
          <Container className="py-10 sm:py-12 lg:py-14">
            <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.22em] text-muted-foreground/90">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="underline-offset-4 hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-foreground">Locations</li>
              </ol>
            </nav>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-highlight shadow-sm">
              <MapPinned className="h-3.5 w-3.5" aria-hidden="true" />
              Coverage Map
            </div>

            <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">
              {heroTitle}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {heroIntro}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          </Container>
        </section>
      </SectionReveal>

      <SectionReveal y={18} delay={0.03}>
        <Container className="section-y">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
              <iframe
                title={`${SITE_NAME} service coverage map`}
                src={mapEmbedUrl}
                loading="lazy"
                className="h-80 w-full sm:h-105"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-highlight/80">At a glance</p>
              <div className="mt-4 space-y-4">
                <article className="rounded-2xl border border-border bg-background/70 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-highlight/30 hover:bg-highlight/5">
                  <h2 className="font-heading text-lg font-semibold">50 US states covered</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Retail, smoke shop, and convenience channels supported with verified age-gated delivery processes.</p>
                </article>
                <article className="rounded-2xl border border-border bg-background/70 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-highlight/30 hover:bg-highlight/5">
                  <h2 className="font-heading text-lg font-semibold">International available</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Cross-border requests are reviewed by lane, product eligibility, and customs readiness before final quote.</p>
                </article>
                <article className="rounded-2xl border border-border bg-background/70 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-highlight/30 hover:bg-highlight/5">
                  <h2 className="font-heading text-lg font-semibold">Compliance first</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Destination-specific restrictions are screened before payment to reduce risk and return events.</p>
                </article>
              </div>
            </div>
          </div>
        </Container>
      </SectionReveal>

      <SectionReveal y={18} delay={0.05}>
        <section className="border-section-y bg-surface-elevated">
          <Container className="section-y">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-highlight/80">United States coverage</p>
            <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">All 50 states supported</h2>

            <div className="mt-5 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-5">
              {states.map((state) => (
                <span
                  key={state}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-center font-medium text-foreground/90 transition-all duration-300 hover:-translate-y-0.5 hover:border-highlight/30 hover:bg-highlight/5 hover:shadow-[0_8px_18px_rgba(0,0,0,0.1)]"
                >
                  {state}
                </span>
              ))}
            </div>
          </Container>
        </section>
      </SectionReveal>

      <SectionReveal y={18} delay={0.07}>
        <Container className="section-y">
          <div className="grid gap-5 lg:grid-cols-3">
            {international.map((item) => (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-[0_16px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-highlight/35 hover:shadow-[0_24px_50px_rgba(0,0,0,0.12)]"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-highlight/8 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-highlight/80">
                  <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                  International
                </div>
                <h3 className="mt-3 font-heading text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.details}</p>
              </article>
            ))}
          </div>
        </Container>
      </SectionReveal>

      <SectionReveal y={18} delay={0.09}>
        <section className="border-section-y bg-surface-elevated">
          <Container className="section-y">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-highlight/80">Regional compliance notes</p>
            <h2 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">Before your order is finalized</h2>

            <div className="mt-5 space-y-4">
              {notes.map((item) => (
                <article key={item.region} className="group rounded-2xl border border-border bg-background p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-highlight/30 hover:bg-highlight/5 hover:shadow-[0_10px_22px_rgba(0,0,0,0.1)]">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <ShieldCheck className="h-4 w-4 text-highlight transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                    {item.region}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.note}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      </SectionReveal>

      <SectionReveal y={18} delay={0.11}>
        <Container className="pb-16 pt-10 sm:pt-12">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold sm:text-3xl">Need destination verification for your next order?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Submit a wholesale request and include your shipping region. We confirm coverage, compliance requirements, and best shipping lane before invoicing.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="group/button">
                  <Link href="/wholesale-request" className="inline-flex items-center gap-2">
                    Request Wholesale Quote
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/compliance">View Compliance Page</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </SectionReveal>
    </main>
  );
}
