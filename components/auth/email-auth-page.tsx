"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";

type AuthMode = "sign-in" | "sign-up";

const getErrorMessage = (fallback: string, error: unknown) => {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = error.message;

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  return fallback;
};

export function EmailAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const callbackURL = useMemo(() => "/auth/callback", []);
  const authError = searchParams.get("error");
  const mode: AuthMode =
    searchParams.get("mode") === "sign-up" ? "sign-up" : "sign-in";
  const isSignUp = mode === "sign-up";

  const submit = async () => {
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !password) {
      toast.error("Enter your email and password.");
      return;
    }

    if (isSignUp && !trimmedName) {
      toast.error("Enter your name to create an account.");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({
          email: trimmedEmail,
          password,
          name: trimmedName,
          callbackURL,
        });

        if (error) {
          toast.error(error.message || "Failed to create your account.");
          setIsLoading(false);
          return;
        }

        router.push("/auth/callback");
        router.refresh();
        return;
      }

      const { error } = await authClient.signIn.email({
        email: trimmedEmail,
        password,
        callbackURL,
      });

      if (error) {
        toast.error(error.message || "Failed to sign in.");
        setIsLoading(false);
        return;
      }

      router.push("/auth/callback");
      router.refresh();
    } catch (error) {
      toast.error(
        getErrorMessage(
          isSignUp
            ? "Failed to create your account."
            : "Failed to sign in.",
          error,
        ),
      );
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#f6f1e8]">
      <section className="flex flex-1 items-center justify-center px-4 py-10 md:px-6">
        <div className="w-full max-w-md rounded-sm border border-zinc-950/10 bg-white p-6 shadow-none md:p-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/logo.png" alt="PlanWiki" width={32} height={32} />
            <span className="text-lg font-semibold text-zinc-950">
              PlanWiki
            </span>
          </Link>

          <h1 className="mt-8 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {isSignUp
              ? "Use email and password to start using PlanWiki."
              : "Sign in with your email and password to continue."}
          </p>

          {authError ? (
            <div className="mt-4 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Authentication failed. Try again.
            </div>
          ) : null}

          <div className="mt-8 grid gap-4">
            {isSignUp ? (
              <div className="grid gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-zinc-800"
                >
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                />
              </div>
            ) : null}

            <div className="grid gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-zinc-800"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-zinc-800"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>

            <Button
              type="button"
              onClick={submit}
              disabled={isLoading}
              className="rounded-sm border border-zinc-950 bg-zinc-950 text-[#f6f1e8] hover:bg-zinc-800"
            >
              {isLoading
                ? isSignUp
                  ? "Creating account..."
                  : "Signing in..."
                : isSignUp
                  ? "Create account"
                  : "Sign in"}
            </Button>

            <p className="text-sm text-zinc-600">
              {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
              <Link
                href={isSignUp ? "/login" : "/login?mode=sign-up"}
                className="font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-950"
              >
                {isSignUp ? "Log in" : "Create account"}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
