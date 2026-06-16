"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Grid3X3 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { CartSidebar } from "@/components/shop/CartSidebar";
import { ProductCard, type ShopProductCardData } from "@/components/shop/ProductCard";
import {
  ProductFiltersPanel,
  type ProductFilterOptions,
  type ProductFiltersState,
} from "@/components/shop/ProductFiltersPanel";
import { ProductSortSelect, type ProductSortValue } from "@/components/shop/ProductSortSelect";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type ProductsCatalogClientProps = {
  products: ShopProductCardData[];
  initialPage?: number;
  productsPerPage?: number;
  filterOptions: ProductFilterOptions;
  initialFilters?: Partial<Pick<ProductFiltersState, "categories" | "brands" | "productTypes">>;
};

function getSafePageNumber(value?: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return Math.floor(parsed);
}

export function ProductsCatalogClient({
  products,
  initialPage = 1,
  productsPerPage = 6,
  filterOptions,
  initialFilters,
}: ProductsCatalogClientProps) {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sortValue, setSortValue] = useState<ProductSortValue>("featured");
  const [filters, setFilters] = useState<ProductFiltersState>({
    categories: initialFilters?.categories || [],
    brands: initialFilters?.brands || [],
    productTypes: initialFilters?.productTypes || [],
    priceRange: filterOptions.priceRange,
    puffRange: filterOptions.puffRange,
  });

  const { items: cartItems, addItem, openCartSidebar, incrementItem, decrementItem, removeItem, clearCart } =
    useCart();
  const { toast } = useToast();
  const cartItemsById = useMemo(() => new Map(cartItems.map((item) => [item.id, item])), [cartItems]);

  const currentPageFromUrl = getSafePageNumber(searchParams.get("page") || String(initialPage));

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        filters.categories.length === 0 || filters.categories.includes(product.category);
      const matchesBrand = filters.brands.length === 0 || filters.brands.includes(product.brand);
      const matchesType =
        filters.productTypes.length === 0 || filters.productTypes.includes(product.productType);
      const matchesPrice =
        product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;
      const matchesPuff =
        product.puffCount >= filters.puffRange.min && product.puffCount <= filters.puffRange.max;

      return matchesCategory && matchesBrand && matchesType && matchesPrice && matchesPuff;
    });
  }, [filters, products]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    if (sortValue === "price-low-high") {
      list.sort((a, b) => a.price - b.price);
      return list;
    }

    if (sortValue === "price-high-low") {
      list.sort((a, b) => b.price - a.price);
      return list;
    }

    if (sortValue === "newest") {
      list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      return list;
    }

    return list;
  }, [filteredProducts, sortValue]);

  const totalProducts = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / productsPerPage));
  const currentPage = Math.min(currentPageFromUrl, totalPages);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = Math.min(startIndex + productsPerPage, totalProducts);
  const pagedProducts = sortedProducts.slice(startIndex, endIndex);

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const setPageInUrl = (page: number) => {
    const next = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      next.delete("page");
    } else {
      next.set("page", String(page));
    }

    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const onSortChange = (next: ProductSortValue) => {
    setSortValue(next);
    setPageInUrl(1);
  };

  const onFiltersChange = (next: ProductFiltersState) => {
    setFilters(next);
    setPageInUrl(1);
  };

  const addToCart = (product: ShopProductCardData) => {
    const id = product.href;
    addItem({
      id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    openCartSidebar();
    toast(`${product.name} added to cart`);
  };

  return (
    <Container className="pt-6 sm:pt-8">
      <motion.div
        className="mb-5 space-y-3 lg:hidden"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? undefined : { duration: 0.45 }}
      >
        <p className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Grid3X3 className="h-4 w-4" aria-hidden={true} />
          Showing {totalProducts === 0 ? 0 : startIndex + 1}-{totalProducts === 0 ? 0 : endIndex} of {totalProducts}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <ProductSortSelect value={sortValue} onValueChange={onSortChange} />

          <div className="flex flex-wrap items-center gap-2">
            <CartSidebar
              items={cartItems}
              onIncrease={incrementItem}
              onDecrease={decrementItem}
              onRemove={removeItem}
              onClear={clearCart}
            />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="inline-flex items-center gap-2">
                  <Filter className="h-4 w-4" aria-hidden={true} />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[90vw] max-w-sm overflow-y-auto border-l border-border/60 bg-transparent"
              >
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                  <SheetDescription>Refine by category, brand, type, and puff count.</SheetDescription>
                </SheetHeader>
                <div className="px-6 pb-6">
                  <ProductFiltersPanel
                    idPrefix="mobile"
                    value={filters}
                    onChange={onFiltersChange}
                    options={filterOptions}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
        <aside className="hidden lg:block">
          <motion.div
            className="glass-listing sticky top-32 rounded-3xl p-5"
            initial={prefersReducedMotion ? false : { opacity: 0, x: -14 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={prefersReducedMotion ? undefined : { duration: 0.5 }}
          >
            <ProductFiltersPanel
              idPrefix="desktop"
              value={filters}
              onChange={onFiltersChange}
              options={filterOptions}
            />
          </motion.div>
        </aside>

        <section aria-label="Product grid" className="min-w-0 pb-2">
          <motion.div
            className="mb-4 hidden items-center justify-between lg:flex"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={prefersReducedMotion ? undefined : { duration: 0.45 }}
          >
            <p className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Grid3X3 className="h-4 w-4" aria-hidden={true} />
              Showing {totalProducts === 0 ? 0 : startIndex + 1}-{totalProducts === 0 ? 0 : endIndex} of {totalProducts}
            </p>

            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <ProductSortSelect value={sortValue} onValueChange={onSortChange} />
              <CartSidebar
                items={cartItems}
                onIncrease={incrementItem}
                onDecrease={decrementItem}
                onRemove={removeItem}
                onClear={clearCart}
              />
            </div>
          </motion.div>

          <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {pagedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={prefersReducedMotion ? undefined : { duration: 0.35, delay: index * 0.04 }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={() => addToCart(product)}
                    cartQuantity={cartItemsById.get(product.href)?.quantity || 0}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {pagedProducts.length === 0 ? (
            <motion.div
              className="glass-listing mt-4 rounded-2xl p-4 text-sm text-muted-foreground"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? undefined : { duration: 0.3 }}
            >
              No products match your current filters. Try broadening category, price, or puff ranges.
            </motion.div>
          ) : null}

          <motion.div
            className="mt-6 flex items-center justify-center gap-2 sm:justify-end"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={prefersReducedMotion ? undefined : { duration: 0.4 }}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasPrevPage}
              className="inline-flex items-center gap-1.5"
              onClick={() => setPageInUrl(currentPage - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden={true} />
              Prev Page
            </Button>

            <span className="px-2 text-xs font-semibold uppercase tracking-[0.11em] text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasNextPage}
              className="inline-flex items-center gap-1.5"
              onClick={() => setPageInUrl(currentPage + 1)}
            >
              Next Page
              <ChevronRight className="h-3.5 w-3.5" aria-hidden={true} />
            </Button>
          </motion.div>
        </section>
      </div>
    </Container>
  );
}
