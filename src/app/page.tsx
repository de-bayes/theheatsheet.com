import ArticleCard from "@/components/ArticleCard";
import { getAllPosts } from "@/lib/posts";
import gradesData from "@/data/grades/latest.json";

export default function Home() {
  const posts = getAllPosts();
  const grades = gradesData.races.reduce(
    (acc, r) => { if (r.grade in acc) acc[r.grade]++; return acc; },
    { A: 0, B: 0, C: 0, D: 0, F: 0 } as Record<string, number>,
  );

  const pinnedSlug = posts.find((p) => p.pinned)?.slug ?? posts[0]?.slug;
  const featured = posts.find((p) => p.slug === pinnedSlug);
  const rest = posts.filter((p) => p.slug !== pinnedSlug);

  return (
    <div>
      {featured && (
        <div className="mb-10">
          <ArticleCard
            {...featured}
            featured
            href={featured.slug === "your-local-market" ? "/your-local-market" : undefined}
          />
        </div>
      )}

      {rest.length > 0 && (
        <div className={`grid gap-10 ${rest.length === 1 ? "grid-cols-1 max-w-xl" : "grid-cols-1 md:grid-cols-2"}`}>
          {rest.map((post) => (
            <ArticleCard
              key={post.slug}
              {...post}
              href={post.slug === "your-local-market" ? "/your-local-market" : undefined}
            />
          ))}
        </div>
      )}

      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-meta-gray text-lg">Articles coming soon.</p>
        </div>
      )}
    </div>
  );
}
