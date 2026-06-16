import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity";
import type { Product, ProductVariant } from "@/types/sanity";

type RelatedProductsProps = {
  products: Product[];
  categoryLabel: string;
};

function getFromPrice(variants?: ProductVariant[]) {
  if (!variants?.length) {
    return 0;
  }

  const defaultPrice = variants.find((variant) => variant.isDefault && typeof variant.price === "number")?.price;
  if (typeof defaultPrice === "number") {
    return defaultPrice;
  }

  const prices = variants.map((variant) => variant.price).filter((price): price is number => typeof price === "number");
  if (!prices.length) {
    return 0;
  }

  return Math.min(...prices);
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

export function RelatedProducts({ products, categoryLabel }: RelatedProductsProps) {
  const related = products.slice(0, 4);

  if (related.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Related products"
      className="glass-listing mt-8 rounded-3xl p-5 sm:p-6 lg:mt-10 lg:p-8"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-highlight">
            Similar Inventory
          </p>
          <h2 className="font-heading text-2xl text-foreground">Related Products</h2>
        </div>
        <Badge variant="secondary" className="bg-highlight/15 text-highlight">
          {categoryLabel}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((product) => (
          <article
            key={product._id}
            className="rounded-2xl border border-border/60 bg-muted/30 p-3 backdrop-blur-sm transition-[border-color] duration-300 hover:border-primary/30"
          >
            <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted/15 ring-1 ring-inset ring-border/50">
              {product.images?.[0]?.asset ? (
                <Image
                  src={urlFor(product.images[0]).width(640).height(480).fit("crop").url()}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Image Not Available
                </div>
              )}
            </div>

            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {product.brand && "name" in product.brand && typeof product.brand.name === "string"
                ? product.brand.name
                : "Brand"}
            </p>
            <h3 className="mt-1 text-sm font-semibold leading-tight text-foreground">{product.name}</h3>
            {getFromPrice(product.variants) > 0 ? (
              <p className="mt-2 text-sm font-semibold text-foreground">
                From {formatCurrency(getFromPrice(product.variants))}
              </p>
            ) : (
              <p className="mt-2 text-sm font-semibold text-foreground">Request Pricing</p>
            )}

            <div className="mt-3 grid gap-2">
              <Button asChild size="sm" className="w-full text-[10px]">
                <Link href={product.slug?.current ? `/product/${product.slug.current}` : "/products"}>
                  View Details
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
