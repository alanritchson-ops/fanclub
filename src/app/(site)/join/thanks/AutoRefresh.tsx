"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Re-checks the payment every 15 seconds while it's still confirming. */
export function AutoRefresh() {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => router.refresh(), 15_000);
    return () => clearInterval(t);
  }, [router]);
  return null;
}
