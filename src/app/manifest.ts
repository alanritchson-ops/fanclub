import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.clubName,
    short_name: "Ritchson Club",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#150a0b",
    theme_color: "#7d1217",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
