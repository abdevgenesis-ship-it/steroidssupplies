"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  DollarSign,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
  User2,
  Wallet,
} from "lucide-react";
import type { FieldErrors } from "react-hook-form";
import { Controller, useForm, useWatch } from "react-hook-form";

import {
  trackFormAbandon,
  trackFormError,
  trackFormStart,
  trackFormSubmitResult,
  trackGenerateLead,
} from "@/lib/analytics/gtag";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createWholesaleFormSchema,
  type WholesaleInquiryInput,
} from "@/lib/wholesale/formSchema";
import type { WholesaleFormClientConfig } from "@/lib/wholesale/formConfig";
import { normalizeOrderItems, type WholesaleOrderItem } from "@/lib/wholesale/orderItems";
import { WholesaleOrderSummary } from "@/components/wholesale/WholesaleOrderSummary";
import { cn } from "@/lib/utils";

const WHOLESALE_FORM_ID = "wholesale_inquiry";
const WHOLESALE_FORM_ELEMENT_ID = "wholesale-inquiry-form";

type WholesaleFormProps = {
  className?: string;
  /** When true, omit outer Card wrapper (e.g. full-page reuse later). */
  bare?: boolean;
  initialValues?: Partial<WholesaleInquiryInput>;
  successRedirectPath?: string;
  formConfig: WholesaleFormClientConfig;
  orderItems?: WholesaleOrderItem[];
};

