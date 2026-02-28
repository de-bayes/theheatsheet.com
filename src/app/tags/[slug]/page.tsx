import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllTags().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = getAllTags().find((t) => t.slug === slug);
  const label = tag?.tag ?? slug;
  return {
    title: `${label} -- The Heat Sheet`,
    description: `All articles tagged "${label}" on The Heat Sheet.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const tag = getAllTags().find((t) => t.slug === slug);
  const label = tag?.tag ?? slug;
  const posts = getPostsByTag(slug);

  return (
    <div>
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center bg-[#e8dff0] px-3 py-1.5 text-xs uppercase tracking-widest font-semibold text-[#5b4a7a]">
            Tag
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          {label}
        </h1>
        <p className="text-lg text-charcoal/65">
          {posts.length} article{posts.length !== 1 ? "s" : ""}
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
          <p className="text-meta-gray text-lg">No articles yet.</p>
        </div>
      )}
    </div>
  );
}
