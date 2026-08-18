import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { LinkButton } from "@/components/shared/Button";
import type { ProductWithRelations, PageSectionWithRelations } from "@/lib/types";
import { getPrimaryProductImage, findSection } from "@/lib/types";

export function HeroSection({
  product,
  sections,
}: {
  product: ProductWithRelations | null;
  sections: PageSectionWithRelations[];
}) {
  const hero = findSection(sections, "hero");
  const image = product ? getPrimaryProductImage(product) : null;
  const title = hero?.title ?? "Pure A2 Gir Cow Ghee";
  const body = hero?.body ?? "Pure ghee. Nothing added.";

  return (
    <div className="relative overflow-hidden bg-cream">
      {/* Subtle decorative ring motif — echoes the cow medallion device without literal imagery */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-warm-gold/40 sm:-right-24 sm:-top-24"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-72 w-72 rounded-full border border-warm-gold/25"
      />

      <Container className="relative grid items-center gap-10 pb-16 pt-10 sm:pb-20 sm:pt-14 lg:grid-cols-2 lg:gap-16 lg:pb-28 lg:pt-16">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-warm-gold">
            Kapila Dairy Farm &middot; Surat, Gujarat
          </p>
          <h1 className="font-heading text-4xl font-semibold leading-[1.08] text-maroon sm:text-5xl lg:text-[3.25rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/80">{body}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <LinkButton href="/our-ghee" size="lg">
              Explore Our Ghee
            </LinkButton>
            <LinkButton href="/contact" variant="secondary" size="lg">
              Enquire Now
            </LinkButton>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative flex aspect-[4/5] w-full max-w-sm items-center justify-center rounded-md bg-white/40 p-8 sm:max-w-md">
            <div
              aria-hidden="true"
              className="absolute inset-6 rounded-full bg-kapila-gold/20"
            />
            {image ? (
              <Image
                src={image.url}
                alt={image.altText ?? `${product?.name ?? "Kapila Ghee"} product photograph`}
                width={image.width ?? 900}
                height={image.height ?? 1600}
                priority
                sizes="(min-width: 1024px) 420px, 80vw"
                className="relative h-full w-auto max-w-full object-contain drop-shadow-[0_25px_35px_rgba(59,33,24,0.25)]"
              />
            ) : (
              <div className="relative font-heading text-2xl text-maroon/50">Kapila Ghee</div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
