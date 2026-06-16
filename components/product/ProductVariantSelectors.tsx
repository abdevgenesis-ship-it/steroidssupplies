"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductVariantSelectorsProps = {
  flavors: string[];
  packSizes: string[];
  selectedFlavor: string;
  selectedPackSize: string;
  onFlavorChange: (value: string) => void;
  onPackSizeChange: (value: string) => void;
};

export function ProductVariantSelectors({
  flavors,
  packSizes,
  selectedFlavor,
  selectedPackSize,
  onFlavorChange,
  onPackSizeChange,
}: ProductVariantSelectorsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Flavor
        </Label>
        <Select value={selectedFlavor} onValueChange={onFlavorChange}>
          <SelectTrigger
            className="w-full border-border bg-card text-foreground shadow-sm hover:border-highlight/40 focus-visible:border-highlight"
            disabled={flavors.length === 0}
          >
            <SelectValue placeholder="Select flavor" />
          </SelectTrigger>
          <SelectContent className="border border-border bg-card text-foreground">
            {flavors.length > 0 ? (
              flavors.map((flavor) => (
                <SelectItem key={flavor} value={flavor} className="text-foreground">
                  {flavor}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                Not available in CMS
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Pack Size
        </Label>
        <Select value={selectedPackSize} onValueChange={onPackSizeChange}>
          <SelectTrigger
            className="w-full border-border bg-card text-foreground shadow-sm hover:border-highlight/40 focus-visible:border-highlight"
            disabled={packSizes.length === 0}
          >
            <SelectValue placeholder="Select pack size" />
          </SelectTrigger>
          <SelectContent className="border border-border bg-card text-foreground">
            {packSizes.length > 0 ? (
              packSizes.map((packSize) => (
                <SelectItem key={packSize} value={packSize} className="text-foreground">
                  {packSize}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                Not available in CMS
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
