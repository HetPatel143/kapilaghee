import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { SectionCard } from "@/components/admin/content/SectionCard";
import { SectionTextForm } from "@/components/admin/content/SectionTextForm";
import { SectionImageManager } from "@/components/admin/content/SectionImageManager";
import { listPageSectionsAdmin, listMediaAdmin } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Homepage Content | Kapila Admin" };

const SECTION_CONFIG: Record<string, { label: string; description: string; hasImage?: boolean; bodyRows?: number }> = {
  hero: { label: "Hero", description: "The first thing visitors see.", hasImage: true },
  "why-kapila-intro": { label: "Why Kapila — Intro", description: "Heading and intro line for the differentiation section." },
  "why-point-gir-cow": { label: "Why Kapila — Point: Gir Cow", description: "First supporting point." },
  "why-point-purity": { label: "Why Kapila — Point: Purity", description: "Second supporting point." },
  "why-point-quality": { label: "Why Kapila — Point: Quality", description: "Third supporting point." },
  "quality-teaser": { label: "Quality & Purity Teaser", description: "Short teaser linking to the full Quality page." },
  "story-teaser": { label: "Our Story Teaser", description: "Short excerpt linking to the full Story page.", hasImage: true },
  "everyday-use-intro": { label: "Everyday Use", description: "How customers can use Kapila Ghee day to day." },
  "final-cta": { label: "Final Call to Action", description: "The last prompt before the footer." },
};

export default async function AdminHomeContentPage() {
  const [sections, media] = await Promise.all([listPageSectionsAdmin("home"), listMediaAdmin("homepage")]);

  return (
    <div>
      <PageHeader
        title="Homepage Content"
        description="Edit the text and images shown on the homepage. Layout and design stay fixed — only content changes here."
      />

      <div className="space-y-4">
        {sections.map((section, i) => {
          const config = SECTION_CONFIG[section.key] ?? { label: section.key, description: "" };
          const currentImage = section.media[0]?.media ?? null;
          return (
            <SectionCard key={section.id} title={config.label} description={config.description} defaultOpen={i === 0}>
              <div className="space-y-6">
                <SectionTextForm sectionId={section.id} page="home" title={section.title} body={section.body} />
                {config.hasImage ? (
                  <div className="border-t border-border pt-5">
                    <SectionImageManager sectionId={section.id} page="home" currentImage={currentImage} libraryOptions={media} />
                  </div>
                ) : null}
              </div>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}
