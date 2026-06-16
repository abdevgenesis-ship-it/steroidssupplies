import { Resend } from "resend";

import { stripCmsTestPrefix } from "@/lib/contactPageContent";
import type { ContactFormInput } from "@/lib/contactFormSchema";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type ContactEmailPayload = ContactFormInput & {
  subjectLabel: string;
};

export async function sendContactEmails(data: ContactEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "SteroidsSupplies <onboarding@resend.dev>";
  const notifyTo =
    process.env.CONTACT_NOTIFY_EMAIL?.trim() ||
    process.env.WHOLESALE_NOTIFY_EMAIL?.trim() ||
    "support@steroidssupplies.co.uk";

  const resend = new Resend(apiKey);

  const clientHtml = `
    <h2>Website contact</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Name</td><td>${escapeHtml(data.name)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Email</td><td>${escapeHtml(data.email)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Subject</td><td>${escapeHtml(data.subjectLabel)}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;vertical-align:top;font-weight:600;">Message</td><td>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</td></tr>
    </table>
  `;

  const clientResult = await resend.emails.send({
    from,
    to: [stripCmsTestPrefix(notifyTo)],
    replyTo: data.email,
    subject: `Contact — ${data.subjectLabel} — ${data.name}`,
    html: clientHtml,
  });

  if (clientResult.error) {
    throw new Error(clientResult.error.message);
  }

  const buyerResult = await resend.emails.send({
    from,
    to: [data.email],
    subject: "We received your message — SteroidsSupplies",
    html: `
      <p>Hi ${escapeHtml(data.name)},</p>
      <p>Thanks for contacting SteroidsSupplies. Our team will review your message and respond as soon as possible.</p>
      <p><strong>Your subject:</strong> ${escapeHtml(data.subjectLabel)}</p>
      <p>SteroidsSupplies is a global B2C and B2B wholesale supplier of performance compounds. All products are sold for lawful use only and in compliance with applicable laws in the buyer's jurisdiction.</p>
    `,
  });

  if (buyerResult.error) {
    console.error(
      "[sendContactEmails] Sender confirmation email failed (team notification was sent):",
      buyerResult.error.message,
    );
  }

  return { ok: true as const };
}
