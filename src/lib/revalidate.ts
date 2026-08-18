import "server-only";
import { revalidatePath } from "next/cache";

/**
 * Central place where admin mutations declare which public pages they affect.
 * Called at the end of every admin server action so changes appear on the public
 * site immediately — the admin never needs to restart the server or "publish"
 * separately (see docs/architecture.md §39 / Prompt 3 §39).
 */
export function revalidateHome() {
  revalidatePath("/");
}

export function revalidateProductPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/our-ghee");
  if (slug) revalidatePath(`/our-ghee/${slug}`);
}

export function revalidateStory() {
  revalidatePath("/");
  revalidatePath("/our-story");
}

export function revalidateProcess() {
  revalidatePath("/");
  revalidatePath("/our-process");
}

export function revalidateQuality() {
  revalidatePath("/");
  revalidatePath("/quality");
}

export function revalidateFaqs() {
  revalidatePath("/faq");
}

/** BusinessSettings feeds the Header/Footer in the root layout and the Contact page. */
export function revalidateSettings() {
  revalidatePath("/", "layout");
}
