import { z } from "zod";

export const wholesaleOrderItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
});

export type WholesaleOrderItem = z.infer<typeof wholesaleOrderItemSchema>;

export function formatOrderCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

export function getOrderItemLineTotal(item: WholesaleOrderItem) {
  return item.price * item.quantity;
}

export function getOrderSubtotal(items: WholesaleOrderItem[]) {
  return items.reduce((sum, item) => sum + getOrderItemLineTotal(item), 0);
}

export function normalizeOrderItems(items: WholesaleOrderItem[]): WholesaleOrderItem[] {
  return items
    .filter((item) => item.name.trim().length > 0 && item.quantity > 0)
    .slice(0, 20)
    .map((item) => ({
      id: item.id,
      name: item.name.trim(),
      quantity: Math.floor(item.quantity),
      price: item.price,
    }));
}
