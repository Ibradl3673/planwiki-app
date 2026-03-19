import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { EmailAuthPage } from "@/components/auth/email-auth-page";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/workspaces");
  }

  return <EmailAuthPage />;
}
