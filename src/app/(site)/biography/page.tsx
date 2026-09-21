import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { LinkButton } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { roots, timeline } from "@/lib/content";
import { breadcrumbLd, personLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Alan Ritchson Biography: Life, Career & Reacher" },
  description:
    "Alan Ritchson's biography: born in Grand Forks, raised in Niceville, then American Idol, Smallville, Titans and the title role in Reacher. His career timeline.",
  alternates: { canonical: "/biography" },
};

export default function BiographyPage() {
  return (
    <>
      <JsonLd
        data={[personLd, breadcrumbLd([{ name: "Biography", path: "/biography" }])]}
      />
      <section className="bg-gradient-to-b from-oxblood via-wine to-ink text-bone">
        <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40 xl:px-20">
          <nav aria-label="Breadcrumb" className="text-sm text-bone/65">
            <Link href="/" className="hover:underline">Home</Link> / Biography
          </nav>
          <SectionTitle as="h1" className="mt-6 max-w-[14ch]">
            Alan Ritchson biography.
          </SectionTitle>
          <p className="mt-6 max-w-[56ch] text-lg text-bone/80">
            From a military family in North Dakota to the title role in Prime Video&apos;s{" "}
            <Link href="/filmography" className="underline underline-offset-4">Reacher</Link>:
            how Alan Ritchson&apos;s career took shape.
          </p>
        </div>
      </section>

      <section className="bg-ink text-bone">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[1fr_1fr] lg:gap-20 xl:px-20">
          <div>
            <h2 className="display text-[clamp(2.2rem,8vw,4rem)]">{roots.title}</h2>
            <div className="mt-8 max-w-[58ch] space-y-5 text-lg leading-relaxed text-bone/80">
              {roots.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <dl className="divide-y divide-white/15 self-start border-y border-white/15">
            {roots.facts.map((f) => (
              <div key={f.label} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <dt className="text-bone/55">{f.label}</dt>
                <dd className="font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-bone text-ink">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 xl:px-20">
          <h2 className="display text-[clamp(2.2rem,8vw,4rem)]">Career timeline.</h2>
          <ol className="mt-10 border-t border-ink/15">
            {timeline.map((m) => (
              <li
                key={m.year}
                className="grid gap-3 border-b border-ink/15 py-8 md:grid-cols-[9rem_1fr_1.2fr] md:gap-10"
              >
                <p className="display text-5xl text-crimson">{m.year}</p>
                <h3 className="text-2xl font-semibold leading-tight tracking-tight">{m.title}</h3>
                <p className="max-w-[52ch] leading-relaxed text-ink/75">{m.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap gap-4">
            <LinkButton href="/filmography" variant="dark">See the full filmography</LinkButton>
            <LinkButton href="/join" variant="solid">Join the VIP club</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
