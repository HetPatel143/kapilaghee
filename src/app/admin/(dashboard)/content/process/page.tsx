import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProcessStepRow } from "@/components/admin/content/ProcessStepRow";
import { AddProcessStepForm } from "@/components/admin/content/AddProcessStepForm";
import { listPageSectionsAdmin } from "@/lib/admin-data";

export const metadata: Metadata = { title: "Our Process Content | Kapila Admin" };

export default async function AdminProcessContentPage() {
  const steps = await listPageSectionsAdmin("process");

  return (
    <div>
      <PageHeader
        title="Our Process Content"
        description="Manage the production steps shown on the Our Process page. New steps are Inactive by default until you're ready to publish them."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          {steps.length > 0 ? (
            steps.map((step, i) => (
              <ProcessStepRow key={step.id} step={step} index={i} isFirst={i === 0} isLast={i === steps.length - 1} />
            ))
          ) : (
            <EmptyState
              title="No process steps yet"
              description="The public Our Process page currently shows a 'being finalized' message. Add steps here once they're confirmed."
            />
          )}
        </div>
        <div>
          <AddProcessStepForm />
        </div>
      </div>
    </div>
  );
}
