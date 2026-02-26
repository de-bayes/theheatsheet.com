import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscribe — The Heat Sheet",
};

export default function SubscribePage() {
  return (
    <div className="max-w-xl mx-auto text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Subscribe</h1>
      <p className="text-lg leading-relaxed text-meta-gray mb-8">
        Get The Heat Sheet delivered to your inbox. Race ratings, market grades,
        and original analysis — no spam, no spin.
      </p>
      <div className="border border-charcoal/10 rounded-lg p-10">
        <p className="text-meta-gray">Newsletter signup coming soon.</p>
      </div>
    </div>
  );
}
