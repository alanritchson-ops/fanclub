/** All page copy and structured data lives here so it's easy to edit. */

export const ticker = [
  "Reacher Season 4 is complete on Prime Video",
  "Neagley, the Reacher spin-off, premiered September 16",
  "War Machine is streaming on Netflix",
  "Alan turns 44 on November 28",
  "VIP membership is open",
];

export const note = {
  title: "Welcome to the club.",
  paragraphs: [
    "Fans have been arguing about the best Reacher fight, rewatching the Aquaman episodes of Smallville, and swapping notes on whatever Alan Ritchson did next. This is the official home for all of it.",
    "The club is run by Alan's management team. It tells you where his work is, when it lands and where to watch it. After every release we publish a short roundup, host watch-alongs for new seasons, and keep a community where the conversation stays kind.",
    "Anything that comes from Alan or his team will come from this site or our verified channels. If another account claims to speak for him, or asks you for money, it isn't us.",
    "If you're new, welcome. If you've been here since Smallville, thank you. You've earned the good seat.",
  ],
  closing: "With thanks,",
  signoff: "The Alan Ritchson Fan Club team",
};

export const roots = {
  title: "Where it started.",
  paragraphs: [
    "Alan was born in Grand Forks, North Dakota, into a military family. His father served in the U.S. Air Force, which meant a lot of moving until the family settled in Niceville, Florida, when he was ten.",
    "He graduated from Niceville High School in 2001, after starting college-level music theatre and dance classes at Okaloosa Walton Community College while still a student. Modelling came next, then a shot at American Idol, then acting.",
  ],
  facts: [
    { label: "Born", value: "November 28, 1982, Grand Forks, North Dakota" },
    { label: "Raised", value: "Niceville, Florida" },
    { label: "Best known for", value: "Jack Reacher in Prime Video's Reacher" },
  ],
};

export type Milestone = { year: string; title: string; body: string };

export const timeline: Milestone[] = [
  {
    year: "2004",
    title: "American Idol",
    body: "Auditioned for the show's third season and made it to Hollywood Week, the first time much of the country saw him.",
  },
  {
    year: "2005",
    title: "Smallville",
    body: "Arrived as Arthur Curry, the first officially licensed live-action Aquaman, and returned as a guest star through season ten.",
  },
  {
    year: "2010",
    title: "Blue Mountain State",
    body: "Played linebacker Thad Castle in the Spike TV comedy, a role he brought back for the 2016 film sequel.",
  },
  {
    year: "2013",
    title: "The Hunger Games: Catching Fire",
    body: "Joined the franchise as Gloss, the tribute from District 1, and kept building a film résumé with the Ninja Turtles films that followed.",
  },
  {
    year: "2017",
    title: "Blood Drive, then Titans",
    body: "Headlined Syfy's Blood Drive, then joined DC's Titans as Hank Hall / Hawk and became a series regular in season two.",
  },
  {
    year: "2022",
    title: "Reacher",
    body: "Took the title role in Prime Video's adaptation of Lee Child's novels. Season one arrived on February 4, 2022.",
  },
  {
    year: "2026",
    title: "War Machine and Reacher Season 4",
    body: "Led Netflix's sci-fi action film War Machine in March, then returned as Reacher for season four, adapting Gone Tomorrow.",
  },
];

export type Poster = {
  id: string;
  title: string;
  years: string;
  role: string;
  where: string;
  className: string;
  image: string;
};

export const posters: Poster[] = [
  {
    id: "reacher",
    title: "Reacher",
    years: "2022 to now",
    role: "Jack Reacher",
    where: "Prime Video",
    className: "bg-gradient-to-b from-crimson to-oxblood text-bone",
    image: "/images/reacher.webp",
  },
  {
    id: "war-machine",
    title: "War Machine",
    years: "2026",
    role: "81",
    where: "Netflix",
    className: "bg-gradient-to-b from-[#2b2f33] to-ink text-bone",
    image: "/images/war_machine.webp",
  },
  {
    id: "titans",
    title: "Titans",
    years: "2018 to 2021",
    role: "Hank Hall / Hawk",
    where: "HBO Max",
    className: "bg-gradient-to-b from-brass to-[#8f6f3e] text-ink",
    image: "/images/titans.webp",
  },
  {
    id: "smallville",
    title: "Smallville",
    years: "2005 to 2010",
    role: "Arthur Curry / Aquaman",
    where: "The CW",
    className: "bg-gradient-to-b from-[#26424a] to-[#0f1e22] text-bone",
    image: "/images/smallville.webp",
  },
  {
    id: "bms",
    title: "Blue Mountain State",
    years: "2010 to 2011",
    role: "Thad Castle",
    where: "Spike",
    className: "bg-gradient-to-b from-paper to-[#c9b9a8] text-ink",
    image: "/images/mountain_state.webp",
  },
];

export const alsoSeenIn = [
  "The Hunger Games: Catching Fire",
  "Teenage Mutant Ninja Turtles",
  "Fast X",
  "Blood Drive",
  "Lazer Team",
];

export type Product = {
  id: string;
  name: string;
  blurb: string;
  price: number;
  vipPrice?: number;
  vipOnly?: boolean;
  glyph: "shirt" | "pin" | "zine" | "tote";
  tone: string;
};

