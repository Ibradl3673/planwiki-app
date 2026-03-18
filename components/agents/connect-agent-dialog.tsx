"use client"

import { useMemo, useState, type ReactNode } from "react"

import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { trpc } from "@/lib/trpc"
import { cn } from "@/lib/utils"

type ProviderId = "cursor" | "codex" | "claude-code"

type ProviderDefinition = {
  id: ProviderId
  name: string
  icon: ReactNode
  setupMode: string
}

type WorkspaceOption = {
  id: string
  slug: string
  title: string | null
}

const providers: ProviderDefinition[] = [
  {
    id: "cursor",
    name: "Cursor",
    setupMode: ".cursor/mcp.json",
    icon: (
      <svg
        version="1.1"
        viewBox="0 0 466.73 532.09"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Cursor</title>
        <path
          d="M457.43,125.94L244.42,2.96c-6.84-3.95-15.28-3.95-22.12,0L9.3,125.94c-5.75,3.32-9.3,9.46-9.3,16.11v247.99c0,6.65,3.55,12.79,9.3,16.11l213.01,122.98c6.84,3.95,15.28,3.95,22.12,0l213.01-122.98c5.75-3.32,9.3-9.46,9.3-16.11v-247.99c0-6.65-3.55-12.79-9.3-16.11h-.01ZM444.05,151.99l-205.63,356.16c-1.39,2.4-5.06,1.42-5.06-1.36v-233.21c0-4.66-2.49-8.97-6.53-11.31L24.87,145.67c-2.4-1.39-1.42-5.06,1.36-5.06h411.26c5.84,0,9.49,6.33,6.57,11.39h-.01Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: "codex",
    name: "Codex",
    setupMode: "~/.codex/config.toml",
    icon: (
      <svg
        fill="currentColor"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>OpenAI</title>
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
      </svg>
    ),
  },
  {
    id: "claude-code",
    name: "Claude Code",
    setupMode: ".mcp.json",
    icon: (
      <svg
        fill="currentColor"
        role="img"
        viewBox="0 0 12 12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Claude</title>
        <path
          clipRule="evenodd"
          d="M2.3545 7.9775L4.7145 6.654L4.7545 6.539L4.7145 6.475H4.6L4.205 6.451L2.856 6.4145L1.6865 6.366L0.5535 6.305L0.268 6.2445L0 5.892L0.0275 5.716L0.2675 5.5555L0.6105 5.5855L1.3705 5.637L2.5095 5.716L3.3355 5.7645L4.56 5.892H4.7545L4.782 5.8135L4.715 5.7645L4.6635 5.716L3.4845 4.918L2.2085 4.074L1.5405 3.588L1.1785 3.3425L0.9965 3.1115L0.9175 2.6075L1.2455 2.2465L1.686 2.2765L1.7985 2.307L2.245 2.65L3.199 3.388L4.4445 4.3045L4.627 4.4565L4.6995 4.405L4.709 4.3685L4.627 4.2315L3.9495 3.0085L3.2265 1.7635L2.9045 1.2475L2.8195 0.938C2.78711 0.819128 2.76965 0.696687 2.7675 0.5735L3.1415 0.067L3.348 0L3.846 0.067L4.056 0.249L4.366 0.956L4.867 2.0705L5.6445 3.5855L5.8725 4.0345L5.994 4.4505L6.0395 4.578H6.1185V4.505L6.1825 3.652L6.301 2.6045L6.416 1.257L6.456 0.877L6.644 0.422L7.0175 0.176L7.3095 0.316L7.5495 0.6585L7.516 0.8805L7.373 1.806L7.0935 3.2575L6.9115 4.2285H7.0175L7.139 4.1075L7.6315 3.4545L8.4575 2.4225L8.8225 2.0125L9.2475 1.5605L9.521 1.345H10.0375L10.4175 1.9095L10.2475 2.4925L9.7155 3.166L9.275 3.737L8.643 4.587L8.248 5.267L8.2845 5.322L8.3785 5.312L9.8065 5.009L10.578 4.869L11.4985 4.7115L11.915 4.9055L11.9605 5.103L11.7965 5.5065L10.812 5.7495L9.6575 5.9805L7.938 6.387L7.917 6.402L7.9415 6.4325L8.716 6.5055L9.047 6.5235H9.858L11.368 6.636L11.763 6.897L12 7.216L11.9605 7.4585L11.353 7.7685L10.533 7.574L8.6185 7.119L7.9625 6.9545H7.8715V7.0095L8.418 7.5435L9.421 8.4485L10.6755 9.6135L10.739 9.9025L10.578 10.13L10.408 10.1055L9.3055 9.277L8.88 8.9035L7.917 8.0935H7.853V8.1785L8.075 8.503L9.2475 10.2635L9.3085 10.8035L9.2235 10.98L8.9195 11.0865L8.5855 11.0255L7.8985 10.063L7.191 8.9795L6.6195 8.008L6.5495 8.048L6.2125 11.675L6.0545 11.86L5.69 12L5.3865 11.7695L5.2255 11.396L5.3865 10.658L5.581 9.696L5.7385 8.931L5.8815 7.981L5.9665 7.665L5.9605 7.644L5.8905 7.653L5.1735 8.6365L4.0835 10.109L3.2205 11.0315L3.0135 11.1135L2.655 10.9285L2.6885 10.5975L2.889 10.303L4.083 8.785L4.803 7.844L5.268 7.301L5.265 7.222H5.2375L2.066 9.28L1.501 9.353L1.2575 9.125L1.288 8.752L1.4035 8.6305L2.3575 7.9745L2.3545 7.9775Z"
          fillRule="evenodd"
        />
      </svg>
    ),
  },
]

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

const buildCodexConfig = (mcpUrl: string, apiKey: string) => `
[mcp_servers.planwiki]
command = "npx"
args = ["-y", "mcp-remote", "${mcpUrl}", "--header", "Authorization: Bearer ${apiKey}"]
`.trim()

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

const CopyButton = ({
  label,
  value,
}: {
  label: string
  value: string
}) => {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      type="button"
      variant="outline"
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1600)
      }}
      className="rounded-none border-zinc-950/15 bg-white px-3 text-zinc-700 shadow-none hover:bg-[#f7f2ea]"
    >
      <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} className="size-4" />
      {copied ? `${label} copied` : `Copy ${label}`}
    </Button>
  )
}

