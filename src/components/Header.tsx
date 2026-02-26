import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Archive", href: "/archive" },
  { label: "Race Ratings", href: "/race-ratings" },
  { label: "The Spread", href: "/the-spread" },
  { label: "Decision Desk", href: "/decision-desk" },
  { label: "About", href: "/about" },
  { label: "Subscribe", href: "/subscribe" },
];

export default function Header() {
  return (
    <header className="border-b-2 border-charcoal/10">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 text-center">
        <Link href="/" className="no-underline hover:no-underline inline-block">
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/White.svg"
              alt="The Heat Sheet logo"
              width={56}
              height={56}
              className="w-12 h-12 md:w-14 md:h-14"
              priority
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
                The Heat Sheet
              </h1>
              <p className="text-meta-gray text-sm tracking-widest uppercase mt-1">
                Elections at your fingertips
              </p>
            </div>
          </div>
        </Link>
      </div>
      <nav className="max-w-6xl mx-auto px-6 md:px-10 pb-4">
        <div className="flex justify-center mb-3">
          <div className="h-px w-32 bg-gradient-to-r from-brand-red via-brand-orange to-brand-blue" />
        </div>
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm uppercase tracking-wider text-charcoal/70 hover:text-charcoal no-underline hover:no-underline transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
