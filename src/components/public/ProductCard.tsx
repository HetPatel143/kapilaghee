import Image from "next/image";
import { LinkButton } from "@/components/shared/Button";
import { ProductVariantSelector } from "@/components/public/ProductVariantSelector";
import { getPrimaryProductImage } from "@/lib/types";
import type { ProductWithRelations } from "@/lib/types";

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const image = getPrimaryProductImage(product);

  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-border bg-white sm:flex-row">
      <div className="relative flex aspect-square items-center justify-center bg-cream p-8 sm:aspect-auto sm:w-72 sm:shrink-0">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.name}
            width={image.width ?? 900}
            height={image.height ?? 1600}
            sizes="(min-width: 640px) 288px, 80vw"
            className="h-full max-h-72 w-auto object-contain"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-warm-gold">Kapila</p>
        <h3 className="mt-1 font-heading text-2xl font-semibold text-maroon">{product.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{product.description}</p>

        <div className="mt-6">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-ink/60">
            Available Sizes
          </p>
          <ProductVariantSelector variants={product.variants} />
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <LinkButton href={`/our-ghee/${product.slug}`} variant="secondary">
            View Details
          </LinkButton>
          <LinkButton href={`/contact?product=${product.slug}`}>Enquire Now</LinkButton>
        </div>
      </div>
    </article>
  );
}
