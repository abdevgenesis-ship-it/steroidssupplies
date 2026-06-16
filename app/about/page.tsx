import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Building2, Scale, ShieldCheck, UserCheck } from "lucide-react";

import { AboutRichBlocks } from "@/components/about/AboutRichBlocks";
import { Container } from "@/components/layout/container";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import { resolveAboutPage } from "@/lib/aboutPageContent";
import { renderTextWithBold } from "@/lib/content/renderTextWithBold";
import { urlFor } from "@/lib/sanity";
import { getAboutPage } from "@/lib/sanityClient";

const complianceIcons = [ShieldCheck, Scale, UserCheck] as const;
const ABOUT_STORY_FALLBACK_IMAGE = "/images/about/story-fallback.png";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getAboutPage();
  const content = resolveAboutPage(doc);
  const title = content.seoTitle;
  const description = content.seoDescription;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/about`,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/about`,
      title,
      description,
      siteName: SITE_NAME,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function AboutPage() {
  const doc = await getAboutPage();
  const content = resolveAboutPage(doc);

  const storyImageUrl =
    content.storyImage?.asset?._ref != null
      ? urlFor({
          _type: "image",
          asset: content.storyImage.asset,
          alt: content.storyImage.alt,
        } as never)
          .width(900)
          .height(675)
          .fit("crop")
          .url()
      : ABOUT_STORY_FALLBACK_IMAGE;

  const storyImageAlt = content.storyImage?.alt?.trim() || `${SITE_NAME} wholesale operations`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: content.pageHeading,
    description: content.seoDescription,
    url: `${SITE_URL}/about`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <main className="relative overflow-hidden bg-background pb-16 text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-24 h-80 w-80 rounded-full bg-highlight/10 blur-3xl" />
        <div className="absolute -right-28 top-40 h-96 w-96 rounded-full bg-foreground/5 blur-3xl" />
        <div className="absolute inset-x-0 top-96 h-px bg-linear-to-r from-transparent via-border/50 to-transparent" />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

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
                <li className="text-foreground">About</li>
              </ol>
            </nav>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-highlight shadow-sm">
              <span className="h-2 w-2 rounded-full bg-highlight animate-pulse" aria-hidden />
              Company
            </div>

            <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">{content.pageHeading}</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {renderTextWithBold(content.introLead)}
            </p>
          </Container>
        </section>
      </SectionReveal>

      <SectionReveal delay={0.02}>
        <Container className="section-y stack-lg">
          <section aria-labelledby="our-story-heading">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="order-2 lg:order-1">
                <h2 id="our-story-heading" className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                  {content.storyHeading}
                </h2>
                <AboutRichBlocks blocks={content.storyBody} className="mt-4" />
              </div>
              <div className="order-1 lg:order-2">
                <figure className="overflow-hidden rounded-2xl border border-border bg-muted/20 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
                  <div className="relative aspect-4/3 w-full">
                    <Image
                      src={storyImageUrl}
                      alt={storyImageAlt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      priority
                    />
                  </div>
                </figure>
              </div>
            </div>
          </section>

          <section aria-labelledby="mission-heading">
            <Card className="border border-highlight/25 bg-surface-panel-diagonal p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)] sm:p-8 lg:p-10">
              <h2 id="mission-heading" className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                {content.missionHeading}
              </h2>
              <AboutRichBlocks blocks={content.missionBody} className="mt-4" />
            </Card>
          </section>

          {content.showTeamSection && content.teamBody.length > 0 ? (
            <section aria-labelledby="team-heading">
              <h2 id="team-heading" className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                {content.teamHeading}
              </h2>
              <AboutRichBlocks blocks={content.teamBody} className="mt-4 max-w-3xl" />
            </section>
          ) : null}

          <section aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">
              Company stats
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {content.stats.map((stat, i) => (
                <Card
                  key={`${stat.label}-${i}`}
                  className="border border-border bg-background/90 p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-highlight/25 hover:shadow-md"
                >
                  <p className="font-heading text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>
          </section>

          <section aria-labelledby="compliance-heading">
            <h2 id="compliance-heading" className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              {content.complianceHeading}
            </h2>
            {content.complianceIntro.trim() ? (
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
                {renderTextWithBold(content.complianceIntro)}
              </p>
            ) : null}
            <div className={`grid gap-4 md:grid-cols-3 ${content.complianceIntro.trim() ? "mt-8" : "mt-3"}`}>
              {content.compliancePoints.map((point, index) => {
                const Icon = complianceIcons[index % complianceIcons.length];

                return (
                  <Card
                    key={`${point.title}-${index}`}
                    className="border border-border bg-surface-panel p-6 shadow-sm"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-highlight/12 text-highlight">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{point.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {renderTextWithBold(point.description)}
                    </p>
                  </Card>
                );
              })}
            </div>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              For full policy language, see our{" "}
              <Link href="/compliance" className="font-medium text-highlight underline-offset-4 hover:underline">
                Compliance &amp; Legal
              </Link>{" "}
              hub and{" "}
              <Link href="/faq" className="font-medium text-highlight underline-offset-4 hover:underline">
                FAQ
              </Link>
              . Ready to buy? Start from{" "}
              <Link href="/wholesale" className="font-medium text-highlight underline-offset-4 hover:underline">
                Wholesale
              </Link>{" "}
              or{" "}
              <Link href="/contact" className="font-medium text-highlight underline-offset-4 hover:underline">
                Contact
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="about-cta">
            <div className="rounded-3xl border border-border bg-surface-panel p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8 lg:p-10">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-highlight/80">Ready to order</p>
                <h2 id="about-cta" className="mt-2 font-heading text-2xl font-bold text-foreground sm:text-3xl">
                  Start your wholesale order or get in touch with our team.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Use the wholesale request form for quoting, or contact us if you need help confirming product fit, compliance, or shipping coverage.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {content.ctaHref.startsWith("/") ? (
                  <Button asChild size="lg" className="group/button">
                    <Link href={content.ctaHref} className="inline-flex items-center gap-2">
                      {content.ctaLabel}
                      <Building2 className="h-4 w-4 transition-transform group-hover/button:translate-x-1" aria-hidden="true" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="group/button">
                    <a href={content.ctaHref} rel="noopener noreferrer" className="inline-flex items-center gap-2">
                      {content.ctaLabel}
                      <Building2 className="h-4 w-4 transition-transform group-hover/button:translate-x-1" aria-hidden="true" />
                    </a>
                  </Button>
                )}

                <Button asChild variant="secondary" size="lg">
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </div>
          </section>
        </Container>
      </SectionReveal>
    </main>
  );
}
