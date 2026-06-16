import { AlertTriangle } from "lucide-react";

type NicotineTHCWarningProps = {
  nicotineWarning?: string;
  thcWarning?: string;
  fdaDisclaimer?: string;
};

export function NicotineTHCWarning({
  nicotineWarning,
  thcWarning,
  fdaDisclaimer,
}: NicotineTHCWarningProps) {
  return (
    <div className="space-y-5 rounded-md border border-destructive/20 bg-destructive/5 p-4 sm:space-y-6 sm:p-6">
      {/* Safety Warning */}
      <div>
        <div className="flex items-start gap-3 sm:gap-4">
          <AlertTriangle className="mt-0.5 shrink-0 text-destructive" size={20} />
          <div>
            <h3 className="text-base font-semibold text-destructive sm:text-lg">Product Safety</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {nicotineWarning ||
                "For adults 18 years of age or older only. Keep all performance compounds out of reach of children and pets. Do not use if pregnant or nursing. Never administer any compound without direct medical supervision from a licensed clinical professional."}
            </p>
          </div>
        </div>
      </div>

      {/* AAS Notice */}
      <div className="border-t border-destructive/20 pt-5 sm:pt-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <AlertTriangle className="mt-0.5 shrink-0 text-destructive" size={20} />
          <div>
            <h3 className="text-base font-semibold text-destructive sm:text-lg">Anabolic Steroids (AAS) Notice</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {thcWarning ||
                "Anabolic androgenic steroids are subject to regional and national laws. Customers must verify local legality before ordering. For adults 18+ only. Never administer without direct medical supervision."}
            </p>
          </div>
        </div>
      </div>

      {/* General Disclaimer */}
      <div className="border-t border-destructive/20 pt-5 sm:pt-6">
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {fdaDisclaimer ||
            "These statements have not been evaluated by a medicines regulator. Food supplements are not intended to diagnose, treat, cure, or prevent any disease. By purchasing and using these products, you acknowledge that you have read and understood all warnings and disclaimers, and you assume all responsibility for proper and legal use."}
        </p>
      </div>
    </div>
  );
}
