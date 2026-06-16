"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createContactFormSchema, type ContactFormInput } from "@/lib/contactFormSchema";
import type { ResolvedContactPage } from "@/lib/contactPageContent";
import { renderTextWithBold } from "@/lib/content/renderTextWithBold";

type ContactFormProps = {
  content: ResolvedContactPage;
};

export function ContactForm({ content }: ContactFormProps) {
  const normalizedSubjectOptions = useMemo(
    () =>
      content.subjectOptions
        .filter((opt) => typeof opt.value === "string" && opt.value.length > 0)
        .map((opt) => ({
          value: opt.value as string,
          label: opt.label || opt.value || "Option",
        })),
    [content.subjectOptions],
  );

  const subjectValues = useMemo(
    () => normalizedSubjectOptions.map((o) => o.value),
    [normalizedSubjectOptions],
  );

  const validationSchema = useMemo(() => createContactFormSchema(subjectValues), [subjectValues]);

  const defaultSubject = normalizedSubjectOptions[0]?.value ?? "general";

  const defaultValues: ContactFormInput = {
    name: "",
    email: "",
    subject: defaultSubject,
    message: "",
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const onSubmit = async (data: ContactFormInput) => {
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setSubmitError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitSuccess(true);
      reset({ ...defaultValues, subject: defaultSubject });
    } catch {
      setSubmitError("Network error. Check your connection and try again.");
    }
  };

  if (submitSuccess) {
    return (
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="font-heading text-xl sm:text-2xl">{content.successTitle}</CardTitle>
          <CardDescription className="text-base leading-relaxed text-muted-foreground">
            {content.successMessage}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setSubmitSuccess(false);
              reset(defaultValues);
            }}
          >
            Send another message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle className="font-heading text-xl sm:text-2xl">{content.formHeading}</CardTitle>
        {content.formIntro ? (
          <CardDescription className="text-base leading-relaxed">{renderTextWithBold(content.formIntro)}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="stack-md" noValidate>
          {submitError ? (
            <p
              className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {submitError}
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="contact-name">{content.nameFieldLabel}</Label>
            <Input
              id="contact-name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">{content.emailFieldLabel}</Label>
            <Input
              id="contact-email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label id="contact-subject-label">{content.subjectFieldLabel}</Label>
            <Controller
              control={control}
              name="subject"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="contact-subject"
                    aria-labelledby="contact-subject-label"
                    aria-invalid={!!errors.subject}
                    className="w-full"
                  >
                    <SelectValue placeholder={content.subjectFieldLabel} />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    side="bottom"
                    sideOffset={6}
                    align="start"
                    collisionPadding={16}
                    className="w-[var(--radix-select-trigger-width)] max-h-[min(320px,var(--radix-select-content-available-height))]"
                  >
                    {normalizedSubjectOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.subject ? <p className="text-xs text-destructive">{errors.subject.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message">{content.messageFieldLabel}</Label>
            <Textarea
              id="contact-message"
              rows={5}
              className="min-h-[120px] resize-y"
              aria-invalid={!!errors.message}
              {...register("message")}
            />
            {errors.message ? (
              <p className="text-xs text-destructive">{errors.message.message}</p>
            ) : null}
          </div>

          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                Sending…
              </>
            ) : (
              content.submitButtonLabel
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
