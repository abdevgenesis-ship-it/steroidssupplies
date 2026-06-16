import { NextResponse } from "next/server";

import { getWholesaleFormClientConfig } from "@/lib/wholesale/formConfig";
import { sendWholesaleInquiryEmails } from "@/lib/wholesale/sendInquiryEmail";
import { createWholesaleFormSchema } from "@/lib/wholesale/formSchema";

/** Two Resend calls + Sanity config; avoid edge timeouts on cold start (Vercel). */
export const maxDuration = 30;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const formConfig = await getWholesaleFormClientConfig();
  const validationSchema = createWholesaleFormSchema(
    formConfig.productInterests.map((item) => item.value),
    formConfig.estimatedOrderValues.map((item) => item.rangeValue),
    formConfig.paymentMethods.map((item) => item.methodValue),
  );

  const parsed = validationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await sendWholesaleInquiryEmails(parsed.data, {
      interestLabels: Object.fromEntries(
        formConfig.productInterests.map((item) => [item.value, item.label]),
      ),
      orderValueLabels: Object.fromEntries(
        formConfig.estimatedOrderValues.map((item) => [item.rangeValue, item.rangeLabel]),
      ),
      paymentLabels: Object.fromEntries(
        formConfig.paymentMethods.map((item) => [item.methodValue, item.label]),
      ),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Email send failed";
    console.error("[wholesale-inquiry]", message);
    return NextResponse.json(
      { error: "Could not send inquiry. Please try again or email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
