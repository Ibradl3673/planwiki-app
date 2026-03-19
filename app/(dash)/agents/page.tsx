import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ConnectAgent } from "@/components/agents/connect-agent";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";

const getAppOrigin = async () => {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const host = forwardedHost ?? requestHeaders.get("host") ?? "localhost:3000";
  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProto ?? (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
};

export default async function AgentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const [userApiKeys, appOrigin] = await Promise.all([
    db.query.apiKeys.findMany({
      where: eq(apiKeys.userId, session.user.id),
      orderBy: desc(apiKeys.createdAt),
    }),
    getAppOrigin(),
  ]);

  const mcpUrl = `${appOrigin}/api/mcp`;

  return (
    <main className="min-h-screen bg-[#f6f1e8]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <header className="rounded-sm border border-zinc-950/10 bg-white p-5 md:p-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            Agents
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-zinc-950 md:text-5xl">
            Collaborate with your AI Agents.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-700">
            Connect AI agents using MCP so they can pick tasks from your
            workspace and help move work forward.
          </p>
        </header>

        <ConnectAgent
          mcpUrl={mcpUrl}
          initialKeys={userApiKeys.map((key) => ({
            id: key.id,
            name: key.name,
            apiKey: key.apiKey,
            allowedWorkspaceIds: key.allowedWorkspaceIds ?? [],
            status: key.status,
            createdAt: key.createdAt,
            lastUsedAt: key.lastUsedAt,
          }))}
        />
      </div>
    </main>
  );
}
