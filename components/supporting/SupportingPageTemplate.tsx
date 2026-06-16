import { Container } from "@/components/layout/container";
import { urlFor } from "@/lib/sanity";
import type { SupportingPage, SupportingPageFaq } from "@/types/sanity";
import { SupportingPageBody } from "./SupportingPageBody";
import { SupportingPageBreadcrumb } from "./SupportingPageBreadcrumb";
import { SupportingPageHero } from "./SupportingPageHero";
import { SupportingPageJsonLd } from "./SupportingPageJsonLd";
import {
  ensureKeywordPrefix,
  getIntroParagraphs,
  getSubH1HighlightSuffix,
  getSupportingExactKeyword,
  getSupportingSubH1,
} from "./supportingPageUtils";

type SupportingPageTemplateProps = {
  page: SupportingPage;
  parentHref: string;
  parentLabel: string;
  currentHref: string;
};

export async function SupportingPageTemplate({
  page,
  parentHref,
  parentLabel,
  currentHref,
}: SupportingPageTemplateProps) {
  const keyword = getSupportingExactKeyword(page);
  const subH1 = getSupportingSubH1(page);
  const subH1Suffix = getSubH1HighlightSuffix(subH1, keyword);
  const introParagraphs = getIntroParagraphs(page);
  const fallbackIntro = ensureKeywordPrefix(
    keyword,
    page.metaDescription || page.seoDescription || `Discover wholesale insights for ${keyword}.`,
    " - ",
  );
  const primaryCtaLabel = page.primaryCtaLabel?.trim() || "Visit shop";
  const primaryCtaHref = page.primaryCtaHref?.trim() || "/shop";
  const secondaryCtaLabel = page.secondaryCtaLabel?.trim() || "Contact us";
  const secondaryCtaHref = page.secondaryCtaHref?.trim() || "/contact";
  const jsonLdTitle = ensureKeywordPrefix(keyword, page.metaTitle || page.title, " | ");
  const jsonLdDescription = ensureKeywordPrefix(
    keyword,
    page.metaDescription || page.seoDescription || introParagraphs[0] || fallbackIntro,
    " - ",
  );
  const heroImageUrl = page.heroImage?.asset
    ? urlFor(page.heroImage).width(1800).height(900).fit("crop").url()
    : "/images/supporting-page-hero.png";
  const pageFaqs: SupportingPageFaq[] = page.pageFaqs ?? [];

  return (
    <main className="bg-background text-foreground">
      <SupportingPageJsonLd
        pageTitle={jsonLdTitle}
        pageDescription={jsonLdDescription}
        currentHref={currentHref}
        parentHref={parentHref}
        parentLabel={parentLabel}
        pageFaqs={pageFaqs}
      />

      <Container className="section-y">
        <SupportingPageBreadcrumb parentHref={parentHref} parentLabel={parentLabel} pageTitle={page.title} />

        <SupportingPageHero
          title={page.title}
          keyword={keyword}
          subH1={subH1}
          subH1Suffix={subH1Suffix}
          introParagraphs={introParagraphs.length > 0 ? introParagraphs : [fallbackIntro]}
          heroImageUrl={heroImageUrl}
          primaryCtaLabel={primaryCtaLabel}
          primaryCtaHref={primaryCtaHref}
          secondaryCtaLabel={secondaryCtaLabel}
          secondaryCtaHref={secondaryCtaHref}
        />

        <section className="mt-6 sm:mt-8">
          <SupportingPageBody page={page} />
        </section>
      </Container>
    </main>
  );
}
