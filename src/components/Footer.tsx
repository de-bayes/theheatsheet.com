import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-charcoal/10 mt-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">The Heat Sheet</h3>
            <p className="text-sm text-meta-gray leading-relaxed">
              Nonpartisan political analysis. Calibrated forecasts.
              Accountable journalism.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Sections</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/race-ratings">Race Ratings</Link>
              </li>
              <li>
                <Link href="/the-spread">The Spread</Link>
              </li>
              <li>
                <Link href="/decision-desk">Decision Desk Scorecards</Link>
              </li>
              <li>
                <Link href="/archive">Archive</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/subscribe">Subscribe</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-charcoal/10 text-center text-sm text-meta-gray">
          &copy; {new Date().getFullYear()} The Heat Sheet. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
