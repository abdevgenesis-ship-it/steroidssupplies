"use client";

import { ArrowDownUp } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
 ] as const;

export type ProductSortValue = (typeof sortOptions)[number]["value"];

type ProductSortSelectProps = {
  value: ProductSortValue;
  onValueChange: (value: ProductSortValue) => void;
};

export function ProductSortSelect({ value, onValueChange }: ProductSortSelectProps) {
  return (
    <div className="flex min-w-0 w-full items-center gap-2 sm:w-auto">
      <ArrowDownUp className="h-4 w-4 text-muted-foreground" aria-hidden={true} />
      <Select value={value} onValueChange={(next) => onValueChange(next as ProductSortValue)}>
        <SelectTrigger className="w-full min-w-0 sm:w-52 text-foreground">
          <SelectValue placeholder="Sort products" />
        </SelectTrigger>
        <SelectContent
          className="w-(--radix-select-trigger-width) min-w-52 border border-border/90 bg-popover/95 p-1 text-foreground shadow-2xl backdrop-blur-md ring-1 ring-inset ring-border/50"
          align="end"
        >
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
