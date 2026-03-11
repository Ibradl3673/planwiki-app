import { auth } from "@/lib/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

export const privateProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const authSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authSession?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Please sign in to continue",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: authSession.user,
      session: authSession.session,
    },
  });
});
