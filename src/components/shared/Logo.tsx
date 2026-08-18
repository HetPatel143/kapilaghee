import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Digital wordmark treatment for "KAPILA / DAIRY FARM", built from the design tokens
 * to echo the geometric maroon wordmark used on Kapila packaging (see docs/design-system.md).
 *
 * This is a coded, temporary stand-in for a true logo asset. To swap in the official
 * logo file later: drop it at /public/images/brand/logo.svg and replace the JSX below
 * with an <Image src="/images/brand/logo.svg" .../> — the surrounding <Link> wrapper,
 * sizing, and every call site (Header, Footer) do not need to change.
 */
export function Logo({
  tone = "maroon",
  className,
}: {
  tone?: "maroon" | "cream";
  className?: string;
}) {
  const textColor = tone === "maroon" ? "text-maroon" : "text-cream";
  const ruleColor = tone === "maroon" ? "bg-maroon/60" : "bg-cream/60";

  return (
    <Link
      href="/"
      aria-label="Kapila Dairy Farm — Home"
      className={cn("group inline-flex flex-col items-start leading-none", className)}
    >
      <span
        className={cn(
          "font-heading text-2xl font-bold tracking-[0.06em] sm:text-3xl",
          textColor
        )}
      >
        KAPILA
      </span>
      <span className="mt-1 flex items-center gap-2">
        <span className={cn("h-px w-4", ruleColor)} aria-hidden="true" />
        <span
          className={cn(
            "text-[10px] font-semibold tracking-[0.35em] sm:text-xs",
            textColor
          )}
        >
          DAIRY FARM
        </span>
        <span className={cn("h-px w-4", ruleColor)} aria-hidden="true" />
      </span>
    </Link>
  );
}
