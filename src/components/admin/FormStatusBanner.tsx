import { cn } from "@/lib/utils";

export function FormStatusBanner({
  status,
  message,
}: {
  status: "idle" | "success" | "error";
  message?: string;
}) {
  if (status === "idle" || !message) return null;

  return (
    <p
      role={status === "error" ? "alert" : "status"}
      className={cn(
        "rounded-sm px-3.5 py-2.5 text-sm",
        status === "success" ? "bg-success/10 text-success" : "bg-error/10 text-error"
      )}
    >
      {message}
    </p>
  );
}
