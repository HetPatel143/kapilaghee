import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-maroon text-white hover:bg-maroon-dark",
  secondary: "border border-maroon text-maroon hover:bg-maroon hover:text-white",
  ghost: "text-maroon hover:bg-maroon/5",
  // For use on dark/maroon section backgrounds.
  inverse: "border border-cream text-cream hover:bg-cream hover:text-maroon",
};

const sizes: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/** A submit/action button. For navigation, use `LinkButton` instead. */
export function Button({ variant, size, className, ...rest }: ButtonProps) {
  return <button {...rest} className={buttonClasses(variant, size, className)} />;
}

type LinkButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} & React.ComponentProps<typeof Link>;

/** A link styled as a button. For form submission/actions, use `Button` instead. */
export function LinkButton({ variant, size, className, ...rest }: LinkButtonProps) {
  return <Link {...rest} className={buttonClasses(variant, size, className)} />;
}
