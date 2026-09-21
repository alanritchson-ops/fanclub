import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <div className="mx-auto max-w-sm py-8 md:py-16">
      <h1 className="display text-5xl">Sign in.</h1>
      <p className="mt-4 text-bone/70">Club admin only.</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
