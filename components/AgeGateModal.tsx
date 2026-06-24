"use client";

import { useAgeGate } from "@/hooks/useAgeGate";
import { Button } from "@/components/ui/button";

export function AgeGateModal() {
  const { isChecking, isOpen, acceptAge, declineAge } = useAgeGate();

  if (isChecking || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="glass-surface w-full max-w-md rounded-2xl border-primary/30 p-5 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Age Verification
        </p>
        <h2 className="mt-3 font-heading text-[1.7rem] leading-tight sm:text-3xl">
          Are you 18 or older?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          You must be at least 18 years old to access this website and purchase anabolic steroids and performance compounds.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button onClick={acceptAge} className="h-10 text-sm font-semibold uppercase tracking-[0.08em] sm:h-11">
            Yes, I am 18+
          </Button>
          <Button
            onClick={declineAge}
            variant="secondary"
            className="h-10 text-sm font-semibold uppercase tracking-[0.08em] sm:h-11"
          >
            No, Exit
          </Button>
        </div>
      </div>
    </div>
  );
}
