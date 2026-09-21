import Link from "next/link";
import { site } from "@/lib/site";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { StarIcon, socialIcon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="bg-ink text-bone">
      <div className="mx-auto max-w-[1400px] px-5 pb-10 pt-16 md:px-10 md:pt-20 xl:px-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]">
          <div className="md:col-span-3 lg:col-span-1">
            <p className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight">
              <StarIcon width={28} height={28} />
              {site.name}.
            </p>
            <p className="mt-4 max-w-[36ch] text-bone/70">
              The official fan club and store for Alan Ritchson, run by his
              management team and nowhere else.
            </p>
          </div>

          <nav aria-label="Explore">
            <h2 className="text-bone/55">Explore</h2>
            <ul className="mt-4 space-y-3">
              <li><Link href="/#store" className="hover:underline">Store</Link></li>
              <li><Link href="/#benefits" className="hover:underline">VIP benefits</Link></li>
              <li><Link href="/join" className="hover:underline">Membership</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </nav>

          <nav aria-label="Follow">
            <h2 className="text-bone/55">Follow</h2>
            <ul className="mt-4 space-y-3">
              {site.socials.map((s) => {
                const Icon = socialIcon[s.label];
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:underline"
                    >
                      <Icon width={18} height={18} />
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <NewsletterForm />
        </div>

        <p className="mt-14 rounded-2xl border border-white/15 bg-white/[.04] p-5 text-sm leading-relaxed text-bone/75">
          <strong className="font-semibold text-bone">Heads up:</strong> this is
          the official Alan Ritchson fan club. It is not affiliated with Amazon,
          Netflix or any studio.
        </p>

        <div className="mt-8 flex flex-col gap-2 text-sm text-bone/55 md:flex-row md:justify-between">
          <p>&copy; {new Date().getFullYear()} {site.clubName}. All rights reserved.</p>
          <p>Fan club terms apply. All trademarks belong to their owners.</p>
        </div>
      </div>
    </footer>
  );
}
