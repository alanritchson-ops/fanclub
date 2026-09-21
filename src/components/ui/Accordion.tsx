"use client";

import { useId, useState } from "react";
import { MinusIcon, PlusIcon } from "./icons";

export type AccordionItem = { title: string; content: React.ReactNode };

export function Accordion({
  items,
  tone = "dark",
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  tone?: "dark" | "light";
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const uid = useId();
  const light = tone === "light";

  return (
    <div
      className={`divide-y border-y ${
        light ? "divide-ink/15 border-ink/15" : "divide-white/15 border-white/15"
      }`}
    >
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${uid}-b${i}`;
        const panelId = `${uid}-p${i}`;
        return (
          <div key={item.title}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-16 w-full items-center justify-between gap-6 py-4 text-left text-lg font-semibold tracking-tight sm:text-xl"
              >
                <span>{item.title}</span>
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full border ${
                    light ? "border-ink/30" : "border-white/30"
                  }`}
                >
                  {isOpen ? (
                    <MinusIcon width={16} height={16} />
                  ) : (
                    <PlusIcon width={16} height={16} />
                  )}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              data-open={isOpen}
              className="acc-panel"
              inert={!isOpen}
            >
              <div>
                <div
                  className={`pb-6 pr-12 text-base leading-relaxed ${
                    light ? "text-ink/75" : "text-bone/75"
                  }`}
                >
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
