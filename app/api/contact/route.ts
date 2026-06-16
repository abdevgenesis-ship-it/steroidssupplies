import { NextResponse } from "next/server";

import { createContactFormSchema } from "@/lib/contactFormSchema";
import { resolveContactPage, subjectLabelForValue } from "@/lib/contactPageContent";
import { sendContactEmails } from "@/lib/sendContactEmail";
import { getContactPage } from "@/lib/sanityClient";

export const maxDuration = 30;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const pageDoc = await getContactPage();
  const page = resolveContactPage(pageDoc);
  const subjectValues = page.subjectOptions
    .map((o) => o.value)
    .filter((value): value is string => typeof value === "string" && value.length > 0);
  const schema = createContactFormSchema(subjectValues);

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const subjectLabel = subjectLabelForValue(page.subjectOptions, parsed.data.subject);

  try {
    await sendContactEmails({
      ...parsed.data,
      subjectLabel,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Email send failed";
    console.error("[contact]", message);
    return NextResponse.json(
      { error: "Could not send your message. Please try again or email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
