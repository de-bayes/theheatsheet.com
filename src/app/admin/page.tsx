"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  category?: string;
  tags?: string[];
  readingTime: number;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(slug: string) {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/editor"
            className="px-4 py-2 text-sm bg-charcoal text-cream rounded hover:bg-charcoal/80 no-underline transition-colors"
          >
            + New Post
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-meta-gray">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-meta-gray">No posts yet.</p>
      ) : (
        <div className="space-y-0">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex items-start justify-between border-t border-charcoal/10 py-4 gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {post.category && (
                    <span className="text-xs uppercase tracking-widest text-brand-red font-semibold">
                      {post.category}
                    </span>
                  )}
                  <span className="text-xs text-meta-gray">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="font-bold text-lg truncate">{post.title}</h2>
                <p className="text-sm text-charcoal/60 truncate">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-meta-gray">
                    {post.author}
                  </span>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span className="text-meta-gray">&middot;</span>
                      <div className="flex gap-1">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-charcoal/5 px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 pt-1">
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-xs text-meta-gray hover:text-charcoal no-underline transition-colors"
                  target="_blank"
                >
                  View
                </Link>
                <Link
                  href={`/admin/editor/${post.slug}`}
                  className="text-xs px-3 py-1.5 bg-charcoal/5 rounded hover:bg-charcoal/10 no-underline transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.slug)}
                  className="text-xs px-3 py-1.5 text-brand-red bg-brand-red/5 rounded hover:bg-brand-red/10 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
