import type { UIMessage } from "ai";
import { and, asc, desc, eq } from "drizzle-orm";

import { auth } from "./auth";
import { db } from "./db/client";
import { messages, plans } from "./db";
import { extractPlanDocumentFromMessage } from "./planner-message";

export type PersistedPlannerMessage = UIMessage<
  unknown,
  unknown,
  unknown
>;

export async function getOptionalSession(request: Request) {
  try {
    return await auth.api.getSession({
      headers: request.headers,
    });
  } catch {
    return null;
  }
}

export async function ensurePlanForUser(input: {
  planId: string;
  userId: string;
  title?: string;
}) {
  const existing = await db.query.plans.findFirst({
    where: eq(plans.id, input.planId),
  });

  if (existing) {
    return existing;
  }

  await db.insert(plans).values({
    id: input.planId,
    userId: input.userId,
    title: input.title ?? "Untitled plan",
    status: "draft",
  });

  return db.query.plans.findFirst({
    where: eq(plans.id, input.planId),
  });
}

export async function persistMessages(
  planId: string,
  uiMessages: PersistedPlannerMessage[],
) {
  if (uiMessages.length === 0) {
    return;
  }

  await db
    .insert(messages)
    .values(
      uiMessages.map((message) => {
        const document = extractPlanDocumentFromMessage(message);

        return {
          id: message.id,
          planId,
          role: message.role,
          content: message.parts,
          metadata: {
            ...(document ? { messageKind: "plan-output" } : {}),
          },
        };
      }),
    )
    .onConflictDoNothing();
}

export async function updatePlanFromMessage(planId: string, message: PersistedPlannerMessage) {
  const document = extractPlanDocumentFromMessage(message);
  if (!document) {
    return;
  }

  await db
    .update(plans)
    .set({
      title: document.title,
      status: "ready",
    })
    .where(eq(plans.id, planId));
}

export async function loadPlanMessages(planId: string): Promise<PersistedPlannerMessage[]> {
  const rows = await db.query.messages.findMany({
    where: eq(messages.planId, planId),
    orderBy: asc(messages.createdAt),
  });

  return rows.map((row) => ({
    id: row.id,
    role: row.role,
    parts: Array.isArray(row.content) ? (row.content as PersistedPlannerMessage["parts"]) : [],
    metadata:
      row.metadata && typeof row.metadata === "object"
        ? (row.metadata as PersistedPlannerMessage["metadata"])
        : undefined,
  }));
}

export async function loadLatestPlanDocumentMessage(planId: string) {
  return db.query.messages.findFirst({
    where: and(
      eq(messages.planId, planId),
      eq(messages.role, "assistant"),
    ),
    orderBy: desc(messages.createdAt),
  });
}
