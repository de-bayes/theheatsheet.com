import ArticleCard from "@/components/ArticleCard";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <ArticleCard key={post.slug} {...post} />
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
