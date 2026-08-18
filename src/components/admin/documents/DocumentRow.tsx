"use client";

import { useActionState } from "react";
import { updateDocumentMeta, setDocumentStatus, deleteDocument, type DeleteDocumentState } from "@/app/actions/admin-documents";
import type { ActionState } from "@/app/actions/admin-products";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { inputClasses } from "@/components/admin/fieldStyles";
import type { Document } from "@prisma/client";

const initialState: ActionState = { status: "idle" };
const initialDeleteState: DeleteDocumentState = { status: "idle" };

export function DocumentRow({ document }: { document: Document }) {
  const [state, formAction] = useActionState(updateDocumentMeta, initialState);
  const [deleteState, deleteAction] = useActionState(deleteDocument, initialDeleteState);

  return (
    <div className="rounded-md border border-border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <a href={document.url} target="_blank" rel="noreferrer noopener" className="text-sm font-medium text-maroon hover:underline">
          {document.label}
        </a>
        <div className="flex items-center gap-2">
          <StatusBadge status={document.status} />
          <form action={setDocumentStatus.bind(null, document.status === "active" ? "inactive" : "active")}>
            <input type="hidden" name="id" value={document.id} />
            <button
              type="submit"
              className="rounded-sm border border-border px-2.5 py-1 text-xs font-medium text-ink/70 hover:bg-black/5"
            >
              {document.status === "active" ? "Deactivate" : "Activate"}
            </button>
          </form>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={document.id} />
            <ConfirmSubmitButton
              title={`Delete "${document.label}"?`}
              description="This permanently removes the file. It's blocked if the document is still attached to the Quality page."
              confirmLabel="Delete Document"
              className="rounded-sm border border-border px-2.5 py-1 hover:bg-error/5"
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>

      {deleteState.status === "error" ? <p className="mt-2 text-xs text-error">{deleteState.message}</p> : null}

      <form action={formAction} className="mt-3 grid gap-3 border-t border-border pt-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
        <input type="hidden" name="id" value={document.id} />
        <div>
          <label htmlFor={`label-${document.id}`} className="mb-1 block text-xs font-medium text-muted">
            Label
          </label>
          <input
            id={`label-${document.id}`}
            name="label"
            defaultValue={document.label}
            className={inputClasses(Boolean(state.fieldErrors?.label))}
          />
        </div>
        <div>
          <label htmlFor={`issuedBy-${document.id}`} className="mb-1 block text-xs font-medium text-muted">
            Issued By
          </label>
          <input id={`issuedBy-${document.id}`} name="issuedBy" defaultValue={document.issuedBy ?? ""} className={inputClasses()} />
        </div>
        <div>
          <label htmlFor={`issuedDate-${document.id}`} className="mb-1 block text-xs font-medium text-muted">
            Issued Date
          </label>
          <input
            id={`issuedDate-${document.id}`}
            name="issuedDate"
            type="date"
            defaultValue={document.issuedDate ? document.issuedDate.toISOString().slice(0, 10) : ""}
            className={inputClasses()}
          />
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
