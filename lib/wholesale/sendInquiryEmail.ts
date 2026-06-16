import { Resend } from "resend";

import {
  ORDER_VALUE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PRODUCT_INTEREST_LABELS,
  type WholesaleInquiryInput,
} from "@/lib/wholesale/formSchema";
import {
  formatOrderCurrency,
  getOrderItemLineTotal,
  getOrderSubtotal,
  type WholesaleOrderItem,
} from "@/lib/wholesale/orderItems";

type InquiryLabelMaps = {
  interestLabels?: Record<string, string>;
  orderValueLabels?: Record<string, string>;
  paymentLabels?: Record<string, string>;
};

function formatInterests(ids: WholesaleInquiryInput["productInterests"], maps?: InquiryLabelMaps) {
  return ids
    .map((id) => maps?.interestLabels?.[id] ?? PRODUCT_INTEREST_LABELS[id as keyof typeof PRODUCT_INTEREST_LABELS] ?? id)
    .join(", ");
}

function orderValueLabel(value: WholesaleInquiryInput["estimatedOrderValue"], maps?: InquiryLabelMaps) {
  return maps?.orderValueLabels?.[value] ?? ORDER_VALUE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

function paymentLabel(value: WholesaleInquiryInput["paymentMethod"], maps?: InquiryLabelMaps) {
  return maps?.paymentLabels?.[value] ?? PAYMENT_METHOD_OPTIONS.find((p) => p.value === value)?.label ?? value;
}

function orderInvoiceHtml(items: WholesaleOrderItem[]) {
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
    <h3 style="margin:24px 0 12px;font-size:16px;">Your order</h3>
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

function inquiryDetailsHtml(data: WholesaleInquiryInput, maps?: InquiryLabelMaps) {
  const orderItems = data.orderItems ?? [];
  return `
    <h2>New wholesale inquiry</h2>
    ${orderItems.length > 0 ? orderInvoiceHtml(orderItems) : ""}
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Business</td><td>${escapeHtml(data.businessName)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Contact</td><td>${escapeHtml(data.contactName)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Email</td><td>${escapeHtml(data.email)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Phone</td><td>${escapeHtml(data.phone)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Country / state</td><td>${escapeHtml(data.countryState)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Interests</td><td>${escapeHtml(formatInterests(data.productInterests, maps))}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Est. order value</td><td>${escapeHtml(orderValueLabel(data.estimatedOrderValue, maps))}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Payment</td><td>${escapeHtml(paymentLabel(data.paymentMethod, maps))}</td></tr>
      ${data.notes ? `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;font-weight:600;">Notes</td><td>${escapeHtml(data.notes).replace(/\n/g, "<br/>")}</td></tr>` : ""}
    </table>
  `;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendWholesaleInquiryEmails(data: WholesaleInquiryInput, maps?: InquiryLabelMaps) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "SteroidsSupplies <onboarding@resend.dev>";
  const notifyTo =
    process.env.WHOLESALE_NOTIFY_EMAIL?.trim() || "sales@steroidssupplies.co.uk";

  const resend = new Resend(apiKey);
  const orderItems = data.orderItems ?? [];

  const clientResult = await resend.emails.send({
    from,
    to: [notifyTo],
    replyTo: data.email,
    subject: `Wholesale inquiry — ${data.businessName}`,
    html: inquiryDetailsHtml(data, maps),
  });

  if (clientResult.error) {
    throw new Error(clientResult.error.message);
  }

  // Second send is best-effort: Resend/domain policies sometimes allow the team inbox
  // delivery but reject or throttle the buyer confirmation. The lead must still succeed.
  const buyerResult = await resend.emails.send({
    from,
    to: [data.email],
    subject: "We received your wholesale inquiry — SteroidsSupplies",
    html: `
      <p>Hi ${escapeHtml(data.contactName)},</p>
      <p>Thanks for contacting SteroidsSupplies. Our wholesale team will review your inquiry and follow up with a proforma invoice within one business day.</p>
      ${orderItems.length > 0 ? orderInvoiceHtml(orderItems) : ""}
      <p><strong>Summary</strong></p>
      <ul>
        <li>Business: ${escapeHtml(data.businessName)}</li>
        <li>Interests: ${escapeHtml(formatInterests(data.productInterests, maps))}</li>
        <li>Estimated order: ${escapeHtml(orderValueLabel(data.estimatedOrderValue, maps))}</li>
      </ul>
      <p>Approved wholesale accounts receive tier-based bulk pricing, COA documentation, and priority dispatch on all orders globally.</p>
    `,
  });

  if (buyerResult.error) {
    console.error(
      "[sendWholesaleInquiryEmails] Buyer confirmation email failed (team notification was sent):",
      buyerResult.error.message,
    );
  }

  return { ok: true as const };
}
