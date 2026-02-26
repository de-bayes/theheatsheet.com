import ArticleCard from "@/components/ArticleCard";
import { getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Archive — The Heat Sheet",
};

export default function ArchivePage() {
  const posts = getAllPosts();

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Archive</h1>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <ArticleCard key={post.slug} {...post} />
          ))}
        </div>
      ) : (
        <p className="text-meta-gray text-lg">No articles yet.</p>
      )}
    </div>
  );
}
