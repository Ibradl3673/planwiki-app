"use client"

import { useState } from "react"

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"

import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"

type KeyInfo = { id: string; name: string; key: string }

export function GetApiKeysButton({ initialKeys }: { initialKeys: KeyInfo[] }) {
  const utils = trpc.useUtils()
  const [open, setOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  // Keep local state in sync or just rely on initial. We can just append newly created keys to local state.
  const [keys, setKeys] = useState<KeyInfo[]>(initialKeys)

  const copyToClipboard = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const createApiKey = trpc.agents.createApiKey.useMutation({
    onSuccess: async (response) => {
      if (!response.success) {
        toast.error("We could not create that API key.")
        return
      }

      await utils.invalidate()
      const newKey: KeyInfo = {
        id: response.data.id,
        name: response.data.name,
        key: response.data.apiKey,
      }
      setKeys((current) => [newKey, ...current])
      toast.success("API key created.")
    },
    onError: () => {
      toast.error("We could not create that API key.")
    },
  })

  return (
    <div className="relative inline-block text-left">
      <Button 
        onClick={() => setOpen(!open)}
        className="rounded-none bg-zinc-950 px-6 py-3 font-medium text-sm text-[oklch(0.97_0.01_92)] hover:bg-zinc-800 transition-colors"
      >
        Get API Keys
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-[26rem] origin-top-right border border-zinc-950/10 bg-white shadow-xl z-50 flex flex-col">
          <div className="border-b border-zinc-950/10 px-5 py-4 bg-[oklch(0.985_0.01_92)] flex items-center justify-between">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-950">Your API Keys</h3>
            <button 
              onClick={() => {
                createApiKey.mutate({ provider: "cursor", name: "Generated Key", workspaceIds: [] })
              }}
              disabled={createApiKey.isPending}
              className="text-[11px] uppercase tracking-[0.1em] font-medium text-zinc-600 hover:text-zinc-950 transition-colors underline underline-offset-2"
            >
              {createApiKey.isPending ? "Creating..." : "Create New"}
            </button>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {keys.length === 0 ? (
              <div className="p-6 text-sm text-zinc-500 text-center">No keys available. Create one to get started.</div>
            ) : (
              <ul className="divide-y divide-zinc-950/10">
                {keys.map((k) => (
                  <li key={k.id} className="p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-medium text-zinc-950">{k.name}</span>
                       <button 
                         onClick={() => copyToClipboard(k.id, k.key)}
                         className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors bg-zinc-100 px-2 py-1"
                       >
                         <HugeiconsIcon icon={copiedId === k.id ? Tick02Icon : Copy01Icon} className="size-3.5" />
                         {copiedId === k.id ? "Copied" : "Copy"}
                       </button>
                    </div>
                    <div>
                      <code className="block text-[11px] bg-zinc-50 p-2.5 text-zinc-600 border border-zinc-950/5 break-all">
                        {k.key}
                      </code>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
