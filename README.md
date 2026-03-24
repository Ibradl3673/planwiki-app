# PlanWiki
**Turn PRDs into Linear issues and Trello boards using AI.**

Paste a feature spec, sprint plan, or raw idea. PlanWiki structures it into tasks, phases, and checklists — then exports directly to Linear or Trello so your team can start working immediately.

→ **[PlanWiki](https://planwiki.com)** — hosted version, no setup or credit card required.

---

## How it works

**Paste** — Drop a PRD, feature spec, sprint plan, or AI-generated output into the chat.

**Structure** — PlanWiki breaks it into tasks, phases, checklists, and timelines your team can review and act on.

**Export** — Push to Linear or Trello in one click. Issues and cards are created automatically, ready for your team.

**Execute** — Optionally connect AI agents via MCP to pick up tasks and update progress in real time.

---

## Export to Linear and Trello

Once your workspace is structured, export it directly to your existing tools:

- **Linear** — Creates a project with issues, priorities, and labels mapped from your plan.
- **Trello** — Creates a board with cards organized by phase or checklist.

No manual copy-paste. No reformatting. Just connect your account and push.

---

## Connect your agents

PlanWiki has a built-in MCP server. Connect Claude Code, Cursor, Codex, GitHub Copilot, Windsurf, Gemini, or any MCP-compatible agent directly to your workspace. Your agent reads the plan, picks up tasks, and updates progress automatically.

Head to the **Agents tab** in your workspace to grab your config.

---

## Self-host in 5 minutes

```bash
git clone https://github.com/planwiki/planwiki-app
cd planwiki
cp .env.example .env
npm install
npx drizzle-kit push
npm run dev
```

Or deploy in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/planwiki/planwiki-app)
[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/planwiki/planwiki-app)

---

## Environment variables

Copy `.env.example` to `.env` and fill in:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/planwiki

# Auth
BETTER_AUTH_SECRET=replace-me
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI provider — pick one
LLM_PROVIDER=openai        # openai | anthropic | google | groq | azure
LLM_MODEL=gpt-4.1-mini    # optional, overrides the provider default

# API keys — only set the one you need
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
GROQ_API_KEY=
AZURE_API_KEY=
AZURE_RESOURCE_NAME=

# Integrations
LINEAR_CLIENT_ID=
LINEAR_CLIENT_SECRET=
TRELLO_API_KEY=
TRELLO_API_SECRET=
```

Set `LLM_PROVIDER` to the provider you want and add only that provider's API key. Add Linear or Trello credentials only when you want those integrations.

---

## Database

PlanWiki uses PostgreSQL with Drizzle ORM. Push the schema to your database with:

```bash
npx drizzle-kit push
```

---

## Auth

Uses Better Auth with email and password. No OAuth setup required for self-hosting.

- `/` and `/login` — login page
- Authenticated users land on `/workspaces`

---

## Tech stack

- **[Next.js](https://nextjs.org)** — Frontend
- **[Drizzle ORM](https://orm.drizzle.team)** — Typesafe queries
- **[PostgreSQL](https://postgresql.org)** — Database
- **[AI SDK](https://sdk.vercel.ai)** — LLM provider routing
- **[Better Auth](https://better-auth.com)** — Email and password authentication
- **[shadcn/ui](https://ui.shadcn.com)** — UI library
- **[tRPC](https://trpc.io)** — End-to-end typesafe API

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=planwiki/planwiki-app&type=date&legend=top-left)](https://www.star-history.com/#planwiki/planwiki-app&type=date&legend=top-left)

---

## License

[GNU Affero General Public License v3.0](./LICENSE)
