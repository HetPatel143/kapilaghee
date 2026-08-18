"use client";

import { useActionState, useRef } from "react";
import { uploadDocument } from "@/app/actions/admin-documents";
import type { ActionState } from "@/app/actions/admin-products";
import { FormField } from "@/components/admin/FormField";
import { SaveButton } from "@/components/admin/SaveButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { inputClasses } from "@/components/admin/fieldStyles";

const initialState: ActionState = { status: "idle" };

export function UploadDocumentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(async (prev: ActionState, formData: FormData) => {
    const result = await uploadDocument(prev, formData);
    if (result.status === "success") formRef.current?.reset();
    return result;
  }, initialState);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 rounded-md border border-border bg-white p-5">
      <h2 className="font-heading text-base font-semibold text-ink">Upload a Document</h2>
      <p className="text-xs text-muted">
        Only upload documents the business has confirmed are genuine — e.g. an FSSAI license or a lab report.
        Don&rsquo;t label something a &ldquo;certificate&rdquo; unless it actually is one.
      </p>

      <div>
        <label htmlFor="file" className="mb-1 block text-xs font-medium text-muted">
          File (PDF, JPG or PNG, max 10MB)
        </label>
        <input id="file" name="file" type="file" accept="application/pdf,image/jpeg,image/png" required className={inputClasses()} />
      </div>

      <FormField label="Label" htmlFor="label" error={state.fieldErrors?.label} hint='e.g. "FSSAI License" or "Lab Test Report — March 2025"'>
        <input id="label" name="label" required className={inputClasses(Boolean(state.fieldErrors?.label))} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Issued By" htmlFor="issuedBy" optional>
          <input id="issuedBy" name="issuedBy" className={inputClasses()} />
        </FormField>
        <FormField label="Issued Date" htmlFor="issuedDate" optional>
          <input id="issuedDate" name="issuedDate" type="date" className={inputClasses()} />
        </FormField>
      </div>

      <FormStatusBanner status={state.status} message={state.message} />
      <SaveButton pendingLabel="Uploading...">Upload Document</SaveButton>
    </form>
  );
}
