"use client";

import { useActionState, useRef } from "react";
import { createFaq } from "@/app/actions/admin-faqs";
import type { ActionState } from "@/app/actions/admin-products";
import { FormField } from "@/components/admin/FormField";
import { SaveButton } from "@/components/admin/SaveButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { inputClasses } from "@/components/admin/fieldStyles";

const initialState: ActionState = { status: "idle" };

export function AddFaqForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(async (prev: ActionState, formData: FormData) => {
    const result = await createFaq(prev, formData);
    if (result.status === "success") formRef.current?.reset();
    return result;
  }, initialState);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 rounded-md border border-border bg-white p-5">
      <h2 className="font-heading text-base font-semibold text-ink">Add a New FAQ</h2>
      <FormField label="Question" htmlFor="question" error={state.fieldErrors?.question}>
        <input id="question" name="question" required className={inputClasses(Boolean(state.fieldErrors?.question))} />
      </FormField>
      <FormField label="Answer" htmlFor="answer" error={state.fieldErrors?.answer}>
        <textarea id="answer" name="answer" required rows={3} className={inputClasses(Boolean(state.fieldErrors?.answer))} />
      </FormField>
      <input type="hidden" name="status" value="active" />
      <FormStatusBanner status={state.status} message={state.message} />
      <SaveButton>Add FAQ</SaveButton>
    </form>
  );
}
