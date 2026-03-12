import type { PlanWidget } from "./widget-schema";

type WidgetDefinition = {
  type: PlanWidget["type"];
  description: string;
  requiredFields: string[];
  whenToUse: string;
};

export const widgetRegistry: WidgetDefinition[] = [
  {
    type: "checklist",
    description: "Actionable tasks with lightweight completion state.",
    requiredFields: ["id", "type", "title", "items[].id", "items[].text", "items[].done"],
    whenToUse: "Use for short execution lists the user can scan and check off.",
  },
  {
    type: "phases",
    description: "Milestone or timeline phases with grouped tasks.",
    requiredFields: ["id", "type", "title", "items[].id", "items[].name", "items[].status", "items[].tasks"],
    whenToUse: "Use for sequence, rollout, or week-by-week structure.",
  },
  {
    type: "table",
    description: "Compact reference data in rows and columns.",
    requiredFields: ["id", "type", "title", "columns", "rows"],
    whenToUse: "Use for stack, budget, owners, or structured reference material.",
  },
  {
    type: "notes",
    description: "Short prose notes or decisions that do not fit a list or table.",
    requiredFields: ["id", "type", "title", "content"],
    whenToUse: "Use for framing, assumptions, or key decisions.",
  },
];

export const widgetRegistryPrompt = widgetRegistry
  .map(
    (widget) =>
      `- ${widget.type}: ${widget.description} Required: ${widget.requiredFields.join(
        ", ",
      )}. ${widget.whenToUse}`,
  )
  .join("\n");
