"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function TenPercentCalculator() {
  const [raw, setRaw] = useState("");

  const quote = useMemo(() => {
    const parsed = Number.parseFloat(raw.replace(/,/g, ""));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }, [raw]);

  const discounted = quote * 0.9;
  const saving = quote * 0.1;

  return (
    <div className="glass-surface rounded-3xl p-5 sm:p-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-highlight">
        <Calculator className="h-4 w-4" aria-hidden />
        The 10% calculator
      </div>
      <div className="mt-5 space-y-2">
        <Label htmlFor="project-quote" className="text-sm font-medium text-muted-foreground">
          Enter project quote ($)
        </Label>
        <Input
          id="project-quote"
          inputMode="decimal"
          placeholder="e.g. 500"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
        />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/80 bg-muted/30 px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">Discounted settlement</p>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-foreground">{formatMoney(discounted)}</p>
        </div>
        <div className="rounded-2xl border border-border/80 bg-muted/30 px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">Saving</p>
          <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-highlight">
            -{formatMoney(saving)}
          </p>
        </div>
      </div>
    </div>
  );
}
