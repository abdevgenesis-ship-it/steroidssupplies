"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";

type ProductImageGalleryProps = {
  productName: string;
  images: string[];
};

export function ProductImageGallery({ productName, images }: ProductImageGalleryProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPoint, setZoomPoint] = useState({ x: 50, y: 50 });
  const safeImages = images;

  if (safeImages.length === 0) {
    return (
      <section aria-label="Product gallery" className="space-y-3">
        <div className="grid aspect-square place-items-center rounded-2xl border border-border bg-muted/20 text-center text-sm text-muted-foreground">
          No product images uploaded in CMS.
        </div>
      </section>
    );
  }

  const activeImage = safeImages[activeIndex] || safeImages[0];

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setZoomPoint({ x, y });
  };

  return (
    <section aria-label="Product gallery" className="space-y-3">
      <div
        className="group/gallery relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl bg-muted/20"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <div className="pointer-events-none absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/85 text-foreground opacity-0 transition-opacity duration-200 group-hover/gallery:opacity-100">
          <Search className="h-4 w-4" aria-hidden={true} />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeImage}
            className="absolute inset-0"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.015 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={prefersReducedMotion ? undefined : { duration: 0.35 }}
          >
            <div
              className="absolute inset-0 transition-transform duration-150"
              style={{
                transformOrigin: `${zoomPoint.x}% ${zoomPoint.y}%`,
                transform: isZooming && !prefersReducedMotion ? "scale(1.42)" : "scale(1)",
              }}
            >
              <Image
                src={activeImage}
                alt={`${productName} primary product image`}
                fill
                loading="lazy"
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {safeImages.map((src, index) => {
          const isActive = index === activeIndex;

          return (
            <motion.button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-xl bg-muted/20 transition ${
                isActive ? "ring-1 ring-highlight/50" : "hover:opacity-90"
              }`}
              aria-label={`View ${productName} image ${index + 1}`}
              aria-pressed={isActive}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            >
              <Image
                src={src}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                loading="lazy"
                className="object-cover"
                sizes="(min-width: 1024px) 10vw, 22vw"
              />
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
