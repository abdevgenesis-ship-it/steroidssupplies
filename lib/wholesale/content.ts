import { cache } from "react";

import { DEFAULT_WHOLESALE } from "@/lib/wholesale/defaults";
import { fetchSanity, sanityQueries } from "@/lib/sanityClient";
import type { WholesalePageDoc } from "@/types/sanity";

export { DEFAULT_WHOLESALE };

export type WholesaleIconKey =
  | "badgePercent"
  | "boxes"
  | "fileText"
  | "headphones"
  | "package"
  | "search"
  | "send"
  | "shieldCheck"
  | "truck"
  | "wallet"
  | "zap";

export type WholesaleBenefitMerged = {
  title: string;
  description: string;
  iconKey: WholesaleIconKey;
};

export type WholesaleStepMerged = {
  title: string;
  description: string;
  iconKey: WholesaleIconKey;
};

export type VolumeTierMerged = { tier: string; note: string };

export type WholesaleFaqMerged = { question: string; answer: string };

export type WholesaleRequestPageMerged = {
  badge: string;
  heading: string;
  intro: string;
  thankYouHeading: string;
  thankYouIntro: string;
  thankYouNextStepsTitle: string;
  thankYouUrgentHelpTitle: string;
  thankYouUrgentHelpBody: string;
  supportEmail: string;
};

export type WholesaleCmsFlags = {
  seoTitle: boolean;
  seoDescription: boolean;
  heroBadge: boolean;
  heroHeading: boolean;
  heroSecondaryHeading: boolean;
  heroSubhead: boolean;
  heroTrustLine1: boolean;
  heroTrustLine2: boolean;
  whyHeading: boolean;
  whyIntro: boolean;
  benefits: boolean;
  howHeading: boolean;
  howIntro: boolean;
  steps: boolean;
  discountHeading: boolean;
  discountIntro: boolean;
  paymentCardTitle: boolean;
  paymentCardDescription: boolean;
  cryptoRowLabel: boolean;
  cryptoDiscountLabel: boolean;
  revolutRowLabel: boolean;
  revolutDiscountLabel: boolean;
  volumeCardTitle: boolean;
  volumeCardDescription: boolean;
  volumeTiers: boolean;
  discountSeeAlso: boolean;
  formHeading: boolean;
  formIntro: boolean;
  requestBadge: boolean;
  requestHeading: boolean;
  requestIntro: boolean;
  requestThankYouHeading: boolean;
  requestThankYouIntro: boolean;
  requestThankYouNextStepsTitle: boolean;
  requestThankYouUrgentHelpTitle: boolean;
  requestThankYouUrgentHelpBody: boolean;
  requestSupportEmail: boolean;
  testimonialsHeading: boolean;
  testimonialsIntro: boolean;
  faqHeading: boolean;
  faqIntro: boolean;
  faqs: boolean;
};

export type MergedWholesalePage = {
  seoTitle: string | null;
  seoDescription: string | null;
  heroBadge: string;
  heroHeading: string;
  heroSecondaryHeading: string;
  heroSubhead: string;
  heroTrustLine1: string;
  heroTrustLine2: string;
  whyHeading: string;
  whyIntro: string;
  benefits: WholesaleBenefitMerged[];
  howHeading: string;
  howIntro: string;
  steps: WholesaleStepMerged[];
  discountHeading: string;
  discountIntro: string;
  paymentCardTitle: string;
  paymentCardDescription: string;
  cryptoRowLabel: string;
  cryptoDiscountLabel: string;
  revolutRowLabel: string;
  revolutDiscountLabel: string;
  volumeCardTitle: string;
  volumeCardDescription: string;
  volumeTiers: VolumeTierMerged[];
  discountSeeAlso: string;
  formHeading: string;
  formIntro: string;
  wholesaleRequestPage: WholesaleRequestPageMerged;
  testimonialsHeading: string;
  testimonialsIntro: string;
  faqHeading: string;
  faqIntro: string;
  faqs: WholesaleFaqMerged[];
};

function isNonEmpty(s: string | undefined | null): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

function normalizeIconKey(key: string | undefined): WholesaleIconKey {
  const allowed: WholesaleIconKey[] = [
    "badgePercent",
    "boxes",
    "fileText",
    "headphones",
    "package",
    "search",
    "send",
    "shieldCheck",
    "truck",
    "wallet",
    "zap",
  ];
  if (key && (allowed as string[]).includes(key)) {
    return key as WholesaleIconKey;
  }
  return "package";
}

