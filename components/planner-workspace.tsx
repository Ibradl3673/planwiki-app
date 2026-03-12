"use client";

import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import { extractLatestPlanDocument } from "../lib/planner-message";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { PlanBoard } from "./plan-board";

function summarizePart(part: Record<string, unknown>) {
  if (part.type === "text" && typeof part.text === "string") {
    return part.text;
  }

  if (typeof part.type === "string" && part.type.startsWith("tool-")) {
    const label = part.type.replace("tool-", "");

    if (part.state === "output-available") {
      return `${label} complete`;
    }

    return `${label} running`;
  }

  return null;
}

export function PlannerWorkspace() {
  const [draft, setDraft] = useState("");
  const [planId] = useState(() => crypto.randomUUID());

  const { messages, sendMessage, status, error } = useChat({
    id: planId || undefined,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ id, messages }) {
        return {
          body: {
            id,
            messages,
          },
        };
      },
    }),
  });

  const document = useMemo(() => extractLatestPlanDocument(messages), [messages]);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fff7ed_0%,_#f8fafc_45%,_#eff6ff_100%)]">
      <main className="mx-auto grid min-h-screen max-w-[1500px] gap-6 px-4 py-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <Card className="flex min-h-[85vh] flex-col bg-white/90 backdrop-blur">
          <CardHeader className="space-y-4">
            <Badge>PlanWiki MVP</Badge>
            <CardTitle className="text-2xl">Paste a messy plan. Get a visual board.</CardTitle>
            <p className="text-sm leading-6 text-black/65">
              The left side captures intent. The right side turns the same content into compact widgets.
            </p>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <Textarea
              placeholder="Paste product notes, launch ideas, sprint goals, or a rough spec. The model will compress it into a plan board."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <Button
              className="w-full"
              disabled={!draft.trim() || status === "submitted" || status === "streaming" || !planId}
              onClick={() => {
                const value = draft.trim();
                if (!value) {
                  return;
                }

                void sendMessage({
                  role: "user",
                  parts: [{ type: "text", text: value }],
                });
                setDraft("");
              }}
            >
              {status === "submitted" || status === "streaming"
                ? "Generating plan"
                : "Generate plan"}
            </Button>

            <Separator />

            <ScrollArea className="flex-1 pr-1">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.role === "user"
                        ? "ml-8 rounded-[28px] bg-black px-4 py-4 text-sm text-white"
                        : "mr-8 rounded-[28px] border border-black/10 bg-white px-4 py-4 text-sm text-black"
                    }
                  >
                    <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-current/55">
                      <span>{message.role}</span>
                      <span>{message.id.slice(0, 6)}</span>
                    </div>
                    <div className="space-y-2">
                      {message.parts.map((part, index) => {
                        const summary = summarizePart(part as Record<string, unknown>);
                        if (!summary) {
                          return null;
                        }

                        return <p key={`${message.id}-${index}`}>{summary}</p>;
                      })}
                    </div>
                  </div>
                ))}
                {error ? (
                  <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error.message}
                  </div>
                ) : null}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="min-h-[85vh]">
          <PlanBoard document={document} className="h-full" />
        </div>
      </main>
    </div>
  );
}
