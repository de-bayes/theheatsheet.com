import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";
import { getPartnerBySlug, getAllPartnerSlugs } from "@/data/partners";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPartnerSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);
  if (!partner) return {};
  return {
    title: `${partner.name} -- The Heat Sheet`,
    description: `${partner.name} -- ${partner.role} at The Heat Sheet.`,
  };
}

export default async function PartnerPage({ params }: Props) {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);

  if (!partner) notFound();

  const posts = getAllPosts().filter((p) => p.authorSlug === slug);

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/partners"
        className="text-sm text-meta-gray hover:text-charcoal no-underline hover:underline underline-offset-2 transition-colors"
      >
        &larr; All Partners
      </Link>

      <div className="mt-8 mb-12 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {partner.photo && (
          <Image
            src={partner.photo}
            alt={partner.name}
            width={400}
            height={400}
            className="w-full md:w-64 md:h-64 aspect-square rounded-lg object-cover object-top shrink-0"
          />
        )}

        <div className="min-w-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-1">{partner.name}</h1>
          <p className="text-sm uppercase tracking-widest text-meta-gray mb-3">
            {partner.role}
          </p>
          <p className="text-base leading-relaxed text-charcoal/85 mb-4">
            {partner.bio}
          </p>
          <div className="flex gap-2.5 flex-wrap">
            {partner.email && (
              <a
                href={`mailto:${partner.email}`}
                className="inline-block px-3 py-1 text-sm border border-charcoal/20 rounded-full text-charcoal/80 hover:text-charcoal hover:bg-charcoal/5 hover:border-charcoal/40 no-underline hover:underline hover:decoration-wavy hover:decoration-charcoal/30 hover:underline-offset-4 transition-colors"
              >
                {partner.email}
              </a>
            )}
            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1 text-sm border border-charcoal/20 rounded-full text-charcoal/80 hover:text-charcoal hover:bg-charcoal/5 hover:border-charcoal/40 no-underline hover:underline hover:decoration-wavy hover:decoration-charcoal/30 hover:underline-offset-4 transition-colors"
              >
                {partner.websiteLabel}
              </a>
            )}
            {partner.twitter && (
              <a
                href={partner.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1 text-sm border border-charcoal/20 rounded-full text-charcoal/80 hover:text-charcoal hover:bg-charcoal/5 hover:border-charcoal/40 no-underline hover:underline hover:decoration-wavy hover:decoration-charcoal/30 hover:underline-offset-4 transition-colors"
              >
                {partner.twitterLabel}
              </a>
            )}
          </div>
        </div>
      </div>

      {posts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-2">Articles</h2>
          <div className="h-px w-12 bg-brand-red mb-6" />
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="group block border-t border-charcoal/10 pt-4 no-underline"
              >
                {post.category && (
                  <span className="text-xs uppercase tracking-widest text-brand-red font-semibold">
                    {post.category}
                  </span>
                )}
                <h3 className="text-lg font-bold text-charcoal group-hover:underline group-hover:decoration-wavy group-hover:decoration-charcoal/30 group-hover:underline-offset-4 mt-1">
                  {post.title}
                </h3>
                <p className="text-sm text-meta-gray mt-1">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  <span className="mx-1">&middot;</span>
                  {post.readingTime} min read
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
