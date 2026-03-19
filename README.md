# PlanWiki

**AI-native workspace for agents and product teams.**

PlanWiki helps product teams move from planning to execution fast. Paste raw ideas or AI-generated plans and instantly get structured checklists, timelines, tasks, and workflows your team and AI agents can execute.

→ **[PlanWiki](https://planwiki.com)** — hosted version, no setup and credit card required.

---

## How it works

**Paste** — Drop a feature spec, sprint plan, PRD, or project brief from any AI output.

**Structure** — PlanWiki breaks it into tasks, phases, and execution views your team can review and act on.

**Execute** — Connect your agents via MCP. Track progress in real time. Just start working.

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
```

Set `LLM_PROVIDER` to the provider you want and add only that provider's API key. Everything else is optional.

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
- **[Drizzle ORM](https://orm.drizzle.team)** — Typesafe Queries
- **[PostgreSQL](https://postgresql.org)** — Database
- **[AI SDK](https://sdk.vercel.ai)** — LLM provider routing
- **[Better Auth](https://better-auth.com)** — Email and password authentication
- **[shadcn/ui](https://ui.shadcn.com)** — UI library
- **[tRPC](https://trpc.io)** — End-to-end typesafe API

---

## License

[GNU Affero General Public License v3.0](./LICENSE)
