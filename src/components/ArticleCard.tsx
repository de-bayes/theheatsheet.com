import Link from "next/link";

interface ArticleCardProps {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  image?: string;
  category?: string;
  readingTime: number;
  featured?: boolean;
}

export default function ArticleCard({
  slug,
  title,
  date,
  excerpt,
  author,
  image,
  category,
  readingTime,
  featured,
}: ArticleCardProps) {
  return (
    <article className={`group border-t border-charcoal/15 pt-4 hover:border-charcoal/40 transition-colors ${featured ? "md:col-span-2" : ""}`}>
      {image && (
        <Link href={`/posts/${slug}`} className="block overflow-hidden mb-4 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            width={600}
            height={340}
            loading="lazy"
            decoding="async"
            className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${featured ? "h-64 md:h-80" : "h-48"}`}
          />
        </Link>
      )}
      {category && (
        <span className="text-xs uppercase tracking-widest text-brand-red font-semibold">
          {category}
        </span>
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
      <h2 className={`font-bold mt-2 mb-2 ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}>
        <Link
          href={`/posts/${slug}`}
          className="text-charcoal no-underline hover:decoration-wavy hover:underline hover:decoration-charcoal/30 hover:underline-offset-4 transition-colors hover:text-charcoal/80"
        >
          {title}
        </Link>
      </h2>
      <p className={`text-charcoal/80 leading-relaxed mb-2 ${featured ? "text-base md:text-lg" : "text-sm"}`}>
        {excerpt}
      </p>
      <span className="text-sm text-meta-gray">By {author}</span>
    </article>
  );
}
