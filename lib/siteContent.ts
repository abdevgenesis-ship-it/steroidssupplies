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
    text: "Fast 48-hour tracked delivery across the USA, UK & Worldwide — priority same-day dispatch available.",
    href: "/shipping",
  },
  footer: {
    warningText:
      "All products on THCPensBulk.com are intended strictly for distribution to licensed commercial business entities and adult consumers of legal age (21+). Not for sale to minors. Cannabinoids can affect blood pressure, heart rate, and intraocular pressure. Do not use if pregnant or nursing. Products may cause drowsiness; do not operate heavy machinery or motor vehicles after use.",
    complianceText:
      "THCPENSBULK operates as a B2B master distributor of hemp-derived vape hardware and legal cannabinoid products. All pre-filled products comply with the 2018 US Farm Bill (≤0.3% Delta-9 THC dry weight). Buyers are responsible for local compliance with all applicable federal, state, and local laws.",
  },
  homepage: {
    badge: "THCPensBulk",
    heading: "Bulk THC Vapes and Wholesale 510 Vape Carts for Global B2B Distribution",
    subheading:
      "Buy Premium THC Disposable Vape Pens and Hardware at the Market's Best Wholesale Prices with Guaranteed 48-Hour Priority Shipping.",
    nextStepTitle: "Shop Our Bulk Inventory",
    nextStepDescription:
      "Browse bulk THC vapes, wholesale 510 carts, and hardware for B2B retailers and distributors across the USA, UK, and worldwide.",
  },
  legal: {
    supportEmail: "support@thcpensbulk.com",
    pactActNotice:
      "THCPensBulk.com operates in full compliance with the Prevent All Cigarette Trafficking (PACT) Act. All wholesale shipments travel via registered, compliant commercial freight carriers, are fully reported to state tax authorities where required, and require an adult signature (21+) upon arrival.",
    nicotineWarning:
      "This product may contain nicotine. Nicotine is an addictive chemical. Not for sale to minors. 21+ age verification required.",
    thcWarning:
      "THC and cannabinoid alternative products are only available where legally permitted. All products comply with the 2018 US Farm Bill (≤0.3% Delta-9 THC dry weight). Customers are responsible for knowing and complying with local laws.",
    fdaDisclaimer:
      "These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.",
    privacy: {
      title: "Privacy Policy",
      description:
        "THCPensBulk Privacy Policy — How we collect, use, and protect your personal information.",
      sections: [
        {
          title: "1. Introduction",
          paragraphs: [
            "THCPensBulk (\"we,\" \"our,\" or \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.",
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
            "Comply with PACT Act and applicable laws and regulations",
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
            "You may request access to, correction of, or deletion of your personal information by contacting us at support@thcpensbulk.com.",
          ],
        },
        {
          title: "8. Contact Us",
          paragraphs: [
            "If you have questions about this Privacy Policy, please contact us at support@thcpensbulk.com.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      description:
        "THCPensBulk Terms of Service — Read our complete terms and conditions for purchasing and using our site.",
      sections: [
        {
          title: "1. Acceptance of Terms",
          paragraphs: [
            "By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. This platform is for licensed B2B buyers only. If you do not agree to abide by the above, please do not use this service.",
          ],
        },
        {
          title: "2. Eligibility & Business Requirements",
          paragraphs: [
            "You must be a licensed commercial business entity and 21 years or older to purchase products from THCPensBulk. All accounts must pass business verification before orders are processed.",
          ],
        },
        {
          title: "3. Product Compliance",
          paragraphs: [
            "All pre-filled products comply with the 2018 US Farm Bill (≤0.3% Delta-9 THC dry weight). Buyers are solely responsible for compliance with local, state, and federal laws in their jurisdiction.",
          ],
        },
        {
          title: "4. Ordering & Payment",
          paragraphs: [
            "By placing an order, you warrant that you are a licensed business operator legally able to enter into binding contracts and that the information you provide is accurate. We reserve the right to refuse or cancel any order at our sole discretion.",
          ],
        },
        {
          title: "5. Shipping & Delivery",
          paragraphs: [
            "Standard wholesale orders are dispatched with guaranteed 48-hour priority shipping. Same-day dispatch is available for qualifying high-volume orders placed before 12:00 PM local warehouse time.",
            "All domestic US shipments comply with PACT Act requirements including adult signature on delivery (21+).",
          ],
        },
        {
          title: "6. Limitation of Liability",
          paragraphs: [
            "THCPensBulk is provided as-is without warranties of any kind. We are not liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use our website or products.",
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
            "For any questions or disputes regarding these terms, please contact us at support@thcpensbulk.com.",
          ],
        },
      ],
    },
    refunds: {
      title: "Refund Policy",
      description:
        "THCPensBulk Refund Policy — Learn about our return, exchange, and refund procedures for B2B orders.",
      sections: [
        {
          title: "Our Refund Policy",
          paragraphs: [
            "At THCPensBulk, we stand behind the quality of our products. Please read our refund and return policy carefully before making a purchase.",
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
            "Opened hardware or items with a broken seal",
            "Clearance or final sale items",
            "Items purchased outside the 30-day return window",
            "Items without original packaging",
          ],
        },
        {
          title: "3. Return Process",
          paragraphs: ["To initiate a return:"],
          ordered: [
            "Contact us at support@thcpensbulk.com with your order number",
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
            "For return inquiries, contact us at support@thcpensbulk.com.",
          ],
        },
      ],
    },
    agePolicy: {
      title: "Mandatory Commercial Safety Warning",
      description:
        "Read our mandatory public health warning, age verification requirements, and product safety guidelines for THC vape hardware.",
      sections: [
        {
          title: "Age Verification Requirement",
          paragraphs: [
            "All products available on THCPensBulk.com are intended strictly for distribution to licensed commercial business entities and adult consumers of legal age (21+). They are not for sale to minors.",
          ],
        },
        {
          title: "Health & Safety Warnings",
          paragraphs: [
            "Cannabinoids can affect blood pressure, heart rate, and intraocular pressure. Consult a physician before use if you have a serious medical condition or use prescription medications. Do not use these products if you are pregnant or nursing. Products may cause drowsiness; do not operate heavy machinery or motor vehicles after consumption.",
          ],
        },
        {
          title: "Legal Compliance",
          paragraphs: [
            "THCPensBulk does not sell pre-filled cannabis products containing over 0.3% Delta-9 THC to unauthorized regions. It is the sole responsibility of the wholesale buyer to ensure complete compliance with local county, state, or country regulations before placing a volume purchase order.",
          ],
        },
        {
          title: "PACT Act Compliance",
          paragraphs: [
            "All domestic US shipments comply with the Prevent All Cigarette Trafficking (PACT) Act. Shipments require an adult signature (21+) upon arrival and travel via registered, compliant commercial freight carriers.",
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
