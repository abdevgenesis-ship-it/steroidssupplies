import { NextResponse } from "next/server";

import { createCheckoutFormSchema } from "@/lib/checkout/formSchema";
import { sendCheckoutOrderEmails } from "@/lib/checkout/sendOrderEmail";
import { getWholesaleFormClientConfig } from "@/lib/wholesale/formConfig";

export const maxDuration = 30;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const formConfig = await getWholesaleFormClientConfig();
  const paymentMethodIds = formConfig.paymentMethods.map((item) => item.methodValue);

  const validationSchema = createCheckoutFormSchema(
    paymentMethodIds.length > 0
      ? paymentMethodIds
      : ["crypto", "revolut", "bank"],
  );

  const parsed = validationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await sendCheckoutOrderEmails(parsed.data, {
      paymentLabels: Object.fromEntries(
        formConfig.paymentMethods.map((item) => [item.methodValue, item.label]),
      ),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Email send failed";
    console.error("[order]", message);
    return NextResponse.json(
      { error: "Could not place your order. Please try again or contact us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
