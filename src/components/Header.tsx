import Link from "next/link";

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
    <header className="border-b border-charcoal/10">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 text-center">
        <Link href="/" className="no-underline hover:no-underline">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
            The Heat Sheet
          </h1>
          <p className="text-meta-gray text-sm tracking-widest uppercase mt-2">
            Elections at your fingertips
          </p>
        </Link>
      </div>
      <nav className="max-w-6xl mx-auto px-6 md:px-10 pb-4">
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
