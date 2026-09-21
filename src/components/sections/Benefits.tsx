import { benefits } from "@/lib/content";
import { Accordion } from "@/components/ui/Accordion";
import { LinkButton } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Benefits() {
  const items = benefits.map((b) => ({
    title: b.title,
    content: (
      <ul className="list-disc space-y-2 pl-5 marker:text-crimson">
        {b.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    ),
  }));

  return (
    <section id="benefits" aria-labelledby="benefits-title" className="bg-bone text-ink">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[1fr_1.15fr] lg:gap-20 xl:px-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionTitle>
            <span id="benefits-title">VIP fan club benefits.</span>
          </SectionTitle>
          <p className="mt-6 max-w-[42ch] text-lg text-ink/70">
            Seven kinds of access, all included from day one. No tiers to
            decode.
          </p>
          <LinkButton href="/join" variant="dark" className="mt-8">
            Join the club
          </LinkButton>
        </div>
        <Accordion items={items} tone="light" />
      </div>
    </section>
  );
}
