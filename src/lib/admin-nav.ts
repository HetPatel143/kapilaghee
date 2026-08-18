export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  {
    label: "Content",
    children: [
      { href: "/admin/content/home", label: "Homepage" },
      { href: "/admin/content/story", label: "Our Story" },
      { href: "/admin/content/process", label: "Our Process" },
      { href: "/admin/content/quality", label: "Quality & Purity" },
    ],
  },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/documents", label: "Documents" },
  { href: "/admin/settings", label: "Settings" },
] as const;
