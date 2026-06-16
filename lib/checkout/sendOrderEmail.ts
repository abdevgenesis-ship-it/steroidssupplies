import { Resend } from "resend";

import {
  DEFAULT_CHECKOUT_PAYMENT_METHODS,
  type CheckoutOrderInput,
} from "@/lib/checkout/formSchema";
import {
  formatOrderCurrency,
  getOrderItemLineTotal,
  getOrderSubtotal,
} from "@/lib/wholesale/orderItems";

type OrderLabelMaps = {
  paymentLabels?: Record<string, string>;
};

function paymentLabel(value: CheckoutOrderInput["paymentMethod"], maps?: OrderLabelMaps) {
  return (
    maps?.paymentLabels?.[value] ??
    DEFAULT_CHECKOUT_PAYMENT_METHODS.find((p) => p.value === value)?.label ??
    value
  );
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function orderInvoiceHtml(items: CheckoutOrderInput["orderItems"]) {
  const subtotal = getOrderSubtotal(items);
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px 10px 0;vertical-align:top;">
          <strong>${escapeHtml(item.name)} × ${item.quantity}</strong><br/>
          <span style="color:#666;font-size:12px;">Unit: ${escapeHtml(formatOrderCurrency(item.price))}</span>
        </td>
        <td style="padding:10px 0;vertical-align:top;text-align:right;white-space:nowrap;">
          <strong>${escapeHtml(formatOrderCurrency(getOrderItemLineTotal(item)))}</strong>
        </td>
      </tr>
    `,
    )
    .join("");

  return `
    <h3 style="margin:24px 0 12px;font-size:16px;">Order summary</h3>
    <table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <thead>
        <tr style="border-bottom:1px solid #ddd;">
          <th style="padding:0 12px 8px 0;text-align:left;color:#666;font-size:12px;text-transform:uppercase;">Product</th>
          <th style="padding:0 0 8px;text-align:right;color:#666;font-size:12px;text-transform:uppercase;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr style="border-top:1px solid #ddd;">
          <td style="padding:10px 12px 4px 0;">Subtotal</td>
          <td style="padding:10px 0 4px;text-align:right;">${escapeHtml(formatOrderCurrency(subtotal))}</td>
        </tr>
        <tr>
          <td style="padding:4px 12px 0 0;font-weight:700;">Total</td>
          <td style="padding:4px 0 0;text-align:right;font-weight:700;">${escapeHtml(formatOrderCurrency(subtotal))}</td>
        </tr>
      </tfoot>
    </table>
  `;
}

function orderDetailsHtml(data: CheckoutOrderInput, maps?: OrderLabelMaps) {
  return `
    <h2>New customer order</h2>
    ${orderInvoiceHtml(data.orderItems)}
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Name</td><td>${escapeHtml(data.clientName)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">WhatsApp</td><td>${escapeHtml(data.whatsapp)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Email</td><td>${escapeHtml(data.email)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;vertical-align:top;font-weight:600;">Address</td><td>${escapeHtml(data.address).replace(/\n/g, "<br/>")}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Payment</td><td>${escapeHtml(paymentLabel(data.paymentMethod, maps))}</td></tr>
      ${data.notes ? `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;font-weight:600;">Notes</td><td>${escapeHtml(data.notes).replace(/\n/g, "<br/>")}</td></tr>` : ""}
    </table>
  `;
}

export async function sendCheckoutOrderEmails(data: CheckoutOrderInput, maps?: OrderLabelMaps) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "THCPensBulk <onboarding@resend.dev>";
  const notifyTo =
    process.env.ORDER_NOTIFY_EMAIL?.trim() ||
    process.env.WHOLESALE_NOTIFY_EMAIL?.trim() ||
    "support@thcpensbulk.com";

  const resend = new Resend(apiKey);

  const teamResult = await resend.emails.send({
    from,
    to: [notifyTo],
    replyTo: data.email,
    subject: `New order — ${data.clientName}`,
    html: orderDetailsHtml(data, maps),
  });

  if (teamResult.error) {
    throw new Error(teamResult.error.message);
  }

  const buyerResult = await resend.emails.send({
    from,
    to: [data.email],
    subject: "We received your order — THCPensBulk",
    html: `
      <p>Hi ${escapeHtml(data.clientName)},</p>
      <p>Thanks for your order. Our team will confirm payment details and dispatch within 48 hours.</p>
      ${orderInvoiceHtml(data.orderItems)}
      <p><strong>Delivery address</strong><br/>${escapeHtml(data.address).replace(/\n/g, "<br/>")}</p>
      <p><strong>Payment method:</strong> ${escapeHtml(paymentLabel(data.paymentMethod, maps))}</p>
      <p>Questions? Reply to this email or message us on WhatsApp at ${escapeHtml(data.whatsapp)}.</p>
    `,
  });

  if (buyerResult.error) {
    console.error(
      "[sendCheckoutOrderEmails] Buyer confirmation email failed (team notification was sent):",
      buyerResult.error.message,
    );
  }

  return { ok: true as const };
}
