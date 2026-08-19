"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Media } from "@prisma/client";

/**
 * Uncontrolled by default (manages its own active image). Pass `activeIndex` +
 * `onActiveIndexChange` to control it from a parent — used on the product detail page so
 * selecting a pack size can jump the gallery to that size's photo (see ProductPurchasePanel).
 */
export function ProductGallery({
  images,
  productName,
  activeIndex: controlledIndex,
  onActiveIndexChange,
}: {
  images: Media[];
  productName: string;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
}) {
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = onActiveIndexChange ? (controlledIndex ?? 0) : internalIndex;
  const setActiveIndex = onActiveIndexChange ?? setInternalIndex;
  const active = images[activeIndex] ?? images[0];

  if (!active) {
    return (
      <div className="flex aspect-square items-center justify-center">
        <p className="font-heading text-maroon/50">{productName}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex aspect-square items-center justify-center sm:aspect-[4/5]">
        <Image
          key={active.id}
          src={active.url}
          alt={active.altText ?? productName}
          width={active.width ?? 900}
          height={active.height ?? 1600}
          priority
          sizes="(min-width: 1024px) 480px, 90vw"
          className="h-full w-auto max-w-full object-contain drop-shadow-[0_20px_30px_rgba(59,33,24,0.18)]"
        />
      </div>

      {images.length > 1 ? (
        <div
          role="tablist"
          aria-label={`${productName} image thumbnails`}
          className="mt-4 flex snap-x gap-3 overflow-x-auto pb-1"
        >
          {images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "flex h-20 w-20 shrink-0 snap-start items-center justify-center rounded-sm border bg-white p-2 transition-colors",
                i === activeIndex ? "border-maroon" : "border-border hover:border-warm-gold"
              )}
            >
              <Image
                src={image.url}
                alt=""
                width={image.width ?? 200}
                height={image.height ?? 200}
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