function mergeWholesale(doc: WholesalePageDoc | null): {
  content: MergedWholesalePage;
  cms: WholesaleCmsFlags;
} {
  const d = DEFAULT_WHOLESALE as unknown as MergedWholesalePage;
  const cms = {} as WholesaleCmsFlags;

  const set = <K extends keyof WholesaleCmsFlags>(key: K, fromSanity: boolean) => {
    cms[key] = fromSanity as WholesaleCmsFlags[K];
  };

  const seoTitle = isNonEmpty(doc?.seoTitle) ? doc!.seoTitle!.trim() : null;
  const seoDescription = isNonEmpty(doc?.seoDescription) ? doc!.seoDescription!.trim() : null;
  set("seoTitle", !!seoTitle);
  set("seoDescription", !!seoDescription);

  const heroBadge = isNonEmpty(doc?.heroBadge) ? doc!.heroBadge!.trim() : d.heroBadge;
  set("heroBadge", isNonEmpty(doc?.heroBadge));
  const heroHeading = isNonEmpty(doc?.heroHeading) ? doc!.heroHeading!.trim() : d.heroHeading;
  set("heroHeading", isNonEmpty(doc?.heroHeading));
  const heroSecondaryHeading = isNonEmpty(doc?.heroSecondaryHeading)
    ? doc!.heroSecondaryHeading!.trim()
    : d.heroSecondaryHeading;
  set("heroSecondaryHeading", isNonEmpty(doc?.heroSecondaryHeading));
  const heroSubhead = isNonEmpty(doc?.heroSubhead) ? doc!.heroSubhead!.trim() : d.heroSubhead;
  set("heroSubhead", isNonEmpty(doc?.heroSubhead));
  const heroTrustLine1 = isNonEmpty(doc?.heroTrustLine1) ? doc!.heroTrustLine1!.trim() : d.heroTrustLine1;
  set("heroTrustLine1", isNonEmpty(doc?.heroTrustLine1));
  const heroTrustLine2 = isNonEmpty(doc?.heroTrustLine2) ? doc!.heroTrustLine2!.trim() : d.heroTrustLine2;
  set("heroTrustLine2", isNonEmpty(doc?.heroTrustLine2));

  const whyHeading = isNonEmpty(doc?.whyHeading) ? doc!.whyHeading!.trim() : d.whyHeading;
  set("whyHeading", isNonEmpty(doc?.whyHeading));
  const whyIntro = isNonEmpty(doc?.whyIntro) ? doc!.whyIntro!.trim() : d.whyIntro;
  set("whyIntro", isNonEmpty(doc?.whyIntro));

  let benefits: WholesaleBenefitMerged[] = d.benefits.map((b) => ({
    title: b.title,
    description: b.description,
    iconKey: b.iconKey,
  }));
  if (doc?.benefits && doc.benefits.length > 0) {
    benefits = doc.benefits.map((b) => ({
      title: b.title?.trim() || "",
      description: b.description?.trim() || "",
      iconKey: normalizeIconKey(b.iconKey),
    }));
    set("benefits", true);
  } else {
    set("benefits", false);
  }

  const howHeading = isNonEmpty(doc?.howHeading) ? doc!.howHeading!.trim() : d.howHeading;
  set("howHeading", isNonEmpty(doc?.howHeading));
  const howIntro = isNonEmpty(doc?.howIntro) ? doc!.howIntro!.trim() : d.howIntro;
  set("howIntro", isNonEmpty(doc?.howIntro));

  let steps: WholesaleStepMerged[] = d.steps.map((s) => ({
    title: s.title,
    description: s.description,
    iconKey: s.iconKey,
  }));
  if (doc?.steps && doc.steps.length > 0) {
    steps = doc.steps.map((s) => ({
      title: s.title?.trim() || "",
      description: s.description?.trim() || "",
      iconKey: normalizeIconKey(s.iconKey),
    }));
    set("steps", true);
  } else {
    set("steps", false);
  }

  const discountHeading = isNonEmpty(doc?.discountHeading)
    ? doc!.discountHeading!.trim()
    : d.discountHeading;
  set("discountHeading", isNonEmpty(doc?.discountHeading));
  const discountIntro = isNonEmpty(doc?.discountIntro) ? doc!.discountIntro!.trim() : d.discountIntro;
  set("discountIntro", isNonEmpty(doc?.discountIntro));

  const paymentCardTitle = isNonEmpty(doc?.paymentCardTitle)
    ? doc!.paymentCardTitle!.trim()
    : d.paymentCardTitle;
  set("paymentCardTitle", isNonEmpty(doc?.paymentCardTitle));
  const paymentCardDescription = isNonEmpty(doc?.paymentCardDescription)
    ? doc!.paymentCardDescription!.trim()
    : d.paymentCardDescription;
  set("paymentCardDescription", isNonEmpty(doc?.paymentCardDescription));

  const cryptoRowLabel = isNonEmpty(doc?.cryptoRowLabel)
    ? doc!.cryptoRowLabel!.trim()
    : d.cryptoRowLabel;
  set("cryptoRowLabel", isNonEmpty(doc?.cryptoRowLabel));
  const cryptoDiscountLabel = isNonEmpty(doc?.cryptoDiscountLabel)
    ? doc!.cryptoDiscountLabel!.trim()
    : d.cryptoDiscountLabel;
  set("cryptoDiscountLabel", isNonEmpty(doc?.cryptoDiscountLabel));
  const revolutRowLabel = isNonEmpty(doc?.revolutRowLabel)
    ? doc!.revolutRowLabel!.trim()
    : d.revolutRowLabel;
  set("revolutRowLabel", isNonEmpty(doc?.revolutRowLabel));
  const revolutDiscountLabel = isNonEmpty(doc?.revolutDiscountLabel)
    ? doc!.revolutDiscountLabel!.trim()
    : d.revolutDiscountLabel;
  set("revolutDiscountLabel", isNonEmpty(doc?.revolutDiscountLabel));

  const volumeCardTitle = isNonEmpty(doc?.volumeCardTitle)
    ? doc!.volumeCardTitle!.trim()
    : d.volumeCardTitle;
  set("volumeCardTitle", isNonEmpty(doc?.volumeCardTitle));
  const volumeCardDescription = isNonEmpty(doc?.volumeCardDescription)
    ? doc!.volumeCardDescription!.trim()
    : d.volumeCardDescription;
  set("volumeCardDescription", isNonEmpty(doc?.volumeCardDescription));

  let volumeTiers: VolumeTierMerged[] = d.volumeTiers.map((v) => ({ ...v }));
  if (doc?.volumeTiers && doc.volumeTiers.length > 0) {
    volumeTiers = doc.volumeTiers.map((v) => ({
      tier: v.tier?.trim() || "",
      note: v.note?.trim() || "",
    }));
    set("volumeTiers", true);
  } else {
    set("volumeTiers", false);
  }

  const discountSeeAlso = isNonEmpty(doc?.discountSeeAlso)
    ? doc!.discountSeeAlso!.trim()
    : d.discountSeeAlso;
  set("discountSeeAlso", isNonEmpty(doc?.discountSeeAlso));

  const formHeading = isNonEmpty(doc?.formHeading) ? doc!.formHeading!.trim() : d.formHeading;
  set("formHeading", isNonEmpty(doc?.formHeading));
  const formIntro = isNonEmpty(doc?.formIntro) ? doc!.formIntro!.trim() : d.formIntro;
  set("formIntro", isNonEmpty(doc?.formIntro));

  const requestBadge = isNonEmpty(doc?.wholesaleRequestPage?.badge)
    ? doc!.wholesaleRequestPage!.badge!.trim()
    : d.wholesaleRequestPage.badge;
  set("requestBadge", isNonEmpty(doc?.wholesaleRequestPage?.badge));

  const requestHeading = isNonEmpty(doc?.wholesaleRequestPage?.heading)
    ? doc!.wholesaleRequestPage!.heading!.trim()
    : d.wholesaleRequestPage.heading;
  set("requestHeading", isNonEmpty(doc?.wholesaleRequestPage?.heading));

  const requestIntro = isNonEmpty(doc?.wholesaleRequestPage?.intro)
    ? doc!.wholesaleRequestPage!.intro!.trim()
    : d.wholesaleRequestPage.intro;
  set("requestIntro", isNonEmpty(doc?.wholesaleRequestPage?.intro));

  const requestThankYouHeading = isNonEmpty(doc?.wholesaleRequestPage?.thankYouHeading)
    ? doc!.wholesaleRequestPage!.thankYouHeading!.trim()
    : d.wholesaleRequestPage.thankYouHeading;
  set("requestThankYouHeading", isNonEmpty(doc?.wholesaleRequestPage?.thankYouHeading));

  const requestThankYouIntro = isNonEmpty(doc?.wholesaleRequestPage?.thankYouIntro)
    ? doc!.wholesaleRequestPage!.thankYouIntro!.trim()
    : d.wholesaleRequestPage.thankYouIntro;
  set("requestThankYouIntro", isNonEmpty(doc?.wholesaleRequestPage?.thankYouIntro));

  const requestThankYouNextStepsTitle = isNonEmpty(doc?.wholesaleRequestPage?.thankYouNextStepsTitle)
    ? doc!.wholesaleRequestPage!.thankYouNextStepsTitle!.trim()
    : d.wholesaleRequestPage.thankYouNextStepsTitle;
  set(
    "requestThankYouNextStepsTitle",
    isNonEmpty(doc?.wholesaleRequestPage?.thankYouNextStepsTitle),
  );

  const requestThankYouUrgentHelpTitle = isNonEmpty(doc?.wholesaleRequestPage?.thankYouUrgentHelpTitle)
    ? doc!.wholesaleRequestPage!.thankYouUrgentHelpTitle!.trim()
    : d.wholesaleRequestPage.thankYouUrgentHelpTitle;
  set(
    "requestThankYouUrgentHelpTitle",
    isNonEmpty(doc?.wholesaleRequestPage?.thankYouUrgentHelpTitle),
  );

  const requestThankYouUrgentHelpBody = isNonEmpty(doc?.wholesaleRequestPage?.thankYouUrgentHelpBody)
    ? doc!.wholesaleRequestPage!.thankYouUrgentHelpBody!.trim()
    : d.wholesaleRequestPage.thankYouUrgentHelpBody;
  set(
    "requestThankYouUrgentHelpBody",
    isNonEmpty(doc?.wholesaleRequestPage?.thankYouUrgentHelpBody),
  );

  const requestSupportEmail = isNonEmpty(doc?.wholesaleRequestPage?.supportEmail)
    ? doc!.wholesaleRequestPage!.supportEmail!.trim()
    : d.wholesaleRequestPage.supportEmail;
  set("requestSupportEmail", isNonEmpty(doc?.wholesaleRequestPage?.supportEmail));

  const testimonialsHeading = isNonEmpty(doc?.testimonialsHeading)
    ? doc!.testimonialsHeading!.trim()
    : d.testimonialsHeading;
  set("testimonialsHeading", isNonEmpty(doc?.testimonialsHeading));
  const testimonialsIntro = isNonEmpty(doc?.testimonialsIntro)
    ? doc!.testimonialsIntro!.trim()
    : d.testimonialsIntro;
  set("testimonialsIntro", isNonEmpty(doc?.testimonialsIntro));

  const faqHeading = isNonEmpty(doc?.faqHeading) ? doc!.faqHeading!.trim() : d.faqHeading;
  set("faqHeading", isNonEmpty(doc?.faqHeading));
  const faqIntro = isNonEmpty(doc?.faqIntro) ? doc!.faqIntro!.trim() : d.faqIntro;
  set("faqIntro", isNonEmpty(doc?.faqIntro));

  let faqs: WholesaleFaqMerged[] = d.faqs.map((f) => ({ ...f }));
  if (doc?.faqs && doc.faqs.length > 0) {
    faqs = doc.faqs.map((f) => ({
      question: f.question?.trim() || "",
      answer: f.answer?.trim() || "",
    }));
    set("faqs", true);
  } else {
    set("faqs", false);
  }

  const content: MergedWholesalePage = {
    ...d,
    seoTitle,
    seoDescription,
    heroBadge,
    heroHeading,
    heroSecondaryHeading,
    heroSubhead,
    heroTrustLine1,
    heroTrustLine2,
    whyHeading,
    whyIntro,
    benefits,
    howHeading,
    howIntro,
    steps,
    discountHeading,
    discountIntro,
    paymentCardTitle,
    paymentCardDescription,
    cryptoRowLabel,
    cryptoDiscountLabel,
    revolutRowLabel,
    revolutDiscountLabel,
    volumeCardTitle,
    volumeCardDescription,
    volumeTiers,
    discountSeeAlso,
    formHeading,
    formIntro,
    wholesaleRequestPage: {
      badge: requestBadge,
      heading: requestHeading,
      intro: requestIntro,
      thankYouHeading: requestThankYouHeading,
      thankYouIntro: requestThankYouIntro,
      thankYouNextStepsTitle: requestThankYouNextStepsTitle,
      thankYouUrgentHelpTitle: requestThankYouUrgentHelpTitle,
      thankYouUrgentHelpBody: requestThankYouUrgentHelpBody,
      supportEmail: requestSupportEmail,
    },
    testimonialsHeading,
    testimonialsIntro,
    faqHeading,
    faqIntro,
    faqs,
  };

  return { content, cms };
}

export const getWholesalePageData = cache(async () => {
  const page = await fetchSanity<WholesalePageDoc | null>(sanityQueries.wholesalePage);
  return mergeWholesale(page);
});
