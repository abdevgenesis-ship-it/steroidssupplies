import { z } from "zod";

import { wholesaleOrderItemSchema } from "@/lib/wholesale/orderItems";

export const DEFAULT_CHECKOUT_PAYMENT_METHODS = [
  { value: "crypto", label: "Cryptocurrency (BTC, ETH, USDT)" },
  { value: "revolut", label: "Revolut" },
  { value: "bank", label: "Bank Transfer" },
] as const;

export function createCheckoutFormSchema(paymentMethodIds: string[]) {
  return z.object({
    clientName: z.string().trim().min(1, "Name is required"),
    whatsapp: z.string().trim().min(1, "WhatsApp number is required"),
    email: z.string().trim().email("Enter a valid email"),
    address: z.string().trim().min(1, "Delivery address is required"),
    paymentMethod: z.enum(paymentMethodIds as [string, ...string[]]),
    notes: z.string().trim().optional(),
    orderItems: z.array(wholesaleOrderItemSchema).min(1, "Your cart is empty"),
  });
}

export const validateCheckoutFormSchema = createCheckoutFormSchema(
  DEFAULT_CHECKOUT_PAYMENT_METHODS.map((m) => m.value),
);

export type CheckoutOrderInput = z.infer<typeof validateCheckoutFormSchema>;
