import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  ShieldCheck,
  Truck,
  Headset,
  CalendarCheck2,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import type { ResolvedTrustStripItem } from "@/lib/homePageDefaults";
import { cn } from "@/lib/utils";

const trustIconByKey: Record<string, LucideIcon> = {
  badgeCheck: BadgeCheck,
  shieldCheck: ShieldCheck,
  calendarCheck2: CalendarCheck2,
  truck: Truck,
  headset: Headset,
};

type HomeTrustStripProps = {
  items: ResolvedTrustStripItem[];
};

function splitTrustTitle(title: string): { primary: string; secondary: string | null } {
  const words = title.trim().split(/\s+/);
  if (words.length <= 2) {
    return { primary: title, secondary: null };
  }

  const splitAt = Math.ceil(words.length / 2);
  return {
    primary: words.slice(0, splitAt).join(" "),
    secondary: words.slice(splitAt).join(" "),
  };
}

function TrustStripCard({
  title,
  accent,
  icon: Icon,
  className,
}: {
  title: string;
  accent: string;
  icon: LucideIcon;
  className?: string;
}) {
  const isSky = accent === "cyan";
  const { primary, secondary } = splitTrustTitle(title);

  return (
    <article
      className={cn(
        "group flex min-h-[8.75rem] min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-2.5 rounded-2xl border border-border/70 bg-card px-2 py-4 text-center shadow-[0_2px_14px_rgb(196_30_58/0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_8px_24px_rgb(196_30_58/0.1)] sm:min-h-[9rem] sm:gap-3 sm:px-3 sm:py-5 lg:px-4",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
          isSky
            ? "bg-sky/12 text-sky group-hover:bg-sky/18"
            : "bg-highlight/12 text-highlight group-hover:bg-highlight/18",
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>

      <div className="space-y-0.5">
        <p className="text-[8px] font-bold uppercase leading-snug tracking-[0.1em] text-foreground sm:text-[10px] sm:tracking-[0.12em] lg:text-[11px]">
          {primary}
        </p>
        {secondary ? (
          <p className="text-[8px] font-bold uppercase leading-snug tracking-[0.1em] text-foreground sm:text-[10px] sm:tracking-[0.12em] lg:text-[11px]">
            {secondary}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function HomeTrustStrip({ items }: HomeTrustStripProps) {
  const trustItems = items.map((item) => ({
    title: item.title,
    accent: item.accent,
    icon: trustIconByKey[item.iconKey] ?? BadgeCheck,
  }));

  return (
    <section
      className="relative z-0 border-section-b-primary bg-background text-foreground"
      aria-label="Delivery and fulfilment highlights"
    >
      <Container className="py-8 sm:py-9 lg:py-10">
        <div className="flex flex-nowrap items-stretch gap-2 sm:gap-3 lg:gap-4">
          {trustItems.map((item) => (
            <TrustStripCard key={item.title} {...item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
