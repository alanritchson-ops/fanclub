import Image from "next/image";
import { representation, team } from "@/lib/content";
import { publicImage } from "@/lib/image";
import { SectionTitle } from "@/components/ui/SectionTitle";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
}

export function Team() {
  return (
    <section id="team" aria-labelledby="team-title" className="bg-bone text-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <SectionTitle>
          <span id="team-title">The team.</span>
        </SectionTitle>
        <p className="mt-6 max-w-[52ch] text-lg text-ink/70">
          The club is run by Alan&apos;s management. These are the people behind
          his career and the companies that represent him.
        </p>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => {
            const photo = publicImage(`/images/team/${m.id}.jpg`);
            return (
              <li key={m.id}>
                <article>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-b from-crimson to-oxblood">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={`${m.name}, ${m.role} at ${m.org}`}
                        fill
                        sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="display absolute inset-0 grid place-items-center text-[5rem] text-bone/90"
                      >
                        {initials(m.name)}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">{m.name}</h3>
                  <p className="text-sm font-medium text-crimson">
                    {m.role}, {m.org}
                  </p>
                  <p className="mt-2 text-sm text-ink/70">{m.bio}</p>
                </article>
              </li>
            );
          })}
        </ul>

        <dl className="mt-14 divide-y divide-ink/15 border-y border-ink/15">
          {representation.map((r) => (
            <div key={r.role} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="text-ink/55">{r.role}</dt>
              <dd className="font-medium">{r.org}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
