"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, ShoppingCart } from "lucide-react";

import { Container } from "@/components/layout/container";
import { RevealItem } from "@/components/motion/RevealItem";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { urlFor } from "@/lib/sanity";
import type { Product } from "@/types/sanity";

type BestSellerCard = {
  id: string;
  title: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  price: number;
  priceText: string;
};

function getPriceText(product: Product) {
  const firstVariantPrice = product.variants?.find((variant) => typeof variant.price === "number")?.price;
  if (typeof firstVariantPrice === "number") {
    return `From $${firstVariantPrice.toFixed(2)}`;
  }

  return "Request Pricing";
}

function mapProductsToCards(products: Product[]) {
  return products.slice(0, 4).map((product): BestSellerCard => {
    const imageSource = product.images?.[0];
    const firstVariantPrice = product.variants?.find((variant) => typeof variant.price === "number")?.price;
    const imageUrl = imageSource?.asset
      ? urlFor(imageSource).width(800).height(800).fit("crop").url()
      : "/images/categories/bulk-thc-vapes.png";

    return {
      id: product._id,
      title: product.name,
      href: product.slug?.current ? `/product/${product.slug.current}` : "/products",
      imageUrl,
      imageAlt: imageSource?.alt || `${product.name} product image`,
      price: typeof firstVariantPrice === "number" ? firstVariantPrice : 0,
      priceText: getPriceText(product),
    };
  });
}

function ProductCard({ product }: { product: BestSellerCard }) {
  const { items, addItem, openCartSidebar } = useCart();
  const { toast } = useToast();
  const cartItem = useMemo(() => items.find((item) => item.id === product.id), [items, product.id]);
  const onAddToCart = () => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      quantity: 1,
    });
    openCartSidebar();
    toast(`${product.title} added to cart`);
  };

  return (
    <article className="glass-listing group overflow-hidden rounded-3xl p-3.5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/35 sm:p-4">
      <div className="relative overflow-hidden rounded-xl bg-muted/15 ring-1 ring-inset ring-border/50">
        <div className="relative aspect-square w-full">
          <Image
            src={product.imageUrl}
            alt={product.imageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 70vw"
          />
        </div>
      </div>

      <div className="mt-3.5 sm:mt-4">
        <h3 className="line-clamp-2 min-h-[2.6rem] text-sm font-semibold leading-tight sm:text-base">
          {product.title}
        </h3>
        <p className="mt-1.5 text-sm font-semibold text-foreground/80">{product.priceText}</p>

        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="group/button mt-4 w-full gap-2 text-[11px] font-semibold tracking-[0.08em] transition-[border-color,transform] duration-300"
          onClick={onAddToCart}
        >
          <ShoppingCart className="h-3.5 w-3.5" aria-hidden={true} />
          {cartItem ? `In Cart (${cartItem.quantity})` : "Add to Cart"}
        </Button>

        <Button
          asChild
          size="sm"
          variant="default"
          className="group/button mt-2 w-full transition-[border-color,transform] duration-300"
        >
          <Link href={product.href} className="inline-flex items-center justify-center gap-2">
            <span>View Details</span>
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </Button>
      </div>
    </article>
  );
}

type CategoryBestsellersProps = {
  products?: Product[];
  eyebrow: string;
  heading: string;
  description: string;
  viewAllLabel: string;
};

export function CategoryBestsellers({
  products = [],
  eyebrow,
  heading,
  description,
  viewAllLabel,
}: CategoryBestsellersProps) {
  const cards = mapProductsToCards(products);

  return (
    <section className="overflow-x-clip bg-background text-foreground">
      <Container className="section-y">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-highlight sm:text-[11px] sm:tracking-[0.18em]">
            <span className="h-px w-8 bg-highlight/70" />
            {eyebrow}
            <span className="h-px w-8 bg-highlight/70" />
          </p>
          <h2 className="mt-2 font-heading text-2xl leading-tight sm:text-3xl lg:text-4xl">{heading}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
        </div>

        <div className="mt-8 md:hidden">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {cards.map((product) => (
              <div
                key={product.title}
                className="min-w-[82vw] max-w-[82vw] snap-start min-[430px]:min-w-[72vw] min-[430px]:max-w-[72vw]"
              >
                <RevealItem>
                  <ProductCard product={product} />
                </RevealItem>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 hidden grid-cols-2 gap-4 md:grid lg:grid-cols-4 lg:gap-5">
          {cards.map((product, index) => (
            <RevealItem key={product.title} delay={index * 0.05}>
              <ProductCard product={product} />
            </RevealItem>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group/button w-full transition-[border-color,transform] duration-300 sm:w-auto"
          >
            <Link href="/products" className="inline-flex items-center gap-2">
              <span>{viewAllLabel}</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
