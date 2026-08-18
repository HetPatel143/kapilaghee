import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: "active" | "inactive" }) {
  const active = status === "active";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium",
        active ? "bg-success/10 text-success" : "bg-black/5 text-muted"
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-success" : "bg-muted")}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}
