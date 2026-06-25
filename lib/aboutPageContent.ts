import type { PortableTextBlock } from "@/components/blog/BlogBody";
import type { AboutCompliancePointDoc, AboutPageDoc, AboutStatDoc, SanityImage } from "@/types/sanity";

const fallbackStoryBody: PortableTextBlock[] = [
  {
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        text: "Founded by an elite collective of veteran organic chemists and international logistics experts, Steroids Supplies was built to solve a critical market vulnerability: the complete lack of verifiable purity and delivery transparency in the performance supplement industry. We maintain state-of-the-art laboratory facilities utilizing HPLC testing protocols to guarantee every compound meets exact pharmaceutical standards.",
      },
    ],
  },
  {
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        text: "We do not believe performance enhancers should be sourced through unverified avenues. Our operation spans the entire globe, seamlessly servicing both individual retail consumers and high-volume commercial wholesale distribution networks. By maintaining absolute control over our manufacturing, storage, and discrete global shipping routes, we provide our clients with the fastest, safest, and most cost-effective path to acquiring premium performance gear on the market today.",
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
        text: "Every batch of performance compounds we distribute is stored in dedicated fulfillment centers equipped with advanced climate controls to preserve compound integrity, guarantee shelf life, and maintain pharmaceutical-grade quality standards.",
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
  seoTitle: "About Steroids Supplies | Certified Performance Logistics",
  seoDescription:
    "Read the history and operational standards of Steroids Supplies. We provide premium-grade performance compounds to retail and wholesale markets globally.",
  pageHeading: "About Steroids Supplies – Redefining Anabolic Quality Standards",
  introLead:
    "The technology, chemistry, and international logistics driving our premium performance distribution network.",
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
