import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/newsreader/wght-italic.css";
import "./globals.css";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

const title = `${site.name} Fan Club | Official News, Reacher & VIP Membership`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  ...pageMetadata({
    title: { default: title, template: `%s | ${site.clubName}` },
    socialTitle: title,
    description: site.description,
    path: "/",
  }),
  applicationName: site.clubName,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  // Search Console / Bing Webmaster verification: set these env vars, no code change needed
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7d1217",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
