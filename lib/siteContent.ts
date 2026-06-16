import groq from "groq";

import { fetchSanity } from "@/lib/sanityClient";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  ordered?: string[];
};

export type LegalPageContent = {
  title: string;
  description: string;
  lastUpdated?: string;
  sections: LegalSection[];
};

export type SiteContent = {
  announcement: {
    text: string;
    href: string;
  };
  footer: {
    warningText: string;
    complianceText: string;
  };
  homepage: {
    badge: string;
    heading: string;
    subheading: string;
    nextStepTitle: string;
    nextStepDescription: string;
  };
  legal: {
    supportEmail: string;
    pactActNotice: string;
    nicotineWarning: string;
    thcWarning: string;
    fdaDisclaimer: string;
    privacy: LegalPageContent;
    terms: LegalPageContent;
    refunds: LegalPageContent;
    agePolicy: LegalPageContent;
  };
};

const DEFAULT_CONTENT: SiteContent = {
  announcement: {
    text: "Fast 48-hour tracked delivery across the UK, USA & Worldwide — priority same-day dispatch available.",
    href: "/shipping",
  },
  footer: {
    warningText:
      "All products on SteroidsSupplies.co.uk are strictly for adults 18 years of age or older. Anabolic androgenic steroids are potent hormonal compounds that profoundly alter human endocrinology. Do not use if pregnant or nursing. Never administer any compound without direct medical supervision from a licensed clinical professional. Keep all compounds out of reach of children and pets.",
    complianceText:
      "STEROIDSSUPPLIES operates as a global B2C and B2B wholesale distributor of performance compounds. All materials, descriptions, and content on this domain are strictly for educational, research, and informational purposes only. The purchase, import, and possession of AAS is subject to regional and national laws. Buyers are solely responsible for ensuring compliance with all applicable laws in their jurisdiction. We assume zero legal liability for cross-border items contrary to localised laws.",
  },
  homepage: {
    badge: "SteroidsSupplies",
    heading: "Buy Steroids Online from the Ultimate Global Performance Source",
    subheading:
      "Order certified anabolic steroids for sale with institutional-grade quality control and guaranteed 48-hour priority international shipping.",
    nextStepTitle: "Shop Our Performance Catalog",
    nextStepDescription:
      "Browse Anavar, Trenbolone, injectable steroids, and oral compounds for retail and B2B wholesale buyers across the UK, USA, and worldwide.",
  },
  legal: {
    supportEmail: "support@steroidssupplies.co.uk",
    pactActNotice:
      "The purchase, import, and possession of anabolic androgenic steroids (AAS) are governed by distinct regional, domestic, and international laws that vary significantly from one country to another. It is the sole responsibility of the individual customer or wholesale purchaser to understand, evaluate, and adhere to the precise legal statutes, import restrictions, and prescription requirements enforced within their own country or local jurisdiction before initiating an order through our storefront. SteroidsSupplies assumes zero legal liability for cross-border customs items that run contrary to localised laws.",
    nicotineWarning:
      "For adults 18 years of age or older only. Keep all performance compounds out of reach of children and pets. Do not use if pregnant or nursing. Do not operate heavy machinery or motor vehicles after administration.",
    thcWarning:
      "Anabolic androgenic steroids (AAS) are subject to regional and national laws. Customers must verify local legality before ordering. For adults 18+ only. Never administer any compound without direct medical supervision from a licensed clinical professional.",
    fdaDisclaimer:
      "All materials, chemical profiles, and descriptions hosted across this domain are intended strictly for educational, research, and informational contexts. They do not constitute professional medical advice, diagnosis, or treatment protocols. Never implement any compound without direct medical supervision from an independent, licensed clinical professional.",
    privacy: {
      title: "Privacy Policy",
      description:
        "SteroidsSupplies Privacy Policy — How we collect, use, and protect your personal information.",
      sections: [
        {
          title: "1. Introduction",
          paragraphs: [
            "SteroidsSupplies (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.",
          ],
        },
        {
          title: "2. Information We Collect",
          paragraphs: ["We collect information you provide directly to us, such as:"],
          bullets: [
            "Name and contact information (email, phone, address)",
            "Business license and verification information",
            "Payment and billing information",
            "Order and shipping history",
            "Communication preferences",
          ],
        },
        {
          title: "3. How We Use Your Information",
          paragraphs: ["We use collected information to:"],
          bullets: [
            "Process and fulfill your orders",
            "Verify your age and business credentials",
            "Send transactional emails (order confirmations, shipment updates)",
            "Improve our website and services",
            "Respond to your inquiries and provide customer support",
            "Comply with applicable laws and regulations",
          ],
        },
        {
          title: "4. Data Security",
          paragraphs: [
            "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.",
          ],
        },
        {
          title: "5. Cookies & Tracking",
          paragraphs: [
            "We use cookies to enhance your browsing experience, including age gate verification cookies. You can control cookie settings through your browser preferences.",
          ],
        },
        {
          title: "6. Third-Party Sharing",
          paragraphs: [
            "We do not sell or share your personal information with third parties for marketing purposes. We may share information with payment processors, shipping carriers, and service providers necessary to fulfill your orders and comply with legal obligations.",
          ],
        },
        {
          title: "7. Your Rights",
          paragraphs: [
            "You may request access to, correction of, or deletion of your personal information by contacting us at support@steroidssupplies.co.uk.",
          ],
        },
        {
          title: "8. Contact Us",
          paragraphs: [
            "If you have questions about this Privacy Policy, please contact us at support@steroidssupplies.co.uk.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      description:
        "SteroidsSupplies Terms of Service — Read our complete terms and conditions for purchasing and using our site.",
      sections: [
        {
          title: "1. Acceptance of Terms",
          paragraphs: [
            "By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. This platform is for adult retail consumers and licensed B2B buyers only. If you do not agree to abide by the above, please do not use this service.",
          ],
        },
        {
          title: "2. Eligibility & Age Requirements",
          paragraphs: [
            "You must be 18 years of age or older to purchase products from SteroidsSupplies. By placing an order you confirm that you meet the minimum age requirement in your jurisdiction and that you are legally permitted to purchase such compounds.",
          ],
        },
        {
          title: "3. Jurisdictional Compliance",
          paragraphs: [
            "The purchase, import, and possession of anabolic androgenic steroids (AAS) are governed by distinct regional, domestic, and international laws. Buyers are solely responsible for compliance with all applicable laws in their jurisdiction. SteroidsSupplies assumes zero legal liability for cross-border customs items contrary to localised laws.",
          ],
        },
        {
          title: "4. Ordering & Payment",
          paragraphs: [
            "By placing an order, you warrant that you are legally able to enter into binding contracts and that the information you provide is accurate. We reserve the right to refuse or cancel any order at our sole discretion.",
          ],
        },
        {
          title: "5. Shipping & Delivery",
          paragraphs: [
            "Standard orders are dispatched with guaranteed 48-hour priority shipping globally. Same-day dispatch is available for qualifying orders placed before 12:00 PM local warehouse time.",
            "All packages are discrete, vacuum-sealed, and dispatched via tracked international courier with full insurance on every consignment.",
          ],
        },
        {
          title: "6. Limitation of Liability",
          paragraphs: [
            "SteroidsSupplies is provided as-is without warranties of any kind. We are not liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use our website or products.",
          ],
        },
        {
          title: "7. Modifications",
          paragraphs: [
            "We reserve the right to modify these terms at any time. Continued use of the website following any modifications constitutes your acceptance of the new terms.",
          ],
        },
        {
          title: "8. Contact & Disputes",
          paragraphs: [
            "For any questions or disputes regarding these terms, please contact us at support@steroidssupplies.co.uk.",
          ],
        },
      ],
    },
    refunds: {
      title: "Refund Policy",
      description:
        "SteroidsSupplies Refund Policy — Learn about our return, exchange, and refund procedures.",
      sections: [
        {
          title: "Our Refund Policy",
          paragraphs: [
            "At SteroidsSupplies, we stand behind the quality of our products. Please read our refund and return policy carefully before making a purchase.",
          ],
        },
        {
          title: "1. Eligibility for Returns",
          paragraphs: ["Items may be returned within 30 days of delivery if:"],
          bullets: [
            "The item is unopened and in original, resellable condition",
            "The original receipt or order confirmation is provided",
            "The item is defective or damaged upon arrival",
            "We made an error in your order",
          ],
        },
        {
          title: "2. Non-Returnable Items",
          paragraphs: ["The following items cannot be returned or refunded:"],
          bullets: [
            "Opened items or items with a broken seal",
            "Clearance or final sale items",
            "Items purchased outside the 30-day return window",
            "Items without original packaging",
          ],
        },
        {
          title: "3. Return Process",
          paragraphs: ["To initiate a return:"],
          ordered: [
            "Contact us at support@steroidssupplies.co.uk with your order number",
            "Obtain a return authorization number (RMA)",
            "Ship the item back to us in original packaging",
            "Include your RMA number inside the package",
            "Refund will be processed within 7–10 business days of receipt",
          ],
        },
        {
          title: "4. Refund Processing",
          paragraphs: [
            "Refunds are processed to your original payment method. Processing times may vary by financial institution (typically 5 to 10 business days). Shipping costs are non-refundable unless the return is due to our error or a defective product.",
          ],
        },
        {
          title: "5. Defective Items",
          paragraphs: [
            "If you receive a defective or damaged product, contact us within 7 days of delivery with photos or video evidence. We will replace the item at no cost or issue a full refund.",
          ],
        },
        {
          title: "6. Questions?",
          paragraphs: [
            "For return inquiries, contact us at support@steroidssupplies.co.uk.",
          ],
        },
      ],
    },
    agePolicy: {
      title: "Mandatory Medical Warning & Safety Notices",
      description:
        "Read the mandatory legal compliance documentation, jurisdictional guidelines, and chemical safety warnings for SteroidsSupplies.",
      sections: [
        {
          title: "Age Verification Requirement",
          paragraphs: [
            "All products available on SteroidsSupplies.co.uk are strictly for adults 18 years of age or older. They are not for sale to minors. By accessing this site you confirm you meet the legal age requirement in your jurisdiction.",
          ],
        },
        {
          title: "⚠️ Mandatory Medical Warning",
          paragraphs: [
            "Anabolic steroids are highly active, potent hormonal compounds that profoundly alter human endocrinology. Unsupervised, excessive, or unverified administration can result in severe and potentially permanent health complications.",
            "These include cardiovascular strain, left ventricular hypertrophy, severe hepatic toxicity, profound suppression of the natural hypothalamic-pituitary-gonadal axis (HPGA), dyslipidemia, and psychiatric alterations.",
            "All materials, chemical profiles, and descriptions hosted across this domain are intended strictly for educational, research, and informational contexts. They do not constitute professional medical advice, diagnosis, or treatment protocols. Never implement any compound without direct medical supervision from an independent, licensed clinical professional.",
          ],
        },
        {
          title: "Jurisdictional Legal Compliance",
          paragraphs: [
            "The purchase, import, and possession of anabolic androgenic steroids (AAS) are governed by distinct regional, domestic, and international laws that vary significantly from one country to another. It is the sole responsibility of the individual customer or wholesale purchaser to understand, evaluate, and adhere to the precise legal statutes, import restrictions, and prescription requirements enforced within their own country or local jurisdiction before initiating an order. SteroidsSupplies assumes zero legal liability for cross-border customs items contrary to localised laws.",
          ],
        },
        {
          title: "Health & Safety Guidelines",
          paragraphs: [
            "Do not use performance compounds if you are pregnant or nursing. Keep all compounds out of reach of children and pets. Do not operate heavy machinery or motor vehicles after administration. Consult a licensed physician before use if you have a serious medical condition or use prescription medications.",
          ],
        },
      ],
    },
  },
};

type SiteSettingsCMS = {
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

type LegalPageCMS = {
  title?: string;
  description?: string;
  lastUpdated?: string;
  sections?: LegalSection[];
};

type LegalContentCMS = {
  supportEmail?: string;
  pactActNotice?: string;
  nicotineWarning?: string;
  thcWarning?: string;
  fdaDisclaimer?: string;
  privacy?: LegalPageCMS;
  terms?: LegalPageCMS;
  refunds?: LegalPageCMS;
  agePolicy?: LegalPageCMS;
};

function stripSanityPrefix(value: string | undefined, fallback: string) {
  const source = value?.trim() || fallback;
  return source.replace(/^x\s*sanity\s*[:\-]?\s*/i, "").trim();
}

function normalizeSections(sections: LegalSection[] | undefined, fallback: LegalSection[]) {
  if (!Array.isArray(sections) || sections.length === 0) {
    return fallback;
  }

  return sections
    .filter((section) => section && typeof section.title === "string" && section.title.trim().length > 0)
    .map((section) => ({
      title: section.title,
      paragraphs: Array.isArray(section.paragraphs) ? section.paragraphs.filter(Boolean) : undefined,
      bullets: Array.isArray(section.bullets) ? section.bullets.filter(Boolean) : undefined,
      ordered: Array.isArray(section.ordered) ? section.ordered.filter(Boolean) : undefined,
    }));
}

function resolveLegalPage(page: LegalPageCMS | undefined, fallback: LegalPageContent): LegalPageContent {
  return {
    title: page?.title || fallback.title,
    description: page?.description || fallback.description,
    lastUpdated: page?.lastUpdated,
    sections: normalizeSections(page?.sections, fallback.sections),
  };
}

const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  announcementBar,
  announcementHref,
  footerWarningText,
  footerComplianceText,
  homepageBadge,
  homepageHeading,
  homepageSubheading,
  homepageNextStepTitle,
  homepageNextStepDescription
}`;

const legalContentQuery = groq`*[_type == "legalContent"] | order(_id asc, _updatedAt desc)[0]{
  supportEmail,
  pactActNotice,
  nicotineWarning,
  thcWarning,
  fdaDisclaimer,
  "privacy": {
    "title": coalesce(privacyTitle, ""),
    "description": coalesce(privacyDescription, ""),
    "lastUpdated": coalesce(string(privacyLastUpdated), ""),
    "sections": privacySections[]{title, paragraphs, bullets, ordered}
  },
  "terms": {
    "title": coalesce(termsTitle, ""),
    "description": coalesce(termsDescription, ""),
    "lastUpdated": coalesce(string(termsLastUpdated), ""),
    "sections": termsSections[]{title, paragraphs, bullets, ordered}
  },
  "refunds": {
    "title": coalesce(refundsTitle, ""),
    "description": coalesce(refundsDescription, ""),
    "lastUpdated": coalesce(string(refundsLastUpdated), ""),
    "sections": refundsSections[]{title, paragraphs, bullets, ordered}
  },
  "agePolicy": {
    "title": coalesce(agePolicyTitle, ""),
    "description": coalesce(agePolicyDescription, ""),
    "lastUpdated": coalesce(string(agePolicyLastUpdated), ""),
    "sections": agePolicySections[]{title, paragraphs, bullets, ordered}
  }
}`;

export async function getSiteContent(): Promise<SiteContent> {
  const [settings, legal] = await Promise.all([
    fetchSanity<SiteSettingsCMS | null>(siteSettingsQuery),
    fetchSanity<LegalContentCMS | null>(legalContentQuery),
  ]);

  return {
    announcement: {
      text: stripSanityPrefix(settings?.announcementBar, DEFAULT_CONTENT.announcement.text),
      href: settings?.announcementHref || DEFAULT_CONTENT.announcement.href,
    },
    footer: {
      warningText: stripSanityPrefix(settings?.footerWarningText, DEFAULT_CONTENT.footer.warningText),
      complianceText: stripSanityPrefix(
        settings?.footerComplianceText,
        DEFAULT_CONTENT.footer.complianceText,
      ),
    },
    homepage: {
      badge: settings?.homepageBadge || DEFAULT_CONTENT.homepage.badge,
      heading: settings?.homepageHeading || DEFAULT_CONTENT.homepage.heading,
      subheading: settings?.homepageSubheading || DEFAULT_CONTENT.homepage.subheading,
      nextStepTitle: settings?.homepageNextStepTitle || DEFAULT_CONTENT.homepage.nextStepTitle,
      nextStepDescription:
        settings?.homepageNextStepDescription || DEFAULT_CONTENT.homepage.nextStepDescription,
    },
    legal: {
      supportEmail: legal?.supportEmail || DEFAULT_CONTENT.legal.supportEmail,
      pactActNotice: legal?.pactActNotice || DEFAULT_CONTENT.legal.pactActNotice,
      nicotineWarning: legal?.nicotineWarning || DEFAULT_CONTENT.legal.nicotineWarning,
      thcWarning: legal?.thcWarning || DEFAULT_CONTENT.legal.thcWarning,
      fdaDisclaimer: legal?.fdaDisclaimer || DEFAULT_CONTENT.legal.fdaDisclaimer,
      privacy: resolveLegalPage(legal?.privacy, DEFAULT_CONTENT.legal.privacy),
      terms: resolveLegalPage(legal?.terms, DEFAULT_CONTENT.legal.terms),
      refunds: resolveLegalPage(legal?.refunds, DEFAULT_CONTENT.legal.refunds),
      agePolicy: resolveLegalPage(legal?.agePolicy, DEFAULT_CONTENT.legal.agePolicy),
    },
  };
}
