import { nanoid } from "nanoid"

import type {
  ChecklistItem,
  ChecklistWidgetData,
  NotesWidgetData,
  PhaseItem,
  PhasesWidgetData,
  TableWidgetData,
  WorkspaceWidget,
} from "@/lib/widgets/widget-registry"

export interface GeneratedWorkspacePreview {
  title: string
  summary: string
  widgets: WorkspaceWidget[]
}

const TIMELINE_PATTERN =
  /\b(day|week|month|quarter|phase|sprint|launch|semester|monday|tuesday|wednesday|thursday|friday)\b/i
const BUDGET_PATTERN =
  /\$[\d,.]+(?:\s*\/\s*[a-z]+)?|\b(budget|cost|price|spend|allocate|expense|revenue)\b/i

const stripMarker = (line: string) =>
  line
    .replace(/^\s*[-*+]\s+/, "")
    .replace(/^\s*\d+[\).\s-]+/, "")
    .trim()

const splitTasks = (value: string) =>
  value
    .split(/,|;|\band\b/gi)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 4)

const toSentence = (value: string) => {
  const normalized = value.trim().replace(/\s+/g, " ")
  if (!normalized) return ""

  return normalized.endsWith(".") ? normalized : `${normalized}.`
}

const inferTitle = (lines: string[]) => {
  const candidate =
    lines.find(
      (line) =>
        line.length > 6 &&
        line.length < 72 &&
        !/^\d/.test(line) &&
        !TIMELINE_PATTERN.test(line),
    ) ?? lines[0] ?? "Generated Workspace"

  return candidate
    .replace(/\b(plan|roadmap|checklist)\b[:\s-]*/gi, "")
    .replace(/[:\-–—]+$/, "")
    .trim() || "Generated Workspace"
}

const inferSummary = (lines: string[]) => {
  const proseLines = lines.filter(
    (line) =>
      line.length > 24 &&
      !/^\d+[\).]/.test(line) &&
      !/^\s*[-*+]/.test(line),
  )

  if (!proseLines.length) {
    return "A compact execution view with the key tasks, timeline, and reference details."
  }

  return toSentence(proseLines[0].slice(0, 140))
}

const buildChecklistItems = (lines: string[]) => {
  const actionable = lines
    .map(stripMarker)
    .filter((line) => line.length > 3)
    .slice(0, 8)

  const items = actionable.map<ChecklistItem>((line, index) => ({
    id: nanoid(),
    text: line,
    done: index === 0 && actionable.length > 3,
  }))

  return items.length
    ? items
    : [
        { id: nanoid(), text: "Review the generated workspace", done: true },
        { id: nanoid(), text: "Refine the plan structure", done: false },
        { id: nanoid(), text: "Share the workspace with collaborators", done: false },
      ]
}

const buildPhaseItems = (lines: string[]) => {
  const timelineLines = lines.filter((line) => TIMELINE_PATTERN.test(line)).slice(0, 4)

  if (timelineLines.length) {
    return timelineLines.map<PhaseItem>((line, index) => {
      const cleaned = stripMarker(line)
      const [namePart, detailPart] = cleaned.split(/[:\-–—]\s+/, 2)
      const tasks = splitTasks(detailPart ?? cleaned).slice(0, 3)

      return {
        id: nanoid(),
        name: namePart.trim() || `Stage ${index + 1}`,
        status: index === 0 ? "done" : index === 1 ? "active" : "pending",
        tasks: tasks.length ? tasks : [`Advance ${cleaned.toLowerCase()}`],
      }
    })
  }

  const fallback = [
    {
      name: "Intake",
      tasks: lines.slice(0, 2).map(stripMarker),
    },
    {
      name: "Build",
      tasks: lines.slice(2, 5).map(stripMarker),
    },
    {
      name: "Launch",
      tasks: lines.slice(5, 8).map(stripMarker),
    },
  ].filter((phase) => phase.tasks.length)

  return fallback.map<PhaseItem>((phase, index) => ({
    id: nanoid(),
    name: phase.name,
    status: index === 0 ? "done" : index === 1 ? "active" : "pending",
    tasks: phase.tasks,
  }))
}

const buildTableData = (lines: string[]) => {
  const budgetRows = lines
    .filter((line) => BUDGET_PATTERN.test(line))
    .slice(0, 6)
    .map((line) => {
      const cleaned = stripMarker(line)
      const [label, detail] = cleaned.split(/:\s+/, 2)
      const amount = cleaned.match(/\$[\d,.]+(?:\s*\/\s*[a-z]+)?/i)?.[0] ?? detail ?? "Planned"
      const notes = detail && detail !== amount ? detail : "Derived from plan"

      return [label.trim(), amount.trim(), notes.trim()]
    })
    .filter((row) => row[0])

  if (budgetRows.length >= 2) {
    return {
      title: "Budget table",
      columns: ["Category", "Amount", "Notes"],
      rows: budgetRows,
    }
  }

  const fallbackRows = lines.slice(0, 5).map((line, index) => [
    `Row ${index + 1}`,
    stripMarker(line),
    index === 0 ? "Priority" : "Tracked",
  ])

  return {
    title: "Reference table",
    columns: ["Entry", "Detail", "Status"],
    rows: fallbackRows,
  }
}

export function generateWorkspaceFromPlan(text: string): GeneratedWorkspacePreview {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  const title = inferTitle(lines)
  const summary = inferSummary(lines)
  const checklistItems = buildChecklistItems(lines)
  const phaseItems = buildPhaseItems(lines)
  const tableData = buildTableData(lines)

  const widgets: WorkspaceWidget[] = [
    {
      id: nanoid(),
      type: "notes",
      order: 1,
      title: "Summary",
      content: summary,
    } satisfies NotesWidgetData,
    {
      id: nanoid(),
      type: "phases",
      order: 2,
      title: "Timeline",
      items: phaseItems,
    } satisfies PhasesWidgetData,
    {
      id: nanoid(),
      type: "checklist",
      order: 3,
      title: "Task list",
      items: checklistItems,
    } satisfies ChecklistWidgetData,
    {
      id: nanoid(),
      type: "table",
      order: 4,
      title: tableData.title,
      columns: tableData.columns,
      rows: tableData.rows,
    } satisfies TableWidgetData,
  ]

  return {
    title,
    summary,
    widgets,
  }
}
