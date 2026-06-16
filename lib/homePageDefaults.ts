import type {
  HomeAuthorityPointDoc,
  HomeHowToStepDoc,
  HomePage,
  HomeTrustItemDoc,
} from "@/types/sanity";

/** When present in `authorityIntro`, splits copy around the block heading: lead → H2 (`authorityHeading`) → tail. */
export const HOME_AUTHORITY_INTRO_H2_MARKER = "\n\n[[H2]]\n\n";
/** Optional trailing section rendered after authority points (e.g. shipping acceleration copy). */
export const HOME_AUTHORITY_INTRO_OUTRO_MARKER = "\n\n[[OUTRO]]\n\n";

const DEFAULT_SEO = {
  title: "Bulk THC Vapes & Wholesale 510 Carts | THCPensBulk",
  description:
    "Licensed B2B distributor of bulk THC vapes and wholesale 510 cartridges. Fast USA & worldwide delivery, COA-verified stock, minimum 50 units. Request a wholesale quote today.",
  keywords: [
    "bulk thc vapes",
    "wholesale 510 carts",
    "thc vape wholesale",
    "510 cartridge bulk",
    "thc pens bulk",
    "disposable thc vapes wholesale",
    "thc cartridge distributor",
  ],
};

export type ResolvedHomeHero = {
  badge: string;
  heading: string;
  subheading: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  backgroundImageUrl?: string;
  backgroundImageAlt?: string;
};

export type ResolvedTrustStripItem = {
  title: string;
  accent: "cyan" | "purple";
  iconKey: string;
};

export type ResolvedAuthorityPoint = {
  title: string;
  description: string;
  iconKey: string;
};

export type ResolvedHowToStep = {
  title: string;
  description: string;
  iconKey: string;
};

