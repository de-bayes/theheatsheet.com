import Link from "next/link";

interface ArticleCardProps {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  image?: string;
  category?: string;
}

export default function ArticleCard({
  slug,
  title,
  date,
  excerpt,
  author,
  image,
  category,
}: ArticleCardProps) {
  return (
    <article className="group">
      {image && (
        <Link href={`/posts/${slug}`} className="block overflow-hidden mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            width={600}
            height={340}
            loading="lazy"
            decoding="async"
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}
      {category && (
        <span className="text-xs uppercase tracking-widest text-link-blue font-semibold">
          {category}
        </span>
      )}
      <div className="text-xs uppercase tracking-widest text-meta-gray mt-1">
        {new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <h2 className="text-xl font-bold mt-2 mb-2">
        <Link
          href={`/posts/${slug}`}
          className="text-charcoal no-underline hover:no-underline hover:text-link-blue transition-colors"
        >
          {title}
        </Link>
      </h2>
      <p className="text-sm text-charcoal/80 leading-relaxed mb-2">
        {excerpt}
      </p>
      <span className="text-sm text-meta-gray">By {author}</span>
    </article>
  );
}
