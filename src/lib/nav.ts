/**
 * Site navigation structure — developer-owned per the Admin Content Principle
 * (docs/requirements.md §8): Admin manages content, not navigation/layout.
 */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/our-ghee", label: "Our Ghee" },
  { href: "/our-story", label: "Our Story" },
  { href: "/our-process", label: "Our Process" },
  { href: "/quality", label: "Quality" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;
