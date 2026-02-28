import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "The Spread -- The Heat Sheet",
  description:
    "Prediction market analysis from The Heat Sheet. We grade markets, track liquidity, and explain what the prices actually mean.",
};

export default function TheSpreadPage() {
  const allPosts = getAllPosts();
  const posts = allPosts.filter((p) => p.category === "The Spread");

  return (
    <div>
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center bg-[#e8dff0] px-3 py-1.5 text-xs uppercase tracking-widest font-semibold text-[#5b4a7a]">
            Category
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          The Spread
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-charcoal/75 max-w-2xl mx-auto">
          Prediction market analysis from The Heat Sheet. We grade markets,
          track liquidity, and figure out which prices you can actually trust.
        </p>
      </div>

      <div className="h-px w-16 bg-charcoal/20 mx-auto mb-12" />

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, i) => (
            <ArticleCard key={post.slug} {...post} featured={i === 0} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-meta-gray text-lg">Articles coming soon.</p>
        </div>
      )}
    </div>
  );
}
