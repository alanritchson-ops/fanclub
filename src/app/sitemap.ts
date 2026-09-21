import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Bump when a page's content meaningfully changes; accurate dates help crawlers
const pages: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly"; lastModified: string }[] = [
  { path: "", priority: 1, changeFrequency: "weekly", lastModified: "2026-09-21" },
  { path: "/biography", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-09-21" },
  { path: "/filmography", priority: 0.8, changeFrequency: "monthly", lastModified: "2026-09-21" },
  { path: "/join", priority: 0.7, changeFrequency: "monthly", lastModified: "2026-09-21" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly", lastModified: "2026-09-21" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, ...rest }) => ({ url: `${site.url}${path}`, ...rest }));
}
