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
  title: "Buy Steroids Online | Premium Anabolic Steroids For Sale UK & Global",
  description:
    "Looking to buy steroids online with guaranteed delivery? Steroids Supplies delivers certified anabolic steroids for sale. Order premium gear with lightning-fast 48h international shipping and secure checkout today.",
  keywords: [
    "buy steroids online",
    "anabolic steroids for sale",
    "steroids uk",
    "buy anavar online",
    "buy trenbolone online",
    "anabolic steroids wholesale",
    "buy steroids online uk",
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
  badge: "SteroidsSupplies",
  heading: "Buy Steroids Online from the Ultimate Global Performance Source",
  subheading:
    "Order certified anabolic steroids for sale with institutional-grade quality control and guaranteed 48-hour priority international shipping.",
  primaryCtaLabel: "Shop Anabolic Steroids",
  primaryCtaHref: "/products",
  secondaryCtaLabel: "Apply for Wholesale",
  secondaryCtaHref: "/wholesale",
};

const DEFAULT_TRUST: ResolvedTrustStripItem[] = [
  { title: "Pharmaceutical-Grade Quality", accent: "cyan", iconKey: "badgeCheck" },
  { title: "Guaranteed 48H International Delivery", accent: "purple", iconKey: "truck" },
  { title: "COA-Verified Every Batch", accent: "cyan", iconKey: "shieldCheck" },
  { title: "B2C & B2B Wholesale Supply", accent: "purple", iconKey: "calendarCheck2" },
  { title: "24/7 Priority Support", accent: "cyan", iconKey: "headset" },
];

const DEFAULT_AUTHORITY: ResolvedAuthorityPoint[] = [
  {
    title: "Institutional Quality Control",
    description:
      "Every compound is verified for exact dosing and zero heavy metals via strict third-party **HPLC analysis** — guaranteeing absolute purity, correct ester weight, and zero bacterial contamination. The same standard elite athletes and research institutions demand.",
    iconKey: "badgeCheck",
  },
  {
    title: "Competitive Wholesale Pricing",
    description:
      "Our **anabolic steroids wholesale** pricing tiers are built for commercial scale. The more you order, the lower your per-unit cost. Volume discounts apply from 50 units, with deeper breaks at 200 and 500+ units — true factory-direct margins.",
    iconKey: "walletCards",
  },
  {
    title: "Unrivaled Global Logistics",
    description:
      "Every package is discrete, **vacuum-sealed**, and backed by a 100% customs clearance guarantee. Our international logistics network converts standard shipping bottlenecks into a seamless 48-hour delivery reality to the UK, USA, Europe, and worldwide.",
    iconKey: "shieldCheck",
  },
];

