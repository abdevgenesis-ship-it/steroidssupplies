"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin, MessageSquareText, Phone, User2, Wallet } from "lucide-react";
import type { FieldErrors } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";

import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/useCart";
import {
  trackFormAbandon,
  trackFormError,
  trackFormStart,
  trackFormSubmitResult,
  trackGenerateLead,
} from "@/lib/analytics/gtag";
import {
  createCheckoutFormSchema,
  type CheckoutOrderInput,
} from "@/lib/checkout/formSchema";
import type { WholesaleFormClientConfig } from "@/lib/wholesale/formConfig";
import { normalizeOrderItems, type WholesaleOrderItem } from "@/lib/wholesale/orderItems";
import { cn } from "@/lib/utils";

const CHECKOUT_FORM_ID = "checkout_order";
const CHECKOUT_FORM_ELEMENT_ID = "checkout-order-form";

type CheckoutFormProps = {
  className?: string;
  orderItems: WholesaleOrderItem[];
  formConfig: WholesaleFormClientConfig;
  successRedirectPath?: string;
};

export function CheckoutForm({
  className,
  orderItems,
  formConfig,
  successRedirectPath = "/checkout/thank-you",
}: CheckoutFormProps) {
  const router = useRouter();
  const { clearCart } = useCart();
  const { paymentMethods } = formConfig;
  const normalizedOrderItems = useMemo(() => normalizeOrderItems(orderItems), [orderItems]);

  const validationSchema = useMemo(() => {
    const paymentMethodIds = paymentMethods.map((item) => item.methodValue);
    return createCheckoutFormSchema(
      paymentMethodIds.length > 0 ? paymentMethodIds : ["crypto", "revolut", "bank"],
    );
  }, [paymentMethods]);

  const defaultPaymentMethod = paymentMethods[0]?.methodValue ?? "crypto";

  const defaultValues: CheckoutOrderInput = {
    clientName: "",
    whatsapp: "",
    email: "",
    address: "",
    paymentMethod: defaultPaymentMethod,
    notes: "",
    orderItems: normalizedOrderItems,
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CheckoutOrderInput>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasTrackedStartRef = useRef(false);
  const formCompletedRef = useRef(false);

  useEffect(() => {
    if (isDirty && !hasTrackedStartRef.current) {
      hasTrackedStartRef.current = true;
      trackFormStart(CHECKOUT_FORM_ID);
    }
  }, [isDirty]);

  useEffect(() => {
    const onPageHide = () => {
      if (hasTrackedStartRef.current && !formCompletedRef.current) {
        trackFormAbandon(CHECKOUT_FORM_ID);
      }
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, []);

  const onInvalid = (fieldErrors: FieldErrors<CheckoutOrderInput>) => {
    const fields = Object.keys(fieldErrors) as string[];
    trackFormError(CHECKOUT_FORM_ID, "validation", { fields });
    trackFormSubmitResult(CHECKOUT_FORM_ID, false);
  };

  const onSubmit = async (data: CheckoutOrderInput) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, orderItems: normalizedOrderItems }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        trackFormError(CHECKOUT_FORM_ID, "server");
        trackFormSubmitResult(CHECKOUT_FORM_ID, false);
        setSubmitError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      formCompletedRef.current = true;
      trackGenerateLead(CHECKOUT_FORM_ID);
      trackFormSubmitResult(CHECKOUT_FORM_ID, true);
      clearCart();
      const emailParam = encodeURIComponent(data.email);
      router.push(`${successRedirectPath}?email=${emailParam}`);
    } catch {
      trackFormError(CHECKOUT_FORM_ID, "network");
      trackFormSubmitResult(CHECKOUT_FORM_ID, false);
      setSubmitError("Network error. Check your connection and try again.");
    }
  };

  const formInner = (
    <form
      id={CHECKOUT_FORM_ELEMENT_ID}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="stack-md"
      noValidate
    >
      {submitError ? (
        <p className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {submitError}
        </p>
      ) : null}

      <div className="rounded-2xl border border-border/90 bg-muted/40 p-4 backdrop-blur-sm transition-colors sm:p-5 hover:border-primary/25 hover:bg-muted/50">
        <div className="mb-3">
          <p className="text-sm font-semibold text-foreground">Your details</p>
          <p className="text-xs text-muted-foreground">We will use these to confirm and deliver your order.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="checkout-name" className="inline-flex items-center gap-1.5">
              <User2 className="size-3.5 text-muted-foreground" aria-hidden="true" />
              Full name
            </Label>
            <Input
              id="checkout-name"
              autoComplete="name"
              placeholder="e.g. Alex Morgan"
              aria-invalid={!!errors.clientName}
              {...register("clientName")}
            />
            {errors.clientName ? (
              <p className="text-xs text-destructive">{errors.clientName.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkout-whatsapp" className="inline-flex items-center gap-1.5">
              <Phone className="size-3.5 text-muted-foreground" aria-hidden="true" />
              WhatsApp number
            </Label>
            <Input
              id="checkout-whatsapp"
              type="tel"
              autoComplete="tel"
              placeholder="e.g. +44 7700 900123"
              aria-invalid={!!errors.whatsapp}
              {...register("whatsapp")}
            />
            {errors.whatsapp ? (
              <p className="text-xs text-destructive">{errors.whatsapp.message}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="checkout-email" className="inline-flex items-center gap-1.5">
            <Mail className="size-3.5 text-muted-foreground" aria-hidden="true" />
            Email address
          </Label>
          <Input
            id="checkout-email"
            type="email"
            autoComplete="email"
            placeholder="e.g. alex@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>
      </div>

      <div className="rounded-2xl border border-border/90 bg-muted/40 p-4 backdrop-blur-sm transition-colors sm:p-5 hover:border-primary/25 hover:bg-muted/50">
        <div className="mb-3">
          <p className="text-sm font-semibold text-foreground">Delivery address</p>
          <p className="text-xs text-muted-foreground">Include street, city, postcode, and country.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="checkout-address" className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 text-muted-foreground" aria-hidden="true" />
            Address
          </Label>
          <Textarea
            id="checkout-address"
            rows={3}
            autoComplete="street-address"
            placeholder="e.g. 12 Baker Street, London, W1U 3BW, United Kingdom"
            aria-invalid={!!errors.address}
            {...register("address")}
          />
          {errors.address ? (
            <p className="text-xs text-destructive">{errors.address.message}</p>
          ) : null}
        </div>
      </div>

      <fieldset className="space-y-3 rounded-2xl border border-border/90 bg-muted/40 p-4 backdrop-blur-sm transition-colors sm:p-5 hover:border-primary/25 hover:bg-muted/50">
        <legend className="px-1 text-sm font-semibold text-foreground">Payment method</legend>
        <p className="text-xs text-muted-foreground">Choose how you would like to pay for this order.</p>
        <Controller
          name="paymentMethod"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="gap-2"
              aria-invalid={!!errors.paymentMethod}
            >
              {paymentMethods.map((opt) => (
                <label
                  key={opt.methodValue}
                  htmlFor={`checkout-pay-${opt.methodValue}`}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/70 bg-muted/40 p-2.5 transition-colors hover:border-primary/20 hover:bg-muted"
                >
                  <RadioGroupItem value={opt.methodValue} id={`checkout-pay-${opt.methodValue}`} />
                  <div className="text-sm leading-snug">
                    <div className="inline-flex items-center gap-1.5">
                      <Wallet className="size-3.5 text-muted-foreground" aria-hidden="true" />
                      {opt.label}
                    </div>
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
      </fieldset>

      <div className="space-y-2 rounded-2xl border border-border/90 bg-muted/40 p-4 backdrop-blur-sm transition-colors sm:p-5 hover:border-primary/25 hover:bg-muted/50">
        <Label htmlFor="checkout-notes" className="inline-flex items-center gap-1.5">
          <MessageSquareText className="size-3.5 text-muted-foreground" aria-hidden="true" />
          Order notes (optional)
        </Label>
        <Textarea
          id="checkout-notes"
          rows={3}
          placeholder="Delivery instructions, preferred contact time, etc."
          aria-invalid={!!errors.notes}
          {...register("notes")}
        />
        {errors.notes ? <p className="text-xs text-destructive">{errors.notes.message}</p> : null}
      </div>
    </form>
  );

  return (
    <div
      className={cn(
        "grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]",
        className,
      )}
    >
      <div>{formInner}</div>
      <OrderSummary
        items={normalizedOrderItems}
        formId={CHECKOUT_FORM_ELEMENT_ID}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
