"use client";

import { useState } from "react";
import { otherPaymentHref, vipPriceLabel } from "@/lib/site";
import { passPerks } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { PassCard } from "@/components/sections/PassCard";
import { Field, FormMessage, Honeypot, inputClass } from "./Field";
import { useSubmit } from "./useSubmit";

export function JoinForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [agree, setAgree] = useState(false);
  const { status, submit } = useSubmit("join");

  return (
    <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
      <div>
        <form
            className="relative space-y-5"
            onSubmit={async (e) => {
              e.preventDefault();
              const company = (new FormData(e.currentTarget).get("company") as string) || "";
              const res = await submit({ name, email, country, agree, company });
              // Hand off to BTCPay's hosted checkout to pay in Bitcoin
              if (res && typeof res.checkoutUrl === "string") {
                window.location.assign(res.checkoutUrl);
              }
            }}
          >
            <Honeypot />
            <Field label="Full name">
              {(id) => (
                <input
                  id={id}
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 28))}
                  required
                  autoComplete="name"
                  className={inputClass}
                />
              )}
            </Field>
            <Field label="Email">
              {(id) => (
                <input
                  id={id}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={inputClass}
                />
              )}
            </Field>
            <Field label="Country" hint="(optional)">
              {(id) => (
                <input
                  id={id}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  autoComplete="country-name"
                  className={inputClass}
                />
              )}
            </Field>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-bone/80">
              <input
                type="checkbox"
                required
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 size-5 shrink-0 accent-crimson"
              />
              <span>
                I understand this club is not affiliated with any studio or
                network, and I agree to the fan club terms.
              </span>
            </label>
            <Button type="submit" variant="light" disabled={status.state === "sending" || status.state === "done"} className="w-full sm:w-auto">
              {status.state === "sending" || status.state === "done"
                ? "Opening checkout..."
                : `Pay ${vipPriceLabel} in Bitcoin`}
            </Button>
            <p className="text-sm text-bone/65">
              One payment, lifetime VIP. You&apos;ll be taken to a secure Bitcoin checkout, and your
              numbered pass is emailed as soon as the payment confirms.
            </p>
            <p className="text-sm text-bone/65">
              Don&apos;t want to pay in Bitcoin?{" "}
              <a href={otherPaymentHref} className="font-semibold text-bone underline underline-offset-4">
                Email us for another payment option
              </a>
              .
            </p>
            <FormMessage status={status} success="" />
        </form>

        <ul className="mt-10 space-y-3 border-t border-white/15 pt-8">
          {passPerks.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brass text-ink">
                <CheckIcon width={14} height={14} strokeWidth={2.4} />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <PassCard name={name} />
      </div>
    </div>
  );
}
