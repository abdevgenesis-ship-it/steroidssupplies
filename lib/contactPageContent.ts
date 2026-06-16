import type { ContactPageDoc, ContactSubjectOptionDoc } from "@/types/sanity";

/** Normalized subject row (required value + label) after CMS merge. */
export type ContactSubjectOption = { value: string; label: string };

const DEFAULT_SUBJECTS: ContactSubjectOption[] = [
  { value: "general", label: "General question" },
  { value: "order", label: "Order & invoice" },
  { value: "wholesale", label: "Wholesale / B2B" },
  { value: "logistics", label: "Freight & logistics" },
];

/** Shown in the sidebar when the real inbox is not public yet (set `NEXT_PUBLIC_SHOW_CONTACT_EMAIL=true` to show CMS/fallback email + mailto). */
export const CONTACT_EMAIL_DISPLAY_PLACEHOLDER = "[Email]";

export const CONTACT_PAGE_FALLBACK = {
  seoTitle: "Contact Us: Customer Care & B2B Wholesale Accounts UK",
  seoDescription:
    "Reach our support team for order inquiries or connect directly with our commercial account managers to establish your corporate wholesale profile across the UK and Ireland.",
  pageHeading: "Contact Our Customer Care and Enterprise B2B Support Teams",
  introLead:
    "Whether Interacting with Our General Retail Assistance Desk or Requesting Rapid Onboarding for a Tier-One Bulk Commercial Trade Profile, We Are Here to Support Your Journey",
  formHeading: "Submit a Direct Assistance Request Ticket",
  formIntro:
    "Our integrated communications center is organized into dedicated functional branches to ensure your specific inquiry reaches an expert in that domain immediately. For rapid self-service assistance, please include your relevant 8-digit order receipt number or corporate company registration index.",
  nameFieldLabel: "Full name",
  emailFieldLabel: "Email address",
  subjectFieldLabel: "Subject",
  messageFieldLabel: "Message",
  submitButtonLabel: "Send message",
  subjectOptions: DEFAULT_SUBJECTS,
  successTitle: "Message received",
  successMessage:
    "Thanks for contacting THCPensBulk. A team member will follow up soon. If your request is urgent, reply to your confirmation email.",
  detailsHeading: "Contact details",
  contactEmail: "support@thcpensbulk.com",
  contactPhone: "",
  businessHours:
    "Central Dispatch Intake: Logistics Unit 4, Gateway Industrial Estate, London, Greater London, E1 4NS\nCommercial Business Operating Hours: Monday through Friday, 08:30 to 17:30 GMT (Excluding recognized UK bank holidays).",
  responsePromise: "We respond within 24 hours (retail) and within 1 business hour (wholesale)",
  paymentsNote:
    "If you represent an independent pharmacy chain, an e-commerce health storefront, a beauty salon group, or an authorized local health stockist, do not utilize general retail communication channels. Please navigate straight to our secure **Wholesale Application Portal** to upload your active VAT credential profile. Our commercial auditing staff activates approved high-volume account tier privileges within 60 minutes of submission.",
};

export type ResolvedContactPage = typeof CONTACT_PAGE_FALLBACK;

/** Strip optional leading test prefix from Sanity copy (e.g. "X ") for mailto/tel and outbound email. */
export function stripCmsTestPrefix(value: string) {
  return value.replace(/^\s*X\s+/i, "").trim();
}

function normalizeSubjectOptions(raw: ContactSubjectOptionDoc[] | undefined): ContactSubjectOption[] {
  if (!raw?.length) {
    return CONTACT_PAGE_FALLBACK.subjectOptions;
  }

  const cleaned = raw
    .map((o) => ({
      value: o.value?.trim().toLowerCase(),
      label: o.label?.trim(),
    }))
    .filter((o): o is ContactSubjectOption => Boolean(o.value && o.label && /^[a-z0-9-]+$/.test(o.value)));

  return cleaned.length > 0 ? cleaned : CONTACT_PAGE_FALLBACK.subjectOptions;
}

export function resolveContactPage(doc: ContactPageDoc | null): ResolvedContactPage {
  const phoneFromDoc = doc == null ? undefined : (doc.contactPhone ?? "").trim();
  const paymentsFromDoc = doc == null ? undefined : (doc.paymentsNote ?? "").trim();
  const formIntroFromDoc = doc == null ? undefined : (doc.formIntro ?? "").trim();

  const resolvedRawEmail = doc?.contactEmail?.trim() || CONTACT_PAGE_FALLBACK.contactEmail;
  const showPublicContactEmail = process.env.NEXT_PUBLIC_SHOW_CONTACT_EMAIL === "true";

  return {
    seoTitle: doc?.seoTitle?.trim() || CONTACT_PAGE_FALLBACK.seoTitle,
    seoDescription: doc?.seoDescription?.trim() || CONTACT_PAGE_FALLBACK.seoDescription,
    pageHeading: doc?.pageHeading?.trim() || CONTACT_PAGE_FALLBACK.pageHeading,
    introLead: doc?.introLead?.trim() || CONTACT_PAGE_FALLBACK.introLead,
    formHeading: doc?.formHeading?.trim() || CONTACT_PAGE_FALLBACK.formHeading,
    formIntro: formIntroFromDoc !== undefined ? formIntroFromDoc : CONTACT_PAGE_FALLBACK.formIntro,
    nameFieldLabel: doc?.nameFieldLabel?.trim() || CONTACT_PAGE_FALLBACK.nameFieldLabel,
    emailFieldLabel: doc?.emailFieldLabel?.trim() || CONTACT_PAGE_FALLBACK.emailFieldLabel,
    subjectFieldLabel: doc?.subjectFieldLabel?.trim() || CONTACT_PAGE_FALLBACK.subjectFieldLabel,
    messageFieldLabel: doc?.messageFieldLabel?.trim() || CONTACT_PAGE_FALLBACK.messageFieldLabel,
    submitButtonLabel: doc?.submitButtonLabel?.trim() || CONTACT_PAGE_FALLBACK.submitButtonLabel,
    subjectOptions: normalizeSubjectOptions(doc?.subjectOptions),
    successTitle: doc?.successTitle?.trim() || CONTACT_PAGE_FALLBACK.successTitle,
    successMessage: doc?.successMessage?.trim() || CONTACT_PAGE_FALLBACK.successMessage,
    detailsHeading: doc?.detailsHeading?.trim() || CONTACT_PAGE_FALLBACK.detailsHeading,
    contactEmail: showPublicContactEmail ? resolvedRawEmail : CONTACT_EMAIL_DISPLAY_PLACEHOLDER,
    contactPhone: phoneFromDoc !== undefined ? phoneFromDoc : CONTACT_PAGE_FALLBACK.contactPhone,
    businessHours: doc?.businessHours?.trim() || CONTACT_PAGE_FALLBACK.businessHours,
    responsePromise: doc?.responsePromise?.trim() || CONTACT_PAGE_FALLBACK.responsePromise,
    paymentsNote: paymentsFromDoc !== undefined ? paymentsFromDoc : CONTACT_PAGE_FALLBACK.paymentsNote,
  };
}

export function subjectLabelForValue(options: ContactSubjectOption[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function toTelHref(phone: string) {
  const cleaned = stripCmsTestPrefix(phone).replace(/[^\d+]/g, "");
  return cleaned.length >= 8 ? `tel:${cleaned}` : undefined;
}
