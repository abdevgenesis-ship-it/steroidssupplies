"use client";

import { useMemo } from "react";

import { ProductCard, type ShopProductCardData } from "@/components/shop/ProductCard";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";

type SupportingPageProductsGridProps = {
  products: ShopProductCardData[];
};

export function SupportingPageProductsGrid({ products }: SupportingPageProductsGridProps) {
  const { items: cartItems, addItem, openCartSidebar } = useCart();
  const { toast } = useToast();
  const cartItemsById = useMemo(() => new Map(cartItems.map((item) => [item.id, item])), [cartItems]);

  const addToCart = (product: ShopProductCardData) => {
    addItem({
      id: product.href,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    openCartSidebar();
    toast(`${product.name} added to cart`);
  };

  return (
    <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => addToCart(product)}
          cartQuantity={cartItemsById.get(product.href)?.quantity || 0}
        />
      ))}
    </div>
  );
}
