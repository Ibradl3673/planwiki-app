import { notFound } from "next/navigation";

import { PlanBoard } from "../../../components/plan-board";
import { extractPlanDocumentFromMessage } from "../../../lib/planner-message";
import { loadLatestPlanDocumentMessage } from "../../../lib/plans-store";

export default async function SharedPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  const row = await loadLatestPlanDocumentMessage(planId);

  if (!row) {
    notFound();
  }

  const document = extractPlanDocumentFromMessage({
    id: row.id,
    role: row.role,
    parts: Array.isArray(row.content) ? (row.content as never) : [],
    metadata: row.metadata as never,
  });

  if (!document) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,_#fff7ed_0%,_#f8fafc_50%,_#eff6ff_100%)] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <PlanBoard document={document} />
      </div>
    </main>
  );
}
