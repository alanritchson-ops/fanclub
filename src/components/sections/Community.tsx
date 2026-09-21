import { safety } from "@/lib/content";
import { publicImage } from "@/lib/image";
import { site } from "@/lib/site";
import { LinkButton } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CheckIcon } from "@/components/ui/icons";
import { Gallery, type Frame } from "./Gallery";

export function Community() {
  // Drop fan photos at /public/images/fans/1.jpg ... 8.jpg to fill the wall
  const frames: Frame[] = Array.from({ length: 8 }, (_, i) => ({
    src: publicImage(`/images/fans/${i + 1}.jpg`),
    alt: `Fan photo ${i + 1}`,
  }));

  const report = `mailto:${site.emails.report}?subject=${encodeURIComponent("Impersonator report")}`;
  const submit = `mailto:${site.emails.support}?subject=${encodeURIComponent("Fan photo submission")}`;

  return (
    <section
      id="community"
      aria-labelledby="community-title"
      className="bg-ink text-bone"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionTitle>
              <span id="community-title">{safety.title}</span>
            </SectionTitle>
            <div className="mt-8 max-w-[52ch] space-y-5 text-lg leading-relaxed text-bone/80">
              {safety.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <a
              href={report}
              className="mt-8 inline-flex min-h-12 items-center rounded-full border border-white/35 px-6 font-semibold hover:bg-white/10"
            >
              Report an impersonator
            </a>
          </div>

          <div className="self-start rounded-3xl border border-white/15 bg-white/[.04] p-6 md:p-8">
            <h3 className="text-2xl font-semibold tracking-tight">
              House rules
            </h3>
            <ul className="mt-5 space-y-4">
              {safety.rules.map((r) => (
                <li key={r} className="flex items-start gap-3 leading-snug">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-signal text-white">
                    <CheckIcon width={14} height={14} strokeWidth={2.4} />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-24 md:mt-32">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="display text-[clamp(2.6rem,12vw,5.75rem)]">
                The fan wall.
              </h2>
              <p className="mt-5 max-w-[46ch] text-lg text-bone/70">
                Set visits, premiere-night screenings, fan art. Frames from
                members appear here.
              </p>
            </div>
            <LinkButton href={submit} variant="ghost" className="w-fit">
              Send us your photo
            </LinkButton>
          </div>
          <div className="mt-10">
            <Gallery frames={frames} />
          </div>
        </div>
      </div>
    </section>
  );
}
