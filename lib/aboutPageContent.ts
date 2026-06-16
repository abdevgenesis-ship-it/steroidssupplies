import type { PortableTextBlock } from "@/components/blog/BlogBody";
import type { AboutCompliancePointDoc, AboutPageDoc, AboutStatDoc, SanityImage } from "@/types/sanity";

const fallbackStoryBody: PortableTextBlock[] = [
  {
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        text: "The cannabis retail market moves at a pace that most regional supply chains can't match. When demand for new THC vape formats—disposables, live resin carts, THCA hardware—surges, dispensaries and smoke shops are left waiting weeks for back-ordered stock. THCPensBulk was founded to eliminate that bottleneck.",
      },
    ],
  },
  {
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        text: "Between exorbitant transatlantic freight costs, surprise customs duties, and multi-week delivery delays, accessing elite health products has been an expensive, unpredictable hurdle.",
      },
    ],
  },
  {
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        text: "Our platform was established to dismantle that hurdle permanently. We operate as a premier, dedicated domestic import and distribution network. By taking on the complex operational burdens of international freight sourcing, structural customs clearance, and regulatory compliance, we bridge the gap between premium global wellness manufacturers and the European market.",
      },
    ],
  },
];

const fallbackMissionBody: PortableTextBlock[] = [
  {
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        text: "We don't operate as a standard middleman broker or a drop-shipping portal. We maintain concrete, end-to-end control over our product pipeline to offer a completely unified supply solution:",
      },
    ],
  },
  {
    _type: "block",
    style: "h3",
    markDefs: [],
    children: [
      {
        text: "Climate-Controlled Storage",
      },
    ],
  },
  {
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        text: "Every batch of THC vapes and 510 cartridges we distribute is stored in domestic fulfillment centers equipped with advanced climate controls to preserve product integrity, guarantee shelf life, and maintain hardware quality standards.",
      },
    ],
  },
  {
    _type: "block",
    style: "h3",
    markDefs: [],
    children: [
      {
        text: "A Dual-Channel Fulfilment Engine",
      },
    ],
  },
  {
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        text: "Our ecosystem is engineered to support both individual consumers looking for single-jar retail orders and enterprise stockists requiring scalable, high-volume B2B wholesale supply.",
      },
    ],
  },
  {
    _type: "block",
    style: "h3",
    markDefs: [],
    children: [
      {
        text: "Immediate 48-Hour Despatch",
      },
    ],
  },
  {
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        text: "By positioning all our inventory within central domestic hubs, we completely eliminate international customs queues, guaranteeing that every retail and commercial package arrives securely at its destination door within 48 hours.",
      },
    ],
  },
];

export const ABOUT_PAGE_FALLBACK = {
  seoTitle: "About THCPensBulk — Licensed B2B THC Vape Wholesale Distributor",
  seoDescription:
    "Learn how THCPensBulk became a trusted B2B wholesale distributor of bulk THC vapes and 510 cartridges for dispensaries and retailers across the USA, UK and worldwide.",
  pageHeading: "About THCPensBulk: Building a Better THC Vape Supply Chain",
  introLead:
    "COA-Verified THC Vape Inventory, Wholesale Pricing, and Fast Global Delivery for Cannabis Retailers and Dispensaries",
  storyHeading: "Our Foundational Mission",
  storyBody: fallbackStoryBody,
  missionHeading: "What Sets Our Distribution Infrastructure Apart",
  missionBody: fallbackMissionBody,
  teamHeading: "Team & Operations",
  teamBody: [] as PortableTextBlock[],
  stats: [
    { value: "10K+", label: "Customers" },
    { value: "48H", label: "Delivery" },
    { value: "UK & IE", label: "Coverage" },
    { value: "24", label: "MOQ Units" },
  ],
  complianceHeading: "Our Core Commitments",
  complianceIntro: "",
  compliancePoints: [
    {
      title: "Uncompromising Brand Authenticity",
      description:
        "Every single container shipped across our platform features its original factory tamper-evident security seal, accurate batch numbers, and verifiable laboratory verification data. We maintain a zero-tolerance policy against grey-market alternatives.",
    },
    {
      title: "Absolute Price Transparency",
      description:
        "We leverage massive bulk-purchasing power directly at the manufacturer level, allowing us to absorb massive shipping tariffs and pass maximum cost savings directly down to our consumer budgets and B2B trade partners.",
    },
  ],
  ctaLabel: "Start Your Wholesale Order →",
  ctaHref: "/wholesale-request",
};

