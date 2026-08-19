import { redirect } from "next/navigation";

/**
 * Product detail content now lives directly at /our-ghee (see docs/requirements.md —
 * with a single product, a separate listing-then-detail flow was redundant friction).
 * This route is kept only so old/bookmarked/shared links to a specific product still work.
 */
export default async function ProductDetailRedirect() {
  redirect("/our-ghee");
}
