"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryFormState } from "@/app/actions/enquiry";
import { Button } from "@/components/shared/Button";
import { cn } from "@/lib/utils";

const initialState: EnquiryFormState = { status: "idle" };

export function EnquiryForm({
  productId,
  variantId,
  contextLabel,
}: {
  productId?: string;
  variantId?: string;
  contextLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-md border border-success/30 bg-success/5 px-6 py-8 text-center"
      >
        <p className="font-heading text-lg text-ink">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-5" id="enquiry-form">
      {contextLabel ? (
        <p className="rounded-sm border border-warm-gold/40 bg-kapila-gold/10 px-4 py-2.5 text-sm text-ink/80">
          Enquiring about: <span className="font-medium text-maroon">{contextLabel}</span>
        </p>
      ) : null}

      {/* Honeypot — hidden from real users, invisible via CSS not just off-screen text */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {productId ? <input type="hidden" name="productId" value={productId} /> : null}
      {variantId ? <input type="hidden" name="variantId" value={variantId} /> : null}

      <Field label="Name" htmlFor="name" error={state.fieldErrors?.name}>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={inputClasses(Boolean(state.fieldErrors?.name))}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" htmlFor="phone" error={state.fieldErrors?.phone} optional>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClasses(Boolean(state.fieldErrors?.phone))}
          />
        </Field>
        <Field label="Email" htmlFor="email" error={state.fieldErrors?.email} optional>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className={inputClasses(Boolean(state.fieldErrors?.email))}
          />
        </Field>
      </div>

      <Field label="Message" htmlFor="message" error={state.fieldErrors?.message}>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          defaultValue={contextLabel ? `I'd like to know more about ${contextLabel}.` : undefined}
          className={inputClasses(Boolean(state.fieldErrors?.message))}
        />
      </Field>

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm text-error">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending..." : "Send Enquiry"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {optional ? <span className="ml-1 font-normal text-muted">(optional)</span> : null}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClasses(hasError: boolean) {
  return cn(
    "w-full rounded-sm border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60",
    hasError ? "border-error" : "border-border"
  );
}
