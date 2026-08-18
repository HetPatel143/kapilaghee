"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function SaveButton({
  children = "Save Changes",
  pendingLabel = "Saving...",
  variant = "primary",
  className,
}: {
  children?: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "danger" | "secondary";
  className?: string;
}) {
  const { pending } = useFormStatus();

  const variantClasses = {
    primary: "bg-maroon text-white hover:bg-maroon-dark",
    danger: "bg-error text-white hover:bg-error/90",
    secondary: "border border-border text-ink hover:bg-black/5",
  }[variant];

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses,
        className
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
