"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { StarIcon, CloseIcon, ArrowRight } from "@/components/ui/icons";

export type Frame = { src: string | null; alt: string };

// Mixed aspect ratios give the contact sheet some rhythm; CSS columns keep it gap-free
const ratios = [
  "aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]",
  "aspect-square", "aspect-[3/4]", "aspect-[4/5]", "aspect-square",
];

export function Gallery({ frames }: { frames: Frame[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const filled = frames
    .map((f, i) => ({ ...f, i }))
    .filter((f): f is { src: string; alt: string; i: number } => !!f.src);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const current = filled.find((f) => f.i === index);
  const step = (dir: 1 | -1) => {
    if (!filled.length || index === null) return;
    const pos = filled.findIndex((f) => f.i === index);
    setIndex(filled[(pos + dir + filled.length) % filled.length].i);
  };

  return (
    <>
      <ul className="columns-2 gap-3 md:columns-4">
        {frames.map((f, i) => (
          <li key={i} className={`relative mb-3 break-inside-avoid ${ratios[i % ratios.length]}`}>
            {f.src ? (
              <button
                onClick={() => setIndex(i)}
                aria-label={`Open photo: ${f.alt}`}
                className="group relative block size-full overflow-hidden rounded-2xl"
              >
                <Image
                  src={f.src}
                  alt={f.alt}
                  fill
                  sizes="(min-width:768px) 25vw, 50vw"
                  className="object-cover"
                />
              </button>
            ) : (
              <div className="relative flex size-full items-end overflow-hidden rounded-2xl border border-white/12 bg-white/[.04] p-4">
                <StarIcon
                  aria-hidden
                  className="absolute right-3 top-3 text-white/10"
                  width={44}
                  height={44}
                />
                <p className="text-sm text-bone/55">Frame {i + 1}</p>
              </div>
            )}
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === dialogRef.current && setIndex(null)}
        aria-label="Fan photo viewer"
        className="m-auto max-h-[92svh] w-[min(92vw,60rem)] overflow-visible rounded-2xl bg-transparent p-0 backdrop:bg-black/85"
      >
        {current && (
          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="92vw"
                className="object-contain"
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-bone">
              <button
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="grid size-11 place-items-center rounded-full bg-white/12 hover:bg-white/20"
              >
                <ArrowRight className="rotate-180" />
              </button>
              <p className="px-4 text-center text-sm text-bone/75">{current.alt}</p>
              <button
                onClick={() => step(1)}
                aria-label="Next photo"
                className="grid size-11 place-items-center rounded-full bg-white/12 hover:bg-white/20"
              >
                <ArrowRight />
              </button>
            </div>
            <button
              onClick={() => setIndex(null)}
              aria-label="Close photo viewer"
              className="absolute -top-3 right-2 grid size-10 -translate-y-full place-items-center rounded-full bg-white text-ink"
            >
              <CloseIcon />
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
