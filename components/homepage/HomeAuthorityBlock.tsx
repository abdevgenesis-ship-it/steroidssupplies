import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BadgeCheck, ShieldCheck, Truck, WalletCards } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  HOME_AUTHORITY_INTRO_H2_MARKER,
  HOME_AUTHORITY_INTRO_OUTRO_MARKER,
  type ResolvedAuthorityPoint,
} from "@/lib/homePageDefaults";
import {
  renderTextWithBold,
  parseAuthorityOutroCard,
  splitParagraphs,
} from "@/lib/content/renderTextWithBold";

const authoritySecondaryImage = {
  src: "/images/authority_retail_thc.png",
  alt: "SteroidsSupplies — pharmaceutical-grade anabolic steroids with COA verification documentation",
} as const;

const authorityIconByKey: Record<string, LucideIcon> = {
  badgeCheck: BadgeCheck,
  shieldCheck: ShieldCheck,
  walletCards: WalletCards,
  truck: Truck,
};

type HomeAuthorityBlockProps = {
  eyebrow: string;
  heading: string;
  intro: string;
  points: ResolvedAuthorityPoint[];
  ctaLabel: string;
  ctaHref: string;
  imageAlt: string;
};

function parseIntro(intro: string) {
  const introTrimmed = intro.trim();
  const withOutro = introTrimmed.includes(HOME_AUTHORITY_INTRO_OUTRO_MARKER)
    ? introTrimmed.split(HOME_AUTHORITY_INTRO_OUTRO_MARKER)
    : null;

  const mainIntro = withOutro && withOutro.length === 2 ? withOutro[0].trim() : introTrimmed;
  const outro = withOutro && withOutro.length === 2 ? withOutro[1].trim() : "";

  const introParts = mainIntro.includes(HOME_AUTHORITY_INTRO_H2_MARKER)
    ? mainIntro.split(HOME_AUTHORITY_INTRO_H2_MARKER)
    : null;
  const introSplit =
    introParts && introParts.length === 2 && introParts[0].trim() && introParts[1].trim()
      ? { lead: introParts[0].trim(), tail: introParts[1].trim() }
      : null;

  return { introTrimmed: mainIntro, introSplit, outro };
}

function RichParagraph({ text, className }: { text: string; className: string }) {
  return <p className={className}>{renderTextWithBold(text)}</p>;
}

const authorityCardIconClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08] text-primary ring-1 ring-primary/15";

const authorityCardBodyClass =
  "font-normal text-[13px] leading-[1.7] text-muted-foreground sm:text-sm sm:leading-relaxed [&_strong]:font-semibold [&_strong]:text-foreground/90";

const authorityCardTitleClass =
  "font-sans text-[15px] font-bold leading-snug tracking-tight text-foreground sm:text-base";

type AuthorityFeatureCardProps = {
  icon: LucideIcon;
  title?: string;
  children: ReactNode;
  className?: string;
};

function AuthorityFeatureCard({ icon: Icon, title, children, className }: AuthorityFeatureCardProps) {
  return (
    <li
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-4 shadow-[0_1px_2px_rgb(196_30_58/0.06)] transition-shadow duration-200 hover:shadow-[0_4px_14px_rgb(196_30_58/0.12)] sm:p-5",
        className,
      )}
    >
      <div className="flex items-start gap-3.5">
        <span className={authorityCardIconClass}>
          <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          {title ? <h3 className={authorityCardTitleClass}>{title}</h3> : null}
          <div className={cn(title ? "mt-2" : "", "space-y-2.5")}>{children}</div>
        </div>
      </div>
    </li>
  );
}

