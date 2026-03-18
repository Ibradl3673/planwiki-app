import { type ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around gap-(--gap)", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  )
}

const agentConnections = [
  { label: "Cursor", detail: ".cursor/mcp.json" },
  { label: "Codex", detail: "~/.codex/config.toml" },
  { label: "Claude Code", detail: ".mcp.json" },
  { label: "MCP Server", detail: "Shared workspace access" },
  { label: "Product Team", detail: "One execution surface" },
  { label: "Agent Tasks", detail: "Structured widgets" },
]

export function ModelMarquee() {
  return (
    <div className="relative overflow-hidden rounded-sm border border-zinc-950/10 bg-[#f6f1e8] py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f6f1e8] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f6f1e8] to-transparent" />
      <Marquee pauseOnHover className="[--duration:28s] [--gap:1.5rem] py-1">
        {agentConnections.map((item) => (
          <div
            key={item.label}
            className="flex min-w-[220px] flex-col gap-1 rounded-sm border border-zinc-950/10 bg-white/90 px-4 py-3"
          >
            <span className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
              Connect
            </span>
            <span className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-900">
              {item.label}
            </span>
            <span className="text-sm text-zinc-600">{item.detail}</span>
          </div>
        ))}
      </Marquee>
    </div>
  )
}
