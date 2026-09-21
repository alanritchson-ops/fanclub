"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products, type Product } from "@/lib/content";

type Items = Record<string, number>;

type CartContextValue = {
  items: Items;
  saved: string[];
  vip: boolean;
  isOpen: boolean;
  count: number;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  toggleSaved: (id: string) => void;
  setVip: (v: boolean) => void;
  open: () => void;
  close: () => void;
  unitPrice: (p: Product) => number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const KEY = "arfc:cart:v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Items>({});
  const [saved, setSaved] = useState<string[]>([]);
  const [vip, setVipState] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage after mount (avoids a hydration mismatch)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (data.items) setItems(data.items);
          if (Array.isArray(data.saved)) setSaved(data.saved);
          if (typeof data.vip === "boolean") setVipState(data.vip);
        }
      } catch {
        /* storage unavailable or corrupt: start fresh */
      }
      setHydrated(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ items, saved, vip }));
    } catch {
      /* ignore */
    }
  }, [items, saved, vip, hydrated]);

  const add = useCallback((id: string) => {
    setItems((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    setOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = Math.min(qty, 9);
      return next;
    });
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const setVip = useCallback((v: boolean) => setVipState(v), []);

  const unitPrice = useCallback(
    (p: Product) => (vip && p.vipPrice != null ? p.vipPrice : p.price),
    [vip],
  );

  const value = useMemo<CartContextValue>(() => {
    const count = Object.values(items).reduce((a, b) => a + b, 0);
    const subtotal = products.reduce(
      (sum, p) => sum + (items[p.id] ?? 0) * unitPrice(p),
      0,
    );
    return {
      items,
      saved,
      vip,
      isOpen,
      count,
      add,
      setQty,
      toggleSaved,
      setVip,
      open: () => setOpen(true),
      close: () => setOpen(false),
      unitPrice,
      subtotal,
    };
  }, [items, saved, vip, isOpen, add, setQty, toggleSaved, setVip, unitPrice]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
