import Link from "next/link"

import { Container } from "@/components/layout/container"
import { FOOTER_BRAND_LABEL, FOOTER_COMPLIANCE_PREFIX } from "@/config/seo"

const shopLinks = [
  { label: "Wholesale", href: "/wholesale" },
  { label: "Categories", href: "/categories" },
]

const wholesaleLinks = [
  { label: "Distributor Info", href: "/wholesale" },
  { label: "MOQ Info", href: "/wholesale/moq" },
  { label: "Shipping Info", href: "/shipping" },
]

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "How to Order", href: "/how-to-buy" },
  { label: "Legality & Compliance", href: "/compliance" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
  { label: "Locations", href: "/locations" },
  { label: "Directory", href: "/directory" },
]

const legalLinks = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refunds" },
  { label: "Safety & Warnings", href: "/age-policy" },
]

function FooterLinkGroup({
  heading,
  links,
}: {
  heading: string
  links: { label: string; href: string }[]
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-heading text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground">
        {heading}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[13px] text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

type FooterProps = {
  warningText?: string;
  complianceText?: string;
};

export function Footer({
  warningText = "For adults 21+ only. THC products may cause impairment. Do not drive or operate heavy machinery. Keep out of reach of children. THCPensBulk does not sell to persons under 21.",
  complianceText = `${FOOTER_COMPLIANCE_PREFIX} is a licensed B2B wholesale distributor of THC vape hardware and cartridges. Products are sold for lawful use only. Buyers are responsible for compliance with applicable local laws.`,
}: FooterProps) {
  return (
    <footer className="glass-chrome border-section-t text-foreground">
      {/* Main footer grid */}
      <Container className="py-10 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-5">
          {/* Brand column */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <Link href="/" className="inline-block">
              <div className="font-heading text-[26px] font-semibold leading-tight tracking-widest">
                <span className="block text-primary">THC</span>
                <span className="block text-foreground">PENS</span>
                <span className="block text-highlight">BULK</span>
              </div>
            </Link>
            <p className="text-[13px] leading-relaxed text-muted-foreground max-w-[200px]">
              Licensed B2B wholesale distributor of bulk THC vapes and 510
              cartridges. USA &amp; worldwide delivery.
            </p>
          </div>

          {/* Link columns */}
          <FooterLinkGroup heading="Shop" links={shopLinks} />
          <FooterLinkGroup heading="Wholesale" links={wholesaleLinks} />
          <FooterLinkGroup heading="Company" links={companyLinks} />
          <FooterLinkGroup heading="Legal" links={legalLinks} />
        </div>
      </Container>

      {/* Warning bar */}
      <div className="border-section-t">
        <Container className="py-4">
          <p className="text-center text-[11px] text-muted-foreground/80">
            {warningText}
          </p>
        </Container>
      </div>

      {/* Bottom compliance bar */}
      <div className="border-section-t">
        <Container className="flex flex-col items-center gap-3 py-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-[12px] text-muted-foreground">
            &copy; {new Date().getFullYear()} {FOOTER_BRAND_LABEL}. All rights
            reserved.
          </p>
          <p className="max-w-sm text-[11px] text-muted-foreground/90 sm:text-right">
            {complianceText}
          </p>
        </Container>
      </div>
    </footer>
  )
}
