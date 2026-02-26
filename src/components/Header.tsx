import Link from "next/link";
import { mainNavItems, isDropdown } from "@/lib/navigation";
import NavDropdown from "./NavDropdown";
import MobileNav from "./MobileNav";

export default function Header() {
  return (
    <header className="border-b border-charcoal/10 relative">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="no-underline hover:no-underline flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-braces.svg"
            alt="The Heat Sheet logo"
            width={48}
            height={48}
            className="w-10 h-10 md:w-12 md:h-12"
          />
          <div>
            <span className="text-2xl md:text-3xl font-bold text-charcoal tracking-tight">
              The Heat Sheet
            </span>
            <p className="text-meta-gray text-xs tracking-widest uppercase hidden md:block">
              Elections at your fingertips
            </p>
          </div>
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
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="h-px bg-gradient-to-r from-brand-red via-brand-orange to-brand-blue" />
      </div>
    </header>
  );
}
