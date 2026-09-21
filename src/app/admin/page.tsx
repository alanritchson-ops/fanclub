import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { countByStatus, listMessages, STATUSES } from "@/lib/messages";
import { mongoConfigured } from "@/lib/mongo";
import { LocalTime } from "./LocalTime";
import { StatusBadge } from "./StatusBadge";

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status: raw } = await searchParams;
  const status = STATUSES.find((s) => s === raw);

  if (!mongoConfigured()) {
    return (
      <p className="rounded-2xl border border-white/15 p-6 text-bone/80">
        MongoDB isn&apos;t connected. Set <code>MONGODB_URI</code> to see website messages here.
      </p>
    );
  }

  let messages, counts;
  try {
    [messages, counts] = await Promise.all([listMessages(status), countByStatus()]);
  } catch (err) {
    console.error("[admin] could not load messages", err);
    return (
      <p className="rounded-2xl border border-white/15 p-6 text-bone/80">
        Couldn&apos;t reach the database. Check <code>MONGODB_URI</code> and try again.
      </p>
    );
  }

  const tabs: { label: string; href: string; active: boolean; count?: number }[] = [
    {
      label: "Inbox",
      href: "/admin",
      active: !status,
      count: counts.new + counts.read + counts.replied,
    },
    ...STATUSES.map((s) => ({
      label: s[0].toUpperCase() + s.slice(1),
      href: `/admin?status=${s}`,
      active: status === s,
      count: counts[s],
    })),
  ];

  return (
    <>
      <h1 className="display text-5xl md:text-6xl">Messages.</h1>

      <nav aria-label="Filter messages" className="mt-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            aria-current={t.active ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              t.active
                ? "border-bone bg-bone text-ink"
                : "border-white/25 text-bone/80 hover:bg-white/10"
            }`}
          >
            {t.label} <span className="opacity-60">{t.count}</span>
          </Link>
        ))}
      </nav>

      {messages.length === 0 ? (
        <p className="mt-10 text-bone/60">Nothing here yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {messages.map((m) => (
            <li key={m.id}>
              <Link
                href={`/admin/messages/${m.id}`}
                className="block py-5 hover:bg-white/[.04] md:px-3"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className={m.status === "new" ? "font-bold" : "font-medium"}>{m.name}</span>
                  <span className="text-sm text-bone/55">{m.email}</span>
                  <StatusBadge status={m.status} />
                  <span className="ml-auto text-sm text-bone/55">
                    <LocalTime iso={m.createdAt} />
                  </span>
                </div>
                <p className="mt-1 text-sm text-brass">{m.topic}</p>
                <p className="mt-1 line-clamp-2 text-bone/70">{m.message}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
