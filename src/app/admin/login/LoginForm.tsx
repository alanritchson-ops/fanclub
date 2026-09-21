"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/forms/Field";
import { loginAction, type FormState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, {});

  return (
    <form action={action} className="space-y-5">
      <Field label="Email">
        {(id) => (
          <input id={id} name="email" type="email" required autoComplete="username" className={inputClass} />
        )}
      </Field>
      <Field label="Password">
        {(id) => (
          <input
            id={id}
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={inputClass}
          />
        )}
      </Field>
      <Button type="submit" variant="light" disabled={pending} className="w-full">
        {pending ? "Signing in..." : "Sign in"}
      </Button>
      <p role="alert" aria-live="polite" className="min-h-6 text-sm text-signal">
        {state.error}
      </p>
    </form>
  );
}
