import type { Metadata } from "next";
import Link from "next/link";
import { getAdmin } from "@/lib/admin/auth";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();

  return (
    <div className="min-h-svh bg-ink text-bone">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 md:px-8">
          <Link href="/admin" className="font-semibold tracking-tight">
            {site.clubName} <span className="text-bone/55">Admin</span>
          </Link>
          {admin && (
            <div className="flex items-center gap-4 text-sm">
              <span className="hidden text-bone/60 sm:inline">{admin}</span>
              <form action={logoutAction}>
                <Button type="submit" variant="ghost" className="min-h-10 px-4 text-sm">
                  Sign out
                </Button>
              </form>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-12">{children}</main>
    </div>
  );
}
