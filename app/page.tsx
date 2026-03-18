"use client";

import { useEffect, useState } from "react";

import { ArrowRight } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { LandingNav } from "@/components/landing-nav";
import { Button } from "@/components/ui/button";
import { ModelMarquee } from "@/components/ui/marquee";
import PricingCards from "@/components/ui/pricing-cards";

const demoExamples = [
  {
    id: "roadmap",
    label: "Roadmap",
    title: "Q3 Collaboration Workspace Rollout",
    plan: [
      "Week 1 — Align product, design, and engineering on the workspace collaboration problem and target users.",
      "Week 2 — Finalize the PRD, define agent workflows, and capture success metrics for activation and adoption.",
      "Week 3 — Break the rollout into onboarding, permissions, widget execution, and agent connectivity milestones.",
      "Week 4 — Ship the first release to an internal beta, collect issues, and document follow-up work.",
      "Week 5 — Prepare launch messaging, customer feedback loops, and post-launch iteration rituals.",
    ],
    widget: {
      title: "Workspace Rollout Board",
      subtitle: "A roadmap converted into execution blocks for product teams and agents.",
      content: (
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Sprint 1", "Problem framing", "Done"],
            ["Sprint 2", "PRD and metrics", "In progress"],
            ["Sprint 3", "Agent workflows", "Ready"],
            ["Sprint 4", "Beta launch", "Queued"],
          ].map(([lane, task, state]) => (
            <button
              key={task}
              type="button"
              className="cursor-pointer rounded-sm border border-zinc-950/10 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-zinc-950 hover:shadow-[4px_4px_0_0_rgba(24,24,27,0.12)]"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                {lane}
              </p>
              <p className="mt-2 text-base font-medium text-zinc-950">{task}</p>
              <p className="mt-2 text-sm text-zinc-600">{state}</p>
            </button>
          ))}
        </div>
      ),
    },
  },
  {
    id: "spec",
    label: "PRD",
    title: "AI Agent Handoff Product Spec",
    plan: [
      "Goal: give product teams a shared workspace where agents can pick up scoped execution work safely.",
      "User flow: paste a long plan, detect structure, convert it into widgets, assign follow-up actions, and share it with teammates.",
      "Key requirements: versioned updates, editable widgets, public/private sharing, and agent connection setup.",
      "Risks: unclear ownership, low trust in AI output, and weak visibility across roadmap execution.",
      "Success metrics: time to first workspace, number of active widgets, and agent-assisted task completion.",
    ],
    widget: {
      title: "Spec Breakdown",
      subtitle: "Requirements, risks, and outcomes split into reviewable sections.",
      content: (
        <div className="space-y-3 text-sm text-zinc-700">
          <div className="flex items-end justify-between border-b border-zinc-900/10 pb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Primary outcome
              </p>
              <p className="mt-1 text-2xl font-semibold text-zinc-950">
                Agent-ready execution
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                Shared with
              </p>
              <p className="mt-1 text-lg font-medium text-emerald-700">
                Shared with product
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {[
              ["Problem statement", "Defined"],
              ["Success metrics", "Tracked"],
              ["Agent workflow", "Mapped"],
              ["Risks", "Reviewed"],
              ["Rollout", "Sequenced"],
            ].map(([label, value]) => (
              <button
                key={label}
                type="button"
                className="grid w-full cursor-pointer grid-cols-[1fr_auto] gap-3 border border-transparent px-2 py-1 text-left transition-colors hover:border-zinc-950/10 hover:bg-zinc-50"
              >
                <span>{label}</span>
                <span className="font-medium text-zinc-950">{value}</span>
              </button>
            ))}
          </div>
        </div>
      ),
    },
  },
  {
    id: "launch",
    label: "Launch",
    title: "Product Launch Coordination Plan",
    plan: [
      "Phase 1 — Lock scope, confirm launch owner, and define the support plan for the first rollout window.",
      "Phase 2 — Coordinate release notes, marketing copy, internal enablement, and agent operating instructions.",
      "Phase 3 — Track launch blockers, feedback, and follow-up items in one shared execution workspace.",
      "Phase 4 — Review outcomes with the team and feed learnings back into the next roadmap cycle.",
    ],
    widget: {
      title: "Launch Coordination Workspace",
      subtitle: "Cross-functional launch steps made visible for teams and agents.",
      content: (
        <div className="space-y-3 text-sm text-zinc-700">
          {[
            ["Phase 1", "Scope lock", true],
            ["Phase 2", "Enablement", true],
            ["Phase 3", "Launch monitoring", false],
            ["Phase 4", "Post-launch review", false],
          ].map(([day, task, done]) => (
            <button
              key={String(day)}
              type="button"
              className="grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-zinc-900/10 pb-3 text-left transition-colors hover:bg-white/60 last:border-b-0 last:pb-0"
            >
              <span className="rounded-sm border border-zinc-950 bg-[#f6f1e8] px-2 py-1 text-[10px] uppercase tracking-[0.24em] text-zinc-600">
                {day}
              </span>
              <span
                className={
                  done ? "text-zinc-500 line-through" : "text-zinc-950"
                }
              >
                {task}
              </span>
              <span className={done ? "text-emerald-700" : "text-amber-700"}>
                {done ? "done" : "next"}
              </span>
            </button>
          ))}
        </div>
      ),
    },
  },
];

