import { roots, timeline } from "@/lib/content";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Roots() {
  return (
    <section id="roots" aria-labelledby="roots-title" className="bg-ink text-bone">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <SectionTitle>
            <span id="roots-title">{roots.title}</span>
          </SectionTitle>
          <div>
            <div className="max-w-[58ch] space-y-5 text-lg leading-relaxed text-bone/80">
              {roots.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <dl className="mt-10 divide-y divide-white/15 border-y border-white/15">
              {roots.facts.map((f) => (
                <div
                  key={f.label}
                  className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6"
                >
                  <dt className="text-bone/55">{f.label}</dt>
                  <dd className="font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-24 md:mt-32">
          <h2 className="display text-balance text-[clamp(2.6rem,12vw,5.75rem)]">
            The long way here.
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg text-bone/70">
            A career doesn&apos;t happen in a straight line. Here&apos;s the
            version with the milestones left in.
          </p>

          <ol className="mt-12 border-t border-white/15">
            {timeline.map((m) => (
              <li
                key={m.year}
                className="grid gap-3 border-b border-white/15 py-8 md:grid-cols-[11rem_1fr_1.2fr] md:gap-10 md:py-10"
              >
                <p className="display text-5xl text-signal md:text-6xl">{m.year}</p>
                <h3 className="text-2xl font-semibold leading-tight tracking-tight md:text-[1.75rem]">
                  {m.title}
                </h3>
                <p className="max-w-[52ch] text-base leading-relaxed text-bone/75">
                  {m.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
