"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { StarIcon } from "@/components/ui/icons";

// Fixed bar widths so the barcode is stable between renders
const bars = [3, 1, 2, 1, 4, 1, 1, 3, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 1, 4, 2, 1, 3, 1, 2, 1, 4, 1, 3, 2, 1];

export function PassCard({ name }: { name: string }) {
  const [flipped, setFlipped] = useState(false);
  const display = name.trim() || "Your name";

  return (
    <div className="mx-auto w-full max-w-[26rem]">
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={`Membership pass for ${display}. ${flipped ? "Showing the back" : "Showing the front"}. Activate to flip.`}
        data-flipped={flipped}
        className="flip block w-full rounded-[1.4rem] text-left"
      >
        <span className="flip-inner relative block aspect-[1.586] w-full">
          {/* Front */}
          <span
            aria-hidden={flipped}
            className="flip-face absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[1.4rem] border border-brass/60 bg-gradient-to-br from-[#5a0d12] via-[#2a0b0e] to-[#120607] p-5 text-bone shadow-[0_30px_60px_-20px_rgba(0,0,0,.7)] sm:p-6"
          >
            <StarIcon
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-auto w-[62%] rotate-12 text-brass/15"
            />
            <span className="relative flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold tracking-tight">
                <StarIcon width={18} height={18} className="text-brass" />
                {site.clubName}
              </span>
              <span className="rounded-full border border-brass/60 px-3 py-1 text-xs font-semibold text-brass">
                VIP Gold
              </span>
            </span>
            <span className="relative">
              <span className="display block break-words text-[clamp(1.6rem,7vw,2.2rem)]">
                {display}
              </span>
              <span className="mt-2 flex items-center justify-between text-sm text-bone/70">
                <span>Preview pass</span>
                <span className="tabular-nums">No. 000000</span>
              </span>
            </span>
          </span>

          {/* Back */}
          <span
            aria-hidden={!flipped}
            className="flip-face flip-back absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[1.4rem] bg-paper p-5 text-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,.7)] sm:p-6"
          >
            <span className="text-xs leading-relaxed text-ink/75 sm:text-[0.8rem]">
              This pass grants entry to the private community, member drops and
              club events. Non-transferable. Lifetime membership, no renewals.
              The official Alan Ritchson fan club.
            </span>
            <span>
              <span
                aria-hidden
                className="flex h-10 items-stretch gap-[3px] sm:h-12"
              >
                {bars.map((w, i) => (
                  <span
                    key={i}
                    className="bg-ink"
                    style={{ width: `${w * 1.6}px` }}
                  />
                ))}
              </span>
              <span className="mt-2 flex justify-between text-xs text-ink/70">
                <span>{site.domain}</span>
                <span className="tabular-nums">000000</span>
              </span>
            </span>
          </span>
        </span>
      </button>
      <p className="mt-4 text-center text-sm text-bone/65">
        Tap the pass to flip it
      </p>
    </div>
  );
}
