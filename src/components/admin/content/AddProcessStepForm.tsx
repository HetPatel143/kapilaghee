"use client";

import { useActionState, useRef } from "react";
import { addProcessStep } from "@/app/actions/admin-content";
import type { ActionState } from "@/app/actions/admin-products";
import { FormField } from "@/components/admin/FormField";
import { SaveButton } from "@/components/admin/SaveButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { inputClasses } from "@/components/admin/fieldStyles";

const initialState: ActionState = { status: "idle" };

export function AddProcessStepForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(async (prev: ActionState, formData: FormData) => {
    const result = await addProcessStep(prev, formData);
    if (result.status === "success") formRef.current?.reset();
    return result;
  }, initialState);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 rounded-md border border-border bg-white p-5">
      <h2 className="font-heading text-base font-semibold text-ink">Add a Process Step</h2>
      <p className="text-xs text-muted">
        Only add steps that accurately describe how Kapila Ghee is actually made — this page publishes to the
        public website as soon as a step is Active.
      </p>
      <FormField label="Title" htmlFor="step-title" error={state.fieldErrors?.title}>
        <input id="step-title" name="title" required className={inputClasses(Boolean(state.fieldErrors?.title))} />
      </FormField>
      <FormField label="Description" htmlFor="step-body" optional>
        <textarea id="step-body" name="body" rows={3} className={inputClasses()} />
      </FormField>
      <FormField label="Status" htmlFor="step-status">
        <select id="step-status" name="status" defaultValue="inactive" className={inputClasses()}>
          <option value="inactive">Inactive — hidden until you&rsquo;re ready</option>
          <option value="active">Active — visible on the public website</option>
        </select>
      </FormField>
      <FormStatusBanner status={state.status} message={state.message} />
      <SaveButton>Add Step</SaveButton>
    </form>
  );
}
