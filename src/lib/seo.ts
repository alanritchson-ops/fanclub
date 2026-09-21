import type { Metadata } from "next";
import { faqs, posters, roots } from "@/lib/content";
import { site } from "@/lib/site";

/** Absolute URL for a path on this site. */
export const abs = (path = "/") => new URL(path, site.url).toString();

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.clubName,
  url: site.url,
  logo: abs("/icon.svg"),
  description: site.description,
  email: site.emails.support,
  sameAs: site.socials.filter((s) => s.label === "Facebook").map((s) => s.href),
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: `${site.url}/`,
  name: site.clubName,
  // Helps Google show the club name (not just the domain) as the site name in results
  alternateName: ["Alan Ritchson Fan Club", site.domain],
  description: site.description,
  inLanguage: "en",
  publisher: { "@id": `${site.url}/#organization` },
};

const { year, monthIndex, day } = site.birthday;
const birthDate = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

/** Facts here come only from what the site already states about Alan. */
export const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${site.url}/#alan-ritchson`,
  name: site.name,
  jobTitle: "Actor",
  birthDate,
  birthPlace: { "@type": "Place", name: "Grand Forks, North Dakota" },
  image: abs("/images/alan.jpg"),
  description: roots.facts.find((f) => f.label === "Best known for")?.value
    ? `American actor best known as ${roots.facts.find((f) => f.label === "Best known for")!.value}.`
    : undefined,
  sameAs: [site.imdb],
  subjectOf: { "@id": `${site.url}/#website` },
};

export const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const filmographyLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `${site.name} filmography`,
  itemListElement: posters.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: p.title,
    description: `${site.name} as ${p.role}, ${p.where} (${p.years}).`,
  })),
};

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}

/**
 * Link-preview image (WhatsApp, Facebook, X, iMessage, Slack...). 1200x630 and
 * under 100 KB, because WhatsApp drops previews for images over ~300 KB.
 * Regenerate from public/images/alan.jpg if the photo changes.
 */
export const socialImage = {
  url: "/images/og-alan.jpg",
  width: 1200,
  height: 630,
  alt: "Alan Ritchson, star of Reacher",
  type: "image/jpeg",
};

/**
 * Complete metadata for a page, including its own link-preview card. Every
 * page needs its own og:title / og:url: a page-level `openGraph` replaces the
 * layout's wholesale, so nothing is inherited.
 */
export function pageMetadata(opts: {
  /** <title> value; use { absolute } to skip the site-name suffix */
  title: Metadata["title"];
  /** The headline shown on a shared link */
  socialTitle: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      type: "website",
      siteName: site.clubName,
      locale: "en_US",
      url: opts.path,
      title: opts.socialTitle,
      description: opts.description,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.socialTitle,
      description: opts.description,
      images: [{ url: socialImage.url, alt: socialImage.alt }],
    },
    // Some scrapers look for the https-specific image tag explicitly
    other: { "og:image:secure_url": abs(socialImage.url) },
  };
}
