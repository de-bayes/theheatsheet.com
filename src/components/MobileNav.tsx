"use client";

import { useState } from "react";
import Link from "next/link";
import { mainNavItems, isDropdown } from "@/lib/navigation";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setExpandedDropdown(expandedDropdown === label ? null : label);
  };

  const closeMenu = () => {
    setOpen(false);
    setExpandedDropdown(null);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-charcoal"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-cream border-b border-charcoal/10 shadow-lg z-50">
          <nav className="max-w-6xl mx-auto px-6 py-4">
            <ul className="space-y-1">
              {mainNavItems.map((entry) => {
                if (isDropdown(entry)) {
                  return (
                    <li key={entry.label}>
                      <button
                        onClick={() => toggleDropdown(entry.label)}
                        className="w-full text-left py-3 text-sm uppercase tracking-wider text-charcoal/70 hover:text-charcoal flex items-center justify-between"
                      >
                        {entry.label}
                        <svg
                          className={`w-3 h-3 transition-transform ${expandedDropdown === entry.label ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedDropdown === entry.label && (
                        <ul className="pl-4 space-y-1 border-l-2 border-charcoal/10 ml-2 mb-2">
                          {entry.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className="block py-2 text-sm text-charcoal/70 hover:text-charcoal no-underline hover:no-underline"
                                onClick={closeMenu}
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }
                return (
                  <li key={entry.href}>
                    <Link
                      href={entry.href}
                      className="block py-3 text-sm uppercase tracking-wider text-charcoal/70 hover:text-charcoal no-underline hover:no-underline"
                      onClick={closeMenu}
                    >
                      {entry.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
