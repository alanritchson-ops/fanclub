/** Simple product glyphs used until real product photography is added. */
export function Glyph({
  name,
  className = "",
}: {
  name: "shirt" | "pin" | "zine" | "tote";
  className?: string;
}) {
  const common = {
    viewBox: "0 0 100 100",
    className,
    "aria-hidden": true as const,
  };
  switch (name) {
    case "shirt":
      return (
        <svg {...common} fill="currentColor">
          <path d="M32 14L8 28l10 18 10-5v44h44V41l10 5 10-18-24-14c-3 8-13 12-24 12S35 22 32 14z" />
          <path
            d="M50 46l3.4 7.5 8.1.9-6 5.5 1.7 8-7.2-4.1-7.2 4.1 1.7-8-6-5.5 8.1-.9L50 46z"
            fill="#000"
            opacity=".35"
          />
        </svg>
      );
    case "pin":
      return (
        <svg {...common} fill="currentColor">
          <path d="M50 8l11.7 26 28.3 3-21 19.2 6 27.8L50 70 25 84l6-27.8L10 37l28.3-3L50 8z" />
          <circle cx="50" cy="46" r="9" fill="#000" opacity=".3" />
        </svg>
      );
    case "zine":
      return (
        <svg {...common} fill="currentColor">
          <rect x="22" y="10" width="56" height="80" rx="4" />
          <rect x="30" y="20" width="40" height="8" rx="2" fill="#000" opacity=".3" />
          <rect x="30" y="36" width="40" height="3" rx="1.5" fill="#000" opacity=".22" />
          <rect x="30" y="44" width="32" height="3" rx="1.5" fill="#000" opacity=".22" />
          <rect x="30" y="52" width="36" height="3" rx="1.5" fill="#000" opacity=".22" />
          <path
            d="M50 64l3 6.5 7 .8-5.2 4.7 1.5 7L50 79.5 43.7 83l1.5-7L40 71.3l7-.8 3-6.5z"
            fill="#000"
            opacity=".3"
          />
        </svg>
      );
    case "tote":
      return (
        <svg {...common} fill="currentColor">
          <path d="M20 34h60l6 56H14l6-56z" />
          <path
            d="M36 34v-8a14 14 0 0128 0v8"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M50 52l3.4 7.5 8.1.9-6 5.5 1.7 8L50 69l-7.2 4.1 1.7-8-6-5.5 8.1-.9L50 52z"
            fill="#000"
            opacity=".3"
          />
        </svg>
      );
  }
}
