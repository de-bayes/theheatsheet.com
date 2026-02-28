export interface NavItem {
  label: string;
  href: string;
}

export interface NavDropdownEntry {
  label: string;
  items: NavItem[];
}

export type NavEntry = NavItem | NavDropdownEntry;

export function isDropdown(entry: NavEntry): entry is NavDropdownEntry {
  return "items" in entry;
}

export const mainNavItems: NavEntry[] = [
  { label: "Archive", href: "/archive" },
  {
    label: "Projects",
    items: [
      { label: "The Spread", href: "/the-spread" },
      { label: "Market Grades API", href: "/posts/market-grades-api" },
    ],
  },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
];

export const footerNavItems: NavItem[] = [
  { label: "Archive", href: "/archive" },
  { label: "The Spread", href: "/the-spread" },
  { label: "Market Grades API", href: "/posts/market-grades-api" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
  { label: "Admin", href: "/admin" },
];
