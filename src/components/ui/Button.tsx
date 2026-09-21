import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "solid" | "light" | "ghost" | "dark";

const variants: Record<Variant, string> = {
  solid: "bg-crimson text-white hover:bg-signal",
  light: "bg-bone text-ink hover:bg-white",
  dark: "bg-ink text-white hover:bg-black",
  ghost:
    "border border-current/40 text-current hover:border-current hover:bg-white/5",
};

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-semibold tracking-tight transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export function LinkButton({
  variant = "solid",
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "solid",
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
