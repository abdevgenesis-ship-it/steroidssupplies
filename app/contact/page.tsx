import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, Phone } from "lucide-react";
import { SiBitcoin, SiEthereum, SiRevolut, SiTether } from "react-icons/si";

import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/layout/container";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_NAME, SITE_URL } from "@/config/seo";
import {
  CONTACT_EMAIL_DISPLAY_PLACEHOLDER,
  resolveContactPage,
  stripCmsTestPrefix,
  toTelHref,
} from "@/lib/contactPageContent";
import { renderTextWithBold } from "@/lib/content/renderTextWithBold";
import { getContactPage } from "@/lib/sanityClient";

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getContactPage();
  const content = resolveContactPage(doc);
  const title = content.seoTitle;
  const description = content.seoDescription;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/contact`,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/contact`,
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

export default async function ContactPage() {
  const doc = await getContactPage();
  const content = resolveContactPage(doc);

  const emailIsPlaceholder = content.contactEmail === CONTACT_EMAIL_DISPLAY_PLACEHOLDER;
  const emailForMailto = emailIsPlaceholder ? "" : stripCmsTestPrefix(content.contactEmail);
  const mailto = emailForMailto.includes("@") ? `mailto:${emailForMailto}` : undefined;
  const telHref = content.contactPhone ? toTelHref(content.contactPhone) : undefined;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE_URL}/contact` },
    ],
  };

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: content.pageHeading,
    description: content.seoDescription,
    url: `${SITE_URL}/contact`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />

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
                <li className="text-foreground">Contact</li>
              </ol>
            </nav>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/90 bg-muted/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-highlight backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-highlight animate-pulse" aria-hidden />
              Support
            </div>

            <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">
              {content.pageHeading}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {renderTextWithBold(content.introLead)}
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              <Link href="/wholesale-request" className="font-medium text-highlight underline-offset-4 hover:underline">
                Wholesale request
              </Link>
              {" · "}
              <Link href="/faq" className="font-medium text-highlight underline-offset-4 hover:underline">
                FAQ
              </Link>
              {" · "}
              <Link href="/compliance" className="font-medium text-highlight underline-offset-4 hover:underline">
                Compliance
              </Link>
            </p>
          </Container>
        </section>
      </SectionReveal>

      <SectionReveal delay={0.02}>
        <Container className="section-y">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-12 lg:items-start">
            <div className="order-1">
              <ContactForm content={content} />
            </div>

            <aside className="order-2 lg:sticky lg:top-28">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-xl">{content.detailsHeading}</CardTitle>
                </CardHeader>
                <CardContent className="stack-md space-y-6 text-sm">
                  {content.contactEmail ? (
                    <div className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-highlight/12 text-highlight">
                        <Mail className="h-4 w-4" aria-hidden />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Email</p>
                        {mailto ? (
                          <a
                            href={mailto}
                            className="mt-1 block font-medium text-foreground underline-offset-4 hover:text-highlight hover:underline"
                          >
                            {content.contactEmail}
                          </a>
                        ) : (
                          <span className="mt-1 block font-medium text-foreground">{content.contactEmail}</span>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {content.contactPhone ? (
                    <div className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-highlight/12 text-highlight">
                        <Phone className="h-4 w-4" aria-hidden />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Phone</p>
                        {telHref ? (
                          <a
                            href={telHref}
                            className="mt-1 block font-medium text-foreground underline-offset-4 hover:text-highlight hover:underline"
                          >
                            {content.contactPhone}
                          </a>
                        ) : (
                          <span className="mt-1 block font-medium text-foreground">{content.contactPhone}</span>
                        )}
                      </div>
                    </div>
                  ) : null}

                  <div className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-highlight/12 text-highlight">
                      <Clock className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Hours</p>
                      <p className="mt-1 whitespace-pre-line leading-relaxed text-muted-foreground">{content.businessHours}</p>
                    </div>
                  </div>

                  <div className="glass-field rounded-xl px-4 py-3 transition-colors hover:border-border">
                    <p className="text-sm font-medium text-foreground">{content.responsePromise}</p>
                  </div>

                  {content.paymentsNote ? (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Payments</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{renderTextWithBold(content.paymentsNote)}</p>
                      <div className="mt-4 flex flex-wrap gap-3" aria-label="Accepted payment methods">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-muted/50 text-[#F7931A] backdrop-blur-md">
                          <SiBitcoin className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-muted/50 text-[#627EEA] backdrop-blur-md">
                          <SiEthereum className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-muted/50 text-[#26A17B] backdrop-blur-md">
                          <SiTether className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-muted/50 text-[#0075FF] backdrop-blur-md">
                          <SiRevolut className="h-5 w-5" aria-hidden />
                        </span>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </aside>
          </div>
        </Container>
      </SectionReveal>
    </main>
  );
}