/** Placeholder fan-made merch. Replace names, prices and add photos at /public/images/store/<id>.jpg */
export const products: Product[] = [
  {
    id: "t-shirt",
    name: "Alan Ritchson Shirt, Alan Ritchson Fan Tee",
    blurb: "Actor Collage T-Shirt, Reacher Inspired Gift, Celebrity Fan Shirt, Pop Culture Tee.",
    price: 34,
    vipPrice: 26,
    glyph: "shirt",
    tone: "from-crimson to-oxblood",
  },
  {
    id: "pillow",
    name: "Alan Ritchson Pillow Bedroom Decoration Cushion Cover",
    blurb: "Materials: Cover material: Cotton, Polyester",
    price: 12,
    glyph: "pin",
    tone: "from-brass to-[#8f6f3e]",
  },
  {
    id: "candle",
    name: "Smells Like Alan Ritchson Candle",
    blurb: "Natural Coconut Apricot Wax, Gift, Home Decor, Gag, Funny, Birthday, Celebrity, Reacher.",
    price: 18,
    vipPrice: 14,
    glyph: "zine",
    tone: "from-paper to-[#c9b9a8]",
  },
  {
    id: "signature",
    name: "Reacher Signed Pilot Script.",
    blurb: "Reacher Signed Pilot Script, Screenplay, Alan Ritchson, Autograph, Birthday Gift, Movie Lovers Gifts, Framed, TV Script, Movie Props.",
    price: 24,
    glyph: "tote",
    tone: "from-[#2b2f33] to-ink",
  },
];

export type Benefit = { title: string; points: string[] };

export const benefits: Benefit[] = [
  {
    title: "Members-only community",
    points: [
      "A private members space with spoiler-safe channels for every season.",
      "Fan projects, theories and behind-the-scenes club planning.",
      "News roundups posted to members before the public feed.",
    ],
  },
  {
    title: "Watch-alongs and hangouts",
    points: [
      "Live watch-alongs for major premieres and finales.",
      "Monthly community hangouts hosted by club members.",
      "Polls that decide what the club does next.",
    ],
  },
  {
    title: "Meet-ups and events",
    points: [
      "Fan-organised local meet-ups, listed for members first.",
      "Official appearance and convention dates shared when they are announced.",
      "Access depends on schedules and venues, and we'll always be clear about what is and isn't included.",
    ],
  },
  {
    title: "Member merch",
    points: [
      "Member pricing across the club store.",
      "VIP-only pins, prints and limited runs.",
      "First notice when a new drop opens.",
    ],
  },
  {
    title: "Birthday and milestone celebrations",
    points: [
      "A club-wide celebration for Alan's birthday every November 28.",
      "Fan art showcases for premieres and finales.",
      "Member-chosen charity drives.",
    ],
  },
  {
    title: "News first",
    points: [
      "A short, sourced roundup after every casting, trailer and release-date announcement.",
      "Where to watch each project in your region, kept up to date.",
    ],
  },
  {
    title: "Membership recognition",
    points: [
      "A numbered digital pass issued the day you join.",
      "A member badge in the community.",
      "Long-term member recognition each year.",
    ],
  },
];

export const passPerks = [
  "Private community and early news roundups",
  "Numbered digital pass and member badge",
  "Watch-alongs and fan meet-ups",
  "VIP-only merch drops and member pricing",
];

export const safety = {
  title: "Looking out for fans.",
  paragraphs: [
    "Celebrity impersonation scams are common, and they target fans. If someone claiming to be Alan, his team or this club asks you for money, gift cards, crypto or a private meet-up, it isn't real.",
    "The club team will never message you first asking for payment. Every payment happens on this website, and nowhere else.",
  ],
  rules: [
    "Be kind. Disagree with ideas, not people.",
    "Use spoiler tags for anything from the latest episode.",
    "Respect Alan's family and their privacy. No personal-life speculation and no sharing of locations.",
    "Report suspicious accounts to us so we can warn others.",
  ],
};

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Is this the official Alan Ritchson fan club?",
    a: "Yes. This is the official fan club, run by Alan's management team. It is not affiliated with Amazon, Netflix or any studio, and any other site or account claiming to be it isn't ours.",
  },
  {
    q: "How do I pay, and is it a subscription?",
    a: "VIP is a single payment for lifetime access, so there's nothing to renew or cancel. You pay in Bitcoin through a secure checkout, and your numbered pass is emailed as soon as the payment confirms.",
  },
  {
    q: "How does the digital pass work?",
    a: "Every member gets a numbered digital pass the moment they join. It lives in your account, shows your member badge in the community and gets you into member-only events run by the club.",
  },
  {
    q: "Will I get to meet Alan?",
    a: "We can't promise that. Membership gives you early notice of official appearances and fan-organised meet-ups, and we'll always be clear about who is and isn't attending.",
  },
  {
    q: "Where does my membership money go?",
    a: "It covers running the site, the community, the events we host and the merch we produce.",
  },
];

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  org: string;
  bio: string;
};

/**
 * Alan's representation, from public reporting (Deadline, July 2025 and later).
 * Representatives change, so re-check before launch and get each person's OK.
 * Photos live at /public/images/team/<id>.jpg; initials show until one exists.
 * Add agents, publicists and other named team members as they're confirmed.
 */
export const team: TeamMember[] = [
  {
    id: "rich_cook",
    name: "Rich Cook",
    role: "Manager",
    org: "Range Media Partners",
    bio: "Founding partner of Range Media Partners, the management company Alan signed with in July 2025.",
  },
];

export const representation = [
  { role: "Management", org: "Range Media Partners" },
  { role: "Agency", org: "WME" },
  { role: "Legal", org: "Hansen, Jacobson, Teller, Hoberman, Newman, Warren, Richman, Rush, Kaller, Gellman, Meigs & Fox" },
];
