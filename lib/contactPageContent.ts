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
  seoTitle: "Contact Steroids Supplies | 24/7 Priority Support",
  seoDescription:
    "Reach out to the customer support team at Steroids Supplies. Get immediate help with retail orders, custom wholesale tiers, and tracking.",
  pageHeading: "Contact Steroids Supplies – Direct Retail & Wholesale Support",
  introLead:
    "Our dedicated team of logistics experts and account managers is online 24/7 to facilitate your procurement needs.",
  formHeading: "Submit a Direct Assistance Request Ticket",
  formIntro:
    "At Steroids Supplies, we back up our lightning-fast 48-hour shipping with responsive, round-the-clock customer support. Whether you are an individual client tracking a priority express order or a high-volume commercial wholesale buyer coordinating a massive bulk inventory shipment, our team is standing by to assist. To reach our support staff, please utilize our fully encrypted secure contact forms, or connect directly via our monitored secure chat channels listed on this page.",
  nameFieldLabel: "Full name",
  emailFieldLabel: "Email address",
  subjectFieldLabel: "Subject",
  messageFieldLabel: "Message",
  submitButtonLabel: "Send message",
  subjectOptions: DEFAULT_SUBJECTS,
  successTitle: "Message received",
  successMessage:
    "Thanks for contacting Steroids Supplies. A team member will follow up soon. If your request is urgent, reply to your confirmation email.",
  detailsHeading: "Contact details",
  contactEmail: "support@steroidssupplies.co.uk",
  contactPhone: "",
  businessHours:
    "Monday–Friday, 08:30–17:30 UTC. Priority 24/7 support available for active wholesale accounts.",
  responsePromise: "All customer inquiries are handled with absolute confidentiality and resolved within a maximum of 12 hours.",
  paymentsNote:
    "For B2B wholesale accounts, please use our Wholesale Application form to register your business. COA documentation and tiered pricing sheets are available on request.",
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
