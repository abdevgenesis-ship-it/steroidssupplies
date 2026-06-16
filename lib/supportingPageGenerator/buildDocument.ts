import { portableTextFromSections } from "./portableText";
import {
  buildSupportingPageId,
  resolveParentRef,
} from "./parentPageRef";
import { pickRandomRelatedContent, type RelatedContentPools } from "./pickRandomRelatedContent";
import type { GeneratedSupportingPageContent, GenerateRequestOptions, ParentSelection } from "./types";

export function buildSupportingPageDocument(
  content: GeneratedSupportingPageContent,
  slug: string,
  parent: ParentSelection,
  pools: RelatedContentPools,
  options: GenerateRequestOptions = {},
) {
  const documentId = buildSupportingPageId(parent, slug);
  const related = pickRandomRelatedContent(pools, slug);
  const primaryCtaHref = options.primaryCtaHref || content.primaryCtaHref || "/shop";
  const secondaryCtaHref = options.secondaryCtaHref || "/contact";

  return {
    document: {
      _id: documentId,
      _type: "supportingPage" as const,
      title: content.subH1.slice(0, 120),
      slug: { _type: "slug" as const, current: slug },
      exactKeyword: content.exactKeyword.trim(),
      subH1: content.subH1.trim(),
      metaTitle: content.metaTitle.trim(),
      metaDescription: content.metaDescription.trim(),
      introParagraphs: content.introParagraphs.map((p) => p.trim()).filter(Boolean),
      aboveFoldDeepContent: portableTextFromSections(content.aboveFoldDeepContent),
      keywordVariations: content.keywordVariations.map((v) => v.trim()).filter(Boolean),
      pageFaqs: content.pageFaqs.map((faq) => ({
        _type: "object" as const,
        _key: `faq-${faq.question.slice(0, 24).replace(/\W/g, "")}`,
        question: faq.question.trim(),
        answer: faq.answer.trim(),
      })),
      primaryCtaLabel: content.primaryCtaLabel?.trim() || "Visit shop",
      primaryCtaHref,
      secondaryCtaLabel: "Contact us",
      secondaryCtaHref,
      whyChooseUsHeading: content.whyChooseUsHeading?.trim() || "Why choose us",
      whyChooseUsPoints: (content.whyChooseUsPoints || []).map((p) => p.trim()).filter(Boolean),
      categoriesHeading: "Shop wholesale categories",
      categories: related.categories,
      relatedProducts: related.relatedProducts,
      parentPage: resolveParentRef(parent),
    },
    documentId,
    categoryIds: related.categoryIds,
    productIds: related.productIds,
  };
}