export type ResolvedHomePageContent = {
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  hero: ResolvedHomeHero;
  trustStrip: ResolvedTrustStripItem[];
  categories: {
    eyebrow: string;
    heading: string;
    description: string;
    emptyMessage: string;
  };
  authority: {
    eyebrow: string;
    heading: string;
    intro: string;
    points: ResolvedAuthorityPoint[];
    ctaLabel: string;
    ctaHref: string;
    imageAlt: string;
  };
  crypto: {
    eyebrow: string;
    heading: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  delivery: {
    eyebrow: string;
    heading: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  howTo: {
    badge: string;
    heading: string;
    intro?: string;
    steps: ResolvedHowToStep[];
    ctaLabel: string;
    ctaHref: string;
  };
  wholesaleMid: {
    eyebrow: string;
    heading: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  brands: {
    eyebrow: string;
    heading: string;
    emptyMessage: string;
  };
  blog: {
    eyebrow: string;
    heading: string;
    description: string;
    emptyMessage: string;
    viewAllLabel: string;
  };
  testimonials: {
    badge: string;
    heading: string;
    intro: string;
  };
  faq: {
    eyebrow: string;
    heading: string;
    description: string;
    viewAllLabel: string;
  };
  compliance: {
    shopCtaLabel: string;
    shopCtaHref: string;
    contactCtaLabel: string;
    contactCtaHref: string;
    disclaimerPlain?: string;
  };
};

const DEFAULT_HERO: ResolvedHomeHero = {
  badge: "THCPensBulk",
  heading: "Bulk THC Vapes and Wholesale 510 Vape Carts — Licensed B2B Distributor",
  subheading:
    "COA-Verified THC Disposables & 510 Cartridges at Wholesale Prices. Fast 48-Hour Tracked Delivery Across the USA, UK & Worldwide.",
  primaryCtaLabel: "Browse Products",
  primaryCtaHref: "/products",
  secondaryCtaLabel: "Request a Quote",
  secondaryCtaHref: "/wholesale",
};

const DEFAULT_TRUST: ResolvedTrustStripItem[] = [
  { title: "Fast USA & Worldwide Delivery", accent: "cyan", iconKey: "truck" },
  { title: "COA-Verified Authentic Stock", accent: "purple", iconKey: "badgeCheck" },
  { title: "Licensed B2B Distributor", accent: "cyan", iconKey: "shieldCheck" },
  { title: "50-Unit Minimum Orders", accent: "purple", iconKey: "calendarCheck2" },
  { title: "Dedicated Wholesale Support", accent: "cyan", iconKey: "headset" },
];

const DEFAULT_AUTHORITY: ResolvedAuthorityPoint[] = [
  {
    title: "COA-Verified Inventory",
    description:
      "Every batch of **bulk THC vapes** and **wholesale 510 cartridges** in our catalog ships with a Certificate of Analysis. Retailers and dispensaries can order with confidence knowing our stock meets potency and purity standards.",
    iconKey: "badgeCheck",
  },
  {
    title: "Competitive Wholesale Pricing",
    description:
      "Our **THC vape wholesale** pricing tiers are built for businesses—the more you order, the lower your per-unit cost. Volume discounts apply from 50 units, with deeper breaks at 200 and 500+ units.",
    iconKey: "walletCards",
  },
  {
    title: "Broad Product Range",
    description:
      "From **disposable THC vape pens** to **510-thread cartridges** and hardware batteries, we carry the full lineup your customers demand. New SKUs added monthly from vetted extract labs.",
    iconKey: "shieldCheck",
  },
];

const DEFAULT_HOW_TO: ResolvedHowToStep[] = [
  {
    title: "Browse the Catalog",
    description: "Explore bulk THC disposables and 510 cartridges by strain, potency, and format.",
    iconKey: "search",
  },
  {
    title: "Request a Quote",
    description: "Submit your SKU and quantity requirements through our wholesale inquiry form.",
    iconKey: "send",
  },
  {
    title: "Order Confirmed",
    description: "Receive a proforma invoice with COA documentation within one business day.",
    iconKey: "mail",
  },
  {
    title: "Fast Tracked Delivery",
    description: "Discreet, tracked shipments dispatched within 48 hours to USA, UK and worldwide.",
    iconKey: "packageCheck",
  },
];

function isTrustItemComplete(item: HomeTrustItemDoc): item is HomeTrustItemDoc & {
  title: string;
  accent: "cyan" | "purple";
  iconKey: string;
} {
  const accent = item.accent;
  return (
    typeof item.title === "string" &&
    item.title.trim().length > 0 &&
    (accent === "cyan" || accent === "purple") &&
    typeof item.iconKey === "string" &&
    item.iconKey.length > 0
  );
}

function isAuthorityPointComplete(item: HomeAuthorityPointDoc): item is HomeAuthorityPointDoc & {
  title: string;
  description: string;
  iconKey: string;
} {
  return (
    typeof item.title === "string" &&
    item.title.trim().length > 0 &&
    typeof item.description === "string" &&
    item.description.trim().length > 0 &&
    typeof item.iconKey === "string" &&
    item.iconKey.length > 0
  );
}

function isHowToStepComplete(item: HomeHowToStepDoc): item is HomeHowToStepDoc & {
  title: string;
  description: string;
  iconKey: string;
} {
  return (
    typeof item.title === "string" &&
    item.title.trim().length > 0 &&
    typeof item.description === "string" &&
    item.description.trim().length > 0 &&
    typeof item.iconKey === "string" &&
    item.iconKey.length > 0
  );
}

export function resolveHomePageContent(home: HomePage | null): ResolvedHomePageContent {
  const trustFromCms = home?.trustStripItems?.filter(isTrustItemComplete) ?? [];
  const trustStrip = trustFromCms.length >= 3 ? trustFromCms : DEFAULT_TRUST;

  const authorityFromCms = home?.authorityPoints?.filter(isAuthorityPointComplete) ?? [];
  const authorityPoints = authorityFromCms.length >= 2 ? authorityFromCms : DEFAULT_AUTHORITY;

  const howFromCms = home?.howToSteps?.filter(isHowToStepComplete) ?? [];
  const howToSteps = howFromCms.length >= 2 ? howFromCms : DEFAULT_HOW_TO;

  const keywords =
    Array.isArray(home?.seoKeywords) && home.seoKeywords.length > 0
      ? home.seoKeywords.filter((k): k is string => typeof k === "string" && k.trim().length > 0)
      : DEFAULT_SEO.keywords;

  return {
    seo: {
      title: home?.seoTitle?.trim() || DEFAULT_SEO.title,
      description: home?.seoDescription?.trim() || DEFAULT_SEO.description,
      keywords,
    },
    hero: {
      badge: home?.heroBadge?.trim() || DEFAULT_HERO.badge,
      heading: home?.heroHeading?.trim() || DEFAULT_HERO.heading,
      subheading: home?.heroSubheading?.trim() || DEFAULT_HERO.subheading,
      primaryCtaLabel: home?.heroPrimaryCtaLabel?.trim() || DEFAULT_HERO.primaryCtaLabel,
      primaryCtaHref: home?.heroPrimaryCtaHref?.trim() || DEFAULT_HERO.primaryCtaHref,
      secondaryCtaLabel: home?.heroSecondaryCtaLabel?.trim() || DEFAULT_HERO.secondaryCtaLabel,
      secondaryCtaHref: home?.heroSecondaryCtaHref?.trim() || DEFAULT_HERO.secondaryCtaHref,
    },
    trustStrip,
    categories: {
      eyebrow: home?.categoriesEyebrow?.trim() || "Shop By Product Type",
      heading: home?.categoriesHeading?.trim() || "Shop by Category",
      description:
        home?.categoriesDescription?.trim() ||
        "Explore our full range of bulk THC disposables and wholesale 510 cartridges, available in multiple strains and potencies.",
      emptyMessage: home?.categoriesEmptyMessage?.trim() || "No homepage categories configured yet.",
    },
    authority: {
      eyebrow: home?.authorityEyebrow?.trim() || "Licensed B2B THC Vape Distributor",
      heading:
        home?.authorityHeading?.trim() ||
        "Bulk THC Vapes for Sale: Wholesale 510 Carts & Disposables for Retailers",
      intro:
        home?.authorityIntro?.trim() ||
        (() => {
          const lead =
            "**Bulk THC vapes** are one of the fastest-growing product categories in licensed cannabis retail, and at THCPensBulk we make it straightforward for dispensaries, smoke shops, and online retailers to source authentic, COA-verified inventory at true wholesale prices. As a dedicated B2B distributor, we stock a curated range of **disposable THC vape pens** and **wholesale 510 cartridges** from vetted extract labs, with a minimum order of just 50 units and volume price breaks that scale with your business.";
          const tail = [
            "For retailers sourcing **THC vape wholesale**, product authenticity and documentation are non-negotiable. Every SKU in our catalog ships with a Certificate of Analysis (COA) from an accredited third-party lab, verifying potency and residual solvents. Our supply chain is direct-from-lab, meaning you receive the same verified product your customers expect to see on licensed shelves.",
            "For wholesale partners who need to move volume, we offer tiered pricing, flexible payment options including crypto discounts, and a dedicated account manager. Whether you operate a single storefront or manage a multi-location distribution network, our infrastructure is built to keep your supply chain uninterrupted.",
            "Our catalog spans the most in-demand formats your customers are looking for:",
          ].join("\n\n");
          const outro = [
            "**Fast Tracked Shipping Across the USA, UK & Worldwide**",
            "We understand that stockouts cost you sales. Our fulfillment network is engineered for speed: orders confirmed before our daily cutoff are packaged and handed to shipping partners within hours, with 48-hour tracked delivery as standard.",
            "Domestic USA shipments qualify for priority dispatch. International wholesale orders to the UK, Europe, and worldwide ship via tracked courier with full insurance on every consignment.",
          ].join("\n\n");
          return `${lead}${HOME_AUTHORITY_INTRO_H2_MARKER}${tail}${HOME_AUTHORITY_INTRO_OUTRO_MARKER}${outro}`;
        })(),
      points: authorityPoints,
      ctaLabel: home?.authorityCtaLabel?.trim() || "Open wholesale catalog",
      ctaHref: home?.authorityCtaHref?.trim() || "/products",
      imageAlt:
        home?.authorityImageAlt?.trim() ||
        "THCPensBulk warehouse — COA-verified bulk THC vapes and 510 cartridges ready for dispatch",
    },
    crypto: {
      eyebrow: home?.cryptoEyebrow?.trim() || "Payment Incentives",
      heading: home?.cryptoHeading?.trim() || "Pay with Crypto - Get 10% Off Instantly",
      description:
        home?.cryptoDescription?.trim() ||
        "We accept BTC, ETH, and USDT for a 10% discount on qualified orders. Prefer Revolut? Receive 5% off with fast invoice turnaround.",
      ctaLabel: home?.cryptoCtaLabel?.trim() || "How It Works",
      ctaHref: home?.cryptoCtaHref?.trim() || "/how-to-buy",
    },
    delivery: {
      eyebrow: home?.deliveryEyebrow?.trim() || "Rapid Fulfilment",
      heading: home?.deliveryHeading?.trim() || "Fast Tracked Delivery — USA, UK & Worldwide",
      description:
        home?.deliveryDescription?.trim() ||
        "Place your wholesale order before our daily cutoff and your shipment is packaged and handed to our shipping partners within hours, with priority dispatch available for commercial buyers.",
      ctaLabel: home?.deliveryCtaLabel?.trim() || "Shipping & Delivery",
      ctaHref: home?.deliveryCtaHref?.trim() || "/shipping",
    },
    howTo: {
      badge: home?.howToBadge?.trim() || "Simple Process",
      heading: home?.howToHeading?.trim() || "How to Order",
      intro: home?.howToIntro?.trim() || undefined,
      steps: howToSteps,
      ctaLabel: home?.howToCtaLabel?.trim() || "Start Your Order",
      ctaHref: home?.howToCtaHref?.trim() || "/wholesale-request",
    },
    wholesaleMid: {
      eyebrow: home?.wholesaleMidEyebrow?.trim() || "Wholesale Partners",
      heading: home?.wholesaleMidHeading?.trim() || "Built for Cannabis Retailers Scaling Fast",
      description:
        home?.wholesaleMidDescription?.trim() ||
        "Join our B2B wholesale programme for COA-verified THC vape inventory, deep volume discounts, and priority dispatch to the USA, UK and worldwide.",
      ctaLabel: home?.wholesaleMidCtaLabel?.trim() || "Apply for Wholesale",
      ctaHref: home?.wholesaleMidCtaHref?.trim() || "/wholesale",
    },
    brands: {
      eyebrow: home?.brandsEyebrow?.trim() || "Brand Partners",
      heading: home?.brandsHeading?.trim() || "Brands We Carry",
      emptyMessage: home?.brandsEmptyMessage?.trim() || "No homepage brands configured yet.",
    },
    blog: {
      eyebrow: home?.blogEyebrow?.trim() || "Latest Insights",
      heading: home?.blogHeading?.trim() || "From the Blog",
      description:
        home?.blogDescription?.trim() ||
        "THC vape industry news, compliance guides, strain deep-dives, and wholesale buying tips for cannabis retailers.",
      emptyMessage:
        home?.blogEmptyMessage?.trim() || "Blog posts will appear here once published in Sanity.",
      viewAllLabel: home?.blogViewAllLabel?.trim() || "View All Posts",
    },
    testimonials: {
      badge: home?.testimonialsBadge?.trim() || "Trusted by Buyers",
      heading: home?.testimonialsHeading?.trim() || "Trusted by Thousands",
      intro:
        home?.testimonialsIntro?.trim() ||
        "Real feedback from dispensaries, smoke shops, and wholesale partners sourcing bulk THC vapes from THCPensBulk.",
    },
    faq: {
      eyebrow: home?.faqEyebrow?.trim() || "Related FAQs",
      heading: home?.faqHeading?.trim() || "COA verification, product formats, bulk pricing & delivery",
      description:
        home?.faqDescription?.trim() ||
        "Straight answers on sourcing authentic THC vapes, available formats and potencies, B2B wholesale ordering, and our tracked USA & worldwide shipping.",
      viewAllLabel: home?.faqViewAllLabel?.trim() || "View full FAQ page",
    },
    compliance: {
      shopCtaLabel: home?.complianceShopCtaLabel?.trim() || "Visit Shop",
      shopCtaHref: home?.complianceShopCtaHref?.trim() || "/products",
      contactCtaLabel: home?.complianceContactCtaLabel?.trim() || "Contact Sales Manager",
      contactCtaHref: home?.complianceContactCtaHref?.trim() || "/contact",
      disclaimerPlain: home?.complianceDisclaimerPlain?.trim() || undefined,
    },
  };
}
