import type { UIMessage } from "ai";

import { planDocumentSchema, type PlanDocument } from "./ai/widget-schema";

type PlannerMessage = UIMessage<unknown, unknown, unknown>;

export function extractPlanDocumentFromMessage(
  message: PlannerMessage | null | undefined,
): PlanDocument | null {
  if (!message || message.role !== "assistant") {
    return null;
  }

  for (const part of message.parts) {
    if (
      part.type === "tool-renderPlanDocument" &&
      part.state === "output-available"
    ) {
      const parsed = planDocumentSchema.safeParse(part.output);
      if (parsed.success) {
        return parsed.data;
      }
    }
  }

  return null;
}

export function extractLatestPlanDocument(
  messages: PlannerMessage[],
): PlanDocument | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const document = extractPlanDocumentFromMessage(messages[index]);
    if (document) {
      return document;
    }
  }

  return null;
}
