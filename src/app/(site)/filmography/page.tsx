import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { LinkButton } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { alsoSeenIn, posters } from "@/lib/content";
import { breadcrumbLd, filmographyLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Alan Ritchson Movies & TV Shows: Where to Watch" },
  description:
    "Alan Ritchson's filmography: Reacher, War Machine, Titans, Smallville and Blue Mountain State, with his roles, the years and where to watch each one.",
  alternates: { canonical: "/filmography" },
};

export default function FilmographyPage() {
  return (
    <>
      <JsonLd
        data={[filmographyLd, breadcrumbLd([{ name: "Filmography", path: "/filmography" }])]}
      />
      <section className="bg-gradient-to-b from-oxblood via-wine to-ink text-bone">
        <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40 xl:px-20">
          <nav aria-label="Breadcrumb" className="text-sm text-bone/65">
            <Link href="/" className="hover:underline">Home</Link> / Filmography
          </nav>
          <SectionTitle as="h1" className="mt-6 max-w-[14ch]">
            Alan Ritchson filmography.
          </SectionTitle>
          <p className="mt-6 max-w-[56ch] text-lg text-bone/80">
            Where to find the roles fans come back to most, with the character, the years and where
            to watch. Read the story behind them in the{" "}
            <Link href="/biography" className="underline underline-offset-4">biography</Link>.
          </p>
        </div>
      </section>

      <section className="bg-bone text-ink">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 xl:px-20">
          <h2 className="sr-only">Movies and TV shows</h2>
          <ul className="divide-y divide-ink/15 border-y border-ink/15">
            {posters.map((p) => (
              <li
                key={p.id}
                className="grid gap-2 py-8 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:items-baseline md:gap-8"
              >
                <h3 className="display text-4xl uppercase md:text-5xl">{p.title}</h3>
                <p>
                  <span className="text-ink/55">Role </span>
                  <span className="font-medium">{p.role}</span>
                </p>
                <p>
                  <span className="text-ink/55">Years </span>
                  <span className="font-medium">{p.years}</span>
                </p>
                <p>
                  <span className="text-ink/55">Watch on </span>
                  <span className="font-medium">{p.where}</span>
                </p>
              </li>
            ))}
          </ul>

          <h2 className="display mt-16 text-[clamp(2rem,7vw,3.5rem)]">Also seen in.</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {alsoSeenIn.map((t) => (
              <li key={t} className="rounded-full border border-ink/25 px-5 py-2">
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <a
              href={site.imdb}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-crimson underline decoration-2 underline-offset-4 hover:text-oxblood"
            >
              Complete credits on IMDb
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <LinkButton href="/join" variant="dark">Join the VIP club</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
