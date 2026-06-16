"use client";

import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatOrderCurrency,
  getOrderItemLineTotal,
  getOrderSubtotal,
  type WholesaleOrderItem,
} from "@/lib/wholesale/orderItems";
import { cn } from "@/lib/utils";

const MIN_ORDER_AMOUNT = 100;

type OrderSummaryProps = {
  items: WholesaleOrderItem[];
  formId: string;
  isSubmitting?: boolean;
  className?: string;
};

export function OrderSummary({
  items,
  formId,
  isSubmitting = false,
  className,
}: OrderSummaryProps) {
  const subtotal = getOrderSubtotal(items);
  const belowMinOrder = subtotal < MIN_ORDER_AMOUNT;

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border/90 bg-muted/40 p-4 backdrop-blur-sm sm:p-5 lg:sticky lg:top-24",
        className,
      )}
      aria-labelledby="checkout-order-summary-heading"
    >
      <h2
        id="checkout-order-summary-heading"
        className="font-heading text-lg uppercase tracking-[0.12em] text-foreground sm:text-xl"
      >
        Your order
      </h2>

      <div className="mt-4 border-b border-border/70 pb-2">
        <div className="grid grid-cols-[1fr_auto] gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span>Product</span>
          <span>Subtotal</span>
        </div>
      </div>

      <ul className="divide-y divide-border/60">
        {items.map((item, index) => (
          <li key={item.id ?? `${item.name}-${index}`} className="grid grid-cols-[1fr_auto] gap-3 py-4">
            <div>
              <p className="text-sm font-semibold leading-snug text-foreground">
                {item.name} × {item.quantity}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                Unit: {formatOrderCurrency(item.price)}
              </p>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {formatOrderCurrency(getOrderItemLineTotal(item))}
            </p>
          </li>
        ))}
      </ul>

      <div className="space-y-2 border-t border-border/70 pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold text-foreground">{formatOrderCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-border/60 pt-2">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-semibold text-foreground">{formatOrderCurrency(subtotal)}</span>
        </div>
      </div>

      {belowMinOrder ? (
        <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
          <p className="font-semibold">Minimum order amount is {formatOrderCurrency(MIN_ORDER_AMOUNT)}.</p>
          <p className="mt-0.5">
            Your current order total is {formatOrderCurrency(subtotal)}. Please add{" "}
            {formatOrderCurrency(MIN_ORDER_AMOUNT - subtotal)} more to continue checkout.
          </p>
        </div>
      ) : null}
      <Button type="submit" form={formId} size="lg" disabled={isSubmitting || belowMinOrder} className="mt-3 w-full">
        {isSubmitting ? "Placing order…" : "Place order"}
      </Button>

      <p className="mt-3 inline-flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-highlight" aria-hidden="true" />
        <span>
          By placing your order, you confirm your details are correct. Food supplements are not
          intended to diagnose, treat, cure, or prevent any disease.
        </span>
      </p>
    </aside>
  );
}
