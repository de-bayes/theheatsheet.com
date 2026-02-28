"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TweetEntry {
  id: string;
  url: string;
  note?: string;
  pinned?: boolean;
  addedAt: string;
}

export default function AdminTweetsPage() {
  const [tweets, setTweets] = useState<TweetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [pinned, setPinned] = useState(false);
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
      body: JSON.stringify({ url, note, pinned }),
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
    setNote("");
    setPinned(false);
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
            <label className="block text-xs uppercase tracking-widest text-meta-gray mb-1">
              Tweet URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={inputClass}
              placeholder="https://x.com/bayes_pr/status/123456789"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-meta-gray mb-1">
              Note (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={inputClass}
              placeholder="Context or description for this tweet"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinned"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="accent-charcoal"
            />
            <label htmlFor="pinned" className="text-sm text-charcoal/70">
              Pin to top
            </label>
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
              className="flex items-center justify-between border-t border-charcoal/10 py-3 gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {tweet.pinned && (
                    <span className="text-xs text-brand-red font-semibold uppercase tracking-widest">
                      Pinned
                    </span>
                  )}
                  <a
                    href={tweet.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-charcoal/70 hover:text-charcoal truncate"
                  >
                    {tweet.url}
                  </a>
                </div>
                {tweet.note && (
                  <p className="text-xs text-meta-gray mt-0.5 truncate">
                    {tweet.note}
                  </p>
                )}
                <p className="text-xs text-meta-gray mt-0.5">
                  Added{" "}
                  {new Date(tweet.addedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
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
