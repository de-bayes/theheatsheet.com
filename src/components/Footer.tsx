import Link from "next/link";
import { footerNavItems } from "@/lib/navigation";

export default function Footer() {
  return (
    <footer className="border-t border-charcoal/10 mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <span className="font-logo text-xl font-light text-charcoal">
            {"{"}THS{"}"}
          </span>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {footerNavItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 pt-6 border-t border-charcoal/10">
          <p className="text-center text-sm text-meta-gray">
            &copy; {new Date().getFullYear()} The Heat Sheet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
