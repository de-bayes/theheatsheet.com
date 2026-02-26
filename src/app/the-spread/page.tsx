import ArticleCard from "@/components/ArticleCard";
import { getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Spread — The Heat Sheet",
  description:
    "When prediction markets, expert ratings, and fundamentals disagree — that's where the interesting analysis lives.",
};

export default function TheSpreadPage() {
  const posts = getAllPosts().filter((p) => p.category === "The Spread");

  return (
    <div>
      <div className="max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">The Spread</h1>
        <p className="text-lg leading-relaxed text-meta-gray">
          When prediction markets, expert ratings, and fundamentals disagree on
          the same race — that&apos;s where the interesting analysis lives. We
          compare all three signals and tell you who we think is right.
        </p>
      </div>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <ArticleCard key={post.slug} {...post} />
          ))}
        </div>
      ) : (
        <div className="border border-charcoal/10 rounded-lg p-10 text-center">
          <p className="text-meta-gray text-lg">
            Spread analyses coming soon.
          </p>
        </div>
      )}
    </div>
  );
}
