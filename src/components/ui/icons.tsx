import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (p: P): P => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  ...p,
});

export const StarIcon = (p: P) => (
  <svg {...base({ fill: "currentColor", stroke: "none", ...p })}>
    <path d="M12 1.5l3.1 6.9 7.4.8-5.5 5 1.6 7.4L12 17.9l-6.6 3.7L7 14.2l-5.5-5 7.4-.8L12 1.5z" />
  </svg>
);
export const InstagramIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
);
export const YouTubeIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="4" />
    <path d="M10.5 9.5v5l4.2-2.5-4.2-2.5z" fill="currentColor" stroke="none" />
  </svg>
);
export const XIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 4l16 16M20 4L4 20" />
  </svg>
);
export const TikTokIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 4v10.2a3.7 3.7 0 11-3.7-3.7" />
    <path d="M14 4c.3 2.3 1.9 3.9 4.5 4.1" />
  </svg>
);
export const WhatsAppIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 20l1.2-4.2A8 8 0 1 1 8.3 18.9L4 20z" />
    <path d="M9.2 8.6c.3 2.6 2.7 5 5.4 5.4l1-1.2-1.9-1-.9.7c-.9-.4-1.7-1.2-2.1-2.1l.7-.9-1-1.9-1.2 1z" fill="currentColor" stroke="none" />
  </svg>
);
export const FacebookIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 21v-8h2.6l.5-3H14V8.2c0-.9.4-1.5 1.6-1.5h1.6V4.1A17 17 0 0 0 15 4c-2.3 0-3.9 1.4-3.9 3.9V10H8.5v3h2.6v8H14z" />
  </svg>
);
export const BagIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5.5 8.5h13l-1 11h-11l-1-11z" />
    <path d="M9 8.5V7a3 3 0 016 0v1.5" />
  </svg>
);
export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base({ fill: filled ? "currentColor" : "none", ...p })}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.4a4.3 4.3 0 017.5 2.4C19.5 15.4 12 20 12 20z" />
  </svg>
);
export const UserIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
  </svg>
);
export const ArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);
export const ArrowDown = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4v15M6 13l6 6 6-6" />
  </svg>
);
export const PlusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const MinusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);
export const MenuIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const CheckIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const socialIcon: Record<string, (p: P) => React.ReactElement> = {
  WhatsApp: WhatsAppIcon,
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  YouTube: YouTubeIcon,
  X: XIcon,
  TikTok: TikTokIcon,
};
