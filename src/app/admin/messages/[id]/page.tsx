import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { getMessage, markRead } from "@/lib/messages";
import { Button } from "@/components/ui/Button";
import { LocalTime } from "../../LocalTime";
import { StatusBadge } from "../../StatusBadge";
import { statusAction } from "../../actions";
import { ReplyForm } from "./ReplyForm";

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const found = await getMessage(id);
  if (!found) notFound();
  if (found.status === "new") await markRead(id);
  const m = found.status === "new" ? { ...found, status: "read" as const } : found;

  return (
    <>
      <Link href="/admin" className="text-sm text-bone/70 underline-offset-4 hover:underline">
        &larr; All messages
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="display text-4xl md:text-5xl">{m.name}</h1>
        <StatusBadge status={m.status} />
      </div>
      <p className="mt-3 text-bone/70">
        <a className="underline underline-offset-4" href={`mailto:${m.email}`}>
          {m.email}
        </a>{" "}
        · <span className="text-brass">{m.topic}</span> · <LocalTime iso={m.createdAt} />
      </p>

      <section aria-label="Message" className="mt-8 rounded-2xl border border-white/15 p-5 md:p-7">
        <p className="whitespace-pre-wrap text-lg leading-relaxed">{m.message}</p>
      </section>

      {m.replies.length > 0 && (
        <section aria-label="Replies sent" className="mt-8 space-y-4">
          <h2 className="text-sm font-medium text-bone/60">Replies sent</h2>
          {m.replies.map((r) => (
            <div key={r.sentAt} className="rounded-2xl bg-white/[.06] p-5">
              <p className="text-sm text-bone/55">
                <LocalTime iso={r.sentAt} />
              </p>
              <p className="mt-2 whitespace-pre-wrap">{r.body}</p>
            </div>
          ))}
        </section>
      )}

      <section aria-label="Reply" className="mt-10">
        <ReplyForm id={m.id} to={m.email} />
      </section>

      <form action={statusAction} className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-6">
        <input type="hidden" name="id" value={m.id} />
        {m.status === "archived" ? (
          <Button type="submit" name="status" value="read" variant="ghost">
            Move back to inbox
          </Button>
        ) : (
          <>
            <Button type="submit" name="status" value="archived" variant="ghost">
              Archive
            </Button>
            <Button type="submit" name="status" value="new" variant="ghost">
              Mark unread
            </Button>
          </>
        )}
      </form>
    </>
  );
}
