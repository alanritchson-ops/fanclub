import Image from "next/image";
import { note } from "@/lib/content";
import { publicImage } from "@/lib/image";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StarIcon } from "@/components/ui/icons";

export function Note() {
  const photo = publicImage("/images/alan2.jpeg");

  return (
    <section id="note" aria-labelledby="note-title" className="bg-bone text-ink">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[1.3fr_1fr] lg:gap-20 xl:px-20">
        <div>
          <SectionTitle className="max-w-[12ch]">
            <span id="note-title">{note.title}</span>
          </SectionTitle>
          <div className="mt-10 max-w-[60ch] space-y-6 font-serif text-[1.2rem] leading-[1.7] text-ink/85 md:text-[1.3rem]">
            {note.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="pt-2 italic text-ink">{note.closing}</p>
            <p className="-mt-3 font-sans text-lg font-semibold not-italic">
              {note.signoff}
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-b from-crimson to-oxblood">
            {photo ? (
              <Image
                src={photo}
                alt="Alan Ritchson"
                fill
                sizes="(min-width:1024px) 40vw, 100vw"
                className="object-cover object-[20_10]"
              />
            ) : (
              <>
                <StarIcon
                  aria-hidden
                  className="absolute -right-12 -top-10 h-auto w-[85%] rotate-12 text-black/25"
                />
                <p className="display absolute bottom-7 left-7 max-w-[8ch] text-[3.4rem] text-bone">
                  For the fans.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
