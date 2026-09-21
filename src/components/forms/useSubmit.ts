"use client";

import { useState } from "react";

export type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "done" }
  | { state: "error"; message: string };

export function useSubmit(type: "join" | "newsletter" | "contact") {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  /** Resolves to the response body on success, or false on failure. */
  async function submit(payload: Record<string, unknown>): Promise<Record<string, unknown> | false> {
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({
          state: "error",
          message: data?.error ?? "Something went wrong. Please try again.",
        });
        return false;
      }
      setStatus({ state: "done" });
      return data as Record<string, unknown>;
    } catch {
      setStatus({
        state: "error",
        message: "We couldn't reach the server. Check your connection and try again.",
      });
      return false;
    }
  }

  return { status, submit, reset: () => setStatus({ state: "idle" }) };
}
