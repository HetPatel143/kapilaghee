"use client";

import { useState } from "react";
import { formatVariantLabel, cn } from "@/lib/utils";
import type { ProductVariant } from "@prisma/client";

/**
 * Displays available pack sizes as selectable chips. Sizes are entirely data-driven —
 * nothing here is hard-coded, so new/changed variants from Admin show up automatically.
 *
 * Selecting a size only highlights it (and, where a parent passes `onSelect`, lets that
 * parent react — e.g. swapping the product gallery image). It never navigates by itself:
 * "Enquire Now" is a separate, explicit action elsewhere on the page. No price/stock is
 * shown or assumed (docs/future-ecommerce.md).
 *
 * Uncontrolled by default (manages its own selection locally). Pass `selectedId` +
 * `onSelect` to control it from a parent that needs to know the current selection.
 */
export function ProductVariantSelector({
  variants,
  size = "md",
  selectedId,
  onSelect,
}: {
  variants: ProductVariant[];
  size?: "sm" | "md";
  selectedId?: string | null;
  onSelect?: (variantId: string) => void;
}) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    variants[0]?.id ?? null
  );
  const activeId = onSelect ? selectedId : internalSelectedId;

  if (variants.length === 0) {
    return <p className="text-sm text-muted">Pack sizes will be available shortly.</p>;
  }

  return (
    <ul className="flex flex-wrap gap-2.5" aria-label="Available pack sizes">
      {variants.map((variant) => {
        const label = formatVariantLabel(variant.size, variant.unit);
        const isActive = activeId === variant.id;
        return (
          <li key={variant.id}>
            <button
              type="button"
              aria-pressed={isActive}
              aria-label={`Select the ${label} pack`}
              onClick={() => (onSelect ? onSelect(variant.id) : setInternalSelectedId(variant.id))}
              className={cn(
                "inline-flex items-center rounded-sm border font-medium transition-colors",
                size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm",
                isActive
                  ? "border-maroon bg-maroon text-white"
                  : "border-maroon/30 text-maroon hover:border-maroon hover:bg-maroon/5"
              )}
            >
              {label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
