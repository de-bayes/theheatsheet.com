import Link from "next/link";
import { mainNavItems, isDropdown } from "@/lib/navigation";
import NavDropdown from "./NavDropdown";
import MobileNav from "./MobileNav";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="relative border-b border-charcoal/10">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="no-underline hover:no-underline">
          <Logo />
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-x-6">
            {mainNavItems.map((entry) => {
              if (isDropdown(entry)) {
                return (
                  <li key={entry.label}>
                    <NavDropdown label={entry.label} items={entry.items} />
                  </li>
                );
              }
              return (
                <li key={entry.href}>
                  <Link
                    href={entry.href}
                    className="text-sm uppercase tracking-wider text-charcoal/70 hover:text-charcoal no-underline hover:no-underline transition-colors"
                  >
                    {entry.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
