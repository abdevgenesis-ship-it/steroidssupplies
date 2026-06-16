import { HowToOrderContent } from "@/components/common/HowToOrderContent";
import type { MergedWholesalePage } from "@/lib/wholesale/content";
import { WHOLESALE_ICON_MAP } from "@/lib/wholesale/icons";

type WholesaleHowItWorksSectionProps = {
  content: MergedWholesalePage;
};

export function WholesaleHowItWorksSection({ content }: WholesaleHowItWorksSectionProps) {
  const howToOrderSteps = content.steps.map((step) => ({
    title: step.title,
    description: step.description,
    icon: WHOLESALE_ICON_MAP[step.iconKey] ?? WHOLESALE_ICON_MAP.search,
  }));

  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="stack-md border-section-t bg-background pt-12 sm:pt-14 lg:pt-16"
    >
      <div id="how-it-works-heading">
        <HowToOrderContent
          badgeText="Simple Process"
          heading={content.howHeading}
          intro={content.howIntro}
          steps={howToOrderSteps}
          ctaHref="/wholesale-request"
          ctaLabel="Start Your Order"
        />
      </div>
    </section>
  );
}