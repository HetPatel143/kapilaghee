import type { Metadata } from "next";
import { getActiveProducts, getBusinessSettings, getPageSections } from "@/lib/data";
import { HeroSection } from "@/components/public/HeroSection";
import { TrustStrip } from "@/components/public/TrustStrip";
import { ProductShowcase } from "@/components/public/ProductShowcase";
import { WhyKapila } from "@/components/public/WhyKapila";
import { ProcessTimeline } from "@/components/public/ProcessTimeline";
import { QualitySection } from "@/components/public/QualitySection";
import { StorySection } from "@/components/public/StorySection";
import { EverydayUse } from "@/components/public/EverydayUse";
import { GheeBenefits } from "@/components/public/GheeBenefits";
import { LocationSection } from "@/components/public/LocationSection";
import { FinalCTA } from "@/components/public/FinalCTA";
import { buildLocalBusinessJsonLd } from "@/lib/structured-data";

const siteUrl = process.env.SITE_URL ?? "https://www.kapiladairyfarm.com";

export const metadata: Metadata = {
  title: "Kapila Dairy Farm — Pure A2 Gir Cow Ghee, Surat",
  description:
    "Kapila Dairy Farm crafts pure A2 Gir Cow Ghee in Surat, Gujarat — no added ingredients, FSSAI licensed and lab tested for purity. Available in 1 KG, 5 KG and 15 KG.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [products, settings, homeSections, processSections, qualitySections] = await Promise.all([
    getActiveProducts(),
    getBusinessSettings(),
    getPageSections("home"),
    getPageSections("process"),
    getPageSections("quality"),
  ]);

  const product = products[0] ?? null;
  const hasQualityDocuments = qualitySections.some((s) => s.documents.length > 0);
  const jsonLd = buildLocalBusinessJsonLd(settings, siteUrl);

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <HeroSection product={product} sections={homeSections} />
      <TrustStrip product={product} />
      <ProductShowcase products={products} />
      <WhyKapila sections={homeSections} />
      <ProcessTimeline steps={processSections} variant="teaser" />
      <QualitySection homeSections={homeSections} hasDocuments={hasQualityDocuments} />
      <StorySection sections={homeSections} />
      <EverydayUse sections={homeSections} />
      <GheeBenefits sections={homeSections} />
      <LocationSection settings={settings} />
      <FinalCTA settings={settings} sections={homeSections} />
    </>
  );
}
