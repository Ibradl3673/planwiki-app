import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title"),
    slug: text("slug")
      .default(sql`generate_workspace_slug()`)
      .notNull(),
    isPublic: boolean("is_public").default(false),
    widgets: jsonb("widgets"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    index("workspaces_slug_idx").on(table.slug),
    index("workspaces_user_id_idx").on(table.userId),
    unique("workspaces_slug_key").on(table.slug),
  ],
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    content: jsonb("content").notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    index("messages_workspace_id_created_at_idx").on(
      table.workspaceId,
      table.createdAt,
    ),
    index("messages_workspace_id_idx").on(table.workspaceId),
    check(
      "messages_role_check",
      sql`${table.role} = ANY (ARRAY['system'::text, 'user'::text, 'assistant'::text])`,
    ),
  ],
);

export const onboarding = pgTable(
  "onboarding",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    hasSeenOnboarding: boolean("has_seen_onboarding").default(false).notNull(),
    seenAt: timestamp("seen_at", { withTimezone: true, mode: "string" }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("onboarding_user_id_idx").on(table.userId),
    unique("onboarding_user_id_key").on(table.userId),
  ],
);

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  name: text("name").notNull(),

  apiKey: text("api_key")
    .notNull()
    .unique()
    .default(sql`'pw_live_' || gen_random_uuid()::text`),

  allowedWorkspaceIds: jsonb("allowed_workspace_ids")
    .$type<string[]>()
    .notNull()
    .default([]),

  status: text("status").notNull().default("active"), // active | revoked

  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
},
  (table) => [
    index("api_keys_user_id_idx").on(table.userId),
    index("api_keys_api_key_idx").on(table.apiKey),
    check(
      "api_keys_status_check",
      sql`${table.status} = ANY (ARRAY['active'::text, 'revoked'::text])`,
    ),
    check(
      "api_keys_api_key_check",
      sql`${table.apiKey} LIKE 'pw_live_%'`,
    ),
  ],
);

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  user: one(user, {
    fields: [workspaces.userId],
    references: [user.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [messages.workspaceId],
    references: [workspaces.id],
  }),
}));

export const onboardingRelations = relations(onboarding, ({ one }) => ({
  user: one(user, {
    fields: [onboarding.userId],
    references: [user.id],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(user, {
    fields: [apiKeys.userId],
    references: [user.id],
  }),
}));
