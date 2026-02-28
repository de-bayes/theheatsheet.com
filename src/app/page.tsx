import ArticleCard from "@/components/ArticleCard";
import { getAllPosts } from "@/lib/posts";
import gradesData from "@/data/grades/latest.json";

export default function Home() {
  const posts = getAllPosts();
  const grades = gradesData.races.reduce(
    (acc, r) => { if (r.grade in acc) acc[r.grade]++; return acc; },
    { A: 0, B: 0, C: 0, D: 0, F: 0 } as Record<string, number>,
  );

  return (
    <div>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, i) => (
            <ArticleCard
              key={post.slug}
              {...post}
              featured={i === 0}
              href={post.slug === "your-local-market" ? "/your-local-market" : undefined}
              stats={
                i === 0 && post.slug === "your-local-market"
                  ? [
                      { value: gradesData.races.length, label: "markets", color: "neutral" as const },
                      { value: grades.A, label: "A-grade", color: "green" as const },
                      { value: grades.B + grades.C + grades.D, label: "B/C/D", color: "yellow" as const },
                      { value: grades.F, label: "F-grade", color: "red" as const },
                    ]
                  : undefined
              }
            />
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
