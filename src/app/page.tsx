import ArticleCard from "@/components/ArticleCard";
import { getAllPosts } from "@/lib/posts";
import gradesData from "@/data/grades/latest.json";

export default function Home() {
  const posts = getAllPosts();
  const grades = gradesData.races.reduce(
    (acc, r) => { if (r.grade in acc) acc[r.grade]++; return acc; },
    { A: 0, B: 0, C: 0, D: 0, F: 0 } as Record<string, number>,
  );

  // Find pinned post, or fall back to most recent
  const pinnedSlug = posts.find((p) => p.pinned)?.slug ?? posts[0]?.slug;

  return (
    <div>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => {
            const isFeatured = post.slug === pinnedSlug;
            return (
              <ArticleCard
                key={post.slug}
                {...post}
                featured={isFeatured}
                href={post.slug === "your-local-market" ? "/your-local-market" : undefined}
                stats={
                  isFeatured && post.slug === "your-local-market"
                    ? [
                        { value: gradesData.races.length, label: "markets", color: "neutral" as const },
                        { value: grades.A, label: "A-grade", color: "green" as const },
                        { value: grades.B + grades.C + grades.D, label: "B/C/D", color: "yellow" as const },
                        { value: grades.F, label: "F-grade", color: "red" as const },
                      ]
                    : undefined
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-meta-gray text-lg">Articles coming soon.</p>
        </div>
      )}
    </div>
  );
}
