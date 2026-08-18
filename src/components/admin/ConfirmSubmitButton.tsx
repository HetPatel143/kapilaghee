"use client";

import { useId, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A submit button that opens a labeled confirmation dialog before its form submits —
 * for destructive/irreversible actions (delete, remove image, remove a process step).
 *
 * Uses the native <dialog> element (showModal()) rather than window.confirm(): it gives
 * real, specific button labels ("Cancel" / "Delete Document") instead of the browser's
 * generic OK/Cancel, while still getting focus-trapping, Escape-to-close, and
 * backdrop-click-to-close for free from the browser — no dialog library needed.
 *
 * For simple, instantly-reversible actions (Activate/Deactivate toggles), call sites
 * intentionally skip this and submit directly — confirming a one-click-to-undo action
 * would be friction without a safety benefit.
 */
export function ConfirmSubmitButton({
  title,
  description,
  confirmLabel,
  children,
  className,
  variant = "danger",
}: {
  /** Dialog heading, e.g. "Delete this document?" */
  title: string;
  /** Supporting sentence, e.g. "This cannot be undone." */
  description?: string;
  /** Label for the confirm button, e.g. "Delete Document" — never generic "Yes". */
  confirmLabel: string;
  children: React.ReactNode;
  className?: string;
  variant?: "danger" | "neutral";
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const dialogId = useId();

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          formRef.current = e.currentTarget.form;
          dialogRef.current?.showModal();
        }}
        className={cn(
          "rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
          variant === "danger" ? "text-error hover:bg-error/10" : "text-ink/70 hover:bg-black/5",
          className
        )}
      >
        {children}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${dialogId}-title`}
        className="m-auto w-full max-w-sm rounded-md border border-border bg-white p-0 backdrop:bg-black/40"
      >
        <div className="p-6">
          <p id={`${dialogId}-title`} className="font-heading text-lg font-semibold text-ink">
            {title}
          </p>
          {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-sm border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                dialogRef.current?.close();
                formRef.current?.requestSubmit();
              }}
              className={cn(
                "rounded-sm px-4 py-2 text-sm font-medium text-white",
                variant === "danger" ? "bg-error hover:bg-error/90" : "bg-maroon hover:bg-maroon-dark"
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
