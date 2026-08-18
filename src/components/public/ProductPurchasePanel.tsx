"use client";

import { useMemo, useState } from "react";
import { LinkButton } from "@/components/shared/Button";
import { ProductGallery } from "@/components/public/ProductGallery";
import { ProductVariantSelector } from "@/components/public/ProductVariantSelector";
import type { ProductWithRelations } from "@/lib/types";

/**
 * Wires together the product gallery and the size selector on the product detail page:
 * - Selecting a size only changes the highlighted chip and (if that size has its own
 *   photo) jumps the gallery to it — it never navigates away by itself.
 * - "Enquire Now" is the one control that navigates, carrying whichever size is currently
 *   selected so the enquiry form arrives pre-filled with the right context.
 */
export function ProductPurchasePanel({ product }: { product: ProductWithRelations }) {
  const images = useMemo(() => product.images.map((pm) => pm.media), [product.images]);

  const firstActiveVariantId = product.variants[0]?.id ?? null;
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(firstActiveVariantId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  function handleSelectVariant(variantId: string) {
    setSelectedVariantId(variantId);
    const matchIndex = product.images.findIndex((pm) => pm.variantId === variantId);
    if (matchIndex !== -1) setActiveImageIndex(matchIndex);
  }

  const enquireHref = selectedVariantId
    ? `/contact?product=${product.slug}&variant=${selectedVariantId}`
    : `/contact?product=${product.slug}`;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <ProductGallery
        images={images}
        productName={product.name}
        activeIndex={activeImageIndex}
        onActiveIndexChange={setActiveImageIndex}
      />

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-warm-gold">Kapila</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold text-maroon">{product.name}</h1>
        <p className="mt-5 text-base leading-relaxed text-ink/80 sm:text-lg">{product.description}</p>

        <div className="mt-8 border-t border-border pt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink/60">
            Available Sizes
          </p>
          <ProductVariantSelector
            variants={product.variants}
            selectedId={selectedVariantId}
            onSelect={handleSelectVariant}
          />
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-ink/60">
            Product Information
          </p>
          <dl className="space-y-2 text-sm text-ink/80">
            <div className="flex gap-2">
              <dt className="font-medium text-ink">Ingredients:</dt>
              <dd>Ghee (from Gir cow milk). No added ingredients.</dd>
            </div>
          </dl>
        </div>

        <div className="mt-9">
          <LinkButton href={enquireHref} size="lg">
            Enquire Now
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