const features = [
  "Roadmaps into widgets",
  "PRDs into execution views",
  "Agent connection setup",
  "Shared team workspaces",
  "Open source and self-hostable",
];

export default function LandingPage() {
  const [showHeader, setShowHeader] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDemo, setActiveDemo] = useState(0);
  const [selectedRoadmapTask, setSelectedRoadmapTask] =
    useState("PRD and metrics");
  const [selectedSpecSection, setSelectedSpecSection] =
    useState("Success metrics");
  const [selectedLaunchStep, setSelectedLaunchStep] = useState("Launch monitoring");

  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 40);
      setShowHeader(currentScrollY < lastScrollY || currentScrollY < 40);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentDemo = demoExamples[activeDemo];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f6f1e8] text-zinc-950 selection:bg-zinc-950 selection:text-[#f6f1e8]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(22,163,74,0.12),transparent_24%),radial-gradient(circle_at_85%_18%,rgba(245,158,11,0.14),transparent_20%),linear-gradient(to_right,rgba(24,24,27,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.05)_1px,transparent_1px)] bg-[size:auto,auto,28px_28px,28px_28px]" />

      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b border-zinc-950/10 bg-[#f6f1e8]/85 backdrop-blur-md"
            : "bg-transparent"
        } ${showHeader ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"}`}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6 md:py-4">
          <LandingNav showLogo />
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pb-10 pt-28 md:px-6 md:pb-12 md:pt-36">
          <div className="max-w-4xl">
            <h1 className="max-w-5xl text-5xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-6xl md:text-7xl lg:text-8xl">
              AI-Native Workspace for Agents and Product Teams
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-700 md:text-xl">
              PlanWiki is an open source workspace for product teams and AI
              agents. Paste long AI-generated plans, roadmaps, or ideas to turn
              them into interactive widgets your team and agents can execute
              together.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-sm border border-zinc-950 bg-zinc-950 px-8 text-base text-[#f6f1e8] hover:bg-zinc-800"
            >
              <Link href="/login">
                Get Started for Free
                <HugeiconsIcon
                  icon={ArrowRight}
                  className="ml-2 h-5 w-5 transition-transform group-hover/button:translate-x-1"
                />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              [
                "Input",
                "Paste long product plans, PRDs, roadmaps, launch docs, or messy AI-generated strategy notes.",
              ],
              [
                "Transform",
                "PlanWiki breaks them into widgets, execution views, and reviewable sections your team can actually use.",
              ],
              [
                "Operate",
                "Your workspace becomes a shared operating surface for product teams and connected AI agents.",
              ],
            ].map(([title, copy]) => (
              <div
                key={title}
                className="rounded-sm border border-zinc-950/10 bg-white/70 p-5 backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                  {title}
                </p>
                <p className="mt-3 text-base leading-7 text-zinc-800">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-6 md:px-6 md:pb-8">
          <div className="rounded-sm border border-zinc-950/10 bg-white/65 p-6 backdrop-blur-sm md:p-8">
            <div className="grid gap-6 md:grid-cols-[0.75fr_1.25fr] md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
                  Connect your agents
                </p>
                <p className="mt-3 max-w-md text-lg leading-8 text-zinc-700">
                  Bring plans from any model, then connect the agents and tools
                  that help your team move the work forward inside one workspace.
                </p>
              </div>
              <ModelMarquee />
            </div>
          </div>
        </section>

        <section id="demo" className="text-zinc-950">
          <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
            <div className="max-w-3xl">
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
                Paste the plan. Run the workspace.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
                Long product plans are useful until nobody can execute them.
                PlanWiki turns them into structured blocks your team and agents
                can inspect, update, and act on together.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {demoExamples.map((demo, index) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => setActiveDemo(index)}
                  className={`border px-4 py-2 text-sm uppercase tracking-[0.24em] transition-colors ${
                    activeDemo === index
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-950/15 bg-[#f6f1e8] text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {demo.label}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-[1fr_auto_1fr] xl:items-center">
              <article className="rounded-sm border border-zinc-950/10 bg-[#f7f2ea] p-5 md:p-8">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
                  From this
                </p>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">
                  {currentDemo.title}
                </h3>
                <div className="mt-6 rounded-sm border border-zinc-950/10 bg-white p-5 font-mono text-sm leading-7 text-zinc-700">
                  <p className="mb-4 text-xs uppercase tracking-[0.24em] text-zinc-500">
                    raw ai output
                  </p>
                  {currentDemo.plan.map((line, index) => (
                    <p
                      key={line}
                      className="transition-colors hover:text-zinc-950"
                    >
                      {index + 1}. {line}
                    </p>
                  ))}
                </div>
              </article>

              <div className="flex items-center justify-center py-1 xl:py-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-sm border border-zinc-950 bg-zinc-950 text-white md:h-16 md:w-16">
                  <HugeiconsIcon
                    icon={ArrowRight}
                    className="h-7 w-7 md:h-8 md:w-8"
                  />
                </div>
              </div>

              <article
                className="overflow-hidden rounded-sm border border-zinc-950/10 bg-[#f7f2ea] p-5 text-zinc-950 md:p-8"
              >
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-600">
                  To this
                </p>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                  {currentDemo.widget.title}
                </h3>
                {currentDemo.widget.subtitle ? (
                  <p className="mt-3 text-base leading-7 text-zinc-700">
                    {currentDemo.widget.subtitle}
                  </p>
                ) : null}
                <div className="mt-6 rounded-sm border border-zinc-950/10 bg-white p-4 md:p-5">
                  {activeDemo === 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        ["Day 1", "Project setup", "Done"],
                        ["Day 2", "Workspace system", "In progress"],
                        ["Day 4", "Plan parser", "Blocked"],
                        ["Day 7", "Sharing", "Queued"],
                      ].map(([lane, task, state]) => {
                        const isSelected = selectedRoadmapTask === task;

                        return (
                          <button
                            key={task}
                            type="button"
                            onClick={() => setSelectedRoadmapTask(String(task))}
                            className={`cursor-pointer rounded-sm border p-4 text-left transition-all hover:-translate-y-0.5 ${
                              isSelected
                                ? "border-emerald-700 bg-emerald-50"
                                : "border-zinc-950/10 hover:border-zinc-950 hover:shadow-[4px_4px_0_0_rgba(24,24,27,0.12)]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                                  {lane}
                                </p>
                                <p className="mt-2 text-base font-medium text-zinc-950">
                                  {task}
                                </p>
                              </div>
                              <span
                                className={`mt-1 h-3 w-3 rounded-sm border ${
                                  isSelected
                                    ? "border-emerald-700 bg-emerald-700"
                                    : "border-zinc-950 bg-transparent"
                                }`}
                              />
                            </div>
                            <p className="mt-2 text-sm text-zinc-600">
                              {state}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  ) : activeDemo === 1 ? (
                    <div className="space-y-3 text-sm text-zinc-700">
                      <div className="flex items-end justify-between border-b border-zinc-900/10 pb-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                            Primary outcome
                          </p>
                          <p className="mt-1 text-2xl font-semibold text-zinc-950">
                            Agent-ready execution
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">
                            Focus
                          </p>
                          <p className="mt-1 text-lg font-medium text-zinc-950">
                            {selectedSpecSection}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[
                          ["Infrastructure", "$45/mo"],
                          ["Domain + branding", "$82"],
                          ["AI processing", "$100"],
                          ["Marketing", "$200"],
                          ["Misc", "$150"],
                        ].map(([label, value]) => {
                          const isSelected = selectedSpecSection === label;

                          return (
                            <button
                              key={label}
                              type="button"
                              onClick={() =>
                                setSelectedSpecSection(String(label))
                              }
                            className={`grid w-full cursor-pointer grid-cols-[1fr_auto] gap-3 rounded-sm border px-2 py-2 text-left transition-colors ${
                                isSelected
                                  ? "border-emerald-700 bg-emerald-700 text-white"
                                  : "border-transparent bg-white hover:border-zinc-950/10 hover:bg-zinc-50"
                              }`}
                            >
                              <span>{label}</span>
                              <span
                                className={
                                  isSelected
                                    ? "font-medium text-white"
                                    : "font-medium text-zinc-950"
                                }
                              >
                                {value}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm text-zinc-700">
                      {[
                        ["Day 1", "Idea validation", true],
                        ["Day 1", "Product definition", true],
                        ["Week 1", "Build MVP", false],
                        ["Launch", "Distribution", false],
                      ].map(([day, task, done]) => {
                        const isSelected = selectedLaunchStep === task;

                        return (
                          <button
                            key={String(task)}
                            type="button"
                            onClick={() => setSelectedLaunchStep(String(task))}
                            className={`grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-zinc-900/10 pb-3 text-left transition-colors hover:bg-white/60 last:border-b-0 last:pb-0 ${
                              isSelected ? "bg-emerald-50/70" : ""
                            }`}
                          >
                            <span
                              className={`rounded-sm border px-2 py-1 text-[10px] uppercase tracking-[0.24em] ${
                                isSelected
                                  ? "border-emerald-700 bg-emerald-700 text-white"
                                  : "border-zinc-950 bg-[#f6f1e8] text-zinc-600"
                              }`}
                            >
                              {day}
                            </span>
                            <span
                              className={
                                done
                                  ? "text-zinc-500 line-through"
                                  : "text-zinc-950"
                              }
                            >
                              {task}
                            </span>
                            <span
                              className={done ? "text-emerald-700" : "text-zinc-600"}
                            >
                              {isSelected ? "open" : done ? "done" : "next"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </article>
            </div>

            <div className="mt-8 flex flex-col gap-4 rounded-sm border border-zinc-950/10 bg-[#f7f2ea] p-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
                  Demo workspace
                </p>
                <p className="mt-3 max-w-sm text-lg leading-7 text-zinc-700">
                  See how a product development plan becomes a workspace your
                  team and agents can execute together.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="h-12 rounded-sm border border-zinc-950 bg-zinc-950 px-6 text-white hover:bg-zinc-800"
              >
                <Link href="/login">
                  Open Demo Workspace
                  <HugeiconsIcon
                    icon={ArrowRight}
                    className="ml-2 h-5 w-5 transition-transform group-hover/button:translate-x-1"
                  />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
              Features
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
              Built for product development work
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {features.map((feature) => (
              <div
                key={feature}
                className="rounded-sm border border-zinc-950/10 bg-white/70 p-5 text-base text-zinc-800 backdrop-blur-sm"
              >
                {feature}
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="grid gap-10 md:grid-cols-[0.75fr_1.25fr]">
            <div>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-zinc-950 md:text-5xl">
                Choose the right plan for your team
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-zinc-700">
                Every pasted plan becomes a workspace. Use PlanWiki to align
                product, design, engineering, and connected agents around the
                same execution surface.
              </p>
            </div>
            <PricingCards />
          </div>
        </section>

        <section
          id="use-cases"
          className="border-y border-zinc-950/10 bg-white/60"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
            <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-zinc-950 md:text-5xl">
                  Built for product teams working with AI
                </h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-700">
                  Use PlanWiki when your team already thinks with AI, but still
                  needs a shared place to organize, review, and execute the work.
                </p>
              </div>
              <div className="grid gap-px border border-zinc-950 bg-zinc-950">
                {[
                  "Product roadmaps",
                  "PRDs and specifications",
                  "Launch coordination",
                  "Backlog shaping",
                  "Cross-functional planning",
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-[#f6f1e8] p-5 text-base leading-7 text-zinc-900"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                "Product teams collecting long AI plans that need structure before execution",
                "Operators who want agents and humans working from the same source of truth",
                "Teams that need workspaces they can review, edit, and share without rewriting everything",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-sm border border-zinc-950/10 bg-white p-5 text-base leading-7 text-zinc-900"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="open-source"
          className="mx-auto max-w-7xl px-4 py-20 md:px-6"
        >
          <div className="grid gap-10 rounded-sm border border-zinc-950 bg-zinc-950 p-8 text-[#f6f1e8] md:grid-cols-[1fr_auto] md:p-10">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">
                Open Source
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
                PlanWiki is open source.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                Inspect the code, contribute improvements, and self-host if your
                team needs full control over how workspaces and agents are set up.
              </p>
              <div className="mt-8 grid gap-3 text-sm uppercase tracking-[0.24em] text-zinc-400 sm:grid-cols-3">
                <span>Inspect the code</span>
                <span>Contribute</span>
                <span>Self host if needed</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:w-56">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-sm border border-[#f6f1e8] bg-[#f6f1e8] px-6 text-zinc-950 hover:bg-zinc-200"
              >
                <Link
                  href="https://github.com/planwiki/planwiki-app"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-sm border-[#f6f1e8] bg-transparent px-6 text-[#f6f1e8] hover:bg-white hover:text-zinc-950"
              >
                <Link
                  href="https://github.com/planwiki/planwiki-app#readme"
                  target="_blank"
                  rel="noreferrer"
                >
                  Docs
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex max-w-7xl items-center justify-between px-4 pb-10 pt-2 text-sm text-zinc-600 md:px-6">
          <p>© {new Date().getFullYear()} PlanWiki</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-zinc-950"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-zinc-950"
            >
              Terms
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
