export type ParentSelection =
  | { type: "root" }
  | { type: "homePage" }
  | { type: "wholesalePage" }
  | { type: "category"; categoryId: string };

export type ContentSection = {
  style: "normal" | "h2" | "h3";
  text: string;
};

export type PageFaq = {
  question: string;
  answer: string;
};

export type GeneratedSupportingPageContent = {
  exactKeyword: string;
  subH1: string;
  metaTitle: string;
  metaDescription: string;
  introParagraphs: string[];
  aboveFoldDeepContent: ContentSection[];
  keywordVariations: string[];
  pageFaqs: PageFaq[];
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  whyChooseUsHeading?: string;
  whyChooseUsPoints?: string[];
};

export type GenerationResult = {
  keyword: string;
  slug: string;
  url: string;
  status: "success" | "error" | "dry_run";
  provider?: string;
  documentId?: string;
  categoryIds?: string[];
  productIds?: string[];
  errors?: string[];
};

export type GenerateRequestOptions = {
  dryRun?: boolean;
  primaryCtaHref?: string;
  secondaryCtaHref?: string;
  provider?: "gemini" | "groq" | "ollama" | "openrouter";
};
