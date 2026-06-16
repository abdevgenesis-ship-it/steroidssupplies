export type Slug = {
  current: string;
};

export type SanityReference = {
  _type: "reference";
  _ref: string;
};

export type SanityImage = {
  _type: "image";
  alt?: string;
  asset?: SanityReference;
};

export type SanityDocumentBase = {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
};

export type BrandPartner = SanityDocumentBase & {
  _type: "brandPartner";
  name: string;
  logo?: SanityImage;
  website?: string;
  description?: string;
};

export type Brand = SanityDocumentBase & {
  _type: "brand";
  name: string;
  slug?: Slug;
  shortDescription?: string;
  logo?: SanityImage;
  website?: string;
  isActive?: boolean;
  sortOrder?: number;
};

export type Category = SanityDocumentBase & {
  _type: "category";
  name: string;
  slug: Slug;
  group?: "Nicotine" | "THC" | "CBD" | "THCA" | "THC Carts";
  shortDescription?: string;
  description?: unknown[];
  image?: SanityImage;
  heroImage?: SanityImage;
  seoContent?: unknown[];
  navOrder?: number;
  showInHeader?: boolean;
  relatedGuides?: Array<{
    title?: string;
    href?: string;
  }>;
  categoryTrustWallHeading?: string;
  categoryTrustWallTestimonials?: Array<{
    quote?: string;
    source?: string;
  }>;
  categoryTrustWallShields?: string[];
  categoryFaqHeading?: string;
  categoryFaqDescription?: string;
  categoryFaqEmptyMessage?: string;
  categoryFaqItems?: FAQItem[];
  relatedCategories?: Array<{
    _id: string;
    name?: string;
    slug?: Slug;
  }>;
  categoryHeroEyebrow?: string;
  categoryHeroHeading?: string;
  categoryHeroPrimaryCtaLabel?: string;
  categoryHeroSecondaryCtaLabel?: string;
  categoryHeroFallbackDescription?: string;
  categoryFilterLabel?: string;
  categoryFilterViewAllLabel?: string;
  categoryProductsHeadingTemplate?: string;
  categoryProductsEmptyMessage?: string;
  categoryAuthorityHeadingTemplate?: string;
  categorySupportingHeading?: string;
  categorySupportingDescription?: string;
  categorySupportingEmptyMessage?: string;
  categoryCrossLinksHeading?: string;
  categoryCrossLinksDescription?: string;
  categoryCrossLinksEmptyMessage?: string;
  categoryBestsellersEyebrow?: string;
  categoryBestsellersHeading?: string;
  categoryBestsellersDescription?: string;
  categoryBestsellersViewAllLabel?: string;
  categoryBrowseAllLabel?: string;
  categoryBreadcrumbCategoriesLabel?: string;
  categoryFilterLoadingMessage?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type ProductVariant = {
  name?: string;
  sku?: string;
  flavor?: string;
  packSize?: string;
  price?: number;
  compareAtPrice?: number;
  puffCount?: number;
  nicotinePercent?: number;
  stockQty?: number;
  isDefault?: boolean;
  isActive?: boolean;
};

export type BrandLite = {
  name?: string;
  slug?: Slug;
};

export type CategoryLite = {
  name?: string;
  slug?: Slug;
  group?: "Nicotine" | "THC" | "CBD" | "THCA";
};

export type ProductSpecs = {
  battery?: string;
  batteryLife?: string;
  chargingType?: string;
  chargingTime?: string;
  fillVolume?: string;
  dimensions?: string;
  weight?: string;
  material?: string;
  warranty?: string;
  certifications?: string;
};

export type ProductShippingInfo = {
  timeline?: string;
  pactCompliance?: string;
  statesCovered?: string;
};

export type Product = SanityDocumentBase & {
  _type: "product";
  name: string;
  slug: Slug;
  images?: SanityImage[];
  shortDescription?: string;
  description?: unknown[];
  variants?: ProductVariant[];
  category?: SanityReference | CategoryLite;
  brand?: SanityReference | BrandLite;
  productType?: "Disposable" | "Cartridge" | "Pod";
  categoryGroup?: "Nicotine" | "THC" | "CBD" | "THCA";
  specs?: ProductSpecs;
  shippingInfo?: ProductShippingInfo;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  puffCount?: number;
  nicotinePercent?: number;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type Testimonial = SanityDocumentBase & {
  _type: "testimonial";
  name: string;
  role?: string;
  location?: string;
  quote?: string;
  rating?: number;
  image?: SanityImage;
  contextImage?: SanityImage;
  placements?: Array<"homepage" | "wholesale">;
  sortOrder?: number;
  isActive?: boolean;
};

export type FAQItem = SanityDocumentBase & {
  _type: "faqItem";
  question: string;
  answer?: unknown[];
  category?:
    | "General"
    | "Ordering"
    | "Shipping"
    | "Payment"
    | "Products"
    | "Compliance"
    | "Nicotine"
    | "CBD"
    | "THC"
    | "THCA"
    | "THC Carts";
  productCategories?: Array<{
    _id: string;
    name?: string;
    slug?: Slug;
  }>;
  ctaLabel?: string;
  ctaHref?: string;
  order?: number;
  isActive?: boolean;
};

export type SupportingPageParent = {
  _id: string;
  _type: "homePage" | "wholesalePage" | "category";
  title?: string;
  slug?: Slug;
};

export type SupportingPageLink = {
  _id: string;
  title?: string;
  slug?: Slug;
};

export type SupportingPageFaq = {
  question: string;
  answer: string;
};

export type SupportingPage = SanityDocumentBase & {
  _type: "supportingPage";
  title: string;
  slug: Slug;
  heroImage?: SanityImage;
  exactKeyword?: string;
  subH1?: string;
  supportingTerm?: string;
  metaTitle?: string;
  metaDescription?: string;
  introParagraphs?: string[];
  aboveFoldDeepContent?: unknown[];
  keywordVariations?: string[];
  pageFaqs?: SupportingPageFaq[];
  heroParagraph?: string;
  h2Heading?: string;
  h2Paragraphs?: unknown[];
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  whyChooseUsHeading?: string;
  whyChooseUsPoints?: string[];
  categoriesHeading?: string;
  otherCategoriesHeading?: string;
  parentPage?: SupportingPageParent;
  _parentRef?: string;
  /** Set by GROQ when parentPage is undefined in Sanity. */
  _hasEmptyParent?: boolean;
  body?: unknown[];
  relatedProducts?: Product[];
  categories?: Array<{
    _id: string;
    name?: string;
    slug?: Slug;
    shortDescription?: string;
    image?: SanityImage;
  }>;
  siblingLinks?: SupportingPageLink[];
  seoDescription?: string;
};

export type ProgrammaticPage = SanityDocumentBase & {
  _type: "programmaticPage";
  locationName: string;
  slug: Slug;
  stateCode: string;
  heroImage?: SanityImage;
  category: {
    _id: string;
    name?: string;
    slug?: Slug;
    group?: string;
  };
  body?: unknown[];
  customIntro?: unknown[];
  seoDescription?: string;
};

export type BlogPost = SanityDocumentBase & {
  _type: "blogPost";
  title: string;
  slug: Slug;
  excerpt?: string;
  category?: CategoryLite;
  author?: {
    name?: string;
    slug?: Slug;
    role?: string;
    bio?: string;
    image?: SanityImage;
  };
  heroImage?: SanityImage;
  body?: unknown[];
  relatedPosts?: Array<{
    _id: string;
    title?: string;
    slug?: Slug;
    heroImage?: SanityImage;
    publishedAt?: string;
  }>;
  estimatedReadMinutes?: number;
  isActive?: boolean;
  featured?: boolean;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
};

export type SiteSettings = SanityDocumentBase & {
  _type: "siteSettings";
  announcementBar?: string;
  announcementHref?: string;
  footerWarningText?: string;
  footerComplianceText?: string;
  homepageBadge?: string;
  homepageHeading?: string;
  homepageSubheading?: string;
  homepageNextStepTitle?: string;
  homepageNextStepDescription?: string;
};

export type HomeTrustItemDoc = {
  _key?: string;
  title?: string;
  accent?: "cyan" | "purple";
  iconKey?: string;
};

export type HomeAuthorityPointDoc = {
  _key?: string;
  title?: string;
  description?: string;
  iconKey?: string;
};

export type HomeHowToStepDoc = {
  _key?: string;
  title?: string;
  description?: string;
  iconKey?: string;
};

export type HomePage = SanityDocumentBase & {
  _type: "homePage";
  featuredCategories?: Category[];
  featuredBrands?: Brand[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  heroBadge?: string;
  heroHeading?: string;
  heroSubheading?: string;
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaHref?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaHref?: string;
  trustStripItems?: HomeTrustItemDoc[];
  categoriesEyebrow?: string;
  categoriesHeading?: string;
  categoriesDescription?: string;
  categoriesEmptyMessage?: string;
  authorityEyebrow?: string;
  authorityHeading?: string;
  authorityIntro?: string;
  authorityPoints?: HomeAuthorityPointDoc[];
  authorityCtaLabel?: string;
  authorityCtaHref?: string;
  authorityImageAlt?: string;
  cryptoEyebrow?: string;
  cryptoHeading?: string;
  cryptoDescription?: string;
  cryptoCtaLabel?: string;
  cryptoCtaHref?: string;
  deliveryEyebrow?: string;
  deliveryHeading?: string;
  deliveryDescription?: string;
  deliveryCtaLabel?: string;
  deliveryCtaHref?: string;
  howToBadge?: string;
  howToHeading?: string;
  howToIntro?: string;
  howToSteps?: HomeHowToStepDoc[];
  howToCtaLabel?: string;
  howToCtaHref?: string;
  wholesaleMidEyebrow?: string;
  wholesaleMidHeading?: string;
  wholesaleMidDescription?: string;
  wholesaleMidCtaLabel?: string;
  wholesaleMidCtaHref?: string;
  brandsEyebrow?: string;
  brandsHeading?: string;
  brandsEmptyMessage?: string;
  blogEyebrow?: string;
  blogHeading?: string;
  blogDescription?: string;
  blogEmptyMessage?: string;
  blogViewAllLabel?: string;
  testimonialsBadge?: string;
  testimonialsHeading?: string;
  testimonialsIntro?: string;
  faqEyebrow?: string;
  faqHeading?: string;
  faqDescription?: string;
  faqViewAllLabel?: string;
  complianceShopCtaLabel?: string;
  complianceShopCtaHref?: string;
  complianceContactCtaLabel?: string;
  complianceContactCtaHref?: string;
  complianceDisclaimerPlain?: string;
};

export type ShopPage = SanityDocumentBase & {
  _type: "shopPage";
  brands?: string[];
  categories?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  puffRange?: {
    min?: number;
    max?: number;
  };
  types?: string[];
};

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  ordered?: string[];
};

export type WholesaleBenefitDoc = {
  title?: string;
  description?: string;
  iconKey?: string;
};

export type WholesaleStepDoc = {
  title?: string;
  description?: string;
  iconKey?: string;
};

export type WholesaleVolumeTierDoc = {
  tier?: string;
  note?: string;
};

export type WholesaleTestimonialDoc = {
  quote?: string;
  name?: string;
  role?: string;
  location?: string;
  rating?: number;
};

export type WholesaleFaqDoc = {
  question?: string;
  answer?: string;
};

export type WholesaleRequestPageDoc = {
  badge?: string;
  heading?: string;
  intro?: string;
  thankYouHeading?: string;
  thankYouIntro?: string;
  thankYouNextStepsTitle?: string;
  thankYouUrgentHelpTitle?: string;
  thankYouUrgentHelpBody?: string;
  supportEmail?: string;
};

export type WholesalePageDoc = SanityDocumentBase & {
  _type: "wholesalePage";
  seoTitle?: string;
  seoDescription?: string;
  heroBadge?: string;
  heroHeading?: string;
  heroSecondaryHeading?: string;
  heroSubhead?: string;
  heroTrustLine1?: string;
  heroTrustLine2?: string;
  whyHeading?: string;
  whyIntro?: string;
  benefits?: WholesaleBenefitDoc[];
  howHeading?: string;
  howIntro?: string;
  steps?: WholesaleStepDoc[];
  discountHeading?: string;
  discountIntro?: string;
  paymentCardTitle?: string;
  paymentCardDescription?: string;
  cryptoRowLabel?: string;
  cryptoDiscountLabel?: string;
  revolutRowLabel?: string;
  revolutDiscountLabel?: string;
  volumeCardTitle?: string;
  volumeCardDescription?: string;
  volumeTiers?: WholesaleVolumeTierDoc[];
  discountSeeAlso?: string;
  formHeading?: string;
  formIntro?: string;
  wholesaleRequestPage?: WholesaleRequestPageDoc;
  testimonialsHeading?: string;
  testimonialsIntro?: string;
  faqHeading?: string;
  faqIntro?: string;
  faqs?: WholesaleFaqDoc[];
};

export type ShippingPageDoc = SanityDocumentBase & {
  _type: "shippingPage";
  title?: string;
  description?: string;
  lastUpdated?: string;
  sections?: LegalSection[];
};

export type CompliancePageDoc = SanityDocumentBase & {
  _type: "compliancePage";
  title?: string;
  description?: string;
  lastUpdated?: string;
  sections?: LegalSection[];
};

export type MoqPageDoc = SanityDocumentBase & {
  _type: "moqPage";
  title?: string;
  description?: string;
  heroTitle?: string;
  heroIntro?: string;
  lastUpdated?: string;
  moqExamples?: Array<{
    title?: string;
    totalBadge?: string;
    description?: string;
  }>;
  sections?: LegalSection[];
};

export type LocationsPageDoc = SanityDocumentBase & {
  _type: "locationsPage";
  title?: string;
  description?: string;
  heroTitle?: string;
  heroIntro?: string;
  lastUpdated?: string;
  mapEmbedUrl?: string;
  usStates?: string[];
  internationalCoverage?: Array<{
    title?: string;
    details?: string;
  }>;
  complianceNotes?: Array<{
    region?: string;
    note?: string;
  }>;
  sections?: LegalSection[];
};

export type AboutStatDoc = {
  value?: string;
  label?: string;
};

export type AboutCompliancePointDoc = {
  title?: string;
  description?: string;
};

export type ContactSubjectOptionDoc = {
  value?: string;
  label?: string;
};

export type ContactPageDoc = SanityDocumentBase & {
  _type: "contactPage";
  seoTitle?: string;
  seoDescription?: string;
  pageHeading?: string;
  introLead?: string;
  formHeading?: string;
  formIntro?: string;
  nameFieldLabel?: string;
  emailFieldLabel?: string;
  subjectFieldLabel?: string;
  messageFieldLabel?: string;
  submitButtonLabel?: string;
  subjectOptions?: ContactSubjectOptionDoc[];
  successTitle?: string;
  successMessage?: string;
  detailsHeading?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessHours?: string;
  responsePromise?: string;
  paymentsNote?: string;
};

export type AboutPageDoc = SanityDocumentBase & {
  _type: "aboutPage";
  seoTitle?: string;
  seoDescription?: string;
  pageHeading?: string;
  introLead?: string;
  storyHeading?: string;
  storyBody?: unknown[];
  storyImage?: SanityImage;
  missionHeading?: string;
  missionBody?: unknown[];
  teamHeading?: string;
  teamBody?: unknown[];
  stats?: AboutStatDoc[];
  complianceHeading?: string;
  complianceIntro?: string;
  compliancePoints?: AboutCompliancePointDoc[];
  ctaLabel?: string;
  ctaHref?: string;
};

export type LegalContent = SanityDocumentBase & {
  _type: "legalContent";
  supportEmail?: string;
  pactActNotice?: string;
  nicotineWarning?: string;
  thcWarning?: string;
  fdaDisclaimer?: string;
  privacyTitle?: string;
  privacyDescription?: string;
  privacyLastUpdated?: string;
  privacySections?: LegalSection[];
  termsTitle?: string;
  termsDescription?: string;
  termsLastUpdated?: string;
  termsSections?: LegalSection[];
  refundsTitle?: string;
  refundsDescription?: string;
  refundsLastUpdated?: string;
  refundsSections?: LegalSection[];
  agePolicyTitle?: string;
  agePolicyDescription?: string;
  agePolicyLastUpdated?: string;
  agePolicySections?: LegalSection[];
};
