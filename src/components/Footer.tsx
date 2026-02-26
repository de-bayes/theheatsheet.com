import Link from "next/link";
import { footerNavItems } from "@/lib/navigation";

export default function Footer() {
  return (
    <footer className="border-t border-charcoal/10 mt-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-braces.svg"
              alt="The Heat Sheet"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold text-lg text-charcoal">The Heat Sheet</span>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {footerNavItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 pt-6 border-t border-charcoal/10">
          <div className="flex justify-center mb-3">
            <div className="h-px w-16 bg-gradient-to-r from-brand-red via-brand-orange to-brand-blue" />
          </div>
          <p className="text-center text-sm text-meta-gray">
            &copy; {new Date().getFullYear()} The Heat Sheet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