export function HomeAuthorityBlock({
  eyebrow,
  heading,
  intro,
  points,
  ctaLabel,
  ctaHref,
  imageAlt,
}: HomeAuthorityBlockProps) {
  const { introTrimmed, introSplit, outro } = parseIntro(intro);

  const introClass =
    "max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base";

  const leadIntroClass =
    "text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-[17px] lg:leading-7";

  const authorityPoints = points.map((item) => ({
    title: item.title,
    description: item.description,
    icon: authorityIconByKey[item.iconKey] ?? BadgeCheck,
  }));
  const outroCard = outro ? parseAuthorityOutroCard(outro) : null;
  return (
    <section className="relative overflow-hidden border-section-y-primary bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_20%_20%,rgb(196_30_58/0.10),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_90%_80%,rgb(127_29_29/0.08),transparent_50%)]"
      />
      <Container className="section-y relative">
        {introSplit && (eyebrow.trim() || introSplit.lead.trim()) ? (
          <div className="mx-auto w-full max-w-4xl px-6 sm:px-10 lg:px-16">
            {eyebrow.trim() ? (
              <h2 className="text-center font-sans text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                {eyebrow}
              </h2>
            ) : null}
            {introSplit.lead.trim() ? (
              <div className={eyebrow.trim() ? "mt-4 sm:mt-5" : ""}>
                {splitParagraphs(introSplit.lead).map((para, i) => (
                  <RichParagraph
                    key={`lead-${i}`}
                    text={para}
                    className={`${leadIntroClass} mt-3 text-justify first:mt-0`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div
          className={`grid items-start gap-8 md:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 ${
            introSplit && (eyebrow.trim() || introSplit.lead.trim()) ? "mt-8 md:mt-10 lg:mt-12" : ""
          }`}
        >
          <div className="order-2 mx-auto w-full max-w-2xl lg:order-1 lg:mx-0 lg:max-w-none">
            {!introSplit && eyebrow.trim() ? (
              <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-[11px] sm:tracking-[0.18em]">
                <span className="h-px w-8 bg-primary/70" />
                {eyebrow}
                <span className="h-px w-8 bg-primary/70" />
              </p>
            ) : null}
            {introSplit ? (
              <>
                <h2 className="font-sans text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[2.1rem] lg:leading-tight xl:text-4xl">
                  {renderTextWithBold(heading)}
                </h2>
                <div className="mt-4 lg:mt-5">
                  {splitParagraphs(introSplit.tail).map((para, i) => (
                    <RichParagraph key={`tail-${i}`} text={para} className={`${introClass} mt-3 first:mt-0`} />
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2
                  className={`font-sans text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[2.1rem] lg:leading-tight xl:text-4xl ${
                    eyebrow.trim() ? "mt-3" : ""
                  }`}
                >
                  {heading}
                </h2>
                <div className="mt-3">
                  {splitParagraphs(introTrimmed).map((para, i) => (
                    <RichParagraph key={`intro-${i}`} text={para} className={`${introClass} mt-3 first:mt-0`} />
                  ))}
                </div>
              </>
            )}

            <ul className="mt-6 grid grid-cols-1 items-start gap-4 sm:grid-cols-2 sm:gap-4 lg:mt-7">
              {authorityPoints.map((item) => {
                const Icon = item.icon;

                return (
                  <AuthorityFeatureCard key={item.title} icon={Icon} title={item.title}>
                    <p className={authorityCardBodyClass}>{renderTextWithBold(item.description)}</p>
                  </AuthorityFeatureCard>
                );
              })}

              {outroCard ? (
                <AuthorityFeatureCard key="authority-outro" icon={Truck} title={outroCard.title}>
                  {outroCard.paragraphs.map((para, i) => (
                    <p key={`outro-${i}`} className={cn(authorityCardBodyClass, "text-pretty")}>
                      {renderTextWithBold(para, `outro-${i}`)}
                    </p>
                  ))}
                </AuthorityFeatureCard>
              ) : null}
            </ul>

            <Button asChild size="lg" className="group/button mt-7 w-full sm:mt-8 sm:w-auto">
              <Link href={ctaHref} className="inline-flex items-center gap-2">
                <span>{ctaLabel}</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>

          <div className="order-1 mx-auto flex w-full max-w-2xl flex-col gap-4 lg:order-2 lg:max-w-none lg:gap-5">
            <div className="glass-surface relative overflow-hidden rounded-3xl border-primary/25 ring-1 ring-inset ring-border/50">
              <div className="relative aspect-4/3 w-full">
                <Image
                  src="/images/authority_scene.png"
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  priority={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.08)_0%,rgb(196_30_58/0.22)_100%)]" />
              </div>
            </div>
            <div className="glass-surface relative overflow-hidden rounded-3xl border-primary/25 ring-1 ring-inset ring-border/50">
              <div className="relative aspect-4/3 w-full">
                <Image
                  src={authoritySecondaryImage.src}
                  alt={authoritySecondaryImage.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  priority={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.08)_0%,rgb(196_30_58/0.22)_100%)]" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