export type ResolvedAboutPage = {
  storyImage?: SanityImage | null;
  showTeamSection: boolean;
  seoTitle: string;
  seoDescription: string;
  pageHeading: string;
  introLead: string;
  storyHeading: string;
  storyBody: PortableTextBlock[];
  missionHeading: string;
  missionBody: PortableTextBlock[];
  teamHeading: string;
  teamBody: PortableTextBlock[];
  stats: Array<{ value: string; label: string }>;
  complianceHeading: string;
  complianceIntro: string;
  compliancePoints: Array<{ title: string; description: string }>;
  ctaLabel: string;
  ctaHref: string;
};

function normalizeStats(stats: AboutStatDoc[] | undefined): Array<{ value: string; label: string }> {
  if (!stats?.length) {
    return ABOUT_PAGE_FALLBACK.stats;
  }

  const cleaned = stats
    .map((s) => ({
      value: s.value?.trim(),
      label: s.label?.trim(),
    }))
    .filter((s): s is { value: string; label: string } => Boolean(s.value && s.label));

  return cleaned.length > 0 ? cleaned : ABOUT_PAGE_FALLBACK.stats;
}

function normalizeCompliance(
  points: AboutCompliancePointDoc[] | undefined,
): Array<{ title: string; description: string }> {
  if (!points?.length) {
    return ABOUT_PAGE_FALLBACK.compliancePoints;
  }

  const cleaned = points
    .map((p) => ({
      title: p.title?.trim(),
      description: p.description?.trim(),
    }))
    .filter((p): p is { title: string; description: string } => Boolean(p.title && p.description));

  return cleaned.length > 0 ? cleaned : ABOUT_PAGE_FALLBACK.compliancePoints;
}

export function resolveAboutPage(doc: AboutPageDoc | null): ResolvedAboutPage {
  const storyBody = (doc?.storyBody as PortableTextBlock[] | undefined)?.filter(Boolean) ?? [];
  const missionBody = (doc?.missionBody as PortableTextBlock[] | undefined)?.filter(Boolean) ?? [];
  const teamBlocks = (doc?.teamBody as PortableTextBlock[] | undefined)?.filter(Boolean) ?? [];
  const showTeamSection = teamBlocks.length > 0;
  const teamBody = teamBlocks;

  return {
    storyImage: doc?.storyImage,
    showTeamSection,
    seoTitle: doc?.seoTitle?.trim() || ABOUT_PAGE_FALLBACK.seoTitle,
    seoDescription: doc?.seoDescription?.trim() || ABOUT_PAGE_FALLBACK.seoDescription,
    pageHeading: doc?.pageHeading?.trim() || ABOUT_PAGE_FALLBACK.pageHeading,
    introLead: doc?.introLead?.trim() || ABOUT_PAGE_FALLBACK.introLead,
    storyHeading: doc?.storyHeading?.trim() || ABOUT_PAGE_FALLBACK.storyHeading,
    storyBody: storyBody.length > 0 ? storyBody : ABOUT_PAGE_FALLBACK.storyBody,
    missionHeading: doc?.missionHeading?.trim() || ABOUT_PAGE_FALLBACK.missionHeading,
    missionBody: missionBody.length > 0 ? missionBody : ABOUT_PAGE_FALLBACK.missionBody,
    teamHeading: doc?.teamHeading?.trim() || ABOUT_PAGE_FALLBACK.teamHeading,
    teamBody,
    stats: normalizeStats(doc?.stats),
    complianceHeading: doc?.complianceHeading?.trim() || ABOUT_PAGE_FALLBACK.complianceHeading,
    complianceIntro: doc?.complianceIntro?.trim() || ABOUT_PAGE_FALLBACK.complianceIntro,
    compliancePoints: normalizeCompliance(doc?.compliancePoints),
    ctaLabel: doc?.ctaLabel?.trim() || ABOUT_PAGE_FALLBACK.ctaLabel,
    ctaHref: doc?.ctaHref?.trim() || ABOUT_PAGE_FALLBACK.ctaHref,
  };
}
