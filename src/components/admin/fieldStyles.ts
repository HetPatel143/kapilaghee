import { cn } from "@/lib/utils";

export function inputClasses(hasError?: boolean, className?: string) {
  return cn(
    "w-full rounded-sm border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 disabled:bg-black/[0.03] disabled:text-muted",
    hasError ? "border-error" : "border-border",
    className
  );
}
