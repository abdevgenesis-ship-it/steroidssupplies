"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ProductFiltersState = {
  categories: string[];
  brands: string[];
  productTypes: string[];
  priceRange: { min: number; max: number };
  puffRange: { min: number; max: number };
};

export type ProductFilterOptions = {
  categories: string[];
  brands: string[];
  productTypes: string[];
  priceRange: { min: number; max: number };
  puffRange: { min: number; max: number };
};

type ProductFiltersPanelProps = {
  idPrefix: string;
  value: ProductFiltersState;
  onChange: (next: ProductFiltersState) => void;
  options: ProductFilterOptions;
};

function FilterGroup({
  title,
  items,
  idPrefix,
  selected,
  onToggle,
  collapsible = false,
  defaultOpen = true,
}: {
  title: string;
  items: string[];
  idPrefix: string;
  selected: string[];
  onToggle: (item: string, checked: boolean) => void;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-3 border-t border-border/70 [border-top-width:0.5px] pt-4 first:border-t-0 first:pt-0">
      {collapsible ? (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between text-left"
          aria-expanded={isOpen}
          aria-controls={`${idPrefix}-${title.toLowerCase().replace(/\s+/g, "-")}-options`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.11em] text-muted-foreground">{title}</p>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      ) : (
        <p className="text-xs font-semibold uppercase tracking-[0.11em] text-muted-foreground">{title}</p>
      )}
      <div
        id={`${idPrefix}-${title.toLowerCase().replace(/\s+/g, "-")}-options`}
        className={`space-y-2.5 ${collapsible && !isOpen ? "hidden" : ""}`}
      >
        {items.map((item) => {
          const itemId = `${idPrefix}-${title.toLowerCase().replace(/\s+/g, "-")}-${item
            .toLowerCase()
            .replace(/\s+/g, "-")}`;

          return (
            <div key={itemId} className="group/field flex items-center gap-2.5">
              <Checkbox
                id={itemId}
                checked={selected.includes(item)}
                onCheckedChange={(checked) => onToggle(item, checked === true)}
              />
              <Label htmlFor={itemId} className="text-sm font-medium text-foreground/90">
                {item}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProductFiltersPanel({ idPrefix, value, onChange, options }: ProductFiltersPanelProps) {
  const {
    categories: selectedCategories,
    brands: selectedBrands,
    productTypes: selectedProductTypes,
    priceRange,
    puffRange,
  } = value;

  const {
    categories,
    brands,
    productTypes,
    priceRange: priceRangeOptions,
    puffRange: puffRangeOptions,
  } = options;

  const PRICE_MIN = priceRangeOptions.min;
  const PRICE_MAX = priceRangeOptions.max;
  const PUFF_MIN = puffRangeOptions.min;
  const PUFF_MAX = puffRangeOptions.max;

  const toggleInList = (list: string[], item: string, checked: boolean) => {
    if (checked) {
      return list.includes(item) ? list : [...list, item];
    }

    return list.filter((entry) => entry !== item);
  };

  const applyPriceMin = (raw: string) => {
    const n = parseInt(raw, 10);
    if (raw.trim() === "" || Number.isNaN(n)) {
      return;
    }
    let min = Math.max(PRICE_MIN, Math.min(n, PRICE_MAX));
    let max = priceRange.max;
    if (min >= max) {
      max = Math.min(PRICE_MAX, min + 1);
    }
    onChange({ ...value, priceRange: { min, max } });
  };

  const applyPriceMax = (raw: string) => {
    const n = parseInt(raw, 10);
    if (raw.trim() === "" || Number.isNaN(n)) {
      return;
    }
    let max = Math.max(PRICE_MIN, Math.min(n, PRICE_MAX));
    let min = priceRange.min;
    if (max <= min) {
      min = Math.max(PRICE_MIN, max - 1);
    }
    onChange({ ...value, priceRange: { min, max } });
  };

  const applyPuffMin = (raw: string) => {
    const n = parseInt(raw, 10);
    if (raw.trim() === "" || Number.isNaN(n)) {
      return;
    }
    let min = Math.max(PUFF_MIN, Math.min(n, PUFF_MAX));
    let max = puffRange.max;
    if (min >= max) {
      max = Math.min(PUFF_MAX, min + 1);
    }
    onChange({ ...value, puffRange: { min, max } });
  };

  const applyPuffMax = (raw: string) => {
    const n = parseInt(raw, 10);
    if (raw.trim() === "" || Number.isNaN(n)) {
      return;
    }
    let max = Math.max(PUFF_MIN, Math.min(n, PUFF_MAX));
    let min = puffRange.min;
    if (max <= min) {
      min = Math.max(PUFF_MIN, max - 1);
    }
    onChange({ ...value, puffRange: { min, max } });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-muted/50 text-highlight backdrop-blur-sm">
          <SlidersHorizontal className="h-4 w-4" aria-hidden={true} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Filter Inventory
          </p>
          <p className="text-sm font-semibold">Refine product results</p>
        </div>
      </div>

      <FilterGroup
        title="Category"
        items={categories}
        idPrefix={idPrefix}
        selected={selectedCategories}
        collapsible
        onToggle={(item, checked) =>
          onChange({
            ...value,
            categories: toggleInList(selectedCategories, item, checked),
          })
        }
      />

      <FilterGroup
        title="Brand"
        items={brands}
        idPrefix={idPrefix}
        selected={selectedBrands}
        collapsible
        onToggle={(item, checked) =>
          onChange({
            ...value,
            brands: toggleInList(selectedBrands, item, checked),
          })
        }
      />

      <div className="space-y-3 border-t border-border/70 [border-top-width:0.5px] pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.11em] text-muted-foreground">Price (USD)</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-price-from`} className="text-[11px] font-medium text-muted-foreground">
              From
            </Label>
            <Input
              id={`${idPrefix}-price-from`}
              type="number"
              inputMode="numeric"
              min={PRICE_MIN}
              max={PRICE_MAX}
              value={priceRange.min}
              onChange={(e) => applyPriceMin(e.target.value)}
              className="rounded-2xl text-sm"
              aria-label="Minimum price in dollars"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-price-to`} className="text-[11px] font-medium text-muted-foreground">
              To
            </Label>
            <Input
              id={`${idPrefix}-price-to`}
              type="number"
              inputMode="numeric"
              min={PRICE_MIN}
              max={PRICE_MAX}
              value={priceRange.max}
              onChange={(e) => applyPriceMax(e.target.value)}
              className="rounded-2xl text-sm"
              aria-label="Maximum price in dollars"
            />
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Catalog spans ${PRICE_MIN}–${PRICE_MAX}. Min must be below max.
        </p>
      </div>

      <div className="space-y-3 border-t border-border/70 [border-top-width:0.5px] pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.11em] text-muted-foreground">Puff count</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-puff-from`} className="text-[11px] font-medium text-muted-foreground">
              From
            </Label>
            <Input
              id={`${idPrefix}-puff-from`}
              type="number"
              inputMode="numeric"
              min={PUFF_MIN}
              max={PUFF_MAX}
              step={1}
              value={puffRange.min}
              onChange={(e) => applyPuffMin(e.target.value)}
              className="rounded-2xl text-sm"
              aria-label="Minimum puff count"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-puff-to`} className="text-[11px] font-medium text-muted-foreground">
              To
            </Label>
            <Input
              id={`${idPrefix}-puff-to`}
              type="number"
              inputMode="numeric"
              min={PUFF_MIN}
              max={PUFF_MAX}
              step={1}
              value={puffRange.max}
              onChange={(e) => applyPuffMax(e.target.value)}
              className="rounded-2xl text-sm"
              aria-label="Maximum puff count"
            />
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Catalog {PUFF_MIN.toLocaleString()}–{PUFF_MAX.toLocaleString()} puffs. From must be less than to.
        </p>
      </div>

      <FilterGroup
        title="Product Type"
        items={productTypes}
        idPrefix={idPrefix}
        selected={selectedProductTypes}
        collapsible
        onToggle={(item, checked) =>
          onChange({
            ...value,
            productTypes: toggleInList(selectedProductTypes, item, checked),
          })
        }
      />
    </div>
  );
}