const DEFAULT_HOW_TO: ResolvedHowToStep[] = [
  {
    title: "Browse the Catalog",
    description: "Explore Anavar, Trenbolone, injectables, and oral compounds by compound type, dosage, and format.",
    iconKey: "search",
  },
  {
    title: "Submit Your Order",
    description: "Add products to cart or submit a wholesale inquiry for high-volume commercial procurement.",
    iconKey: "send",
  },
  {
    title: "Invoice & Payment",
    description: "Receive a proforma invoice. Pay securely via crypto (10% off), Revolut (5% off), or bank transfer.",
    iconKey: "mail",
  },
  {
    title: "Priority Dispatch",
    description: "Orders dispatched within 48 hours globally — fully discrete vacuum-sealed packaging with tracking.",
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
      eyebrow: home?.categoriesEyebrow?.trim() || "Shop By Compound Type",
      heading: home?.categoriesHeading?.trim() || "Shop by Category",
      description:
        home?.categoriesDescription?.trim() ||
        "Explore our full range of certified anabolic steroids — oral and injectable compounds available in multiple dosages and formats.",
      emptyMessage: home?.categoriesEmptyMessage?.trim() || "No homepage categories configured yet.",
    },
    authority: {
      eyebrow: home?.authorityEyebrow?.trim() || "Certified Global Performance Supplier",
      heading:
        home?.authorityHeading?.trim() ||
        "Premium Anabolic Steroids for Sale with Guaranteed Delivery",
      intro:
        home?.authorityIntro?.trim() ||
        (() => {
          const lead =
            "When you choose to **buy anabolic steroids online** from SteroidsSupplies, you are bypassing underground black-market guesswork and tapping directly into an institutional-grade supply chain. We specialize in bringing the highest purity **anabolic steroids for sale** straight to elite athletes, bodybuilders, and wholesale buyers across the UK, USA, and worldwide. Every single batch is third-party tested, ensuring that when you order through our encrypted platform, you receive unmatched potency at the best prices on the market.";
          const tail = [
            "To safely buy steroids online, athletes must look beyond flash marketing and prioritize rigorous laboratory verification. Our retail e-commerce storefront and wholesale distribution channels are meticulously structured to provide an ultra-secure environment to **purchase anabolic steroids**. Whether you are looking for oral anabolic steroids to kickstart a lean bulk or injectable anabolic steroids for an advanced contest prep stack, our catalogue contains only the top anabolic steroids on the market.",
            "We cut out the middlemen to offer **steroids online** and global shipments at deep factory-direct discounts. Don't risk your health or money on unverified underground labs — purchase from a verified global supplier that guarantees your gear arrives safely.",
            "Our catalog spans the most in-demand compounds your cycle demands:",
          ].join("\n\n");
          const outro = [
            "**Fast Tracked Shipping Across the UK, USA & Worldwide**",
            "We understand that supply consistency is critical. Our fulfillment network is engineered for speed: orders confirmed before our daily cutoff are packaged and handed to shipping partners within hours, with 48-hour tracked delivery as standard.",
            "International wholesale orders to the UK, Europe, and worldwide ship via tracked courier with full insurance on every consignment and our 100% customs clearance guarantee.",
          ].join("\n\n");
          return `${lead}${HOME_AUTHORITY_INTRO_H2_MARKER}${tail}${HOME_AUTHORITY_INTRO_OUTRO_MARKER}${outro}`;
        })(),
      points: authorityPoints,
      ctaLabel: home?.authorityCtaLabel?.trim() || "Open performance catalog",
      ctaHref: home?.authorityCtaHref?.trim() || "/products",
      imageAlt:
        home?.authorityImageAlt?.trim() ||
        "SteroidsSupplies — COA-verified anabolic steroids and performance compounds ready for dispatch",
    },
    crypto: {
      eyebrow: home?.cryptoEyebrow?.trim() || "Payment Incentives",
      heading: home?.cryptoHeading?.trim() || "Pay with Crypto — Get 10% Off Instantly",
      description:
        home?.cryptoDescription?.trim() ||
        "We accept BTC, ETH, and USDT for a 10% discount on qualified orders. Prefer Revolut? Receive 5% off with fast invoice turnaround.",
      ctaLabel: home?.cryptoCtaLabel?.trim() || "How It Works",
      ctaHref: home?.cryptoCtaHref?.trim() || "/how-to-buy",
    },
    delivery: {
      eyebrow: home?.deliveryEyebrow?.trim() || "Rapid Fulfilment",
      heading: home?.deliveryHeading?.trim() || "Fast Tracked Delivery — UK, USA & Worldwide",
      description:
        home?.deliveryDescription?.trim() ||
        "Place your order before our daily cutoff and your shipment is packaged and handed to our shipping partners within hours. Discrete vacuum-sealed packaging with priority international dispatch available.",
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
      heading: home?.wholesaleMidHeading?.trim() || "Built for Commercial Buyers Scaling Fast",
      description:
        home?.wholesaleMidDescription?.trim() ||
        "Join our B2B wholesale programme for COA-verified anabolic steroids, deep volume discounts, and priority dispatch to the UK, USA, and worldwide.",
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
        "Anabolic steroid industry insights, compound guides, cycle protocols, and wholesale buying tips for performance buyers.",
      emptyMessage:
        home?.blogEmptyMessage?.trim() || "Blog posts will appear here once published in Sanity.",
      viewAllLabel: home?.blogViewAllLabel?.trim() || "View All Posts",
    },
    testimonials: {
      badge: home?.testimonialsBadge?.trim() || "Trusted by Buyers",
      heading: home?.testimonialsHeading?.trim() || "Trusted by Thousands",
      intro:
        home?.testimonialsIntro?.trim() ||
        "Real feedback from athletes, bodybuilders, and wholesale partners sourcing certified anabolic steroids from SteroidsSupplies.",
    },
    faq: {
      eyebrow: home?.faqEyebrow?.trim() || "Related FAQs",
      heading: home?.faqHeading?.trim() || "Quality verification, compound formats, bulk pricing & delivery",
      description:
        home?.faqDescription?.trim() ||
        "Straight answers on sourcing certified anabolic steroids, available compounds and dosages, B2B wholesale ordering, and our tracked UK & worldwide shipping.",
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
