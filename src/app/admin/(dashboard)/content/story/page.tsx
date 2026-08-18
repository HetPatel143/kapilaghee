import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { SectionCard } from "@/components/admin/content/SectionCard";
import { SectionTextForm } from "@/components/admin/content/SectionTextForm";
import { SectionImageManager } from "@/components/admin/content/SectionImageManager";
import { listPageSectionsAdmin, listMediaAdmin } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Our Story Content | Kapila Admin" };

const SECTION_CONFIG: Record<string, { label: string; description: string; hasImage?: boolean }> = {
  "story-intro": { label: "Story Introduction", description: "The main opening content for Our Story.", hasImage: true },
  "story-placeholder": { label: "Placeholder Note", description: 'Shown while the full story is still being written. Clear this once "story-intro" has the complete story.' },
};

const RICH_TEXT_HINT =
  "Supports: **bold**, *italic*, [link text](https://...), blank lines for new paragraphs, \"- \" for bullet lists, and \"## \" for a heading.";

export default async function AdminStoryContentPage() {
  const [sections, media] = await Promise.all([listPageSectionsAdmin("story"), listMediaAdmin("story")]);

  return (
    <div>
      <PageHeader
        title="Our Story Content"
        description="Only publish what's actually true about Kapila Dairy Farm — leave the placeholder note in place until the real story is ready."
      />

      <div className="space-y-4">
        {sections.map((section, i) => {
          const config = SECTION_CONFIG[section.key] ?? { label: section.key, description: "" };
          const currentImage = section.media[0]?.media ?? null;
          return (
            <SectionCard key={section.id} title={config.label} description={config.description} defaultOpen={i === 0}>
              <div className="space-y-6">
                <SectionTextForm
                  sectionId={section.id}
                  page="story"
                  title={section.title}
                  body={section.body}
                  bodyRows={8}
                  bodyHint={RICH_TEXT_HINT}
                />
                {config.hasImage ? (
                  <div className="border-t border-border pt-5">
                    <SectionImageManager sectionId={section.id} page="story" currentImage={currentImage} libraryOptions={media} />
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
