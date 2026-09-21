"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

function target(now: Date) {
  const { monthIndex, day, year } = site.birthday;
  const y = now.getFullYear();
  let t = new Date(y, monthIndex, day, 0, 0, 0);
  const isToday = now.getMonth() === monthIndex && now.getDate() === day;
  if (!isToday && t.getTime() <= now.getTime()) t = new Date(y + 1, monthIndex, day);
  return { t, isToday, turning: t.getFullYear() - year };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // First tick is deferred so server and client markup match on hydration
    const first = setTimeout(() => setNow(new Date()), 0);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const info = now ? target(now) : null;
  const diff = info && now ? Math.max(0, info.t.getTime() - now.getTime()) : 0;
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor(diff / 3_600_000) % 24;
  const m = Math.floor(diff / 60_000) % 60;
  const s = Math.floor(diff / 1000) % 60;

  const cells = [
    ["Days", info ? String(d) : "--"],
    ["Hrs", info ? pad(h) : "--"],
    ["Min", info ? pad(m) : "--"],
    ["Sec", info ? pad(s) : "--"],
  ];

  return (
    <div>
      <p className="text-lg font-medium text-bone/85">
        {info?.isToday
          ? "Happy birthday, Alan. Celebrations are live in the community."
          : info
            ? `Alan turns ${info.turning} on November 28. Birthday celebration in`
            : "Alan's birthday celebration in"}
      </p>
      <div
        role="timer"
        aria-label="Countdown to Alan's birthday"
        className="mt-4 grid max-w-xl grid-cols-4 gap-2 sm:gap-3"
      >
        {cells.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-white/15 bg-black/25 px-2 py-4 text-center backdrop-blur sm:py-5"
          >
            <p className="display text-[2.2rem] tabular-nums sm:text-5xl">{value}</p>
            <p className="mt-1 text-sm text-bone/65">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
