import { z } from "zod";

import { wholesaleOrderItemSchema } from "@/lib/wholesale/orderItems";

// Legacy fallback interests - map category group names to IDs
// These are used when Sanity config is unavailable
export const DEFAULT_PRODUCT_INTERESTS = [
  { value: "anavar", label: "Anavar (Oxandrolone)" },
  { value: "trenbolone", label: "Trenbolone" },
  { value: "injectable-steroids", label: "Injectable Steroids" },
  { value: "oral-steroids", label: "Oral Steroids" },
  { value: "pct", label: "PCT (Post Cycle Therapy)" },
  { value: "performance-bundles", label: "Performance Bundles" },
] as const;

export const DEFAULT_ORDER_VALUE_OPTIONS = [
  { value: "range-500", label: "£500 - £1,500" },
  { value: "range-1500", label: "£1,500 - £5,000" },
  { value: "range-5000", label: "£5,000 - £10,000" },
  { value: "range-10000", label: "£10,000+" },
] as const;

export const DEFAULT_PAYMENT_METHOD_OPTIONS = [
  { value: "crypto", label: "Cryptocurrency (BTC / ETH / USDT)" },
  { value: "revolut", label: "Revolut / Card" },
  { value: "bank-transfer", label: "Bank Transfer / SEPA" },
] as const;

// Generic form field labels (no product-specific wording)
export const DEFAULT_FORM_LABELS = {
  businessNameLabel: "Business Name",
  businessNameHelp: "Your company or business name",
  contactNameLabel: "Contact Name",
  contactNameHelp: "Primary contact person",
  emailLabel: "Email Address",
  emailHelp: "We'll send confirmation to this address",
  phoneLabel: "Phone Number",
  phoneHelp: "Your business or personal phone number",
  countryStateLabel: "Country / Region",
  countryStateHelp: "Your location",
  productInterestsLabel: "Product Interests",
  productInterestsHelp: "Select at least one option",
  orderValueLabel: "Estimated Order Value",
  orderValueHelp: "Your typical order range",
  paymentMethodLabel: "Preferred Payment Method",
  paymentMethodHelp: "How you'd prefer to pay",
  notesLabel: "Additional Notes (Optional)",
  notesHelp: "Any additional information",
  submitButtonText: "Submit Inquiry",
} as const;

// Legacy exports for backward compatibility
export const PRODUCT_INTEREST_IDS = ["anavar", "trenbolone", "injectable-steroids", "oral-steroids", "pct", "performance-bundles"] as const;
export const PRODUCT_INTEREST_LABELS: Record<(typeof PRODUCT_INTEREST_IDS)[number], string> = {
  "anavar": "Anavar (Oxandrolone)",
  "trenbolone": "Trenbolone",
  "injectable-steroids": "Injectable Steroids",
  "oral-steroids": "Oral Steroids",
  "pct": "PCT (Post Cycle Therapy)",
  "performance-bundles": "Performance Bundles",
};

export const ORDER_VALUE_OPTIONS = [
  { value: "range-500", label: "£500 - £1,500" },
  { value: "range-1500", label: "£1,500 - £5,000" },
  { value: "range-5000", label: "£5,000 - £10,000" },
  { value: "range-10000", label: "£10,000+" },
] as const;
export const PAYMENT_METHOD_OPTIONS = [
  { value: "crypto", label: "Cryptocurrency (BTC / ETH / USDT)" },
  { value: "revolut", label: "Revolut / Card" },
  { value: "bank-transfer", label: "Bank Transfer / SEPA" },
] as const;

// Dynamic schema generator - allows any values
export function createWholesaleFormSchema(
  productInterestIds: string[],
  orderValueIds: string[],
  paymentMethodIds: string[]
) {
  return z.object({
    businessName: z.string().trim().min(1, "Business name is required"),
    contactName: z.string().trim().min(1, "Contact name is required"),
    email: z.string().trim().email("Enter a valid email"),
    phone: z.string().trim().min(1, "Phone is required"),
    countryState: z.string().trim().min(1, "Country / region is required"),
    productInterests: z
      .array(z.enum(productInterestIds as [string, ...string[]]))
      .min(1, "Select at least one product"),
    estimatedOrderValue: z.enum(orderValueIds as [string, ...string[]]),
    paymentMethod: z.enum(paymentMethodIds as [string, ...string[]]),
    notes: z.string().trim().optional(),
    orderItems: z.array(wholesaleOrderItemSchema).optional(),
  });
}

// Default schema using generic options
export const validateWholesaleFormSchema = createWholesaleFormSchema(
  PRODUCT_INTEREST_IDS as unknown as string[],
  ORDER_VALUE_OPTIONS.map(o => o.value) as string[],
  PAYMENT_METHOD_OPTIONS.map(p => p.value) as string[]
);

export type WholesaleInquiryInput = z.infer<typeof validateWholesaleFormSchema>;
