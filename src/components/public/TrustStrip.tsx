import { Container } from "@/components/shared/Container";
import { formatVariantLabel } from "@/lib/utils";
import type { ProductWithRelations } from "@/lib/types";

export function TrustStrip({ product }: { product: ProductWithRelations | null }) {
  const sizesLabel = product?.variants.length
    ? product.variants.map((v) => formatVariantLabel(v.size, v.unit)).join(" · ")
    : null;

  const items = [
    "A2 Gir Cow Ghee",
    "Pure Ghee, No Added Ingredients",
    "FSSAI Licensed",
    sizesLabel,
  ].filter((v): v is string => Boolean(v));

  return (
    <div className="border-y border-border bg-white">
      <Container>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 py-7 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-8 sm:py-6">
          {items.map((item) => (
            <li
              key={item}
              className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-maroon/85 sm:text-left sm:text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
