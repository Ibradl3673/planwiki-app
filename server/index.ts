import { router } from "./trpc";
import { agentsRouter } from "./routers/agents";
import { authRouter } from "./routers/auth";
import { workspacesRouter } from "./routers/workspaces";

export const appRouter = router({
  agents: agentsRouter,
  auth: authRouter,
  workspaces: workspacesRouter,
});

export type AppRouter = typeof appRouter;
