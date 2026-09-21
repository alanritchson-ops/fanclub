import Image from "next/image";
import Link from "next/link";
import { alsoSeenIn, posters } from "@/lib/content";
import { publicImage } from "@/lib/image";
import { site } from "@/lib/site";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StarIcon } from "@/components/ui/icons";

const starPos = [
  "-right-10 -top-6 w-3/4 rotate-12",
  "-left-8 top-10 w-2/3 -rotate-12",
  "-right-6 top-16 w-2/3 rotate-[24deg]",
  "-left-10 -top-4 w-3/4 rotate-6",
  "-right-12 top-8 w-3/4 -rotate-[18deg]",
];

export function Screen() {
  return (
    <section id="screen" aria-labelledby="screen-title" className="bg-bone text-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <SectionTitle>
          <span id="screen-title">Most watched.</span>
        </SectionTitle>
        <p className="mt-6 max-w-[46ch] text-lg text-ink/70">
          Where to find the roles fans come back to most.
        </p>

        <ul className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-5">
          {posters.map((p, i) => {
            const image = publicImage(p.image);
            return (
              <li
                key={p.id}
                className="basis-[70%] shrink-0 snap-start sm:basis-[44%] md:basis-auto"
              >
                <article>
                  <div
                    className={`relative aspect-[2/3] overflow-hidden rounded-2xl ${p.className}`}
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={`${p.title} poster`}
                        fill
                        sizes="(min-width:1024px) 20vw, (min-width:768px) 33vw, 70vw"
                        className="object-cover"
                      />
                    ) : (
                      <>
                        <StarIcon
                          aria-hidden
                          className={`pointer-events-none absolute h-auto opacity-[.12] ${starPos[i % starPos.length]}`}
                        />
                        <h3 className="display absolute inset-x-5 bottom-5 text-[2.1rem] uppercase md:text-[1.6rem] xl:text-[1.9rem] 2xl:text-[2.4rem]">
                          {p.title}
                        </h3>
                      </>
                    )}
                  </div>
                  <div className="mt-4">
                    {image && (
                      <h3 className="display text-2xl uppercase md:text-xl xl:text-2xl">
                        {p.title}
                      </h3>
                    )}
                    <p className="mt-1 text-sm font-medium text-ink/80">as {p.role}</p>
                    <p className="mt-1 text-sm text-ink/60">
                      {p.where} · {p.years}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-col gap-4 border-t border-ink/15 pt-6 text-ink/75 md:flex-row md:items-center md:justify-between">
          <p>
            <span className="font-semibold text-ink">Also seen in:</span>{" "}
            {alsoSeenIn.join(", ")}.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/filmography"
              className="font-semibold text-crimson underline decoration-2 underline-offset-4 hover:text-oxblood"
            >
              Full Alan Ritchson filmography
            </Link>
            <a
              href={site.imdb}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-crimson underline decoration-2 underline-offset-4 hover:text-oxblood"
            >
              Full filmography on IMDb
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
