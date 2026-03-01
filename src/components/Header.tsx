import Link from "next/link";
import { mainNavItems, isDropdown } from "@/lib/navigation";
import NavDropdown from "./NavDropdown";
import NavLink from "./NavLink";
import MobileNav from "./MobileNav";
import Logo from "./Logo";
import CountdownTicker from "./GradeTicker";
import { getUpcomingDates } from "@/data/key-dates";

export default function Header() {
  const dates = getUpcomingDates();

  return (
    <header className="relative">
      <div className="border-b border-charcoal/10">
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
                    <NavLink href={entry.href}>
                      {entry.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <MobileNav />
        </div>
      </div>
      <div className="border-b border-charcoal/5 bg-charcoal/[0.02]">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <CountdownTicker dates={dates} />
        </div>
      </div>
    </header>
  );
}
