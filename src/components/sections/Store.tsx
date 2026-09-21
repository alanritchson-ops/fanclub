import Image from "next/image";
import { products } from "@/lib/content";
import { publicImage } from "@/lib/image";
import { Glyph } from "@/components/ui/Glyph";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductActions, SaveButton, VipToggle } from "./ProductActions";

export function Store() {
  return (
    <section id="store" aria-labelledby="store-title" className="bg-ink text-bone">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 xl:px-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionTitle>
              <span id="store-title">Shop the collection.</span>
            </SectionTitle>
            <p className="mt-6 max-w-[48ch] text-lg text-bone/70">
              Pieces made for the club, in limited runs. VIP members get
              member pricing and first notice on every drop.
            </p>
          </div>
          <VipToggle />
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5">
          {products.map((p) => {
            const photo = publicImage(`/images/store/${p.id}.webp`);
            return (
              <li key={p.id}>
                <div
                  className={`relative grid aspect-square place-items-center overflow-hidden rounded-2xl bg-gradient-to-b ${p.tone}`}
                >
                  {photo ? (
                    <Image
                      src={photo}
                      alt={p.name}
                      fill
                      sizes="(min-width:768px) 25vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <Glyph name={p.glyph} className="size-[46%] text-white/90" />
                  )}
                  <SaveButton product={p} />
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-tight tracking-tight">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm leading-snug text-bone/65">{p.blurb}</p>
                <ProductActions product={p} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
