"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TweetEntry {
  id: string;
  url: string;
  authorName: string;
  handle: string;
  text: string;
  date?: string;
  addedAt: string;
}

export default function AdminTweetsPage() {
  const [tweets, setTweets] = useState<TweetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [authorName, setAuthorName] = useState("Ryan McComb");
  const [handle, setHandle] = useState("@bayes_pr");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/tweets")
      .then((r) => r.json())
      .then((data) => {
        setTweets(data);
        setLoading(false);
      });
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAdding(true);

    const res = await fetch("/api/tweets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, authorName, handle, text, date }),
    });

    setAdding(false);

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Failed to add tweet");
      return;
    }

    const entry = await res.json();
    setTweets((prev) => [entry, ...prev]);
    setUrl("");
    setText("");
    setDate("");
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this tweet?")) return;
    const res = await fetch(`/api/tweets?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setTweets((prev) => prev.filter((t) => t.id !== id));
    }
  }

  const inputClass =
    "w-full px-3 py-2 bg-cream border border-charcoal/15 rounded text-charcoal focus:outline-none focus:border-charcoal/40 transition-colors font-serif";
  const labelClass = "block text-xs uppercase tracking-widest text-meta-gray mb-1";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Tweets</h1>
        <div className="flex gap-3">
          <Link
            href="/tweets"
            className="text-xs text-meta-gray hover:text-charcoal no-underline transition-colors"
            target="_blank"
          >
            View Public Page
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 text-sm bg-charcoal/5 text-charcoal rounded hover:bg-charcoal/10 no-underline transition-colors"
          >
            Back to Admin
          </Link>
        </div>
      </div>

      {/* Add tweet form */}
      <form onSubmit={handleAdd} className="border border-charcoal/15 rounded p-4 mb-8">
        <h2 className="font-bold mb-3">Add Tweet</h2>
        {error && (
          <div className="mb-3 px-3 py-2 bg-brand-red/10 text-brand-red rounded text-sm">
            {error}
          </div>
        )}
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Tweet URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={inputClass}
              placeholder="https://x.com/bayes_pr/status/123456789"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Author Name</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className={inputClass}
                placeholder="Ryan McComb"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Handle</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className={inputClass}
                placeholder="@bayes_pr"
                required
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Tweet Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="Paste the tweet text here..."
              required
            />
          </div>
          <div>
            <label className={labelClass}>Date (optional)</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
              placeholder="Feb 28, 2026"
            />
          </div>
          <button
            type="submit"
            disabled={adding}
            className="px-4 py-2 bg-charcoal text-cream rounded hover:bg-charcoal/80 disabled:opacity-50 transition-colors text-sm cursor-pointer"
          >
            {adding ? "Adding..." : "Add Tweet"}
          </button>
        </div>
      </form>

      {/* Tweet list */}
      {loading ? (
        <p className="text-meta-gray">Loading...</p>
      ) : tweets.length === 0 ? (
        <p className="text-meta-gray">No tweets added yet. Add one above.</p>
      ) : (
        <div className="space-y-0">
          {tweets.map((tweet) => (
            <div
              key={tweet.id}
              className="flex items-start justify-between border-t border-charcoal/10 py-3 gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{tweet.authorName}</span>
                  <span className="text-xs text-meta-gray">{tweet.handle}</span>
                  {tweet.date && (
                    <span className="text-xs text-meta-gray">&middot; {tweet.date}</span>
                  )}
                </div>
                <p className="text-sm text-charcoal/70 line-clamp-2">{tweet.text}</p>
                <a
                  href={tweet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-meta-gray hover:text-charcoal mt-1 inline-block"
                >
                  {tweet.url}
                </a>
              </div>
              <button
                onClick={() => handleDelete(tweet.id)}
                className="text-xs px-3 py-1.5 text-brand-red bg-brand-red/5 rounded hover:bg-brand-red/10 transition-colors shrink-0 cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
