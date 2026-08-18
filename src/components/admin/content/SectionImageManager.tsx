"use client";

import { useActionState } from "react";
import Image from "next/image";
import {
  setSectionImageFromLibrary,
  uploadSectionImage,
  removeSectionImage,
} from "@/app/actions/admin-content";
import type { ActionState } from "@/app/actions/admin-products";
import { SaveButton } from "@/components/admin/SaveButton";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { inputClasses } from "@/components/admin/fieldStyles";
import type { Media } from "@prisma/client";
import type { PageKey } from "@/lib/data";

const initialState: ActionState = { status: "idle" };

export function SectionImageManager({
  sectionId,
  page,
  currentImage,
  libraryOptions,
}: {
  sectionId: string;
  page: PageKey;
  currentImage: Media | null;
  libraryOptions: Media[];
}) {
  const [uploadState, uploadAction] = useActionState(uploadSectionImage, initialState);

  return (
    <div className="space-y-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Image</p>

      {currentImage ? (
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-sm border border-border bg-cream">
            <Image
              src={currentImage.url}
              alt={currentImage.altText ?? ""}
              width={currentImage.width ?? 200}
              height={currentImage.height ?? 200}
              className="h-full w-full object-contain p-1"
            />
          </div>
          <form action={removeSectionImage}>
            <input type="hidden" name="sectionId" value={sectionId} />
            <input type="hidden" name="page" value={page} />
            <ConfirmSubmitButton
              title="Remove this image?"
              description="The section will show no image until you set a new one."
              confirmLabel="Remove Image"
            >
              Remove
            </ConfirmSubmitButton>
          </form>
        </div>
      ) : (
        <p className="text-sm text-muted">No image set.</p>
      )}

      {libraryOptions.length > 0 ? (
        <form action={setSectionImageFromLibrary} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="sectionId" value={sectionId} />
          <input type="hidden" name="page" value={page} />
          <div className="w-64">
            <label htmlFor={`pick-${sectionId}`} className="mb-1 block text-xs font-medium text-muted">
              Choose from Media Library
            </label>
            <select id={`pick-${sectionId}`} name="mediaId" defaultValue="" className={inputClasses()}>
              <option value="" disabled>
                Select an image...
              </option>
              {libraryOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.altText || m.url.split("/").pop()}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="rounded-sm border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-black/5">
            Use This Image
          </button>
        </form>
      ) : null}

      <form action={uploadAction} className="flex flex-wrap items-end gap-3 border-t border-border pt-4">
        <input type="hidden" name="sectionId" value={sectionId} />
        <input type="hidden" name="page" value={page} />
        <div>
          <label htmlFor={`file-${sectionId}`} className="mb-1 block text-xs font-medium text-muted">
            Or Upload New
          </label>
          <input id={`file-${sectionId}`} name="file" type="file" accept="image/jpeg,image/png,image/webp" className={inputClasses()} />
        </div>
        <div className="w-48">
          <label htmlFor={`alt-${sectionId}`} className="mb-1 block text-xs font-medium text-muted">
            Alt text
          </label>
          <input id={`alt-${sectionId}`} name="altText" className={inputClasses()} />
        </div>
        <SaveButton pendingLabel="Uploading...">Upload &amp; Use</SaveButton>
      </form>
      <FormStatusBanner status={uploadState.status} message={uploadState.message} />
    </div>
  );
}
