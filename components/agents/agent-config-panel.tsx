"use client"

import { useMemo, useState } from "react"

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import { toast } from "sonner"

type AgentClient = {
  name: string
  subtitle: string
  domain: string
  id:
    | "cursor"
    | "codex"
    | "claude-code"
    | "github-copilot"
    | "antigravity"
    | "windsurf"
  comingSoon?: boolean
}

const buildCursorConfig = (mcpUrl: string, apiKey: string) =>
  JSON.stringify(
    {
      mcpServers: {
        planwiki: {
          url: mcpUrl,
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      },
    },
    null,
    2,
  )

const buildCodexConfig = (mcpUrl: string) =>
  `codex mcp add planwiki --url ${mcpUrl}`.trim()

const buildClaudeCodeConfig = (mcpUrl: string, apiKey: string) =>
  JSON.stringify(
    {
      mcpServers: {
        planwiki: {
          command: "npx",
          args: [
            "-y",
            "mcp-remote",
            mcpUrl,
            "--header",
            `Authorization: Bearer ${apiKey}`,
          ],
        },
      },
    },
    null,
    2,
  )

export function AgentConfigPanel({
  agentClients,
  mcpUrl,
  apiKey,
}: {
  agentClients: AgentClient[]
  mcpUrl: string
  apiKey: string
}) {
  const [selectedClientId, setSelectedClientId] =
    useState<AgentClient["id"]>("cursor")
  const [copied, setCopied] = useState(false)

  const selectedClient =
    agentClients.find((client) => client.id === selectedClientId) ??
    agentClients[0]

  const config = useMemo(() => {
    if (selectedClientId === "codex") {
      return buildCodexConfig(mcpUrl)
    }

    if (selectedClientId === "claude-code") {
      return buildClaudeCodeConfig(mcpUrl, apiKey)
    }

    return buildCursorConfig(mcpUrl, apiKey)
  }, [apiKey, mcpUrl, selectedClientId])

  const copyConfig = async () => {
    await navigator.clipboard.writeText(config)
    setCopied(true)
    toast.success("MCP config copied")
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="border border-zinc-950/10 bg-white/65 p-3 backdrop-blur-sm md:p-4">
        <div className="mb-3 flex items-center justify-between border-b border-zinc-950/10 pb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Clients
          </p>
          <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">
            {agentClients.length} options
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {agentClients.map((client) => {
            const isSelected = client.id === selectedClientId

            return (
              <button
                key={client.id}
                type="button"
                onClick={() => setSelectedClientId(client.id)}
                className={`group border px-3 py-3 text-left transition-all ${
                  isSelected
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-zinc-950/10 bg-white/90 text-zinc-950 hover:border-zinc-950/25 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-20 items-center justify-center border px-2 ${
                      isSelected
                        ? "border-white/20 bg-white"
                        : "border-zinc-950/10 bg-[#f7f2ea]"
                    }`}
                  >
                    <Image
                      src={`https://img.logo.dev/${client.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}`}
                      alt={client.name}
                      width={88}
                      height={20}
                      className="h-5 w-auto object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={`truncate text-[12px] font-medium ${
                          isSelected ? "text-[oklch(0.97_0.01_92)]" : "text-zinc-950"
                        }`}
                      >
                        {client.name}
                      </p>
                      {client.comingSoon ? (
                        <span
                          className={`border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] ${
                            isSelected
                              ? "border-white/20 bg-transparent text-white/72"
                              : "border-zinc-950/10 bg-[#f7f2ea] text-zinc-500"
                          }`}
                        >
                          Soon
                        </span>
                      ) : null}
                    </div>
                    <p
                      className={`mt-0.5 truncate text-[10px] uppercase tracking-[0.14em] ${
                        isSelected ? "text-white/64" : "text-zinc-500"
                      }`}
                    >
                      {client.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </aside>

      <div className="border border-zinc-950/10 bg-white/65 backdrop-blur-sm">
        <div className="flex flex-col gap-4 border-b border-zinc-950/10 bg-white/70 px-5 py-5 md:flex-row md:items-end md:justify-between md:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              {selectedClient.comingSoon ? "Status" : "Configuration"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-zinc-950">
              {selectedClient.name}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-700">
              {selectedClient.comingSoon
                ? `${selectedClient.name} is planned for this MCP workflow, but its setup is not available yet.`
                : selectedClientId === "codex"
                  ? "Use the Codex CLI to register the MCP endpoint, then continue in the shared Codex configuration."
                  : "Copy the generated block and paste it into the client file shown below."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!selectedClient.comingSoon ? (
                <div className="border border-zinc-950/10 bg-[#f7f2ea] px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  Target
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-950">
                  {selectedClient.subtitle}
                </p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={copyConfig}
              disabled={selectedClient.comingSoon}
              className={`flex items-center gap-1.5 border px-3 py-2 text-xs font-medium transition-colors ${
                selectedClient.comingSoon
                  ? "cursor-not-allowed border-zinc-950/10 bg-zinc-100 text-zinc-400"
                  : "border-zinc-950 bg-zinc-950 text-[oklch(0.97_0.01_92)] hover:bg-zinc-800"
              }`}
            >
              <HugeiconsIcon
                icon={copied ? Tick02Icon : Copy01Icon}
                className="size-4"
              />
              {selectedClient.comingSoon
                ? "Coming soon"
                : copied
                  ? "Copied"
                  : "Copy config"}
            </button>
          </div>
        </div>

        <div className="px-5 py-5 md:px-6 md:py-6">
          {selectedClient.comingSoon ? (
            <div className="grid gap-4 border border-zinc-950/10 bg-white p-5">
              <span className="w-fit border border-zinc-950/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                Coming soon
              </span>
              <p className="max-w-xl text-sm leading-6 text-zinc-700">
                We are still shaping the MCP handoff for {selectedClient.name}.
                The route, auth model, and copyable config will appear here once
                the integration is ready.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                <div className="border border-zinc-950/10 bg-white px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    MCP endpoint
                  </p>
                  <p className="mt-2 break-all text-sm font-medium text-zinc-950">
                    {mcpUrl}
                  </p>
                </div>

                <div className="border border-zinc-950/10 bg-[#f7f2ea] px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    Auth
                  </p>
                  <p className="mt-2 text-sm font-medium text-zinc-950">
                    Bearer key required
                  </p>
                </div>
              </div>

              <div className="border border-zinc-950/10 bg-zinc-950">
                <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.6] text-[oklch(0.95_0.01_95)] selection:bg-zinc-800 md:p-6">
                  <code>{config}</code>
                </pre>
              </div>

              {selectedClientId === "codex" ? (
                <p className="max-w-2xl text-sm leading-6 text-zinc-600">
                  Codex supports MCP in the CLI and IDE extension. This shortcut
                  gets the server registered fast, then you can continue managing
                  it inside the shared Codex configuration.
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
