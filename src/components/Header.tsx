"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { useCart } from "@/components/cart/CartProvider";
import {
  ArrowRight,
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  StarIcon,
  UserIcon,
  socialIcon,
} from "@/components/ui/icons";

const sectionIds = nav.filter((n) => n.id !== "top" && n.id !== "note").map((n) => n.id);

export function Header() {
  const pathname = usePathname();
  const { count, saved, open: openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState("top");

  // Track scroll position and the section currently in view (home page only)
  useEffect(() => {
    let raf = 0;
    const update = () => {
      setScrolled(window.scrollY > 24);
      if (pathname !== "/") return;
      let current = "top";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) {
          current = id;
        }
      }
      setSection(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Lock scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const active =
    pathname === "/" ? section : pathname === "/contact" ? "contact" : "";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 motion-reduce:transition-none ${
          scrolled ? "bg-ink/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-3.5 md:px-10 xl:px-20 xl:py-5">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-white"
            aria-label={`${site.name} fan club, home`}
          >
            <span className="text-xl font-semibold tracking-tight sm:text-[1.4rem]">
              {site.name}
            </span>
          </Link>

          {/* Desktop pill nav */}
          <nav
            aria-label="Primary"
            className="absolute left-1/2 hidden -translate-x-1/2 xl:block"
          >
            <ul className="flex items-center gap-0.5 rounded-full bg-white p-1 shadow-[0_0_0_3px_rgba(255,255,255,.35)]">
              {nav
                .filter((n) => n.pill)
                .map((n) => {
                  const isActive = active === n.id;
                  return (
                    <li key={n.id}>
                      <Link
                        href={n.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`block rounded-full px-4 py-2.5 text-[0.9rem] font-medium tracking-tight transition-colors ${
                          isActive
                            ? "bg-oxblood text-white"
                            : "text-ink hover:bg-ink/6"
                        }`}
                      >
                        {n.label}
                      </Link>
                    </li>
                  );
                })}
              <li>
                <Link
                  href="/join"
                  className="ml-0.5 flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.9rem] font-medium tracking-tight text-white transition-colors hover:bg-black"
                >
                  Join VIP <ArrowRight width={16} height={16} />
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Cart: pill on desktop, round icon on mobile */}
            <button
              onClick={openCart}
              aria-label={`Open cart, ${count} items`}
              className="relative hidden h-11 items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 text-sm font-medium text-white backdrop-blur hover:bg-black/50 xl:flex"
            >
              <BagIcon width={18} height={18} />
              Cart ({count})
            </button>
            <button
              onClick={openCart}
              aria-label={`Open cart, ${count} items`}
              className="relative grid size-11 place-items-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur xl:hidden"
            >
              <BagIcon />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-signal px-1 text-[0.7rem] font-bold leading-5 text-white">
                  {count}
                </span>
              )}
            </button>

            <Link
              href="/#store"
              aria-label={`Saved items, ${saved.length}`}
              className="relative hidden size-11 place-items-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur hover:bg-black/50 xl:grid"
            >
              <HeartIcon filled={saved.length > 0} />
            </Link>
            <Link
              href="/join"
              aria-label="Your membership"
              className="hidden size-11 place-items-center rounded-full border border-white/15 bg-white/12 text-white backdrop-blur hover:bg-white/20 xl:grid"
            >
              <UserIcon />
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid size-11 place-items-center rounded-full bg-white text-ink xl:hidden"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        inert={!menuOpen}
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[60] flex flex-col bg-gradient-to-b from-oxblood via-wine to-ink px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3.5 transition-[transform,visibility] duration-500 ease-[cubic-bezier(.2,.7,.1,1)] motion-reduce:transition-none md:px-10 xl:hidden ${
          menuOpen ? "visible translate-y-0" : "invisible -translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2.5 text-white">
            <StarIcon width={30} height={30} />
            <span className="text-xl font-semibold tracking-tight">{site.name}.</span>
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="grid size-11 place-items-center rounded-full bg-white text-ink"
          >
            <CloseIcon />
          </button>
        </div>

        <nav aria-label="Mobile" className="mt-8 flex-1 overflow-y-auto">
          <ul>
            {nav.map((n) => (
              <li key={n.id} className="border-b border-white/12">
                <Link
                  href={n.href}
                  onClick={() => setMenuOpen(false)}
                  className={`display flex items-center justify-between py-4 text-[2.4rem] ${
                    active === n.id ? "text-signal" : "text-white"
                  }`}
                >
                  {n.label}
                  <ArrowRight width={26} height={26} className="opacity-60" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 space-y-5">
          <Link
            href="/join"
            onClick={() => setMenuOpen(false)}
            className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-white text-lg font-semibold text-ink"
          >
            Join VIP <ArrowRight width={18} height={18} />
          </Link>
          <ul className="flex justify-center gap-3">
            {site.socials.map((s) => {
              const Icon = socialIcon[s.label];
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label} (opens in a new tab)`}
                    className="grid size-12 place-items-center rounded-full border border-white/25 text-white"
                  >
                    <Icon />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
