"use client";

import { useMemo, useState } from "react";

import { ProductPurchaseActions } from "@/components/product/ProductPurchaseActions";
import { ProductVariantSelectors } from "@/components/product/ProductVariantSelectors";
import type { ProductVariant } from "@/types/sanity";

type ProductVariantPurchasePanelProps = {
  productId: string;
  productName: string;
  variants: ProductVariant[];
};

function uniqueValues(values: Array<string | undefined>) {
  return Array.from(new Set(values.map((value) => value?.trim()).filter((value): value is string => Boolean(value))));
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

export function ProductVariantPurchasePanel({
  productId,
  productName,
  variants,
}: ProductVariantPurchasePanelProps) {
  const activeVariants = useMemo(
    () => variants.filter((variant) => variant.isActive !== false),
    [variants],
  );

  const initialVariant = useMemo(() => {
    if (activeVariants.length === 0) {
      return undefined;
    }
    return activeVariants.find((variant) => variant.isDefault) || activeVariants[0];
  }, [activeVariants]);

  const [selectedFlavor, setSelectedFlavor] = useState(initialVariant?.flavor?.trim() || "");
  const [selectedPackSize, setSelectedPackSize] = useState(initialVariant?.packSize?.trim() || "");

  const flavorOptions = useMemo(() => uniqueValues(activeVariants.map((variant) => variant.flavor)), [activeVariants]);

  const packSizeOptions = useMemo(() => {
    const pool = selectedFlavor
      ? activeVariants.filter((variant) => variant.flavor?.trim() === selectedFlavor)
      : activeVariants;
    return uniqueValues(pool.map((variant) => variant.packSize));
  }, [activeVariants, selectedFlavor]);

  const selectedVariant = useMemo(() => {
    const exact = activeVariants.find(
      (variant) =>
        (variant.flavor?.trim() || "") === selectedFlavor &&
        (variant.packSize?.trim() || "") === selectedPackSize,
    );

    if (exact) {
      return exact;
    }

    const flavorPool = selectedFlavor
      ? activeVariants.filter((variant) => (variant.flavor?.trim() || "") === selectedFlavor)
      : activeVariants;

    if (flavorPool.length > 0) {
      return flavorPool.find((variant) => variant.isDefault) || flavorPool[0];
    }

    return initialVariant;
  }, [activeVariants, initialVariant, selectedFlavor, selectedPackSize]);

  const selectedPrice = useMemo(() => {
    if (typeof selectedVariant?.price === "number" && Number.isFinite(selectedVariant.price) && selectedVariant.price > 0) {
      return selectedVariant.price;
    }

    const prices = activeVariants
      .map((variant) => variant.price)
      .filter((value): value is number => typeof value === "number" && Number.isFinite(value) && value > 0);

    if (prices.length === 0) {
      return 0;
    }

    return Math.min(...prices);
  }, [activeVariants, selectedVariant]);

  const effectiveFlavor = selectedVariant?.flavor?.trim() || selectedFlavor;
  const effectivePackSize = selectedVariant?.packSize?.trim() || selectedPackSize;

  const purchaseIdSuffix = selectedVariant?.sku?.trim() || [effectiveFlavor, effectivePackSize].filter(Boolean).join("-") || "default";
  const purchaseProductId = `${productId}:${purchaseIdSuffix}`;

  const onFlavorChange = (value: string) => {
    setSelectedFlavor(value);

    const packsForFlavor = uniqueValues(
      activeVariants
        .filter((variant) => (variant.flavor?.trim() || "") === value)
        .map((variant) => variant.packSize),
    );

    if (packsForFlavor.length === 0) {
      setSelectedPackSize("");
      return;
    }

    if (!packsForFlavor.includes(selectedPackSize)) {
      setSelectedPackSize(packsForFlavor[0]);
    }
  };

  const onPackSizeChange = (value: string) => {
    setSelectedPackSize(value);
  };

  return (
    <div className="space-y-4">
      <ProductVariantSelectors
        flavors={flavorOptions}
        packSizes={packSizeOptions}
        selectedFlavor={effectiveFlavor}
        selectedPackSize={effectivePackSize}
        onFlavorChange={onFlavorChange}
        onPackSizeChange={onPackSizeChange}
      />

      <div className="rounded-2xl border border-border bg-background p-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Selected Price</p>
        <p className="mt-1 text-2xl font-semibold">{selectedPrice > 0 ? formatPrice(selectedPrice) : "Request Pricing"}</p>
        {effectivePackSize ? <p className="mt-1 text-xs text-muted-foreground">Pack Size: {effectivePackSize}</p> : null}
      </div>

      <ProductPurchaseActions
        productId={purchaseProductId}
        productName={productName}
        unitPrice={selectedPrice}
        selectedFlavor={effectiveFlavor}
        selectedPackSize={effectivePackSize}
      />
    </div>
  );
}
