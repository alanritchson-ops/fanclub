"use client";

import { useId, useState } from "react";
import { passPerks } from "@/lib/content";
import { otherPaymentHref, vipPriceLabel } from "@/lib/site";
import { LinkButton } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CheckIcon } from "@/components/ui/icons";
import { Countdown } from "./Countdown";
import { PassCard } from "./PassCard";

export function Pass() {
  const [name, setName] = useState("");
  const inputId = useId();

  return (
    <section
      id="pass"
      aria-labelledby="pass-title"
      className="grain relative isolate overflow-hidden bg-gradient-to-b from-oxblood to-[#2a0709] text-bone"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="order-2 lg:order-1">
            <PassCard name={name} />
            <div className="mx-auto mt-8 max-w-[26rem]">
              <label htmlFor={inputId} className="text-sm font-medium text-bone/80">
                Preview it with your name
              </label>
              <input
                id={inputId}
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 28))}
                placeholder="Your name"
                autoComplete="name"
                className="mt-2 min-h-12 w-full rounded-full border border-white/25 bg-black/25 px-5 text-base text-white placeholder:text-white/45 focus:border-brass focus:outline-none"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <SectionTitle>
              <span id="pass-title">The pass is the point.</span>
            </SectionTitle>
            <p className="mt-6 max-w-[48ch] text-lg text-bone/80">
              One card, issued the day you join. It&apos;s your badge in the
              community and your proof of entry at member events. Every benefit
              comes with it. One payment of {vipPriceLabel} for lifetime VIP, paid in
              Bitcoin. Prefer another way to pay?{" "}
              <a href={otherPaymentHref} className="underline underline-offset-4 hover:text-white">
                Email us
              </a>{" "}
              for other options.
            </p>
            <ul className="mt-8 space-y-3">
              {passPerks.map((p) => (
                <li key={p} className="flex items-start gap-3 text-base">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brass text-ink">
                    <CheckIcon width={14} height={14} strokeWidth={2.4} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <LinkButton href="/join" variant="light" className="mt-9">
              Join the club
            </LinkButton>
          </div>
        </div>

        <div className="mt-16 border-t border-white/15 pt-10 md:mt-24">
          <Countdown />
        </div>
      </div>
    </section>
  );
}
