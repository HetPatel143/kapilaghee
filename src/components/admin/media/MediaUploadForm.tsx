"use client";

import { useActionState, useRef } from "react";
import { uploadMedia } from "@/app/actions/admin-media";
import type { ActionState } from "@/app/actions/admin-products";
import { FormField } from "@/components/admin/FormField";
import { SaveButton } from "@/components/admin/SaveButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { inputClasses } from "@/components/admin/fieldStyles";

const initialState: ActionState = { status: "idle" };
const CATEGORIES = ["product", "homepage", "story", "process", "quality", "other"] as const;

export function MediaUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(async (prev: ActionState, formData: FormData) => {
    const result = await uploadMedia(prev, formData);
    if (result.status === "success") formRef.current?.reset();
    return result;
  }, initialState);

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3 rounded-md border border-border bg-white p-5">
      <div>
        <label htmlFor="file" className="mb-1 block text-xs font-medium text-muted">
          Image
        </label>
        <input id="file" name="file" type="file" accept="image/jpeg,image/png,image/webp" required className={inputClasses()} />
      </div>
      <div className="w-64">
        <FormField label="Alt Text" htmlFor="altText" hint="Describes the image for screen readers and SEO.">
          <input id="altText" name="altText" required className={inputClasses()} />
        </FormField>
      </div>
      <div className="w-44">
        <label htmlFor="category" className="mb-1 block text-xs font-medium text-muted">
          Category
        </label>
        <select id="category" name="category" defaultValue="other" className={inputClasses()}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c[0].toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <SaveButton pendingLabel="Uploading...">Upload</SaveButton>
      <FormStatusBanner status={state.status} message={state.message} />
    </form>
  );
}
