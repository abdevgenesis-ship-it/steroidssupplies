"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProductQuantitySelectorProps = {
  min?: number;
  max?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
};

export function ProductQuantitySelector({
  min = 1,
  max = 999,
  defaultValue = 1,
  value,
  onChange,
}: ProductQuantitySelectorProps) {
  const [internalQuantity, setInternalQuantity] = useState(
    Math.max(min, Math.min(defaultValue, max)),
  );

  const quantity = value ?? internalQuantity;

  const updateQuantity = (next: number) => {
    const normalized = Math.max(min, Math.min(next, max));

    if (value === undefined) {
      setInternalQuantity(normalized);
    }

    onChange?.(normalized);
  };

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        Quantity
      </p>
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => updateQuantity(quantity - 1)}
          disabled={quantity <= min}
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" aria-hidden={true} />
        </Button>

        <Input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={quantity}
          onChange={(event) => updateQuantity(Number(event.target.value) || min)}
          className="h-8 w-18 border-none bg-transparent px-0 text-center text-sm font-semibold shadow-none focus-visible:ring-0"
          aria-label="Quantity"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => updateQuantity(quantity + 1)}
          disabled={quantity >= max}
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden={true} />
        </Button>
      </div>
    </div>
  );
}