const ConfigBlock = ({
  title,
  subtitle,
  value,
}: {
  title: string
  subtitle: string
  value: string
}) => (
  <div className="border border-zinc-950/10 bg-white">
    <div className="flex items-center justify-between gap-3 border-b border-zinc-950/10 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-zinc-950">{title}</p>
        <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
          {subtitle}
        </p>
      </div>
      <CopyButton label={title} value={value} />
    </div>
    <pre className="overflow-x-auto bg-[#f7f2ea] p-4 text-xs leading-6 text-zinc-800">
      <code>{value}</code>
    </pre>
  </div>
)

export function AgentConnectPanel({
  mcpUrl,
  workspaces,
}: {
  mcpUrl: string
  workspaces: WorkspaceOption[]
}) {
  const utils = trpc.useUtils()
  const [selectedProviderId, setSelectedProviderId] = useState<ProviderId>("cursor")
  const [keyName, setKeyName] = useState("Cursor workspace link")
  const [allowAllWorkspaces, setAllowAllWorkspaces] = useState(true)
  const [selectedWorkspaceIds, setSelectedWorkspaceIds] = useState<string[]>([])
  const [apiKey, setApiKey] = useState<string | null>(null)

  const selectedProvider =
    providers.find((provider) => provider.id === selectedProviderId) ?? providers[0]

  const createApiKey = trpc.agents.createApiKey.useMutation({
    onSuccess: async (response) => {
      if (!response.success) {
        toast.error("We could not create that API key.")
        return
      }

      await utils.invalidate()
      setApiKey(response.data.apiKey)
      toast.success("API key created.")
    },
    onError: () => {
      toast.error("We could not create that API key.")
    },
  })

  const config = useMemo(() => {
    if (!apiKey) {
      return null
    }

    return {
      cursor: buildCursorConfig(mcpUrl, apiKey),
      codex: buildCodexConfig(mcpUrl, apiKey),
      claudeCode: buildClaudeCodeConfig(mcpUrl, apiKey),
    }
  }, [apiKey, mcpUrl])

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <div className="space-y-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => {
              setSelectedProviderId(provider.id)
              setKeyName(
                provider.id === "cursor"
                  ? "Cursor workspace link"
                  : provider.id === "codex"
                    ? "Codex workspace link"
                    : "Claude Code workspace link",
              )
              setApiKey(null)
            }}
            className={cn(
              "flex w-full items-center gap-3 border px-4 py-3 text-left transition-colors",
              selectedProviderId === provider.id
                ? "border-zinc-950 bg-zinc-950 text-[#f6f1e8]"
                : "border-zinc-950/10 bg-white text-zinc-950 hover:border-zinc-950/20",
            )}
          >
            <span className="flex size-8 shrink-0 items-center justify-center">
              {provider.icon}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium">{provider.name}</span>
              <span
                className={cn(
                  "block text-[10px] uppercase tracking-[0.22em]",
                  selectedProviderId === provider.id
                    ? "text-[#f6f1e8]/70"
                    : "text-zinc-500",
                )}
              >
                {provider.setupMode}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="border border-zinc-950/10 bg-white">
          <div className="border-b border-zinc-950/10 px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              Create key
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-zinc-950">
              {selectedProvider.name}
            </h2>
          </div>

          <div className="space-y-5 px-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key-name" className="text-zinc-950">
                Key label
              </Label>
              <Input
                id="api-key-name"
                value={keyName}
                onChange={(event) => setKeyName(event.target.value)}
                className="h-11 rounded-none border-zinc-950/10 bg-white shadow-none"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-zinc-700">Workspace scope</p>
                <button
                  type="button"
                  onClick={() => {
                    setAllowAllWorkspaces((current) => !current)
                    setSelectedWorkspaceIds([])
                  }}
                  className={cn(
                    "border px-3 py-2 text-[10px] uppercase tracking-[0.22em] transition-colors",
                    allowAllWorkspaces
                      ? "border-zinc-950 bg-zinc-950 text-[#f6f1e8]"
                      : "border-zinc-950/10 bg-white text-zinc-600",
                  )}
                >
                  {allowAllWorkspaces ? "All workspaces" : "Selected only"}
                </button>
              </div>

              <div className="grid gap-2">
                {workspaces.length ? (
                  workspaces.map((workspace) => (
                    <label
                      key={workspace.id}
                      className={cn(
                        "flex items-start gap-3 border px-3 py-3",
                        allowAllWorkspaces
                          ? "border-zinc-950/8 bg-[#f7f2ea] text-zinc-400"
                          : "border-zinc-950/10 bg-white",
                      )}
                    >
                      <Checkbox
                        checked={selectedWorkspaceIds.includes(workspace.id)}
                        onCheckedChange={(checked) => {
                          if (allowAllWorkspaces) {
                            return
                          }

                          setSelectedWorkspaceIds((current) =>
                            checked
                              ? [...current, workspace.id]
                              : current.filter((id) => id !== workspace.id),
                          )
                        }}
                        disabled={allowAllWorkspaces}
                        className="mt-0.5 rounded-none border-zinc-950/15 data-checked:border-zinc-950 data-checked:bg-zinc-950"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-zinc-950">
                          {workspace.title ?? "Untitled workspace"}
                        </span>
                        <span className="block text-xs uppercase tracking-[0.22em] text-zinc-500">
                          {workspace.slug}
                        </span>
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="border border-zinc-950/10 bg-[#f7f2ea] px-3 py-3 text-sm text-zinc-600">
                    No workspaces yet.
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-zinc-950/10 pt-4">
              <Button
                type="button"
                onClick={() =>
                  createApiKey.mutate({
                    provider: selectedProvider.id,
                    name: keyName.trim(),
                    workspaceIds: allowAllWorkspaces ? [] : selectedWorkspaceIds,
                  })
                }
                disabled={createApiKey.isPending}
                className="rounded-none border border-zinc-950 bg-zinc-950 px-4 text-[#f6f1e8] hover:bg-zinc-800"
              >
                {createApiKey.isPending ? "Creating..." : "Create key"}
              </Button>
              <p className="text-sm text-zinc-600">Shown once after creation.</p>
            </div>
          </div>
        </div>

        {apiKey && config ? (
          <div className="space-y-4">
            <div className="border border-zinc-950/10 bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-950/10 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-zinc-950">Bearer key</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    Copy this now
                  </p>
                </div>
                <CopyButton label="API key" value={apiKey} />
              </div>
              <div className="bg-[#f7f2ea] px-4 py-4">
                <code className="break-all text-sm text-zinc-900">{apiKey}</code>
              </div>
            </div>

            <ConfigBlock
              title="Cursor"
              subtitle=".cursor/mcp.json"
              value={config.cursor}
            />
            <ConfigBlock
              title="Codex"
              subtitle="~/.codex/config.toml"
              value={config.codex}
            />
            <ConfigBlock
              title="Claude Code"
              subtitle=".mcp.json"
              value={config.claudeCode}
            />
          </div>
        ) : (
          <div className="border border-zinc-950/10 bg-white px-4 py-4 text-sm text-zinc-600">
            Create a key to reveal the config.
          </div>
        )}
      </div>
    </div>
  )
}
