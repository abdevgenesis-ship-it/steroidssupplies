"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { buildCheckoutHref } from "@/lib/checkout/cartUrl";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MIN_ORDER_AMOUNT = 100;

export type CartSidebarItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartSidebarProps = {
  items: CartSidebarItem[];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onClear?: () => void;
  /** Optional trigger (single element). Defaults to outline “Cart (n)” button. */
  trigger?: ReactNode;
  openSignal?: number;
};

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

export function CartSidebar({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  trigger,
  openSignal,
}: CartSidebarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showMinOrderError, setShowMinOrderError] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const checkoutHref = buildCheckoutHref(items);

  function handleCheckout() {
    if (subtotal < MIN_ORDER_AMOUNT) {
      setShowMinOrderError(true);
      return;
    }
    setShowMinOrderError(false);
    setOpen(false);
    router.push(checkoutHref);
  }

  useEffect(() => {
    if (typeof openSignal === "number" && openSignal > 0) {
      setOpen(true);
    }
  }, [openSignal]);

  useEffect(() => {
    if (subtotal >= MIN_ORDER_AMOUNT) {
      setShowMinOrderError(false);
    }
  }, [subtotal]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="inline-flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" aria-hidden={true} />
            Cart ({itemCount})
          </Button>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="w-[92vw] max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>Review items before checkout.</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-6 pb-6">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
              Your cart is empty. Add products from the shop to checkout.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <article key={item.id} className="rounded-2xl border border-border bg-card p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold leading-tight">{item.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Unit: {formatCurrency(item.price)}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onRemove(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden={true} />
                    </Button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border px-2 py-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onDecrease(item.id)}
                        aria-label={`Decrease quantity for ${item.name}`}
                      >
                        <Minus className="h-3 w-3" aria-hidden={true} />
                      </Button>
                      <span className="min-w-6 text-center text-xs font-semibold">{item.quantity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onIncrease(item.id)}
                        aria-label={`Increase quantity for ${item.name}`}
                      >
                        <Plus className="h-3 w-3" aria-hidden={true} />
                      </Button>
                    </div>

                    <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </div>
            {showMinOrderError && items.length > 0 ? (
              <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                <p className="font-semibold">Minimum order amount is {formatCurrency(MIN_ORDER_AMOUNT)}.</p>
                <p className="mt-0.5">
                  Your current order total is {formatCurrency(subtotal)}. Please add{" "}
                  {formatCurrency(MIN_ORDER_AMOUNT - subtotal)} more to continue checkout.
                </p>
              </div>
            ) : null}
            {items.length === 0 ? (
              <Button type="button" className="mt-3 w-full" disabled>
                Checkout
              </Button>
            ) : (
              <Button type="button" className="mt-3 w-full" onClick={handleCheckout}>
                Checkout
              </Button>
            )}
            {items.length > 0 && onClear ? (
              <Button type="button" variant="ghost" className="mt-2 w-full" onClick={onClear}>
                Clear cart
              </Button>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
