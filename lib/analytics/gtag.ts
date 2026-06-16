/**
 * GA4 helpers. Requires `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` and the gtag snippet in root layout.
 * Funnel for completion rate: `form_start` → `generate_lead` (success).
 */

export function isAnalyticsEnabled(): boolean {
  const id = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  return Boolean(id && id !== "G-PLACEHOLDER");
}

function gtagEvent(name: string, params?: Record<string, unknown>): void {
  if (!isAnalyticsEnabled() || typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

const FORM_EVENT_SCOPE = "thcpensbulk";

export function trackFormStart(formId: string): void {
  gtagEvent("form_start", {
    form_id: formId,
    form_name: formId,
    event_scope: FORM_EVENT_SCOPE,
  });
}

/** GA4 recommended conversion for lead-gen forms */
export function trackGenerateLead(formId: string): void {
  gtagEvent("generate_lead", {
    form_id: formId,
    lead_source: formId,
    event_scope: FORM_EVENT_SCOPE,
  });
}

export function trackFormSubmitResult(formId: string, success: boolean): void {
  gtagEvent("form_submit", {
    form_id: formId,
    form_name: formId,
    success,
    event_scope: FORM_EVENT_SCOPE,
  });
}

export type FormErrorType = "validation" | "server" | "network";

export function trackFormError(
  formId: string,
  errorType: FormErrorType,
  options?: { fields?: string[] },
): void {
  gtagEvent("form_error", {
    form_id: formId,
    form_name: formId,
    error_type: errorType,
    ...(options?.fields?.length
      ? { error_fields: options.fields.slice(0, 20).join(",") }
      : {}),
    event_scope: FORM_EVENT_SCOPE,
  });
}

/** Fired when the user leaves the page after starting the form without a successful submit */
export function trackFormAbandon(formId: string): void {
  gtagEvent("form_abandon", {
    form_id: formId,
    form_name: formId,
    event_scope: FORM_EVENT_SCOPE,
  });
}
