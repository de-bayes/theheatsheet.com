import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — The Heat Sheet`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto">
      {post.category && (
        <span className="text-xs uppercase tracking-widest text-link-blue font-semibold">
          {post.category}
        </span>
      )}
      <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
        {post.title}
      </h1>
      <div className="flex items-center gap-3 text-sm text-meta-gray mb-8">
        <span>By {post.author}</span>
        <span>&middot;</span>
        <time>
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
      <div
        className="article-content text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
