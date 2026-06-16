import { Mail, PackageCheck, Search, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { HowToOrderContent } from "@/components/common/HowToOrderContent";
import { Container } from "@/components/layout/container";
import type { ResolvedHowToStep } from "@/lib/homePageDefaults";

const howToIconByKey: Record<string, LucideIcon> = {
  search: Search,
  send: Send,
  mail: Mail,
  packageCheck: PackageCheck,
};

type HomeHowToOrderProps = {
  badge: string;
  heading: string;
  intro?: string;
  steps: ResolvedHowToStep[];
  ctaLabel: string;
  ctaHref: string;
};

export function HomeHowToOrder({ badge, heading, intro, steps, ctaLabel, ctaHref }: HomeHowToOrderProps) {
  const resolvedSteps = steps.map((step) => ({
    title: step.title,
    description: step.description,
    icon: howToIconByKey[step.iconKey] ?? Search,
  }));

  return (
    <section className="border-section-y bg-background text-foreground">
      <Container className="section-y">
        <HowToOrderContent
          badgeText={badge}
          heading={heading}
          intro={intro}
          steps={resolvedSteps}
          ctaHref={ctaHref}
          ctaLabel={ctaLabel}
        />
      </Container>
    </section>
  );
}
