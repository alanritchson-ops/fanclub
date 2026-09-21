import { ticker } from "@/lib/content";
import { StarIcon } from "@/components/ui/icons";

export function Ticker() {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {ticker.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap">
          <span className="px-6 text-[0.95rem] font-medium sm:px-8">{t}</span>
          <StarIcon width={12} height={12} className="opacity-70" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="marquee overflow-hidden bg-crimson py-3.5 text-bone"
      aria-label="Latest from the club"
    >
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
