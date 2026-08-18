"use client";

import { useActionState } from "react";
import Image from "next/image";
import {
  addProductImage,
  removeProductImage,
  reorderProductImage,
  setProductImageVariant,
  type ActionState,
} from "@/app/actions/admin-products";
import { FormStatusBanner } from "@/components/admin/FormStatusBanner";
import { SaveButton } from "@/components/admin/SaveButton";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { inputClasses } from "@/components/admin/fieldStyles";
import { formatVariantLabel } from "@/lib/utils";
import type { Media, ProductMedia, ProductVariant } from "@prisma/client";

const initialState: ActionState = { status: "idle" };

type ImageEntry = ProductMedia & { media: Media };

export function ProductImageManager({
  productId,
  images,
  variants,
}: {
  productId: string;
  images: ImageEntry[];
  variants: ProductVariant[];
}) {
  const [state, formAction] = useActionState(addProductImage, initialState);

  return (
    <div className="rounded-md border border-border bg-white p-6">
      <h2 className="mb-1 font-heading text-lg font-semibold text-ink">Product Images</h2>
      <p className="mb-5 text-sm text-muted">
        The first image is used as the default primary photo. Tag an image to a specific
        size (e.g. the 5 KG tin&rsquo;s own photo) and the product page swaps to it
        automatically when a visitor selects that size.
      </p>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <ImageTile
              key={image.id}
              image={image}
              variants={variants}
              isPrimary={index === 0}
              isFirst={index === 0}
              isLast={index === images.length - 1}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-sm border border-dashed border-border p-4 text-sm text-muted">
          No images uploaded yet.
        </p>
      )}

      <form action={formAction} className="mt-6 flex flex-wrap items-end gap-3 border-t border-border pt-6">
        <input type="hidden" name="productId" value={productId} />
        <div>
          <label htmlFor="file" className="mb-1 block text-xs font-medium text-muted">
            Upload Image
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className={inputClasses()}
          />
        </div>
        <div className="w-56">
          <label htmlFor="altText" className="mb-1 block text-xs font-medium text-muted">
            Alt text (optional)
          </label>
          <input id="altText" name="altText" type="text" className={inputClasses()} />
        </div>
        <div className="w-44">
          <label htmlFor="variantId" className="mb-1 block text-xs font-medium text-muted">
            Applies To
          </label>
          <select id="variantId" name="variantId" defaultValue="" className={inputClasses()}>
            <option value="">All sizes (general)</option>
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {formatVariantLabel(v.size, v.unit)} only
              </option>
            ))}
          </select>
        </div>
        <SaveButton pendingLabel="Uploading...">Upload</SaveButton>
      </form>
      <p className="mt-2 text-xs text-muted">JPG, PNG or WebP. Max 5MB.</p>
      <FormStatusBanner status={state.status} message={state.message} />
    </div>
  );
}

function ImageTile({
  image,
  variants,
  isPrimary,
  isFirst,
  isLast,
}: {
  image: ImageEntry;
  variants: ProductVariant[];
  isPrimary: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-border">
      <div className="relative flex aspect-square items-center justify-center bg-cream">
        <Image
          src={image.media.url}
          alt={image.media.altText ?? ""}
          width={image.media.width ?? 300}
          height={image.media.height ?? 300}
          className="h-full w-full object-contain p-2"
        />
        {isPrimary ? (
          <span className="absolute left-1.5 top-1.5 rounded-sm bg-maroon px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Primary
          </span>
        ) : null}
      </div>

      <form action={setProductImageVariant} className="border-t border-border bg-white px-2 py-1.5">
        <input type="hidden" name="productMediaId" value={image.id} />
        <label className="sr-only" htmlFor={`applies-to-${image.id}`}>
          Applies to
        </label>
        <select
          id={`applies-to-${image.id}`}
          name="variantId"
          defaultValue={image.variantId ?? ""}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="w-full rounded-sm border border-border bg-white px-1.5 py-1 text-[11px] text-ink"
        >
          <option value="">All sizes (general)</option>
          {variants.map((v) => (
            <option key={v.id} value={v.id}>
              {formatVariantLabel(v.size, v.unit)} only
            </option>
          ))}
        </select>
      </form>

      <form action={removeProductImage} className="flex items-center justify-between gap-1 border-t border-border bg-white px-2 py-1.5">
        <input type="hidden" name="productMediaId" value={image.id} />
        <div className="flex gap-1">
          <button
            type="submit"
            formAction={reorderProductImage.bind(null, "up")}
            disabled={isFirst}
            aria-label="Move image earlier"
            className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-ink/60 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="submit"
            formAction={reorderProductImage.bind(null, "down")}
            disabled={isLast}
            aria-label="Move image later"
            className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-ink/60 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ↓
          </button>
        </div>
        <ConfirmSubmitButton
          title="Remove this product image?"
          description="This cannot be undone. If it's the primary image, the next image in order will take its place."
          confirmLabel="Remove Image"
          className="text-xs"
        >
          Remove
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
