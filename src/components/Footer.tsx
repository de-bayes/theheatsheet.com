import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-charcoal/10 mt-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/logo-braces.svg"
                alt="The Heat Sheet"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <h3 className="font-bold text-lg">The Heat Sheet</h3>
            </div>
            <p className="text-sm text-meta-gray leading-relaxed">
              Nonpartisan political analysis. Calibrated forecasts.
              Accountable journalism.
            </p>
          </div>
          <div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">About Us</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-charcoal/10">
          <div className="flex justify-center mb-4">
            <div className="h-0.5 w-16 rounded bg-gradient-to-r from-brand-red via-brand-orange to-brand-blue" />
          </div>
          <p className="text-center text-sm text-meta-gray">
            &copy; {new Date().getFullYear()} The Heat Sheet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
