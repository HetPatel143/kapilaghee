"use client";

import { useActionState, useState } from "react";
import { updateFaq, setFaqStatus, reorderFaq } from "@/app/actions/admin-faqs";
import type { ActionState } from "@/app/actions/admin-products";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { inputClasses } from "@/components/admin/fieldStyles";
import type { FAQ } from "@prisma/client";

const initialState: ActionState = { status: "idle" };

export function FaqRow({ faq, isFirst, isLast }: { faq: FAQ; isFirst: boolean; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [state, formAction] = useActionState(updateFaq, initialState);

  return (
    <div className="rounded-md border border-border bg-white">
      <div className="flex items-center gap-3 px-4 py-3.5">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="flex-1 text-left text-sm font-medium text-ink hover:text-maroon"
        >
          {faq.question}
        </button>
        <StatusBadge status={faq.status} />
        <span className="text-xs text-muted">#{faq.sortOrder + 1}</span>

        <form className="flex items-center gap-1">
          <input type="hidden" name="id" value={faq.id} />
          <button
            type="submit"
            formAction={reorderFaq.bind(null, "up")}
            disabled={isFirst}
            aria-label="Move up"
            className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-ink/60 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="submit"
            formAction={reorderFaq.bind(null, "down")}
            disabled={isLast}
            aria-label="Move down"
            className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-ink/60 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ↓
          </button>
        </form>

        <form action={setFaqStatus.bind(null, faq.status === "active" ? "inactive" : "active")}>
          <input type="hidden" name="id" value={faq.id} />
          <button
            type="submit"
            className="rounded-sm border border-border px-2.5 py-1 text-xs font-medium text-ink/70 hover:bg-black/5"
          >
            {faq.status === "active" ? "Deactivate" : "Activate"}
          </button>
        </form>
      </div>

      {expanded ? (
        <form action={formAction} className="space-y-3 border-t border-border p-4">
          <input type="hidden" name="id" value={faq.id} />
          <div>
            <label htmlFor={`q-${faq.id}`} className="mb-1 block text-xs font-medium text-muted">
              Question
            </label>
            <input
              id={`q-${faq.id}`}
              name="question"
              defaultValue={faq.question}
              className={inputClasses(Boolean(state.fieldErrors?.question))}
            />
          </div>
          <div>
            <label htmlFor={`a-${faq.id}`} className="mb-1 block text-xs font-medium text-muted">
              Answer
            </label>
            <textarea
              id={`a-${faq.id}`}
              name="answer"
              rows={3}
              defaultValue={faq.answer}
              className={inputClasses(Boolean(state.fieldErrors?.answer))}
            />
          </div>
          <input type="hidden" name="status" value={faq.status} />
          <div className="flex items-center gap-3">
            <button type="submit" className="rounded-sm bg-maroon px-4 py-2 text-sm font-medium text-white hover:bg-maroon-dark">
              Save
            </button>
            <FormStatusBanner status={state.status} message={state.message} />
          </div>
        </form>
      ) : null}
    </div>
  );
}
