"use client";

import { useActionState } from "react";
import { createProduct, updateProduct, type ActionState } from "@/app/actions/admin-products";
import { FormField } from "@/components/admin/FormField";
import { SaveButton } from "@/components/admin/SaveButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { inputClasses } from "@/components/admin/fieldStyles";
import type { Product } from "@prisma/client";

const initialState: ActionState = { status: "idle" };

export function ProductBasicInfoForm({ product }: { product?: Product }) {
  const action = product ? updateProduct : createProduct;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} noValidate className="space-y-5 rounded-md border border-border bg-white p-6">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <FormField label="Product Name" htmlFor="name" error={state.fieldErrors?.name}>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={product?.name}
          className={inputClasses(Boolean(state.fieldErrors?.name))}
        />
      </FormField>

      <FormField
        label="Slug"
        htmlFor="slug"
        error={state.fieldErrors?.slug}
        hint="Used in the product URL, e.g. /our-ghee/kapila-a2-gir-cow-ghee. Lowercase letters, numbers and hyphens only."
      >
        <input
          id="slug"
          name="slug"
          type="text"
          required
          defaultValue={product?.slug}
          className={inputClasses(Boolean(state.fieldErrors?.slug))}
        />
      </FormField>

      <FormField label="Description" htmlFor="description" error={state.fieldErrors?.description}>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={product?.description}
          className={inputClasses(Boolean(state.fieldErrors?.description))}
        />
      </FormField>

      <FormField label="Status" htmlFor="status">
        <select id="status" name="status" defaultValue={product?.status ?? "active"} className={inputClasses()}>
          <option value="active">Active — visible on the public website</option>
          <option value="inactive">Inactive — hidden from the public website</option>
        </select>
      </FormField>

      <FormStatusBanner status={state.status} message={state.message} />

      <SaveButton>{product ? "Save Changes" : "Create Product"}</SaveButton>
    </form>
  );
}
