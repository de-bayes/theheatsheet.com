import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BackToTop from "@/components/BackToTop";
import Link from "next/link";
import Image from "next/image";
import gradesData from "@/data/grades/latest.json";
import MarketGradesTable from "@/components/MarketGradesTable";
import ApiTerminal from "@/components/ApiTerminal";
import CopyableContent from "@/components/CopyableContent";

function slugifyTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-");
}

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
    title: `${post.title} -- The Heat Sheet`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const tags = post.tags ?? [];
  const allLabels = [
    ...tags.map((t) => ({ label: t, href: `/tags/${slugifyTag(t)}` })),
    ...(post.category
      ? [{ label: post.category, href: "/the-spread" }]
      : []),
  ];

  return (
    <article>
      {/* Hero — centered */}
      <div className="max-w-3xl mx-auto mb-12 text-center">
        {allLabels.length > 0 && (
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center bg-[#e8dff0] px-3 py-1.5 text-xs uppercase tracking-widest font-semibold text-[#5b4a7a]">
              {allLabels.map((item, i) => (
                <span key={item.href} className="inline-flex items-center">
                  {i > 0 && (
                    <span className="mx-1.5 text-[#5b4a7a]/30">&middot;</span>
                  )}
                  <Link
                    href={item.href}
                    className="text-[#5b4a7a] no-underline hover:underline hover:decoration-wavy hover:decoration-[#5b4a7a]/40 hover:underline-offset-2 transition-all"
                  >
                    {item.label}
                  </Link>
                </span>
              ))}
            </span>
          </div>
        )}

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          {post.title}
        </h1>

        <p className="text-sm uppercase tracking-widest text-meta-gray mb-6">
          Published by{" "}
          {post.authorSlug ? (
            <Link
              href={`/partners/${post.authorSlug}`}
              className="text-meta-gray hover:text-charcoal no-underline hover:underline hover:decoration-wavy hover:decoration-charcoal/30 hover:underline-offset-2 transition-colors"
            >
              {post.author}
            </Link>
          ) : (
            post.author
          )}
        </p>

        <p className="text-lg md:text-xl leading-relaxed text-charcoal/75 mb-8">
          {post.excerpt}
        </p>

        {post.image && (
          <div className="rounded-2xl overflow-hidden border border-charcoal/10 mb-8">
            <Image
              src={post.image}
              alt={post.title}
              width={1536}
              height={1024}
              className="w-full h-auto"
              priority
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto">
        <CopyableContent
          html={post.contentHtml}
          className="article-content text-lg leading-relaxed"
        />
      </div>

      {/* Interactive terminal for API post */}
      {slug === "market-grades-api" && (
        <div className="max-w-3xl mx-auto mt-12">
          <ApiTerminal />
        </div>
      )}

      {/* Market grades table for YLM post */}
      {slug === "your-local-market" && (
        <div className="mt-12 -mx-4 md:-mx-8 lg:-mx-16">
          <MarketGradesTable races={gradesData.races} date={gradesData.date} />
        </div>
      )}

      <BackToTop />
    </article>
  );
}
