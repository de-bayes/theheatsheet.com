"use client";

import { useState } from "react";
import Link from "next/link";

interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  authorSlug: string;
  image: string;
  category: string;
  tags: string[];
  content: string;
}

interface PostEditorProps {
  initial?: PostData;
  onSave: (data: PostData) => void;
  saving: boolean;
  isEditing?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function PostEditor({ initial, onSave, saving, isEditing }: PostEditorProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!initial?.slug);
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().split("T")[0]);
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "Ryan McComb");
  const [authorSlug, setAuthorSlug] = useState(initial?.authorSlug ?? "ryanm");
  const [image, setImage] = useState(initial?.image ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [tagsInput, setTagsInput] = useState(initial?.tags?.join(", ") ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [showPreview, setShowPreview] = useState(false);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugManual && !isEditing) {
      setSlug(slugify(val));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ slug, title, date, excerpt, author, authorSlug, image, category, tags, content });
  }

  const inputClass =
    "w-full px-3 py-2 bg-cream border border-charcoal/15 rounded text-charcoal focus:outline-none focus:border-charcoal/40 transition-colors font-serif";
  const labelClass = "block text-xs uppercase tracking-widest text-meta-gray mb-1";

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className={labelClass}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={`${inputClass} text-xl font-bold`}
            placeholder="Post title"
            required
          />
        </div>

        <div>
          <label className={labelClass}>
            Slug
            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setSlugManual(!slugManual);
                  if (slugManual) setSlug(slugify(title));
                }}
                className="ml-2 text-meta-gray hover:text-charcoal transition-colors normal-case tracking-normal"
              >
                ({slugManual ? "auto" : "manual"})
              </button>
            )}
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlugManual(true);
              setSlug(e.target.value);
            }}
            className={inputClass}
            placeholder="post-url-slug"
            required
            disabled={isEditing}
          />
        </div>

        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={inputClass}
            placeholder="Author name"
          />
        </div>

        <div>
          <label className={labelClass}>Author Slug</label>
          <input
            type="text"
            value={authorSlug}
            onChange={(e) => setAuthorSlug(e.target.value)}
            className={inputClass}
            placeholder="ryanm"
          />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
            placeholder="e.g. The Spread, Announcements"
          />
        </div>

        <div>
          <label className={labelClass}>Image Path</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className={inputClass}
            placeholder="/images/example.png"
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Tags (comma-separated)</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className={inputClass}
            placeholder="Prediction Markets, 2026 Midterms"
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className={`${inputClass} resize-none`}
            rows={2}
            placeholder="Brief description shown on article cards"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <label className={labelClass}>Content (Markdown)</label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs text-meta-gray hover:text-charcoal transition-colors cursor-pointer"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>

        {showPreview ? (
          <div className="article-content border border-charcoal/15 rounded p-6 min-h-[400px] bg-white/50">
            <MarkdownPreview content={content} />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${inputClass} font-mono text-sm resize-y`}
            rows={20}
            placeholder="Write your post in Markdown..."
            style={{ minHeight: "400px" }}
          />
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-charcoal/10 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-charcoal text-cream rounded hover:bg-charcoal/80 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Post"}
        </button>
        <Link
          href="/admin"
          className="px-4 py-2 text-sm text-meta-gray hover:text-charcoal no-underline transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  // Simple client-side markdown preview — handles the basics
  const html = content
    // Headers
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Blockquotes
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Line breaks to paragraphs
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");

  return (
    <div dangerouslySetInnerHTML={{ __html: `<p>${html}</p>` }} />
  );
}
