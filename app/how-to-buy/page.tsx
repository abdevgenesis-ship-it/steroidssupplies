import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Bitcoin,
  Globe,
  Info,
  Shield,
  Smartphone,
  Square,
} from "lucide-react";
import { SiEthereum, SiTether } from "react-icons/si";

import { CopyAddressButton } from "@/components/how-to-buy/CopyAddressButton";
import { TenPercentCalculator } from "@/components/how-to-buy/TenPercentCalculator";
import { Container } from "@/components/layout/container";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_NAME, SITE_URL } from "@/config/seo";

const WALLETS = {
  /** Display-only example addresses from the published payment guide; replace with your live wallets in production. */
  usdtTrc20: "TR7NHqJ3diNMqQCYMAnvS9Z7U4S0C7K1",
  btc: "1A1zP1eP5QGefi2DMPFTL5SLmv7DivfNa",
  eth: "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
} as const;

const telegramConfirmHref =
  process.env.NEXT_PUBLIC_TELEGRAM_CONFIRM_URL?.trim() || "/contact";
const signalConfirmHref = process.env.NEXT_PUBLIC_SIGNAL_CONFIRM_URL?.trim() || "/contact";

const appMethods = [
  {
    name: "Revolut",
    benefit: "Instant settlement and integrated exchange.",
    note: null,
    buySteps: [
      "Open the app and log in",
      "Add funds to your account",
      "Go to the Crypto section",
      "Select BTC, ETH, or USDT",
      "Enter amount and confirm purchase",
    ],
    sendSteps: [
      "Go to Crypto → Send",
      "Paste our wallet address",
      "Select the correct network",
      "Enter the amount",
      "Confirm transaction",
    ],
    videoHref: "https://youtu.be/yakQwxppk4A?si=6aba2vRV72SWXWR5",
  },
  {
    name: "Cash App",
    benefit: "Most utilized method for US-based domestic hires.",
    note: null,
    buySteps: ["Open the app", "Tap Money → Buy Bitcoin", "Enter amount and confirm"],
    sendSteps: ["Go to Bitcoin → Withdraw", "Paste our BTC wallet address", "Enter amount and confirm"],
    videoHref: "https://youtu.be/fDjDH_WAvYI?si=oChrIyyr7rdRh0PT",
  },
  {
    name: "Venmo",
    benefit: "Simple transfer flow once verified.",
    note: "Ensure you have completed your identity verification on the app first.",
    buySteps: ["Open the app", "Navigate to Crypto section", "Choose coin and enter amount", "Confirm purchase"],
    sendSteps: ["Select crypto → Send/Transfer", "Paste wallet address", "Confirm transaction"],
    videoHref: "https://youtu.be/f2Dmrru4eK8?si=AGPgKWY0I6wNuH8w",
  },
  {
    name: "PayPal",
    benefit: "Trusted wallet and exchange interface.",
    note: "Ensure you have completed your identity verification on the app first.",
    buySteps: ["Log in to your account", "Go to Crypto section", "Select coin and enter amount", "Confirm"],
    sendSteps: ["Select crypto → Send", "Enter wallet address", "Confirm transaction"],
    videoHref: "https://youtu.be/TOK-efEehb4?si=aMHowsmifP7GIMWb",
  },
] as const;

const browserPlatforms = ["MoonPay", "Bybit", "Guardarian", "StealthEX", "SimpleSwap", "Swapzone"] as const;

const generalBrowserSteps = [
  "Choose a platform",
  "Select the cryptocurrency (BTC, ETH, or USDT TRC20)",
  "Enter the amount",
  "Paste our wallet address when prompted",
  "Complete payment (card or bank transfer)",
  "Confirm transaction",
] as const;

