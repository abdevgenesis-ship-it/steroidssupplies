import Link from "next/link";
import { AlertCircle, Package } from "lucide-react";
import { Container } from "@/components/layout/container";

type ComplianceBannerProps = {
  pactActNotice?: string;
  nicotineWarning?: string;
  thcWarning?: string;
  fdaDisclaimer?: string;
};

export function ComplianceBanner({
  pactActNotice,
  nicotineWarning,
  thcWarning,
  fdaDisclaimer,
}: ComplianceBannerProps) {
  return (
    <div className="w-full border-section-t bg-card">
      <Container className="py-5 sm:py-6">
        {/* PACT Act Notice */}
        <div className="mb-4 flex items-start gap-3 sm:mb-6 sm:gap-4">
          <AlertCircle className="mt-1 shrink-0 text-destructive" size={18} />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
              Regulatory Notice
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {pactActNotice ||
                "THCPensBulk is a licensed B2B wholesale distributor operating in compliance with applicable federal and state regulations. All THC products are sold lawfully only where permitted. Buyers are solely responsible for ensuring legal compliance in their jurisdiction."}
            </p>
          </div>
        </div>

        {/* Nicotine Warning */}
        <div className="flex items-start gap-3 sm:gap-4">
          <Package className="mt-1 shrink-0 text-accent-foreground" size={18} />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
              Disclaimers & Warnings
            </h3>
            <ul className="mt-2 list-outside list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              <li>
                <strong>Age Restriction:</strong>{" "}
                {nicotineWarning ||
                  "For adults 21 years of age or older only. Keep all THC products out of reach of children and pets. Do not use while pregnant, nursing, or operating heavy machinery."}
              </li>
              <li>
                <strong>THC & Cannabinoid Products:</strong>{" "}
                {thcWarning ||
                  "THC and cannabinoid products are subject to federal, state, and destination-market regulations. Customers must verify local legality before ordering. For adults 21+ only."}
              </li>
              <li>
                <strong>Health Disclaimer:</strong>{" "}
                {fdaDisclaimer ||
                  "These statements have not been evaluated by a medicines regulator. Food supplements are not intended to diagnose, treat, cure, or prevent any disease."}
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground/75 sm:mt-6 sm:text-sm">
          For more information about compliance, shipping restrictions, and refund policies, please review our{" "}
          <Link href="/privacy" className="underline transition-colors hover:text-muted-foreground">
            Privacy Policy
          </Link>
          , <Link href="/terms" className="underline transition-colors hover:text-muted-foreground">
            Terms of Service
          </Link>
          , and{" "}
          <Link href="/age-policy" className="underline transition-colors hover:text-muted-foreground">
            Age Verification Policy
          </Link>
          .
        </p>
      </Container>
    </div>
  );
}
