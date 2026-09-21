"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Renders in the viewer's own timezone once on the client (UTC on the server). */
export function LocalTime({ iso }: { iso: string }) {
  const text = useSyncExternalStore(
    subscribe,
    () => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }),
    () => iso.slice(0, 16).replace("T", " ") + " UTC",
  );
  return <time dateTime={iso}>{text}</time>;
}