export const metadata: Metadata = {
  title: `How to Buy Crypto & Pay | ${SITE_NAME}`,
  description:
    "How to fund your order via secure crypto settlement: wallets, mobile apps, browser on-ramps, quick links, and confirmation steps for BTC, ETH, and USDT (TRC20).",
  openGraph: {
    title: `How to Buy Crypto & Pay | ${SITE_NAME}`,
    description:
      "How to fund your order via secure crypto settlement: wallets, mobile apps, browser on-ramps, quick links, and confirmation steps for BTC, ETH, and USDT (TRC20).",
    type: "website",
    url: `${SITE_URL}/how-to-buy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

function StepList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <Square className="mt-2 h-1.5 w-1.5 shrink-0 fill-highlight text-highlight" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionHeading({ children, icon: Icon }: { children: React.ReactNode; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <h2 className="flex items-center gap-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
      {Icon ? <Icon className="h-7 w-7 shrink-0 text-highlight" aria-hidden /> : null}
      <span>{children}</span>
    </h2>
  );
}

function WalletAddressField({ address }: { address: string }) {
  return (
    <div className="flex flex-row items-center gap-2 rounded-2xl border border-border bg-background/80 px-3 py-2.5">
      <div className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5">
        <code className="block w-max whitespace-nowrap font-mono text-[11px] leading-normal text-foreground sm:text-xs">{address}</code>
      </div>
      <CopyAddressButton address={address} className="shrink-0" />
    </div>
  );
}

export default function HowToBuyPage() {
  return (
    <main className="relative overflow-hidden bg-background pb-16 text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-24 h-80 w-80 rounded-full bg-highlight/10 blur-3xl" />
        <div className="absolute -right-28 top-40 h-96 w-96 rounded-full bg-foreground/5 blur-3xl" />
      </div>

      <SectionReveal y={18}>
        <section className="border-section-b bg-surface-elevated backdrop-blur-sm section-y-tight">
          <Container className="py-10 sm:py-12 lg:py-14">
            <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.22em] text-muted-foreground/90">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="underline-offset-4 hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-foreground">How to buy</li>
              </ol>
            </nav>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/90 bg-muted/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-highlight backdrop-blur-md">
              <Shield className="h-4 w-4 text-highlight" aria-hidden />
              10% operational discount
            </div>

            <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-[1.04] sm:text-5xl lg:text-6xl">How to buy and send crypto</h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Follow the exact steps below to buy BTC, ETH, or USDT and send it to our receiving wallets safely.
            </p>

            <div className="mt-10 max-w-xl">
              <TenPercentCalculator />
            </div>
          </Container>
        </section>
      </SectionReveal>

      <SectionReveal y={20} delay={0.03}>
        <Container className="section-y">
          <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            This guide ensures your transaction remains non-attributable. We provide step-by-step instructions for Revolut, Cash App, and web-based exchanges—designed for
            absolute beginners and professionals alike.
          </p>

          <div className="mt-12 space-y-6">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm text-highlight" aria-hidden>
                &gt;_
              </span>
              <SectionHeading>Supported crypto and receiving wallets</SectionHeading>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              We currently accept Bitcoin (BTC), Ethereum (ETH), and USDT (TRC20). We recommend USDT (TRC20) for fastest and lowest-fee payments.
            </p>
          </div>
        </Container>
      </SectionReveal>

      <SectionReveal y={20} delay={0.05}>
        <section className="border-section-y bg-muted/30">
          <Container className="section-y">
            <SectionHeading icon={Shield}>Our receiving wallets</SectionHeading>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              <Card tone="listing" className="border-border/80">
                <CardHeader className="flex-row items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#26A17B]/15">
                      <SiTether className="h-6 w-6 text-[#26A17B]" aria-hidden />
                    </span>
                    <div>
                      <CardTitle className="font-heading text-base">USDT (TRC20, recommended)</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">Tron (TRC20)</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-highlight/15 px-2.5 py-1 text-[10px] font-semibold text-highlight">Fastest / lowest fees</span>
                </CardHeader>
                <CardContent>
                  <WalletAddressField address={WALLETS.usdtTrc20} />
                </CardContent>
              </Card>

              <Card tone="listing" className="border-border/80">
                <CardHeader className="flex-row items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#F7931A]/15">
                      <Bitcoin className="h-6 w-6 text-[#F7931A]" aria-hidden />
                    </span>
                    <div>
                      <CardTitle className="font-heading text-base">Bitcoin (BTC)</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">Bitcoin network</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#F7931A]/15 px-2.5 py-1 text-[10px] font-semibold text-[#F7931A]">Native BTC</span>
                </CardHeader>
                <CardContent>
                  <WalletAddressField address={WALLETS.btc} />
                </CardContent>
              </Card>

              <Card tone="listing" className="border-border/80">
                <CardHeader className="flex-row items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#627EEA]/15">
                      <SiEthereum className="h-6 w-6 text-[#627EEA]" aria-hidden />
                    </span>
                    <div>
                      <CardTitle className="font-heading text-base">Ethereum (ETH)</CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">Ethereum (ERC-20)</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#627EEA]/15 px-2.5 py-1 text-[10px] font-semibold text-[#627EEA]">ERC-20</span>
                </CardHeader>
                <CardContent>
                  <WalletAddressField address={WALLETS.eth} />
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 flex items-start gap-2 rounded-2xl border border-highlight/25 bg-highlight/5 px-4 py-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-highlight" aria-hidden />
              <p className="leading-relaxed">Secure copy-paste reduces user error significantly.</p>
            </div>
          </Container>
        </section>
      </SectionReveal>

      <SectionReveal y={20} delay={0.07}>
        <Container className="section-y">
          <div className="space-y-2">
            <SectionHeading icon={Smartphone}>Instant funding via mobile apps</SectionHeading>
            <p className="text-sm font-medium text-muted-foreground">(No experience required)</p>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
              These apps allow you to buy and send in one interface. Use these for the lowest friction.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-1">
            {appMethods.map((method) => (
              <Card key={method.name} className="border-border/80">
                <CardHeader className="border-b border-border/60 pb-4">
                  <div className="flex items-start gap-3">
                    <Smartphone className="mt-1 h-6 w-6 text-muted-foreground" aria-hidden />
                    <div>
                      <CardTitle className="font-heading text-xl sm:text-2xl">{method.name}</CardTitle>
                      <p className="mt-1 text-sm font-medium text-highlight">{method.benefit}</p>
                      {method.note ? <p className="mt-2 text-xs text-muted-foreground">{method.note}</p> : null}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-6 pt-2 md:grid-cols-2">
                  <div>
                    <p className="border-l-4 border-highlight pl-3 text-sm font-semibold text-foreground">How to buy</p>
                    <StepList items={method.buySteps} />
                  </div>
                  <div>
                    <p className="border-l-4 border-highlight pl-3 text-sm font-semibold text-foreground">How to send</p>
                    <StepList items={method.sendSteps} />
                  </div>
                </CardContent>
                <CardContent className="border-t border-border/60 pt-5 pb-6">
                  <Button asChild variant="secondary" className="w-full sm:w-auto">
                    <Link href={method.videoHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                      Video guide
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </SectionReveal>

      <SectionReveal y={20} delay={0.09}>
        <section className="border-section-y bg-muted/30">
          <Container className="section-y">
            <div className="flex items-start gap-3">
              <Globe className="mt-1 h-7 w-7 shrink-0 text-highlight" aria-hidden />
              <div>
                <h2 className="font-heading text-2xl font-bold sm:text-3xl">Buy crypto in your browser</h2>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
                  Alternative method (no app required). If you cannot use the apps above, you can buy crypto directly from your browser and send it to our wallet in one step.
                </p>
                <div className="mt-4 flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span className="font-medium">Some platforms require identity verification (KYC).</span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {browserPlatforms.map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-center rounded-2xl border border-border bg-card px-3 py-4 text-center font-heading text-sm font-semibold sm:text-base"
                >
                  {name}
                </div>
              ))}
            </div>

            <div className="mt-10">
              <p className="text-sm font-semibold text-foreground underline decoration-highlight underline-offset-4">General steps</p>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {generalBrowserSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="mt-5 text-sm text-muted-foreground">
                Video guide:{" "}
                <span className="font-medium text-foreground">Coming soon</span>
              </p>
            </div>
          </Container>
        </section>
      </SectionReveal>

      <SectionReveal y={20} delay={0.11}>
        <Container className="section-y" id="strategic-quick-links">
          <SectionHeading>Strategic quick links</SectionHeading>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Choose and click on any of the links below to instantly access a crypto purchase platform. Make sure you enter our appropriate wallet address where required.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              {
                title: "Buy Bitcoin",
                body: "Make sure you enter our BTC wallet address. Click here to buy Bitcoin.",
                href: "https://buy.bitcoin.com/",
              },
              {
                title: "Buy Ethereum",
                body: "Ensure you insert our ETH wallet address. Click here to buy Ethereum.",
                href: "https://app.rampnetwork.com/exchange",
              },
              {
                title: "Buy USDT (TRC20)",
                body: "Network = TRC20 (TRON) and wallet = our USDT address.",
                href: "https://paybis.com/buy-tether-trc20/",
              },
            ].map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:border-highlight/40 hover:bg-muted/40"
                >
                  <div>
                    <p className="font-heading text-base font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-highlight" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </SectionReveal>

      <SectionReveal y={20} delay={0.12}>
        <Container className="section-y">
          <div className="rounded-3xl border border-destructive/35 bg-destructive/5 px-5 py-6 sm:px-8">
            <h2 className="font-heading text-xl font-bold text-destructive sm:text-2xl">Important warnings</h2>
            <p className="mt-2 text-sm font-medium text-destructive/90">Please read carefully before you send payment.</p>
            <ul className="mt-5 list-disc space-y-1 pl-5 text-sm leading-6 text-destructive/90 marker:text-destructive">
              <li>Sending the wrong cryptocurrency will result in loss of funds.</li>
              <li>Using the wrong network will result in loss of funds.</li>
              <li>Crypto payments cannot be reversed or refunded.</li>
              <li>Always copy and paste wallet addresses.</li>
              <li>Double-check all details before confirming.</li>
            </ul>
          </div>
        </Container>
      </SectionReveal>

      <SectionReveal y={20} delay={0.14}>
        <Container className="section-y" id="confirmation">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Confirmation &amp; project activation</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Your payment acts as the Commencement Bond. Once the blockchain confirms the transaction, your project is moved to the Active Operational Queue.
          </p>
          <blockquote className="mt-6 rounded-3xl border border-border bg-muted/30 px-5 py-5 text-sm italic leading-relaxed text-muted-foreground sm:px-8 sm:text-base">
            The commencement bond ensures dedicated allocation of our high-velocity hardware clusters to your specific target. This stake prevents network congestion and
            ensures 1:1 technician availability.
          </blockquote>

          <div className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-stretch">
            <Button asChild size="lg" className="flex-1 justify-center">
              <Link
                href={telegramConfirmHref}
                target={telegramConfirmHref.startsWith("http") ? "_blank" : undefined}
                rel={telegramConfirmHref.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                Send confirmation to Telegram
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="flex-1 justify-center border-border">
              <Link
                href={signalConfirmHref}
                target={signalConfirmHref.startsWith("http") ? "_blank" : undefined}
                rel={signalConfirmHref.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                Send confirmation to Signal
              </Link>
            </Button>
          </div>

          <div className="mt-8 space-y-2 text-center text-sm text-muted-foreground">
            <p>To activate your hire immediately, send the following to your lead technician:</p>
            <p>A screenshot of the Sent confirmation.</p>
            <p>The Transaction Hash (TXID) - a long string of letters and numbers.</p>
          </div>
        </Container>
      </SectionReveal>

      <SectionReveal y={20} delay={0.16}>
        <Container className="pb-4" id="crypto-video-guides">
          <p className="text-center text-xs text-muted-foreground">
            Use the <Link href="/contact">contact page</Link> if you need help matching a payment to your order.
          </p>
        </Container>
      </SectionReveal>
    </main>
  );
}
