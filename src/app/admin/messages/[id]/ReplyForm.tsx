"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/forms/Field";
import { replyAction, type FormState } from "../../actions";

export function ReplyForm({ id, to }: { id: string; to: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(replyAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <label htmlFor="reply-body" className="block text-sm font-medium text-bone/85">
        Reply to {to}
      </label>
      <textarea
        id="reply-body"
        name="body"
        required
        rows={8}
        maxLength={8000}
        className={`${inputClass} py-3`}
      />
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" variant="light" disabled={pending}>
          {pending ? "Sending..." : "Send reply"}
        </Button>
        <p role="status" aria-live="polite" className="text-sm">
          {state.ok && <span className="text-brass">Reply sent to their inbox.</span>}
          {state.error && <span className="text-signal">{state.error}</span>}
        </p>
      </div>
    </form>
  );
}
