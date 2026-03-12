import {
  convertToModelMessages,
  createIdGenerator,
  stepCountIs,
  streamText,
  tool,
  validateUIMessages,
} from "ai";
import { z } from "zod";

import { collectPlannerContext } from "../../../lib/ai/plan-orchestrator";
import { planningModel } from "../../../lib/ai/models";
import { renderPlanDocument } from "../../../lib/ai/widget-json-generator";
import { planDocumentSchema, plannerContextSchema } from "../../../lib/ai/widget-schema";
import {
  ensurePlanForUser,
  getOptionalSession,
  persistMessages,
  updatePlanFromMessage,
  type PersistedPlannerMessage,
} from "../../../lib/plans-store";

export const maxDuration = 30;

const plannerTools = {
  collectPlannerContext: tool({
    description: "Reduce the user's raw planning text into normalized planning context.",
    inputSchema: z.object({
      request: z.string(),
      conversation: z.string(),
    }),
    outputSchema: plannerContextSchema,
    execute: collectPlannerContext,
  }),
  renderPlanDocument: tool({
    description:
      "Generate the final widget JSON for the plan board using only the supported registry widget types.",
    inputSchema: z.object({
      context: plannerContextSchema,
    }),
    outputSchema: planDocumentSchema,
    execute: async ({ context }) => renderPlanDocument(context),
  }),
};

export async function POST(request: Request) {
  const {
    messages,
    id,
  }: {
    messages: PersistedPlannerMessage[];
    id: string;
  } = await request.json();

  const validatedMessages = (await validateUIMessages({
    messages,
    tools: plannerTools as never,
  })) as PersistedPlannerMessage[];

  const session = await getOptionalSession(request);
  const userId = session?.user?.id;

  if (userId && id) {
    await ensurePlanForUser({
      planId: id,
      userId,
    });

    await persistMessages(id, validatedMessages);
  }

  const result = streamText({
    model: planningModel,
    messages: await convertToModelMessages(validatedMessages),
    tools: plannerTools as never,
    stopWhen: stepCountIs(5) as never,
    system: [
      "You are PlanWiki's planner assistant.",
      "Your job is to convert long user text into a visual plan board.",
      "Always call collectPlannerContext first.",
      "Then call renderPlanDocument with that result.",
      "After the tools finish, respond with a short summary that highlights what the board now contains.",
      "Keep the final text brief. The board is the primary output.",
    ].join(" "),
  });

  result.consumeStream();

  return result.toUIMessageStreamResponse({
    originalMessages: validatedMessages,
    generateMessageId: createIdGenerator({
      prefix: "msg",
      size: 16,
    }),
    onFinish: async ({ responseMessage }) => {
      if (!userId || !id) {
        return;
      }

      const persistedMessage = responseMessage as PersistedPlannerMessage;
      await persistMessages(id, [persistedMessage]);
      await updatePlanFromMessage(id, persistedMessage);
    },
  });
}
