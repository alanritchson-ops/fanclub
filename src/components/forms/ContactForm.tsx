"use client";

import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Honeypot, inputClass } from "./Field";
import { useSubmit } from "./useSubmit";

const topics = ["Fan support", "Press and partnerships", "Report an impersonator", "Something else"];

export function ContactForm() {
  const { status, submit } = useSubmit("contact");

  return (
    <form
      className="relative space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const ok = await submit({
          name: fd.get("name"),
          email: fd.get("email"),
          topic: fd.get("topic"),
          message: fd.get("message"),
          company: fd.get("company"),
        });
        if (ok) form.reset();
      }}
    >
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name">
          {(id) => (
            <input id={id} name="name" required autoComplete="name" className={inputClass} />
          )}
        </Field>
        <Field label="Email">
          {(id) => (
            <input id={id} name="email" type="email" required autoComplete="email" className={inputClass} />
          )}
        </Field>
      </div>
      <Field label="What's it about?">
        {(id) => (
          <select id={id} name="topic" defaultValue={topics[0]} className={inputClass}>
            {topics.map((t) => (
              <option key={t} className="text-ink">
                {t}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field label="Message">
        {(id) => (
          <textarea
            id={id}
            name="message"
            required
            rows={6}
            minLength={10}
            className={`${inputClass} py-3`}
          />
        )}
      </Field>
      <Button type="submit" variant="light" disabled={status.state === "sending"}>
        {status.state === "sending" ? "Sending..." : "Send message"}
      </Button>
      <FormMessage
        status={status}
        success="Thanks, your message is in. We reply within two business days."
      />
    </form>
  );
}
