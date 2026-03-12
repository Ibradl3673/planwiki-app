import { generateObject } from "ai";

import { planningModel } from "./models";
import { plannerContextSchema, type PlannerContext } from "./widget-schema";

export async function collectPlannerContext(input: {
  request: string;
  conversation: string;
}): Promise<PlannerContext> {
  const { object } = await generateObject({
    model: planningModel,
    schema: plannerContextSchema,
    system: [
      "You are the planning brain for PlanWiki.",
      "Your job is to reduce messy user text into compact planning context.",
      "Do not produce widget JSON.",
      "Do not add made-up facts.",
      "Keep the result short, concrete, and implementation-friendly.",
    ].join(" "),
    prompt: [
      "Turn the user input into normalized planning context.",
      "Capture goal, constraints, deliverables, milestones, and notes.",
      "Source conversation:",
      input.conversation || "(none)",
      "Latest request:",
      input.request,
    ].join("\n\n"),
  });

  return object;
}
