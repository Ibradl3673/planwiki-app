import { generateObject } from "ai";

import { renderingModel } from "./models";
import { widgetRegistryPrompt } from "./widget-registry";
import {
  planDocumentSchema,
  type PlanDocument,
  type PlannerContext,
} from "./widget-schema";

export async function renderPlanDocument(context: PlannerContext): Promise<PlanDocument> {
  const { object } = await generateObject({
    model: renderingModel,
    schema: planDocumentSchema,
    system: [
      "You generate visual plan JSON for PlanWiki.",
      "Reduce walls of text into small, scannable widgets.",
      "Only use widget types from the provided registry.",
      "Output widgets in reading order: framing first, execution next, reference last.",
      "Prefer compact cards over verbose notes.",
    ].join(" "),
    prompt: [
      "Available widgets:",
      widgetRegistryPrompt,
      "",
      "Planning context:",
      JSON.stringify(context, null, 2),
      "",
      "Generate a valid PlanDocument version 1.",
    ].join("\n"),
  });

  return object;
}
