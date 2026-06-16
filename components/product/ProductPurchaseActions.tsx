"use client";

import Link from "next/link";
import { useState } from "react";

import { ProductQuantitySelector } from "@/components/product/ProductQuantitySelector";
import { CartSidebar } from "@/components/shop/CartSidebar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";

type ProductPurchaseActionsProps = {
  productId: string;
  productName: string;
  unitPrice: number;
  selectedFlavor?: string;
  selectedPackSize?: string;
};

export function ProductPurchaseActions({
  productId,
  productName,
  unitPrice,
  selectedFlavor,
  selectedPackSize,
}: ProductPurchaseActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const {
    items: cartItems,
    itemCount,
    addItem,
    openCartSidebar,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart();
  const hasPrice = Number.isFinite(unitPrice) && unitPrice > 0;
  const variantBits = [selectedFlavor?.trim(), selectedPackSize?.trim()].filter(
    (value): value is string => Boolean(value),
  );
  const displayName = variantBits.length > 0 ? `${productName} - ${variantBits.join(" / ")}` : productName;

  const quoteParams = new URLSearchParams({
    product: productName,
    qty: String(quantity),
  });
  if (selectedFlavor?.trim()) {
    quoteParams.set("flavor", selectedFlavor.trim());
  }
  if (selectedPackSize?.trim()) {
    quoteParams.set("packSize", selectedPackSize.trim());
  }
  if (hasPrice) {
    quoteParams.set("unitPrice", unitPrice.toFixed(2));
  }

  const quoteHref = `/wholesale-request?${quoteParams.toString()}`;

  const addToCart = () => {
    if (!hasPrice) {
      return;
    }

    addItem({
      id: productId,
      name: displayName,
      price: unitPrice,
      quantity,
    });
    openCartSidebar();
    toast(`${displayName} added to cart`);
  };

  return (
    <div className="space-y-3">
      <ProductQuantitySelector min={1} max={999} value={quantity} onChange={setQuantity} />

      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" onClick={addToCart} disabled={!hasPrice} className="w-full text-xs">
          {hasPrice ? `Add to Cart${itemCount > 0 ? ` (${itemCount})` : ""}` : "Price Not Available"}
        </Button>

        <Button asChild variant="secondary" className="w-full text-xs">
          <Link href={quoteHref}>Request Bulk Quote</Link>
        </Button>
      </div>

      <div className="flex justify-start">
        <CartSidebar
          items={cartItems}
          onIncrease={incrementItem}
          onDecrease={decrementItem}
          onRemove={removeItem}
          onClear={clearCart}
        />
      </div>
    </div>
  );
}
