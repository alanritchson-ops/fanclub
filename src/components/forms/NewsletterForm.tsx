"use client";

import { useState } from "react";
import { ArrowRight } from "@/components/ui/icons";
import { FormMessage } from "./Field";
import { useSubmit } from "./useSubmit";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const { status, submit } = useSubmit("newsletter");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const company = (new FormData(form).get("company") as string) || "";
        if (await submit({ email, company })) setEmail("");
      }}
    >
      <label htmlFor="news-email" className="mb-2 block text-sm font-medium text-bone/85">
        Stay in the loop
      </label>
      <div className="flex gap-2">
        <input
          id="news-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="min-h-12 min-w-0 flex-1 rounded-full border border-white/25 bg-black/25 px-5 text-base text-white placeholder:text-white/45 focus:border-brass focus:outline-none"
        />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
        <button
          type="submit"
          disabled={status.state === "sending"}
          aria-label="Subscribe"
          className="grid size-12 shrink-0 place-items-center rounded-full bg-bone text-ink hover:bg-white disabled:opacity-50"
        >
          <ArrowRight />
        </button>
      </div>
      <div className="mt-2">
        <FormMessage status={status} success="You're on the list. Watch your inbox." />
      </div>
    </form>
  );
}
