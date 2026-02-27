import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center py-20 md:py-32">
      <span className="font-logo text-7xl md:text-9xl font-light text-charcoal/15 select-none block mb-6">
        {"{ 404 }"}
      </span>
      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        This race has been called — for nobody.
      </h1>
      <p className="text-lg text-charcoal/70 mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist, was moved, or never
        filed to run in the first place.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="text-sm uppercase tracking-widest text-charcoal no-underline hover:no-underline border-b border-charcoal pb-1 hover:text-charcoal/70 hover:border-charcoal/50 transition-colors"
        >
          Back to the homepage
        </Link>
        <span className="hidden sm:inline text-meta-gray">&middot;</span>
        <Link
          href="/archive"
          className="text-sm uppercase tracking-widest text-charcoal/70 no-underline hover:no-underline hover:text-charcoal transition-colors"
        >
          Browse the archive
        </Link>
      </div>
    </div>
  );
}
