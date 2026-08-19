import { redirect } from "next/navigation";

/**
 * FAQs now live at the bottom of the Contact page (see contact/page.tsx) rather than as
 * their own nav item. This route is kept only so old/bookmarked links still resolve.
 */
export default async function FaqRedirect() {
  redirect("/contact#faq");
}
