import Link from "next/link";
import Image from "next/image";

interface ArticleCardProps {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  authorSlug?: string;
  image?: string;
  category?: string;
  readingTime: number;
  featured?: boolean;
  stats?: { value: number; label: string; color?: "green" | "red" | "yellow" | "neutral" }[];
  href?: string;
}

export default function ArticleCard({
  slug,
  title,
  date,
  excerpt,
  author,
  authorSlug,
  image,
  category,
  readingTime,
  featured,
  stats,
  href,
}: ArticleCardProps) {
  const url = href ?? `/posts/${slug}`;

  if (featured) {
    return (
      <article className="group border-t border-charcoal/15 pt-6 hover:border-charcoal/40 transition-colors">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {image && (
            <Link href={url} className="block overflow-hidden rounded-lg no-underline md:w-1/2 shrink-0">
              <Image
                src={image}
                alt={title}
                width={800}
                height={500}
                className="w-full h-64 md:h-80 object-cover brightness-105"
              />
            </Link>
          )}
          <div className="flex flex-col justify-center min-w-0">
            {category && (
              <Link
                href={`/tags/${category.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-xs uppercase tracking-widest text-brand-red font-semibold no-underline hover:underline hover:decoration-wavy hover:decoration-brand-red/30 hover:underline-offset-2 transition-colors"
              >
                {category}
              </Link>
            )}
            <div className="text-xs uppercase tracking-widest text-meta-gray mt-1">
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              <span className="mx-1">&middot;</span>
              {readingTime} min read
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-2">
              <Link
                href={url}
                className="text-charcoal no-underline hover:decoration-wavy hover:underline hover:decoration-charcoal/30 hover:underline-offset-4 transition-colors hover:text-charcoal/80"
              >
                {title}
              </Link>
            </h2>
            <p className="text-base md:text-lg text-charcoal/80 leading-relaxed mb-3">
              {excerpt}
            </p>
            {stats && stats.length > 0 && (
              <div className="flex gap-2.5 mb-3">
                {stats.map((s) => {
                  const bg =
                    s.color === "green"
                      ? "bg-[rgba(74,222,128,0.22)]"
                      : s.color === "red"
                        ? "bg-[rgba(248,113,113,0.22)]"
                        : s.color === "yellow"
                          ? "bg-[rgba(250,204,21,0.22)]"
                          : "bg-charcoal/5";
                  return (
                    <div
                      key={s.label}
                      className={`${bg} rounded px-3 py-2 flex items-baseline gap-1.5`}
                    >
                      <span className="text-xl font-bold">{s.value}</span>
                      <span className="text-xs text-meta-gray">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <span className="text-sm text-meta-gray">
              By{" "}
              {authorSlug ? (
                <Link href={`/partners/${authorSlug}`} className="text-meta-gray hover:text-charcoal no-underline hover:underline underline-offset-2 transition-colors">
                  {author}
                </Link>
              ) : (
                author
              )}
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group border-t border-charcoal/15 pt-4 hover:border-charcoal/40 transition-colors">
      {image && (
        <Link href={url} className="block overflow-hidden rounded-lg mb-4 no-underline">
          <Image
            src={image}
            alt={title}
            width={600}
            height={340}
            className="w-full h-48 object-cover brightness-105"
          />
        </Link>
      )}
      {category && (
        <Link
          href={`/tags/${category.toLowerCase().replace(/\s+/g, "-")}`}
          className="text-xs uppercase tracking-widest text-brand-red font-semibold no-underline hover:underline hover:decoration-wavy hover:decoration-brand-red/30 hover:underline-offset-2 transition-colors"
        >
          {category}
        </Link>
      )}
      <div className="text-xs uppercase tracking-widest text-meta-gray mt-1">
        {new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        <span className="mx-1">&middot;</span>
        {readingTime} min read
      </div>
      <h2 className="text-xl font-bold mt-2 mb-2">
        <Link
          href={url}
          className="text-charcoal no-underline hover:decoration-wavy hover:underline hover:decoration-charcoal/30 hover:underline-offset-4 transition-colors hover:text-charcoal/80"
        >
          {title}
        </Link>
      </h2>
      <p className="text-sm text-charcoal/80 leading-relaxed mb-2">
        {excerpt}
      </p>
      <span className="text-sm text-meta-gray">
        By{" "}
        {authorSlug ? (
          <Link href={`/partners/${authorSlug}`} className="text-meta-gray hover:text-charcoal no-underline hover:underline underline-offset-2 transition-colors">
            {author}
          </Link>
        ) : (
          author
        )}
      </span>
    </article>
  );
}
