"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

import { ProductSortSelect, type ProductSortValue } from "@/components/shop/ProductSortSelect";

type CategoryFilterSortBarProps = {
  categoryName: string;
  label: string;
  viewAllLabel: string;
};

function getSortFromParam(value: string | null): ProductSortValue {
  if (value === "price-low-high" || value === "price-high-low" || value === "newest") {
    return value;
  }
  return "featured";
}

export function CategoryFilterSortBar({ categoryName, label, viewAllLabel }: CategoryFilterSortBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortValue = getSortFromParam(searchParams.get("sort"));

  const onSortChange = (next: ProductSortValue) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", next);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <section
      aria-label="Category filter and sort controls"
      className="glass-listing mt-6 rounded-2xl p-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium">{label}</span>
          <span className="max-w-full truncate rounded-full border border-border/70 bg-muted/50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.11em] text-foreground backdrop-blur-sm">
            {categoryName}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <ProductSortSelect value={sortValue} onValueChange={onSortChange} />
          <Link href="/products" className="text-xs font-medium text-highlight hover:underline">
            {viewAllLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
