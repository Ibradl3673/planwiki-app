"use client";

import type { PlanDocument, PlanWidget } from "../lib/ai/widget-schema";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

function WidgetCard({
  title,
  eyebrow,
  children,
  className,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="space-y-3">
        <Badge>{eyebrow}</Badge>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ChecklistCard({ widget }: { widget: Extract<PlanWidget, { type: "checklist" }> }) {
  return (
    <WidgetCard title={widget.title} eyebrow="Checklist">
      <div className="space-y-3">
        {widget.items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-2xl border border-black/8 bg-black/[0.02] px-4 py-3"
          >
            <div
              className={cn(
                "mt-0.5 h-5 w-5 rounded-full border",
                item.done ? "border-emerald-600 bg-emerald-500" : "border-black/20 bg-white",
              )}
            />
            <p className={cn("text-sm", item.done && "text-black/45 line-through")}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

function PhasesCard({ widget }: { widget: Extract<PlanWidget, { type: "phases" }> }) {
  return (
    <WidgetCard title={widget.title} eyebrow="Phases">
      <div className="space-y-4">
        {widget.items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-black/8 px-4 py-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h4 className="font-medium">{item.name}</h4>
              <Badge>{item.status}</Badge>
            </div>
            <ul className="space-y-2 text-sm text-black/65">
              {item.tasks.map((task) => (
                <li key={task}>• {task}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

function TableCard({ widget }: { widget: Extract<PlanWidget, { type: "table" }> }) {
  return (
    <WidgetCard title={widget.title} eyebrow="Reference">
      <div className="overflow-hidden rounded-2xl border border-black/10">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-black text-white">
            <tr>
              {widget.columns.map((column) => (
                <th key={column} className="px-3 py-2 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {widget.rows.map((row, index) => (
              <tr key={`${widget.id}-${index}`} className="border-t border-black/10">
                {row.map((cell, cellIndex) => (
                  <td key={`${widget.id}-${index}-${cellIndex}`} className="px-3 py-2 text-black/70">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
}

function NotesCard({ widget }: { widget: Extract<PlanWidget, { type: "notes" }> }) {
  return (
    <WidgetCard title={widget.title} eyebrow="Notes">
      <p className="whitespace-pre-wrap text-sm leading-7 text-black/70">
        {widget.content}
      </p>
    </WidgetCard>
  );
}

const widgetRegistry = {
  checklist: ChecklistCard,
  phases: PhasesCard,
  table: TableCard,
  notes: NotesCard,
} satisfies {
  [Type in PlanWidget["type"]]: React.ComponentType<{
    widget: Extract<PlanWidget, { type: Type }>;
  }>;
};

export function PlanBoard({
  document,
  className,
}: {
  document: PlanDocument | null;
  className?: string;
}) {
  if (!document) {
    return (
      <Card className={cn("min-h-[420px] border-dashed bg-white/70", className)}>
        <CardHeader>
          <Badge>Plan board</Badge>
          <CardTitle>Visual plan will appear here</CardTitle>
          <CardDescription>
            Paste your wall of text, generate once, and the board will condense it into widgets.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-5", className)}>
      <Card className="bg-[radial-gradient(circle_at_top_left,_#fff7ed,_#ffffff_45%,_#ecfeff)]">
        <CardHeader className="space-y-4">
          <Badge>Plan board</Badge>
          <CardTitle className="text-3xl">{document.title}</CardTitle>
          <CardDescription className="max-w-2xl text-base leading-7">
            {document.summary}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        {document.widgets.map((widget) => {
          const Component = widgetRegistry[widget.type];
          return <Component key={widget.id} widget={widget as never} />;
        })}
      </div>
    </div>
  );
}
