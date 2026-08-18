export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Formats a ProductVariant's size/unit into a display label, e.g. "1 KG", "500 ML". */
export function formatVariantLabel(size: number, unit: string) {
  const trimmedSize = Number.isInteger(size) ? size.toString() : size.toString();
  return `${trimmedSize} ${unit.toUpperCase()}`;
}
