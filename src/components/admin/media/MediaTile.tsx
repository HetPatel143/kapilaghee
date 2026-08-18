"use client";

import { useActionState } from "react";
import Image from "next/image";
import { setMediaStatus, deleteMedia, type DeleteMediaState } from "@/app/actions/admin-media";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import type { Media } from "@prisma/client";

const initialState: DeleteMediaState = { status: "idle" };

export function MediaTile({ media }: { media: Media }) {
  const [state, formAction] = useActionState(deleteMedia, initialState);

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-white">
      <div className="relative flex aspect-square items-center justify-center bg-cream">
        <Image src={media.url} alt={media.altText ?? ""} width={media.width ?? 300} height={media.height ?? 300} className="h-full w-full object-contain p-2" />
        <span className="absolute left-1.5 top-1.5">
          <StatusBadge status={media.status} />
        </span>
      </div>
      <div className="space-y-2 p-2.5">
        <p className="truncate text-xs text-ink/80" title={media.altText ?? ""}>
          {media.altText || "—"}
        </p>
        <p className="text-[11px] uppercase tracking-wide text-muted">{media.category}</p>

        <div className="flex items-center justify-between gap-2">
          <form action={setMediaStatus.bind(null, media.status === "active" ? "inactive" : "active")}>
            <input type="hidden" name="id" value={media.id} />
            <button
              type="submit"
              className="rounded-sm border border-border px-2 py-1 text-[11px] font-medium text-ink/70 hover:bg-black/5"
            >
              {media.status === "active" ? "Deactivate" : "Activate"}
            </button>
          </form>
          <form action={formAction}>
            <input type="hidden" name="id" value={media.id} />
            <ConfirmSubmitButton
              title="Delete this image?"
              description="This permanently removes the file. It's blocked if the image is still used on a product or content section."
              confirmLabel="Delete Image"
              className="text-[11px]"
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        </div>
        {state.status === "error" ? <p className="text-[11px] text-error">{state.message}</p> : null}
      </div>
    </div>
  );
}
