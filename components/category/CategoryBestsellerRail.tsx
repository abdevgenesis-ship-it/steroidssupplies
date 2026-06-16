import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/lib/sanity";
import type { Product } from "@/types/sanity";

type CategoryBestsellerCard = {
  title: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  priceText: string;
};

function getPriceText(product: Product) {
  const firstVariantPrice = product.variants?.find((variant) => typeof variant.price === "number")?.price;

  if (typeof firstVariantPrice === "number") {
    return `From $${firstVariantPrice.toFixed(2)}`;
  }

  return "Request Pricing";
}

function toCard(product: Product): CategoryBestsellerCard {
  const imageSource = product.images?.[0];
  const imageUrl = imageSource?.asset
    ? urlFor(imageSource).width(480).height(480).fit("crop").url()
    : "/images/authority_scene.png";

  return {
    title: product.name,
    href: product.slug?.current ? `/product/${product.slug.current}` : "/products",
    imageUrl,
    imageAlt: imageSource?.alt || `${product.name} product image`,
    priceText: getPriceText(product),
  };
}

type CategoryBestsellerRailProps = {
  categoryName: string;
  products: Product[];
};

export function CategoryBestsellerRail({ categoryName, products }: CategoryBestsellerRailProps) {
  if (products.length === 0) {
    return null;
  }

  const cards = products.slice(0, 3).map(toCard);

  return (
    <div className="min-h-[236px] border-t border-border/70 bg-card px-4 py-2.5 sm:min-h-[258px] sm:px-5 sm:py-3 lg:px-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-highlight sm:text-[10px]">
            Top Rated in Category
          </p>
          <h4 className="mt-1 font-heading text-sm leading-tight sm:text-base">
            Bestsellers for {categoryName}
          </h4>
        </div>
      </div>

      <div className="mt-1.5 grid grid-cols-3 gap-2.5 pb-1">
        {cards.map((card) => (
          <article
            key={card.title}
            className="w-full overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
          >
            <Link href={card.href} className="block p-1 sm:p-1.5">
              <div className="relative aspect-square overflow-hidden rounded-md bg-muted/20">
                <Image
                  src={card.imageUrl}
                  alt={card.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                  sizes="(max-width: 640px) 30vw, (max-width: 1024px) 18vw, 140px"
                />
              </div>
              <div className="mt-0.5">
                <h5 className="line-clamp-2 min-h-9 text-xs font-semibold leading-tight text-foreground sm:text-sm">
                  {card.title}
                </h5>
                <p className="mt-0.25 text-[11px] font-semibold text-foreground/75 sm:text-xs">{card.priceText}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
