import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { apiKeys, workspaces } from "@/lib/db/schema";
import {
  type ChecklistWidgetData,
  type WorkspaceWidget,
  workspaceWidgetsSchema,
} from "@/lib/widgets/widget-registry";

type McpAuthExtra = {
  apiKeyId: string;
  allowedWorkspaceIds: string[];
  userId: string;
};

const parseWidgets = (widgets: unknown): WorkspaceWidget[] =>
  workspaceWidgetsSchema.parse(widgets ?? []);

const getAllowedWorkspaceIds = (authInfo?: AuthInfo): string[] => {
  const allowedWorkspaceIds = authInfo?.extra?.allowedWorkspaceIds;
  return Array.isArray(allowedWorkspaceIds) &&
    allowedWorkspaceIds.every((value) => typeof value === "string")
    ? allowedWorkspaceIds
    : [];
};

const getUserId = (authInfo?: AuthInfo): string | null => {
  const userId = authInfo?.extra?.userId;
  return typeof userId === "string" && userId.length > 0 ? userId : null;
};

const getWorkspaceAccessWhere = (
  userId: string,
  allowedWorkspaceIds: string[],
  workspaceId?: string,
) => {
  const filters = [eq(workspaces.userId, userId)];

  if (workspaceId) {
    filters.push(eq(workspaces.id, workspaceId));
  }

  if (allowedWorkspaceIds.length > 0) {
    filters.push(inArray(workspaces.id, allowedWorkspaceIds));
  }

  return and(...filters);
};

const getAccessibleWorkspace = async (
  authInfo: AuthInfo | undefined,
  workspaceId: string,
) => {
  const userId = getUserId(authInfo);

  if (!userId) {
    throw new Error("Missing authenticated user context.");
  }

  const workspace = await db.query.workspaces.findFirst({
    where: getWorkspaceAccessWhere(
      userId,
      getAllowedWorkspaceIds(authInfo),
      workspaceId,
    ),
  });

  if (!workspace) {
    throw new Error(
      `Workspace ${workspaceId} was not found or is not permitted for this API key.`,
    );
  }

  return workspace;
};

const updateWorkspaceWidgets = async (
  workspaceId: string,
  nextWidgets: WorkspaceWidget[],
) => {
  await db
    .update(workspaces)
    .set({
      widgets: nextWidgets,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(workspaces.id, workspaceId));
};

const createToolError = (message: string) => ({
  content: [{ type: "text" as const, text: message }],
  isError: true,
});

export const getBearerToken = (req: Request) => {
  const authorization = req.headers.get("authorization");

  if (!authorization) {
    return undefined;
  }

  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return undefined;
  }

  return token;
};

export const verifyToken = async (
  _req: Request,
  bearerToken?: string,
): Promise<AuthInfo | undefined> => {
  if (!bearerToken) {
    return undefined;
  }

  const record = await db.query.apiKeys.findFirst({
    where: and(eq(apiKeys.apiKey, bearerToken), eq(apiKeys.status, "active")),
  });

  if (!record) {
    return undefined;
  }

  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, record.id));

  const extra: McpAuthExtra = {
    apiKeyId: record.id,
    allowedWorkspaceIds: record.allowedWorkspaceIds ?? [],
    userId: record.userId,
  };

  return {
    token: bearerToken,
    clientId: record.id,
    scopes: ["workspaces:read", "workspaces:write"],
    extra,
  };
};

export const createPlanWikiMcpServer = (authInfo: AuthInfo) => {
  const server = new McpServer({
    name: "PlanWiki MCP",
    version: "1.0.0",
  });

  server.registerTool(
    "list_workspaces",
    {
      title: "List Workspaces",
      description:
        "List the workspaces available to this API key. Use this first, then pass the exact workspaceId returned here into any read or update tool.",
    },
    async () => {
      const userId = getUserId(authInfo);

      if (!userId) {
        return createToolError("Missing authenticated user context.");
      }

      const allowedWorkspaceIds = getAllowedWorkspaceIds(authInfo);

      const items = await db.query.workspaces.findMany({
        where: getWorkspaceAccessWhere(userId, allowedWorkspaceIds),
        orderBy: desc(workspaces.updatedAt),
      });

      const payload = items.map((workspace) => ({
        id: workspace.id,
        slug: workspace.slug,
        title: workspace.title,
        updatedAt: workspace.updatedAt,
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(payload) }],
      };
    },
  );

  server.registerTool(
    "get_workspace",
    {
      title: "Get Workspace",
      description:
        "Get a PlanWiki workspace by ID. You must provide the exact workspaceId from list_workspaces.",
      inputSchema: {
        workspaceId: z.string().uuid(),
      },
    },
    async ({ workspaceId }) => {
      try {
        const workspace = await getAccessibleWorkspace(authInfo, workspaceId);

        return {
          content: [{ type: "text", text: JSON.stringify(workspace) }],
        };
      } catch (error) {
        return createToolError(
          error instanceof Error ? error.message : "Failed to load workspace.",
        );
      }
    },
  );

  server.registerTool(
    "update_task_status",
    {
      title: "Update Task Status",
      description:
        "Update a checklist task inside a workspace. Always call list_workspaces first and provide the exact workspaceId plus the target widgetId and itemId.",
      inputSchema: {
        workspaceId: z.string().uuid(),
        widgetId: z.string().min(1),
        itemId: z.string().min(1),
        done: z.boolean(),
      },
    },
    async ({ workspaceId, widgetId, itemId, done }) => {
      try {
        const workspace = await getAccessibleWorkspace(authInfo, workspaceId);
        const widgets = parseWidgets(workspace.widgets);

        const nextWidgets = widgets.map((widget) => {
          if (widget.id !== widgetId || widget.type !== "checklist") {
            return widget;
          }

          const nextItems = widget.items.map((item) =>
            item.id === itemId ? { ...item, done } : item,
          );

          return {
            ...widget,
            items: nextItems,
          } satisfies ChecklistWidgetData;
        });

        const targetWidget = nextWidgets.find(
          (widget) => widget.id === widgetId && widget.type === "checklist",
        ) as ChecklistWidgetData | undefined;

        if (!targetWidget) {
          return createToolError(
            `Checklist widget ${widgetId} was not found in workspace ${workspaceId}.`,
          );
        }

        const itemExists = targetWidget.items.some(
          (item) => item.id === itemId,
        );

        if (!itemExists) {
          return createToolError(
            `Checklist item ${itemId} was not found in widget ${widgetId}.`,
          );
        }

        await updateWorkspaceWidgets(workspaceId, nextWidgets);

        return {
          content: [
            {
              type: "text",
              text: `Updated checklist item ${itemId} in workspace ${workspaceId} to done=${done}.`,
            },
          ],
        };
      } catch (error) {
        return createToolError(
          error instanceof Error ? error.message : "Failed to update task.",
        );
      }
    },
  );

  return server;
};
