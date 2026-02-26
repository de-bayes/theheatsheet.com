import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Race Ratings — The Heat Sheet",
  description:
    "Every competitive House, Senate, and gubernatorial race — rated with explicit probability estimates.",
};

export default function RaceRatingsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Race Ratings</h1>
      <p className="text-lg leading-relaxed text-meta-gray mb-8">
        Every competitive House, Senate, and gubernatorial race on the standard
        Solid/Likely/Lean/Toss Up scale — with explicit estimated margin ranges
        and implied win probabilities.
      </p>
      <div className="border border-charcoal/10 rounded-lg p-10 text-center">
        <p className="text-meta-gray text-lg">
          2026 race ratings coming soon.
        </p>
      </div>
    </div>
  );
}
