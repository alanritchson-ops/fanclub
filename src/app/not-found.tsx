import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="grid min-h-svh place-items-center bg-gradient-to-b from-oxblood to-ink px-5 text-center text-bone">
      <div>
        <p className="display text-[clamp(6rem,30vw,16rem)]">404</p>
        <p className="mt-2 text-xl text-bone/80">
          This page went off the grid, Reacher style.
        </p>
        <LinkButton href="/" variant="light" className="mt-8">
          Back to the home page
        </LinkButton>
      </div>
    </section>
  );
}
