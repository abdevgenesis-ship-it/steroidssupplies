import type { Metadata } from "next"
import { Geist_Mono, Inter, Space_Grotesk } from "next/font/google"
import Script from "next/script"

import "./globals.css"
import { isAnalyticsEnabled } from "@/lib/analytics/gtag"
import { ThemeProvider } from "@/components/theme-provider"
import { JsonLdProvider } from "@/components/DefaultSeoProvider"
import { AnnounceBar } from "@/components/AnnounceBar"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { cn } from "@/lib/utils"
import { SEO_DEFAULTS } from "@/config/seo";
import { getSiteContent } from "@/lib/siteContent";
import { getCategories } from "@/lib/sanityClient";
import { CartProvider } from "@/hooks/useCart";
import { ToastProvider } from "@/hooks/useToast";
import { ToastViewport } from "@/components/ui/toast-viewport";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { AgeGateModal } from "@/components/AgeGateModal";

const spaceGroteskHeading = Space_Grotesk({subsets:['latin'],weight:['400','500','600','700'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: SEO_DEFAULTS.title,
  description: SEO_DEFAULTS.description,
  openGraph: SEO_DEFAULTS.openGraph,
  twitter: {
    card: 'summary_large_image',
    site: '@steroidssupplies',
    creator: '@steroidssupplies',
  },
  robots: SEO_DEFAULTS.robots as Metadata['robots'],
  alternates: {
    canonical: SEO_DEFAULTS.canonical,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [siteContent, categories] = await Promise.all([
    getSiteContent(),
    getCategories(),
  ])

  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
  const loadGa = isAnalyticsEnabled()

  return (
    <html
      lang="en-GB"
      className={cn("antialiased dark", fontMono.variable, "font-sans", inter.variable, spaceGroteskHeading.variable)}
      suppressHydrationWarning
    >
      <body>
        {loadGa && gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaId}', { send_page_view: true });
              `}
            </Script>
          </>
        ) : null}
        <ThemeProvider>
          <ToastProvider>
            <CartProvider>
              <JsonLdProvider>
                <AnnounceBar
                  text={siteContent.announcement.text}
                  href={siteContent.announcement.href}
                />
                <Header categories={categories} />
                {children}
                <Footer
                  warningText={siteContent.footer.warningText}
                  complianceText={siteContent.footer.complianceText}
                />
                <AgeGateModal />
                <ToastViewport />
                <WhatsAppWidget />
                <Script
                  id="chatway"
                  src="https://cdn.chatway.app/widget.js?id=g2cCVSyBsiLJ"
                  strategy="afterInteractive"
                />
              </JsonLdProvider>
            </CartProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
