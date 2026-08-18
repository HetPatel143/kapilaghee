"use client";

import { useActionState } from "react";
import { updateSectionContent } from "@/app/actions/admin-content";
import type { ActionState } from "@/app/actions/admin-products";
import { FormField } from "@/components/admin/FormField";
import { SaveButton } from "@/components/admin/SaveButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { inputClasses } from "@/components/admin/fieldStyles";
import type { PageKey } from "@/lib/data";

const initialState: ActionState = { status: "idle" };

export function SectionTextForm({
  sectionId,
  page,
  title,
  body,
  titleLabel = "Title",
  bodyLabel = "Description",
  bodyRows = 4,
  bodyHint,
}: {
  sectionId: string;
  page: PageKey;
  title: string | null;
  body: string | null;
  titleLabel?: string;
  bodyLabel?: string;
  bodyRows?: number;
  bodyHint?: string;
}) {
  const [state, formAction] = useActionState(updateSectionContent, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={sectionId} />
      <input type="hidden" name="page" value={page} />

      <FormField label={titleLabel} htmlFor={`title-${sectionId}`} error={state.fieldErrors?.title}>
        <input id={`title-${sectionId}`} name="title" defaultValue={title ?? ""} className={inputClasses(Boolean(state.fieldErrors?.title))} />
      </FormField>

      <FormField label={bodyLabel} htmlFor={`body-${sectionId}`} error={state.fieldErrors?.body} hint={bodyHint}>
        <textarea
          id={`body-${sectionId}`}
          name="body"
          rows={bodyRows}
          defaultValue={body ?? ""}
          className={inputClasses(Boolean(state.fieldErrors?.body))}
        />
      </FormField>

      <div className="flex items-center gap-3">
        <SaveButton>Save Section</SaveButton>
        <FormStatusBanner status={state.status} message={state.message} />
      </div>
    </form>
  );
}
