/**
 * Central site configuration. Anything marked TODO is a placeholder you
 * should replace before launch (emails, social handles, membership price).
 */
export const site = {
  name: "Alan Ritchson",
  clubName: "Alan Ritchson Fan Club",
  domain: "alanritchsonfanclub.com",
  // Must be the address the site is actually served from (Vercel redirects the bare
  // domain to www). Canonicals, link previews and the sitemap all use this value.
  url: "https://www.alanritchsonfanclub.com",
  description:
    "The official fan club for Alan Ritchson. Reacher, War Machine, Titans and more: news roundups, watch-alongs, member merch and a VIP membership pass.",

  // TODO: point these at real mailboxes on your domain
  emails: {
    support: "hello@alanritchsonfanclub.com",
    press: "press@alanritchsonfanclub.com",
    report: "report@alanritchsonfanclub.com",
  },

  socials: [
    { label: "WhatsApp", short: "WA", href: "https://wa.link/ger3su" },
    { label: "Facebook", short: "FB", href: "https://www.facebook.com/share/1CVeN41une/" },
  ],

  // Alan was born on 28 November 1982
  birthday: { year: 1982, monthIndex: 10, day: 28 },

  // Lifetime VIP price. Fans send a request and the team emails payment options.
  membership: { price: "1500", currency: "$" },

  imdb: "https://www.imdb.com/name/nm2024927/",
} as const;

export type NavItem = {
  label: string;
  href: string;
  id: string;
  /** Show in the desktop pill nav (mobile menu shows everything) */
  pill: boolean;
};

export const nav: NavItem[] = [
  { label: "Home", href: "/", id: "top", pill: true },
  { label: "The note", href: "/#note", id: "note", pill: false },
  { label: "Roots", href: "/#roots", id: "roots", pill: true },
  { label: "On screen", href: "/#screen", id: "screen", pill: true },
  { label: "Store", href: "/#store", id: "store", pill: true },
  { label: "VIP benefits", href: "/#benefits", id: "benefits", pill: true },
  { label: "Team", href: "/#team", id: "team", pill: false },
  { label: "Contact", href: "/#contact", id: "contact", pill: true },
];

/** "$1,500" */
export const vipPriceLabel = `${site.membership.currency}${Number(site.membership.price).toLocaleString("en-US")}`;
