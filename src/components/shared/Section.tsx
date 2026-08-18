import { cn } from "@/lib/utils";

type Tone = "cream" | "white" | "maroon" | "gold";

const toneClasses: Record<Tone, string> = {
  cream: "bg-cream",
  white: "bg-white",
  maroon: "bg-maroon text-cream",
  gold: "bg-warm-gold/15",
};

export function Section({
  tone = "cream",
  className,
  children,
  id,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-14 sm:py-20 lg:py-24", toneClasses[tone], className)}>
      {children}
    </section>
  );
}
