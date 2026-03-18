import { and, desc, eq, inArray } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/lib/db"
import { apiKeys, workspaces } from "@/lib/db/schema"
import { privateProcedure, router } from "@/server/trpc"

const supportedProviders = ["cursor", "codex", "claude-code"] as const

const createDefaultName = (provider: (typeof supportedProviders)[number]) => {
  const normalizedProvider =
    provider === "claude-code"
      ? "Claude Code"
      : provider === "codex"
        ? "Codex"
        : "Cursor"

  const stamp = new Date().toISOString().slice(0, 10)
  return `${normalizedProvider} agent ${stamp}`
}

export const agentsRouter = router({
  listApiKeys: privateProcedure.query(async ({ ctx }) => {
    const records = await db.query.apiKeys.findMany({
      where: eq(apiKeys.userId, ctx.user!.id),
      orderBy: desc(apiKeys.createdAt),
    })

    return {
      success: true as const,
      data: records.map((record) => ({
        id: record.id,
        name: record.name,
        apiKey: record.apiKey,
        allowedWorkspaceIds: record.allowedWorkspaceIds ?? [],
        status: record.status,
        createdAt: record.createdAt,
        lastUsedAt: record.lastUsedAt,
      })),
    }
  }),
  createApiKey: privateProcedure
    .input(
      z.object({
        provider: z.enum(supportedProviders),
        name: z.string().trim().max(120).optional().default(""),
        workspaceIds: z.array(z.string().uuid()).default([]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.workspaceIds.length > 0) {
        const ownedWorkspaces = await db.query.workspaces.findMany({
          where: and(
            eq(workspaces.userId, ctx.user!.id),
            inArray(workspaces.id, input.workspaceIds),
          ),
        })

        if (ownedWorkspaces.length !== input.workspaceIds.length) {
          return {
            success: false as const,
            error: "invalid_workspace_selection",
          }
        }
      }

      const keyName = input.name || createDefaultName(input.provider)
      const apiKeyValue = `pw_live_${crypto.randomUUID()}`

      const [record] = await db
        .insert(apiKeys)
        .values({
          userId: ctx.user!.id,
          name: keyName,
          apiKey: apiKeyValue,
          allowedWorkspaceIds: input.workspaceIds,
          status: "active",
        })
        .returning()

      if (!record) {
        return {
          success: false as const,
          error: "failed_to_create_api_key",
        }
      }

      return {
        success: true as const,
        data: {
          id: record.id,
          name: record.name,
          apiKey: apiKeyValue,
          allowedWorkspaceIds: record.allowedWorkspaceIds ?? [],
          status: record.status,
        },
      }
    }),
})
