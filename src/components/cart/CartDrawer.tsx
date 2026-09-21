"use client";

import { useEffect, useRef } from "react";
import { products } from "@/lib/content";
import { site } from "@/lib/site";
import { useCart } from "./CartProvider";
import { Glyph } from "@/components/ui/Glyph";
import { CloseIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";

const money = (n: number) => `${site.membership.currency}${n.toFixed(2)}`;

export function CartDrawer() {
  const { isOpen, close, items, setQty, vip, setVip, unitPrice, subtotal, count } =
    useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const lines = products.filter((p) => (items[p.id] ?? 0) > 0);

  const mailto = () => {
    const body = [
      "Hi, I'd like to order:",
      "",
      ...lines.map(
        (p) =>
          `${items[p.id]} x ${p.name} (${money(unitPrice(p))} each)`,
      ),
      "",
      `Subtotal: ${money(subtotal)}${vip ? " (VIP member pricing)" : ""}`,
    ].join("\n");
    return `mailto:${site.emails.support}?subject=${encodeURIComponent(
      "Store order",
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div
      className={`fixed inset-0 z-[70] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        inert={!isOpen}
        className={`absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-3xl bg-bone text-ink shadow-2xl transition-[transform,visibility] duration-300 motion-reduce:transition-none sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[26rem] sm:rounded-none sm:rounded-l-3xl ${
          isOpen ? "visible translate-y-0 sm:translate-x-0" : "invisible translate-y-full sm:translate-x-full sm:translate-y-0"
        }`}
      >
        <header className="flex items-center justify-between px-5 py-4">
          <h2 className="text-xl font-bold tracking-tight">
            Your cart ({count})
          </h2>
          <button
            ref={closeRef}
            onClick={close}
            aria-label="Close cart"
            className="grid size-10 place-items-center rounded-full bg-ink/8 hover:bg-ink/15"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5">
          {lines.length === 0 ? (
            <p className="py-10 text-center text-ink/65">
              Your cart is empty. Pick something from the store to get started.
            </p>
          ) : (
            <ul className="divide-y divide-ink/12">
              {lines.map((p) => (
                <li key={p.id} className="flex items-center gap-4 py-4">
                  <div
                    className={`grid size-16 shrink-0 place-items-center rounded-xl bg-gradient-to-b ${p.tone}`}
                  >
                    <Glyph name={p.glyph} className="size-9 text-white/90" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{p.name}</p>
                    <p className="text-sm text-ink/65">{money(unitPrice(p))}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-ink/8 p-1">
                    <button
                      aria-label={`Remove one ${p.name}`}
                      onClick={() => setQty(p.id, items[p.id] - 1)}
                      className="grid size-8 place-items-center rounded-full hover:bg-ink/10"
                    >
                      <MinusIcon width={14} height={14} />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold tabular-nums">
                      {items[p.id]}
                    </span>
                    <button
                      aria-label={`Add one ${p.name}`}
                      onClick={() => setQty(p.id, items[p.id] + 1)}
                      className="grid size-8 place-items-center rounded-full hover:bg-ink/10"
                    >
                      <PlusIcon width={14} height={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="space-y-4 border-t border-ink/12 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={vip}
              onChange={(e) => setVip(e.target.checked)}
              className="mt-0.5 size-5 accent-crimson"
            />
            <span>
              I&apos;m a VIP member{" "}
              <span className="text-ink/60">(applies member pricing)</span>
            </span>
          </label>
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Subtotal</span>
            <span className="tabular-nums">{money(subtotal)}</span>
          </div>
          <a
            href={lines.length ? mailto() : undefined}
            aria-disabled={lines.length === 0}
            className={`flex min-h-12 items-center justify-center rounded-full bg-ink px-6 font-semibold text-white ${
              lines.length === 0 ? "pointer-events-none opacity-40" : "hover:bg-black"
            }`}
          >
            Send order request
          </a>
          <p className="text-center text-xs text-ink/55">
            Online checkout is coming soon. For now we&apos;ll confirm your order
            and payment details by email.
          </p>
        </footer>
      </aside>
    </div>
  );
}
