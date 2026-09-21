"use client";

import Link from "next/link";
import type { Product } from "@/lib/content";
import { site } from "@/lib/site";
import { useCart } from "@/components/cart/CartProvider";
import { HeartIcon } from "@/components/ui/icons";

const money = (n: number) => `${site.membership.currency}${n}`;

export function ProductActions({ product }: { product: Product }) {
  const { add, vip } = useCart();
  const locked = product.vipOnly && !vip;

  return (
    <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
      <p className="text-sm leading-snug">
        {product.vipOnly ? (
          <>
            <span className="text-base font-semibold">{money(product.price)}</span>
            <br />
            <span className="text-bone/60">VIP members only</span>
          </>
        ) : vip && product.vipPrice ? (
          <>
            <span className="text-base font-semibold">{money(product.vipPrice)}</span>{" "}
            <s className="text-bone/50">{money(product.price)}</s>
            <br />
            <span className="text-bone/60">VIP price</span>
          </>
        ) : (
          <>
            <span className="text-base font-semibold">{money(product.price)}</span>
            {product.vipPrice && (
              <>
                <br />
                <span className="text-bone/60">{money(product.vipPrice)} for VIP</span>
              </>
            )}
          </>
        )}
      </p>

      {locked ? (
        <Link
          href="/join"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/35 px-4 py-2.5 text-sm font-semibold hover:bg-white/10 xl:shrink-0"
        >
          Join to unlock
        </Link>
      ) : (
        <button
          onClick={() => add(product.id)}
          aria-label={`Add ${product.name} to cart`}
          className="min-h-11 rounded-full bg-bone px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white xl:shrink-0"
        >
          Add to cart
        </button>
      )}
    </div>
  );
}

export function SaveButton({ product }: { product: Product }) {
  const { saved, toggleSaved } = useCart();
  const on = saved.includes(product.id);
  return (
    <button
      onClick={() => toggleSaved(product.id)}
      aria-pressed={on}
      aria-label={`${on ? "Remove" : "Save"} ${product.name} ${on ? "from" : "to"} saved items`}
      className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-black/35 text-white backdrop-blur hover:bg-black/55"
    >
      <HeartIcon filled={on} width={18} height={18} />
    </button>
  );
}

export function VipToggle() {
  const { vip, setVip } = useCart();
  return (
    <label className="flex w-fit cursor-pointer items-center gap-3 rounded-full border border-white/25 py-2 pl-4 pr-5 text-sm font-medium">
      <input
        type="checkbox"
        checked={vip}
        onChange={(e) => setVip(e.target.checked)}
        className="size-5 accent-crimson"
      />
      I&apos;m a VIP member
    </label>
  );
}
