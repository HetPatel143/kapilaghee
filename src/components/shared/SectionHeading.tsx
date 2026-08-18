import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "ink",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "ink" | "cream";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-xs font-semibold uppercase tracking-[0.25em]",
            tone === "cream" ? "text-kapila-gold" : "text-warm-gold"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-heading text-3xl font-semibold leading-tight sm:text-4xl",
          tone === "cream" ? "text-cream" : "text-maroon"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            tone === "cream" ? "text-cream/80" : "text-muted"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
