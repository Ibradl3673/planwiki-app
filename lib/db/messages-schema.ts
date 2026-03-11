import { relations } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { plans } from "./plans-schema";

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id, { onDelete: "cascade" }),
  role: text("role", {
    enum: ["system", "user", "assistant"],
  }).notNull(),
  content: jsonb("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const messageRelations = relations(messages, ({ one }) => ({
  plan: one(plans, {
    fields: [messages.planId],
    references: [plans.id],
  }),
}));

export const planMessages = relations(plans, ({ many }) => ({
  messages: many(messages),
}));
