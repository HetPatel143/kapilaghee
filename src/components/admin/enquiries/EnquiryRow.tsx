"use client";

import { useActionState } from "react";
import type { Enquiry, Product, ProductVariant } from "@prisma/client";
import { setEnquiryStatus, deleteEnquiry, type DeleteEnquiryState } from "@/app/actions/admin-enquiries";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { toWhatsAppDigits } from "@/lib/contact";
import { formatVariantLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<Enquiry["status"], string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

const STATUS_CLASS: Record<Enquiry["status"], string> = {
  new: "bg-warm-gold/15 text-maroon",
  contacted: "bg-black/5 text-ink/70",
  closed: "bg-success/10 text-success",
};

const initialDeleteState: DeleteEnquiryState = { status: "idle" };

export function EnquiryRow({
  enquiry,
}: {
  enquiry: Enquiry & { product: Product | null; variant: ProductVariant | null };
}) {
  const [deleteState, deleteAction] = useActionState(deleteEnquiry, initialDeleteState);

  const contextLabel = enquiry.product
    ? `${enquiry.product.name}${enquiry.variant ? ` — ${formatVariantLabel(enquiry.variant.size, enquiry.variant.unit)}` : ""}`
    : null;

  return (
    <div className="rounded-md border border-border bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-heading text-base font-semibold text-ink">{enquiry.name}</p>
            <span className={cn("inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium", STATUS_CLASS[enquiry.status])}>
              {STATUS_LABEL[enquiry.status]}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            {enquiry.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            {contextLabel ? ` · Regarding: ${contextLabel}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {enquiry.phone ? (
            <>
              <a
                href={`tel:${enquiry.phone}`}
                className="rounded-sm border border-border px-2.5 py-1 text-xs font-medium text-ink/70 hover:bg-black/5"
              >
                Call
              </a>
              <a
                href={`https://wa.me/${toWhatsAppDigits(enquiry.phone)}`}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-sm border border-border px-2.5 py-1 text-xs font-medium text-ink/70 hover:bg-black/5"
              >
                WhatsApp
              </a>
            </>
          ) : null}
          <form action={deleteAction}>
            <input type="hidden" name="id" value={enquiry.id} />
            <ConfirmSubmitButton
              title={`Delete enquiry from "${enquiry.name}"?`}
              description="This permanently removes the enquiry record. This cannot be undone."
              confirmLabel="Delete Enquiry"
              className="rounded-sm border border-border px-2.5 py-1 text-xs hover:bg-error/5"
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>

      {enquiry.phone ? <p className="mt-3 text-sm text-ink/80">{enquiry.phone}</p> : null}
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/80">{enquiry.message}</p>

      {deleteState.status === "error" ? <p className="mt-2 text-xs text-error">{deleteState.message}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
        {(Object.keys(STATUS_LABEL) as Enquiry["status"][])
          .filter((status) => status !== enquiry.status)
          .map((status) => (
            <form key={status} action={setEnquiryStatus.bind(null, status)}>
              <input type="hidden" name="id" value={enquiry.id} />
              <button
                type="submit"
                className="rounded-sm border border-border px-2.5 py-1 text-xs font-medium text-ink/70 hover:bg-black/5"
              >
                Mark {STATUS_LABEL[status]}
              </button>
            </form>
          ))}
      </div>
    </div>
  );
}
