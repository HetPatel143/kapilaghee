import type { Metadata } from "next";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { getBusinessSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    default: "Kapila Dairy Farm — Pure A2 Gir Cow Ghee, Surat",
    template: "%s | Kapila Dairy Farm",
  },
  description:
    "Kapila Dairy Farm crafts pure A2 Gir Cow Ghee in Surat, Gujarat — no added ingredients, FSSAI licensed and lab tested for purity.",
  openGraph: {
    type: "website",
    siteName: "Kapila Dairy Farm",
    locale: "en_IN",
  },
};

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getBusinessSettings();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-maroon focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
    </>
  );
}
