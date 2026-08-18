"use client";

import { useActionState } from "react";
import {
  updateProcessStep,
  deleteProcessStep,
  reorderProcessStep,
} from "@/app/actions/admin-content";
import type { ActionState } from "@/app/actions/admin-products";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { inputClasses } from "@/components/admin/fieldStyles";
import type { PageSection } from "@prisma/client";

const initialState: ActionState = { status: "idle" };

export function ProcessStepRow({
  step,
  index,
  isFirst,
  isLast,
}: {
  step: PageSection;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [state, formAction] = useActionState(updateProcessStep, initialState);

  return (
    <div className="rounded-md border border-border bg-white p-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="font-heading text-lg font-semibold text-warm-gold">{String(index + 1).padStart(2, "0")}</span>
        <StatusBadge status={step.status} />
        <div className="ml-auto flex items-center gap-1">
          <ReorderButtons id={step.id} isFirst={isFirst} isLast={isLast} />
          <form action={deleteProcessStep}>
            <input type="hidden" name="id" value={step.id} />
            <ConfirmSubmitButton
              title={`Remove "${step.title}"?`}
              description="This step will be permanently deleted from Our Process. This cannot be undone."
              confirmLabel="Remove Step"
            >
              Remove
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>

      <form action={formAction} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto_auto]">
        <input type="hidden" name="id" value={step.id} />
        <div>
          <label htmlFor={`title-${step.id}`} className="mb-1 block text-xs font-medium text-muted">
            Title
          </label>
          <input id={`title-${step.id}`} name="title" defaultValue={step.title ?? ""} className={inputClasses(Boolean(state.fieldErrors?.title))} />
        </div>
        <div>
          <label htmlFor={`body-${step.id}`} className="mb-1 block text-xs font-medium text-muted">
            Description
          </label>
          <input id={`body-${step.id}`} name="body" defaultValue={step.body ?? ""} className={inputClasses()} />
        </div>
        <div>
          <label htmlFor={`status-${step.id}`} className="mb-1 block text-xs font-medium text-muted">
            Status
          </label>
          <select id={`status-${step.id}`} name="status" defaultValue={step.status} className={inputClasses()}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" className="w-full rounded-sm border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-black/5">
            Save
          </button>
        </div>
      </form>
      {state.status !== "idle" && state.message ? (
        <p className={`mt-2 text-xs ${state.status === "error" ? "text-error" : "text-success"}`}>{state.message}</p>
      ) : null}
    </div>
  );
}

function ReorderButtons({ id, isFirst, isLast }: { id: string; isFirst: boolean; isLast: boolean }) {
  return (
    <form className="flex items-center gap-1">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        formAction={reorderProcessStep.bind(null, "up")}
        disabled={isFirst}
        aria-label="Move up"
        className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-ink/60 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
      >
        ↑
      </button>
      <button
        type="submit"
        formAction={reorderProcessStep.bind(null, "down")}
        disabled={isLast}
        aria-label="Move down"
        className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-ink/60 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
      >
        ↓
      </button>
    </form>
  );
}
