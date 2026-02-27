"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`text-sm uppercase tracking-wider no-underline hover:no-underline transition-colors ${isActive ? "text-charcoal border-b border-charcoal" : "text-charcoal/70 hover:text-charcoal"}`}
    >
      {children}
    </Link>
  );
}
