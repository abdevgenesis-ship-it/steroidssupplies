import Link from "next/link";
import { ArrowRight, Truck, Zap, MapPin, ShieldCheck } from "lucide-react";
import { SiBitcoin, SiEthereum, SiRevolut, SiTether } from "react-icons/si";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

const cryptoPaymentOptions = [
  { label: "Bitcoin", short: "BTC", icon: SiBitcoin, iconClassName: "text-[#F7931A]" },
  { label: "Ethereum", short: "ETH", icon: SiEthereum, iconClassName: "text-[#627EEA]" },
  { label: "Tether", short: "USDT", icon: SiTether, iconClassName: "text-[#26A17B]" },
] as const;

const revolutPaymentOption = {
  label: "Revolut",
  short: "REV",
  icon: SiRevolut,
  iconClassName: "text-primary",
} as const;

const fulfilmentFeatures = [
  { label: "48-Hour Tracked Delivery", short: "Standard", icon: Truck, iconClassName: "text-primary" },
  { label: "Priority Same-Day Dispatch", short: "Urgent", icon: Zap, iconClassName: "text-highlight" },
  { label: "UK & Ireland Coverage", short: "Regions", icon: MapPin, iconClassName: "text-primary" },
] as const;

const assuranceFeature = {
  label: "Authentic, Lab-Verified Stock",
  short: "Quality",
  icon: ShieldCheck,
  iconClassName: "text-highlight",
} as const;

export type HomePromoBannerVariant = "crypto" | "delivery";

type HomePromoBannerProps = {
  variant: HomePromoBannerVariant;
  eyebrow: string;
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

function CryptoVisualPanel() {
  return (
    <div className="grid gap-2.5 sm:gap-4">
      <article className="glass-surface rounded-xl p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 sm:p-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {cryptoPaymentOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.label}
                className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-2 sm:gap-3 sm:p-2.5"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/80 bg-muted/50 backdrop-blur-md sm:h-10 sm:w-10">
                  <Icon className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${option.iconClassName}`} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-muted-foreground sm:text-[11px] sm:tracking-[0.13em]">
                    {option.short}
                  </p>
                  <p className="text-xs font-semibold leading-tight text-foreground sm:text-sm">{option.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </article>
      <article className="glass-surface rounded-xl p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 sm:p-4">
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-muted/50 backdrop-blur-md sm:h-11 sm:w-11">
            <revolutPaymentOption.icon
              className={`h-4.5 w-4.5 sm:h-5 sm:w-5 ${revolutPaymentOption.iconClassName}`}
            />
          </span>
          <div className="-mt-1 sm:-mt-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-muted-foreground sm:text-[11px] sm:tracking-[0.13em]">
              {revolutPaymentOption.short}
            </p>
            <p className="text-base font-semibold leading-tight text-foreground sm:text-3xl">{revolutPaymentOption.label}</p>
          </div>
        </div>
      </article>
    </div>
  );
}

function DeliveryVisualPanel() {
  return (
    <div className="grid gap-2.5 sm:gap-4">
      <article className="glass-surface rounded-xl p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 sm:p-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {fulfilmentFeatures.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.label}
                className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-2 sm:gap-3 sm:p-2.5"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/80 bg-muted/50 backdrop-blur-md sm:h-10 sm:w-10">
                  <Icon className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${option.iconClassName}`} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-muted-foreground sm:text-[11px] sm:tracking-[0.13em]">
                    {option.short}
                  </p>
                  <p className="text-xs font-semibold leading-tight text-foreground sm:text-sm">{option.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </article>
      <article className="glass-surface rounded-xl p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 sm:p-4">
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-muted/50 backdrop-blur-md sm:h-11 sm:w-11">
            <assuranceFeature.icon className={`h-4.5 w-4.5 sm:h-5 sm:w-5 ${assuranceFeature.iconClassName}`} />
          </span>
          <div className="-mt-1 sm:-mt-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-muted-foreground sm:text-[11px] sm:tracking-[0.13em]">
              {assuranceFeature.short}
            </p>
            <p className="text-base font-semibold leading-tight text-foreground sm:text-xl">{assuranceFeature.label}</p>
          </div>
        </div>
      </article>
    </div>
  );
}

export function HomePromoBanner({ variant, eyebrow, heading, description, ctaLabel, ctaHref }: HomePromoBannerProps) {
  return (
    <section
      className="border-section-y-primary bg-background text-foreground"
      data-home-promo={variant}
      aria-label={variant === "crypto" ? "Payment incentives" : "Rapid fulfilment"}
    >
      <Container className="section-y-tight">
        <div className="grid items-center gap-7 md:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-none">
            <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-highlight sm:text-[11px] sm:tracking-[0.18em]">
              <span className="h-px w-8 bg-highlight/70" />
              {eyebrow}
              <span className="h-px w-8 bg-highlight/70" />
            </p>
            <h2 className="mt-2 font-heading text-2xl leading-tight sm:text-3xl lg:text-[2.1rem] xl:text-4xl">{heading}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>

            <Button asChild variant="accent" size="lg" className="group/button mt-6 w-full sm:mt-7 sm:w-auto">
              <Link href={ctaHref} className="inline-flex items-center gap-2">
                <span>{ctaLabel}</span>
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>

          <div className="mx-auto w-full max-w-2xl lg:max-w-none">
            {variant === "crypto" ? <CryptoVisualPanel /> : <DeliveryVisualPanel />}
          </div>
        </div>
      </Container>
    </section>
  );
}
