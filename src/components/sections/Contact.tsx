import { site } from "@/lib/site";
import { LinkButton } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ArrowRight, socialIcon } from "@/components/ui/icons";

export function ContactBlock() {
  const rows = [
    { label: "Fan support", email: site.emails.support, note: "Membership and order help. We reply within two business days." },
    { label: "Press and partnerships", email: site.emails.press, note: "Interviews, collaborations and community projects." },
    { label: "Report an impersonator", email: site.emails.report, note: "Screenshots and account links help us warn others." },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-gradient-to-b from-[#2a0709] to-oxblood text-bone"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <SectionTitle>
              <span id="contact-title">Get in touch.</span>
            </SectionTitle>
            <p className="mt-6 max-w-[42ch] text-lg text-bone/80">
              The club team handles fan support, press and partnerships. For
              bookings and business enquiries, please contact Alan&apos;s
              representatives directly.
            </p>
            <ul className="mt-8 flex gap-3" aria-label="Follow the fan club">
              {site.socials.map((s) => {
                const Icon = socialIcon[s.label];
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} (opens in a new tab)`}
                      className="grid size-12 place-items-center rounded-full border border-white/30 hover:bg-white/10"
                    >
                      <Icon />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <ul className="divide-y divide-white/15 border-y border-white/15">
              {rows.map((r) => (
                <li key={r.label} className="py-6">
                  <p className="text-bone/60">{r.label}</p>
                  <a
                    href={`mailto:${r.email}`}
                    className="mt-1 block break-all text-[1.35rem] font-semibold tracking-tight underline-offset-4 hover:underline sm:text-2xl"
                  >
                    {r.email}
                  </a>
                  <p className="mt-1 text-sm text-bone/65">{r.note}</p>
                </li>
              ))}
            </ul>
            <LinkButton href="/contact" variant="light" className="mt-8">
              Go to contact page <ArrowRight width={18} height={18} />
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
