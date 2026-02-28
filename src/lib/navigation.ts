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
      { label: "Your Local Market", href: "/your-local-market" },
      { label: "The Spread", href: "/the-spread" },
      { label: "Decision Desk", href: "/decision-desk" },
    ],
  },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
];

export const footerNavItems: NavItem[] = [
  { label: "Archive", href: "/archive" },
  { label: "Your Local Market", href: "/your-local-market" },
  { label: "The Spread", href: "/the-spread" },
  { label: "Decision Desk", href: "/decision-desk" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
];
