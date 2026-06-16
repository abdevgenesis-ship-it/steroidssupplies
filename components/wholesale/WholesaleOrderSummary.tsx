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

type WholesaleOrderSummaryProps = {
  items: WholesaleOrderItem[];
  formId: string;
  isSubmitting?: boolean;
  className?: string;
};

export function WholesaleOrderSummary({
  items,
  formId,
  isSubmitting = false,
  className,
}: WholesaleOrderSummaryProps) {
  const subtotal = getOrderSubtotal(items);

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border/90 bg-muted/40 p-4 backdrop-blur-sm sm:p-5 lg:sticky lg:top-24",
        className,
      )}
      aria-labelledby="wholesale-order-summary-heading"
    >
      <h2
        id="wholesale-order-summary-heading"
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

      <Button type="submit" form={formId} size="lg" disabled={isSubmitting} className="mt-5 w-full">
        {isSubmitting ? "Placing order…" : "Place order"}
      </Button>

      <p className="mt-3 inline-flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-highlight" aria-hidden="true" />
        <span>
          By placing your order, you confirm you are authorized to purchase on behalf of your
          business. Food supplements are not intended to diagnose, treat, cure, or prevent any disease.
        </span>
      </p>
    </aside>
  );
}
