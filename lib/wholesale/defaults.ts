/**
 * Canonical wholesale page defaults (hero through FAQ).
 */
export const DEFAULT_WHOLESALE = {
  seoTitle: null as string | null,
  seoDescription: null as string | null,
  heroBadge: "Badge",
  heroHeading: "Heading",
  heroSecondaryHeading: "",
  heroSubhead: "Subheading",
  heroTrustLine1: "Trust line 1",
  heroTrustLine2: "Trust line 2",
  whyHeading: "Section heading",
  whyIntro: "Section introduction.",
  benefits: [
    {
      title: "Benefit 1",
      description: "Benefit description.",
      iconKey: "badgePercent" as const,
    },
    {
      title: "Benefit 2",
      description: "Benefit description.",
      iconKey: "package" as const,
    },
    {
      title: "Benefit 3",
      description: "Benefit description.",
      iconKey: "boxes" as const,
    },
    {
      title: "Benefit 4",
      description: "Benefit description.",
      iconKey: "wallet" as const,
    },
    {
      title: "Benefit 5",
      description: "Benefit description.",
      iconKey: "truck" as const,
    },
    {
      title: "Benefit 6",
      description: "Benefit description.",
      iconKey: "headphones" as const,
    },
  ],
  howHeading: "Section heading",
  howIntro: "Section introduction.",
  steps: [
    {
      title: "Step 1",
      description: "Step description.",
      iconKey: "search" as const,
    },
    {
      title: "Step 2",
      description: "Step description.",
      iconKey: "send" as const,
    },
    {
      title: "Step 3",
      description: "Step description.",
      iconKey: "fileText" as const,
    },
    {
      title: "Step 4",
      description: "Step description.",
      iconKey: "truck" as const,
    },
  ],
  discountHeading: "Section heading",
  discountIntro: "Section introduction.",
  paymentCardTitle: "Card title",
  paymentCardDescription: "Card description.",
  cryptoRowLabel: "Label 1",
  cryptoDiscountLabel: "Value 1",
  revolutRowLabel: "Label 2",
  revolutDiscountLabel: "Value 2",
  volumeCardTitle: "Card title",
  volumeCardDescription: "Card description.",
  volumeTiers: [
    { tier: "Tier 1", note: "Tier note." },
    { tier: "Tier 2", note: "Tier note." },
    { tier: "Tier 3", note: "Tier note." },
    { tier: "Tier 4", note: "Tier note." },
  ],
  discountSeeAlso: "",
  formHeading: "Form heading",
  formIntro: "Form introduction.",
  wholesaleRequestPage: {
    badge: "Badge",
    heading: "Heading",
    intro: "Introduction.",
    thankYouHeading: "Thank you heading",
    thankYouIntro: "Thank you introduction.",
    thankYouNextStepsTitle: "Next steps",
    thankYouUrgentHelpTitle: "Help title",
    thankYouUrgentHelpBody: "Help body.",
    supportEmail: "support@example.com",
  },
  testimonialsHeading: "Testimonials heading",
  testimonialsIntro: "Testimonials introduction.",
  faqHeading: "FAQ heading",
  faqIntro: "FAQ introduction.",
  faqs: [
    {
      question: "Question 1?",
      answer: "Answer text.",
    },
    {
      question: "Question 2?",
      answer: "Answer text.",
    },
    {
      question: "Question 3?",
      answer: "Answer text.",
    },
    {
      question: "Question 4?",
      answer: "Answer text.",
    },
    {
      question: "Question 5?",
      answer: "Answer text.",
    },
    {
      question: "Question 6?",
      answer: "Answer text.",
    },
  ],
} as const;
