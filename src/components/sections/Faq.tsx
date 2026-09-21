import { faqs } from "@/lib/content";
import { Accordion } from "@/components/ui/Accordion";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-bone text-ink">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[1fr_1.4fr] lg:gap-20 xl:px-20">
        <SectionTitle>
          <span id="faq-title">Before you join.</span>
        </SectionTitle>
        <Accordion
          tone="light"
          defaultOpen={0}
          items={faqs.map((f) => ({
            title: f.q,
            content: <p className="max-w-[58ch]">{f.a}</p>,
          }))}
        />
      </div>
    </section>
  );
}
