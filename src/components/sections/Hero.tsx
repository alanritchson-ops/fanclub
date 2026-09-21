import Image from "next/image";
import { publicImage } from "@/lib/image";
import { site } from "@/lib/site";
import { ArrowDown, StarIcon, socialIcon } from "@/components/ui/icons";

export function Hero() {
  // Drop a photo at /public/images/hero.jpg to replace the illustrated fallback
  const photo = publicImage("/images/alan.jpg");
  const rail = site.socials.slice(0, 3);

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="grain relative isolate flex min-h-svh overflow-hidden bg-[#1a0708] text-white"
    >
      {/* Background: red glow falling to black, as in the reference design */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 95% at 0% 42%, #b41f25 0%, #7d1217 30%, #3b0c10 58%, #150607 100%)",
        }}
      />

      {photo ? (
        <>
          <Image
            src={photo}
            alt="Alan Ritchson, star of Reacher"
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover object-[62%_20%] md:object-[50%_25%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(125,18,23,.75)_0%,rgba(125,18,23,0)_55%),linear-gradient(0deg,#150607_0%,rgba(21,6,7,.55)_38%,rgba(21,6,7,0)_65%)]"
          />
        </>
      ) : (
        <>
          {/* Illustrated fallback: a huge dark star, echoing the logo and the leaf shapes in the design */}
          <StarIcon
            aria-hidden
            className="absolute -right-[22%] top-[6%] -z-10 h-auto w-[105vw] rotate-[14deg] text-[#0d0405] opacity-70 md:-right-[6%] md:top-[-8%] md:w-[62vw] md:opacity-80"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,#150607_0%,rgba(21,6,7,.6)_35%,rgba(21,6,7,0)_65%)]"
          />
        </>
      )}

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col justify-end px-5 pb-8 pt-28 md:px-10 md:pb-12 xl:px-20">
        {/* Vertical social pill */}
        <ul
          aria-label="Follow the fan club"
          className="absolute left-10 top-[40%] hidden -translate-y-1/2 flex-col items-center gap-7 rounded-full border border-white/10 bg-white/12 px-6 py-8 backdrop-blur-md md:flex xl:left-20"
        >
          {rail.map((s) => {
            const Icon = socialIcon[s.label];
            return (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} (opens in a new tab)`}
                  className="block text-white/90 transition-colors hover:text-white"
                >
                  <Icon width={24} height={24} />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Stat */}
        <div
          className="rise mb-7 md:absolute md:right-10 md:top-[38%] md:mb-0 md:text-right xl:right-20"
          style={{ "--i": 4 } as React.CSSProperties}
        >
          <p className="display text-6xl md:text-7xl">4</p>
          <p className="mt-1 text-lg text-white/85 md:text-xl">
            Seasons as Jack Reacher
          </p>
        </div>

        <h1
          id="hero-title"
          className="display uppercase text-[17vw] md:text-[10vw] lg:text-[length:min(7vw,8rem)]"
        >
          <span className="sr-only">Alan Ritchson Fan Club: </span>
          <span className="rise block" style={{ "--i": 0 } as React.CSSProperties}>
            <span className="block md:inline">Where</span>{" "}
            <span className="block md:inline">action</span>
          </span>
          <span className="rise block" style={{ "--i": 1 } as React.CSSProperties}>
            <span className="block md:inline">speaks</span>{" "}
            <span className="block md:inline">volumes.</span>
          </span>
        </h1>

        <div className="mt-7 flex items-end justify-between gap-6 md:mt-10">
          <div
            className="rise flex items-start gap-6 md:gap-10"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            <span aria-hidden className="mt-3 hidden h-px w-24 shrink-0 bg-white/60 lg:block xl:w-36" />
            <p className="max-w-[40ch] text-[1.02rem] leading-snug text-white/90 md:text-lg">
              The official fan club for Alan Ritchson. Reacher, War Machine,
              Titans and the road that led here, with news, watch-alongs and a
              member pass that carries your name.
            </p>
          </div>

          <a
            href="#note"
            aria-label="Scroll to the next section"
            className="grid size-14 shrink-0 place-items-center rounded-full border border-white/70 text-white transition-colors hover:bg-white hover:text-ink md:absolute md:bottom-12 md:right-10 md:size-20 xl:right-20"
          >
            <ArrowDown width={26} height={26} />
          </a>
        </div>

        <p className="mt-5 hidden text-right text-xl leading-tight text-white/90 lg:absolute lg:bottom-40 lg:right-10 lg:block xl:right-20">
          Reacher Season 4
          <br />
          Now on Prime Video
        </p>
      </div>
    </section>
  );
}
