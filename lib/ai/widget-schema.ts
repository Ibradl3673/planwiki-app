import { z } from "zod";

export const checklistWidgetSchema = z.object({
  id: z.string(),
  type: z.literal("checklist"),
  title: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      done: z.boolean(),
    }),
  ),
});

export const phasesWidgetSchema = z.object({
  id: z.string(),
  type: z.literal("phases"),
  title: z.string(),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      status: z.enum(["pending", "active", "done"]),
      tasks: z.array(z.string()),
    }),
  ),
});

export const tableWidgetSchema = z.object({
  id: z.string(),
  type: z.literal("table"),
  title: z.string(),
  columns: z.array(z.string()).min(1),
  rows: z.array(z.array(z.string())),
});

export const notesWidgetSchema = z.object({
  id: z.string(),
  type: z.literal("notes"),
  title: z.string(),
  content: z.string(),
});

export const planWidgetSchema = z.discriminatedUnion("type", [
  checklistWidgetSchema,
  phasesWidgetSchema,
  tableWidgetSchema,
  notesWidgetSchema,
]);

export const planDocumentSchema = z.object({
  version: z.literal("1"),
  title: z.string(),
  summary: z.string(),
  widgets: z.array(planWidgetSchema),
});

export const plannerContextSchema = z.object({
  goal: z.string(),
  audience: z.string().optional(),
  constraints: z.array(z.string()),
  deliverables: z.array(z.string()),
  milestones: z.array(z.string()),
  notes: z.array(z.string()),
  sourceSummary: z.string(),
});

export type PlanDocument = z.infer<typeof planDocumentSchema>;
export type PlanWidget = z.infer<typeof planWidgetSchema>;
export type PlannerContext = z.infer<typeof plannerContextSchema>;
