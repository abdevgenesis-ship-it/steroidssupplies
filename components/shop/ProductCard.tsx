"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type ShopProductCardData = {
  id: string;
  name: string;
  image?: string;
  brand: string;
  category: string;
  productType: "Injectable" | "Oral" | "Tablet" | "PCT" | "Vial";
  puffCount: number;
  price: number;
  publishedAt: string;
  specLine: string;
  priceText: string;
  href: string;
};

type ProductCardProps = {
  product: ShopProductCardData;
  onAddToCart?: () => void;
  cartQuantity?: number;
};

export function ProductCard({ product, onAddToCart, cartQuantity = 0 }: ProductCardProps) {
  return (
    <Card
      tone="listing"
      size="sm"
      className="group overflow-hidden transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/35"
    >
      <CardContent className="space-y-3 pt-4">
        <Link
          href={product.href}
          className="block space-y-3 rounded-xl outline-none transition-opacity hover:opacity-[0.97] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted/15 ring-1 ring-inset ring-border/50">
            {product.image ? (
              <Image
                src={product.image}
                alt={`${product.name} by ${product.brand}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Image Not Available
              </div>
            )}
            <Badge
              variant="secondary"
              className="absolute left-2 top-2 border-border/90 bg-black/40 text-white backdrop-blur-md"
            >
              {product.brand}
            </Badge>
          </div>

          <p className="text-sm font-semibold leading-tight">{product.name}</p>
          <p className="text-xs font-medium text-muted-foreground">{product.specLine}</p>
          <p className="text-sm font-semibold text-foreground/90">{product.priceText}</p>
        </Link>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="relative z-10 w-full gap-1.5 px-4 py-2.5 text-[11px] font-semibold tracking-[0.08em]"
          onClick={onAddToCart}
          disabled={!onAddToCart}
        >
          <ShoppingCart
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover/button:scale-110"
            aria-hidden={true}
          />
          {cartQuantity > 0 ? `In Cart (${cartQuantity})` : "Add to Cart"}
        </Button>

        <Button asChild type="button" variant="outline" size="sm" className="relative z-10 w-full px-4 py-2.5 text-[11px] font-semibold tracking-[0.08em]">
          <Link href={product.href}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
