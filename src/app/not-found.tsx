import Link from "next/link";
import BayesCalculator from "@/components/BayesCalculator";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16 md:py-24">
      <span className="font-logo text-8xl md:text-[10rem] font-light text-charcoal/10 select-none block leading-none mb-6">
        404
      </span>

      <p className="text-lg text-charcoal/60 mb-2">
        Page not found. But how much should this update your beliefs?
      </p>

      <BayesCalculator />

      <div className="mt-12">
        <Link
          href="/"
          className="text-sm uppercase tracking-widest text-charcoal no-underline hover:no-underline border-b border-charcoal pb-1 hover:text-charcoal/70 hover:border-charcoal/50 transition-colors"
        >
          Back to the homepage
        </Link>
      </div>
    </div>
  );
}
