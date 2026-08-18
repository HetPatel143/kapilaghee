"use client";

import { useActionState } from "react";
import {
  addVariant,
  updateVariant,
  setVariantStatus,
  reorderVariant,
  type ActionState,
} from "@/app/actions/admin-products";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { inputClasses } from "@/components/admin/fieldStyles";
import type { ProductVariant } from "@prisma/client";

const initialState: ActionState = { status: "idle" };
const UNITS = ["kg", "g", "ml", "l"] as const;

export function VariantManager({ productId, variants }: { productId: string; variants: ProductVariant[] }) {
  return (
    <div className="rounded-md border border-border bg-white p-6">
      <h2 className="mb-1 font-heading text-lg font-semibold text-ink">Pack Sizes</h2>
      <p className="mb-5 text-sm text-muted">
        Sizes shown here appear automatically on the public product page — no code changes needed.
      </p>

      {variants.length > 0 ? (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <VariantRow
              key={variant.id}
              variant={variant}
              isFirst={index === 0}
              isLast={index === variants.length - 1}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-sm border border-dashed border-border p-4 text-sm text-muted">
          No sizes added yet.
        </p>
      )}

      <div className="mt-6 border-t border-border pt-6">
        <AddVariantForm productId={productId} />
      </div>
    </div>
  );
}

function VariantRow({
  variant,
  isFirst,
  isLast,
}: {
  variant: ProductVariant;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [state, formAction] = useActionState(updateVariant, initialState);

  return (
    <div className="rounded-sm border border-border p-4">
      <form action={formAction} className="flex flex-wrap items-end gap-3">
        <input type="hidden" name="id" value={variant.id} />

        <div className="w-24">
          <label htmlFor={`size-${variant.id}`} className="mb-1 block text-xs font-medium text-muted">
            Size
          </label>
          <input
            id={`size-${variant.id}`}
            name="size"
            type="number"
            step="any"
            min="0"
            defaultValue={variant.size}
            className={inputClasses()}
          />
        </div>

        <div className="w-24">
          <label htmlFor={`unit-${variant.id}`} className="mb-1 block text-xs font-medium text-muted">
            Unit
          </label>
          <select id={`unit-${variant.id}`} name="unit" defaultValue={variant.unit} className={inputClasses()}>
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="w-40">
          <label htmlFor={`status-${variant.id}`} className="mb-1 block text-xs font-medium text-muted">
            Status
          </label>
          <select id={`status-${variant.id}`} name="status" defaultValue={variant.status} className={inputClasses()}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-sm border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-black/5"
        >
          Save
        </button>

        <div className="ml-auto flex items-center gap-1">
          <ReorderButton id={variant.id} direction="up" disabled={isFirst} />
          <ReorderButton id={variant.id} direction="down" disabled={isLast} />
          <DeactivateToggle status={variant.status} />
        </div>
      </form>
      {state.status !== "idle" && state.message ? (
        <p className={`mt-2 text-xs ${state.status === "error" ? "text-error" : "text-success"}`}>{state.message}</p>
      ) : null}
    </div>
  );
}

function ReorderButton({ direction, disabled }: { id: string; direction: "up" | "down"; disabled: boolean }) {
  // The variant `id` is already present as a hidden field on the enclosing form (shared
  // with the Save button's updateVariant call) — binding `direction` here is enough for
  // reorderVariant to receive both pieces it needs.
  return (
    <button
      type="submit"
      disabled={disabled}
      aria-label={direction === "up" ? "Move up" : "Move down"}
      formAction={reorderVariant.bind(null, direction)}
      className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border text-ink/60 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {direction === "up" ? "↑" : "↓"}
    </button>
  );
}

function DeactivateToggle({ status }: { status: "active" | "inactive" }) {
  const nextStatus = status === "active" ? "inactive" : "active";
  return (
    <button
      type="submit"
      formAction={setVariantStatus.bind(null, nextStatus)}
      className="rounded-sm border border-border px-3 py-2 text-xs font-medium text-ink/70 hover:bg-black/5"
    >
      {status === "active" ? "Deactivate" : "Activate"}
    </button>
  );
}

function AddVariantForm({ productId }: { productId: string }) {
  const [state, formAction] = useActionState(addVariant, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="productId" value={productId} />

      <div className="w-24">
        <label htmlFor="new-size" className="mb-1 block text-xs font-medium text-muted">
          Size
        </label>
        <input id="new-size" name="size" type="number" step="any" min="0" required className={inputClasses(Boolean(state.fieldErrors?.size))} />
      </div>
      <div className="w-24">
        <label htmlFor="new-unit" className="mb-1 block text-xs font-medium text-muted">
          Unit
        </label>
        <select id="new-unit" name="unit" defaultValue="kg" className={inputClasses()}>
          {UNITS.map((u) => (
            <option key={u} value={u}>
              {u.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <input type="hidden" name="status" value="active" />
      <button type="submit" className="rounded-sm bg-maroon px-4 py-2 text-sm font-medium text-white hover:bg-maroon-dark">
        + Add Size
      </button>
      <FormStatusBanner status={state.status} message={state.message} />
    </form>
  );
}
