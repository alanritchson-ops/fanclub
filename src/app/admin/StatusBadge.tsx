import type { MessageStatus } from "@/lib/messages";

const styles: Record<MessageStatus, string> = {
  new: "bg-crimson text-white",
  read: "bg-white/10 text-bone/80",
  replied: "bg-brass/20 text-brass",
  archived: "bg-white/5 text-bone/50",
};

export function StatusBadge({ status }: { status: MessageStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}