export function WholesaleForm({
  className,
  bare = false,
  initialValues,
  successRedirectPath,
  formConfig,
  orderItems = [],
}: WholesaleFormProps) {
  const router = useRouter();
  const { formLabels, productInterests, estimatedOrderValues, paymentMethods } = formConfig;
  const normalizedOrderItems = useMemo(() => normalizeOrderItems(orderItems), [orderItems]);
  const hasOrderSummary = normalizedOrderItems.length > 0;

  // Create dynamic schema based on config values
  const validationSchema = useMemo(() => {
    return createWholesaleFormSchema(
      productInterests.map((item) => item.value),
      estimatedOrderValues.map((item) => item.rangeValue),
      paymentMethods.map((item) => item.methodValue),
    );
  }, [estimatedOrderValues, paymentMethods, productInterests]);

  // Extract first valid values for defaults (use first config option if available)
  const defaultOrderValue = initialValues?.estimatedOrderValue ?? estimatedOrderValues[0]?.rangeValue ?? "range-500";
  const defaultPaymentMethod = initialValues?.paymentMethod ?? paymentMethods[0]?.methodValue ?? "method-1";

  const defaultValues: WholesaleInquiryInput = {
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    countryState: "",
    productInterests: initialValues?.productInterests ?? [],
    estimatedOrderValue: defaultOrderValue,
    paymentMethod: defaultPaymentMethod,
    notes: initialValues?.notes ?? "",
  };

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<WholesaleInquiryInput>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const hasTrackedStartRef = useRef(false);
  const formCompletedRef = useRef(false);

  useEffect(() => {
    if (isDirty && !hasTrackedStartRef.current) {
      hasTrackedStartRef.current = true;
      trackFormStart(WHOLESALE_FORM_ID);
    }
  }, [isDirty]);

  useEffect(() => {
    const onPageHide = () => {
      if (hasTrackedStartRef.current && !formCompletedRef.current) {
        trackFormAbandon(WHOLESALE_FORM_ID);
      }
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, []);

  const onInvalid = (fieldErrors: FieldErrors<WholesaleInquiryInput>) => {
    const fields = Object.keys(fieldErrors) as string[];
    trackFormError(WHOLESALE_FORM_ID, "validation", { fields });
    trackFormSubmitResult(WHOLESALE_FORM_ID, false);
  };

  const onSubmit = async (data: WholesaleInquiryInput) => {
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const payload =
        normalizedOrderItems.length > 0 ? { ...data, orderItems: normalizedOrderItems } : data;
      const res = await fetch("/api/wholesale-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        trackFormError(WHOLESALE_FORM_ID, "server");
        trackFormSubmitResult(WHOLESALE_FORM_ID, false);
        setSubmitError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      formCompletedRef.current = true;
      trackGenerateLead(WHOLESALE_FORM_ID);
      trackFormSubmitResult(WHOLESALE_FORM_ID, true);
      if (successRedirectPath) {
        const emailParam = encodeURIComponent(data.email);
        router.push(`${successRedirectPath}?email=${emailParam}`);
        return;
      }
      setSubmitSuccess(true);
      reset(defaultValues);
    } catch {
      trackFormError(WHOLESALE_FORM_ID, "network");
      trackFormSubmitResult(WHOLESALE_FORM_ID, false);
      setSubmitError("Network error. Check your connection and try again.");
    }
  };

  const formInner = (
    <form
      id={WHOLESALE_FORM_ELEMENT_ID}
      onSubmit={
        // eslint-disable-next-line react-hooks/refs -- RHF async submit only; ref marks completion before client nav
        handleSubmit(onSubmit, onInvalid)
      }
      className="stack-md"
      noValidate
      aria-describedby={submitSuccess ? "wholesale-form-success" : undefined}
    >
      {submitSuccess ? (
        <p
          id="wholesale-form-success"
          className="rounded-2xl border border-border/90 bg-muted/40 px-4 py-3 text-sm text-foreground backdrop-blur-sm"
          role="status"
        >
          Thank you — we received your inquiry. Check your email for a confirmation. Our team will
          follow up shortly.
        </p>
      ) : null}

      {submitError ? (
        <p className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {submitError}
        </p>
      ) : null}

      <div className="rounded-2xl border border-border/90 bg-muted/40 p-4 backdrop-blur-sm transition-colors sm:p-5 hover:border-primary/25 hover:bg-muted/50">
        <div className="mb-3">
          <p className="text-sm font-semibold text-foreground">Business details</p>
          <p className="text-xs text-muted-foreground">Tell us who we should quote for.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="wholesale-business" className="inline-flex items-center gap-1.5">
              <Building2 className="size-3.5 text-muted-foreground" aria-hidden="true" />
              {formLabels.businessNameLabel || "Business name"}
            </Label>
          <Input
            id="wholesale-business"
            autoComplete="organization"
            placeholder={formLabels.businessNameHelp || "e.g. Midtown Smoke Supply"}
            aria-invalid={!!errors.businessName}
            {...register("businessName")}
          />
          {errors.businessName ? (
            <p className="text-xs text-destructive">{errors.businessName.message}</p>
          ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="wholesale-contact" className="inline-flex items-center gap-1.5">
              <User2 className="size-3.5 text-muted-foreground" aria-hidden="true" />
              {formLabels.contactNameLabel || "Contact name"}
            </Label>
          <Input
            id="wholesale-contact"
            autoComplete="name"
            placeholder={formLabels.contactNameHelp || "e.g. Alex Morgan"}
            aria-invalid={!!errors.contactName}
            {...register("contactName")}
          />
          {errors.contactName ? (
            <p className="text-xs text-destructive">{errors.contactName.message}</p>
          ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/90 bg-muted/40 p-4 backdrop-blur-sm transition-colors sm:p-5 hover:border-primary/25 hover:bg-muted/50">
        <div className="mb-3">
          <p className="text-sm font-semibold text-foreground">Contact details</p>
          <p className="text-xs text-muted-foreground">How should we send your pricing and invoice info?</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="wholesale-email" className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5 text-muted-foreground" aria-hidden="true" />
              {formLabels.emailLabel || "Email"}
            </Label>
          <Input
            id="wholesale-email"
            type="email"
            autoComplete="email"
            placeholder={formLabels.emailHelp || "e.g. purchasing@yourstore.com"}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="wholesale-phone" className="inline-flex items-center gap-1.5">
              <Phone className="size-3.5 text-muted-foreground" aria-hidden="true" />
              {formLabels.phoneLabel || "Phone"}
            </Label>
          <Input
            id="wholesale-phone"
            type="tel"
            autoComplete="tel"
            placeholder={formLabels.phoneHelp || "e.g. +1 (555) 123-4567"}
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          {errors.phone ? <p className="text-xs text-destructive">{errors.phone.message}</p> : null}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Label htmlFor="wholesale-region" className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 text-muted-foreground" aria-hidden="true" />
            {formLabels.countryStateLabel || "Country / state"}
          </Label>
          <Input
            id="wholesale-region"
            autoComplete="address-level1"
            placeholder={formLabels.countryStateHelp || "e.g. United States — Texas"}
            aria-invalid={!!errors.countryState}
            {...register("countryState")}
          />
          {errors.countryState ? (
            <p className="text-xs text-destructive">{errors.countryState.message}</p>
          ) : null}
        </div>
      </div>

      <fieldset className="space-y-3 rounded-2xl border border-border/90 bg-muted/40 p-4 backdrop-blur-sm transition-colors sm:p-5 hover:border-primary/25 hover:bg-muted/50">
        <legend className="px-1 text-sm font-semibold text-foreground">{formLabels.productInterestsLabel || "Product interests"}</legend>
        <p className="text-xs text-muted-foreground">{formLabels.productInterestsHelp || "Select all categories you want to stock."}</p>
        <Controller
          name="productInterests"
          control={control}
          render={({ field }) => {
            const interests = Array.isArray(field.value) ? field.value : [];
            return (
              <div className="grid gap-3 sm:grid-cols-2">
                {productInterests.map((interest) => (
                  <label
                    key={interest.value}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/70 bg-muted/40 p-3 transition-colors hover:border-primary/20 hover:bg-muted"
                  >
                    <Checkbox
                      id={`wholesale-interest-${interest.value}`}
                      checked={interests.includes(interest.value)}
                      onCheckedChange={(checked) => {
                        if (checked === true) {
                          field.onChange(Array.from(new Set([...interests, interest.value])));
                        } else {
                          field.onChange(interests.filter((x) => x !== interest.value));
                        }
                      }}
                    />
                    <span className="text-sm leading-snug text-foreground">
                      {interest.label}
                    </span>
                  </label>
                ))}
              </div>
            );
          }}
        />
        {errors.productInterests ? (
          <p className="text-xs text-destructive">{errors.productInterests.message}</p>
        ) : null}
      </fieldset>

      <div className="grid gap-4 rounded-2xl border border-border/90 bg-muted/40 p-4 backdrop-blur-sm transition-colors sm:p-5 hover:border-primary/25 hover:bg-muted/50 lg:grid-cols-2">
        <div className="space-y-2">
          <Label id="wholesale-order-value-label" className="inline-flex items-center gap-1.5">
            <DollarSign className="size-3.5 text-muted-foreground" aria-hidden="true" />
            {formLabels.orderValueLabel || "Estimated order value"}
          </Label>
          <Controller
            name="estimatedOrderValue"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className="w-full"
                  aria-labelledby="wholesale-order-value-label"
                  aria-invalid={!!errors.estimatedOrderValue}
                >
                  <SelectValue placeholder={formLabels.orderValueHelp || "Select range"} />
                </SelectTrigger>
                <SelectContent>
                  {estimatedOrderValues.map((opt) => (
                    <SelectItem key={opt.rangeValue} value={opt.rangeValue}>
                      {opt.rangeLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.estimatedOrderValue ? (
            <p className="text-xs text-destructive">{errors.estimatedOrderValue.message}</p>
          ) : null}
        </div>

        <div className="space-y-3">
          <Label id="wholesale-payment-label" className="inline-flex items-center gap-1.5">
            <Wallet className="size-3.5 text-muted-foreground" aria-hidden="true" />
            {formLabels.paymentMethodLabel || "Preferred payment method"}
          </Label>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="gap-2"
                aria-labelledby="wholesale-payment-label"
                aria-invalid={!!errors.paymentMethod}
              >
                {paymentMethods.map((opt) => (
                  <label
                    key={opt.methodValue}
                    htmlFor={`wholesale-pay-${opt.methodValue}`}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/70 bg-muted/40 p-2.5 transition-colors hover:border-primary/20 hover:bg-muted"
                  >
                    <RadioGroupItem value={opt.methodValue} id={`wholesale-pay-${opt.methodValue}`} />
                    <div className="text-sm leading-snug">
                      <div>{opt.label}</div>
                      {opt.helpText ? (
                        <div className="text-xs text-muted-foreground">{opt.helpText}</div>
                      ) : null}
                    </div>
                  </label>
                ))}
              </RadioGroup>
            )}
          />
          {errors.paymentMethod ? (
            <p className="text-xs text-destructive">{errors.paymentMethod.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-border/90 bg-muted/40 p-4 backdrop-blur-sm transition-colors sm:p-5 hover:border-primary/25 hover:bg-muted/50">
        <Label htmlFor="wholesale-notes" className="inline-flex items-center gap-1.5">
          <MessageSquareText className="size-3.5 text-muted-foreground" aria-hidden="true" />
          {formLabels.notesLabel || "Additional notes"}
        </Label>
        <Textarea
          id="wholesale-notes"
          rows={4}
          placeholder={formLabels.notesHelp || "SKU preferences, timeline, delivery windows, etc."}
          aria-invalid={!!errors.notes}
          {...register("notes")}
        />
        {errors.notes ? <p className="text-xs text-destructive">{errors.notes.message}</p> : null}
      </div>

      {!hasOrderSummary ? (
        <>
          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Sending…" : formLabels.submitButtonText || "Submit wholesale inquiry"}
          </Button>
          <p className="inline-flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-highlight" aria-hidden="true" />
            <span>
              By submitting, you confirm you are authorized to purchase on behalf of your
              business. Food supplements are not intended to diagnose, treat, cure, or prevent any disease.
            </span>
          </p>
        </>
      ) : null}
    </form>
  );

  const formWithSummary = hasOrderSummary ? (
    <div className={cn("grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]", className)}>
      <div>{formInner}</div>
      <WholesaleOrderSummary
        items={normalizedOrderItems}
        formId={WHOLESALE_FORM_ELEMENT_ID}
        isSubmitting={isSubmitting}
      />
    </div>
  ) : (
    formInner
  );

  if (bare) {
    return <div className={cn(!hasOrderSummary && "stack-md", !hasOrderSummary && className)}>{formWithSummary}</div>;
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="font-heading text-xl sm:text-2xl">Wholesale inquiry</CardTitle>
        <CardDescription>
          Tell us about your business. We typically respond within one business day.
        </CardDescription>
      </CardHeader>
      <CardContent>{formWithSummary}</CardContent>
    </Card>
  );
}
