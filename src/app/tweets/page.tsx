"use client";

import { useEffect, useState, useCallback } from "react";
import Script from "next/script";

interface TweetEntry {
  id: string;
  url: string;
  note?: string;
  pinned?: boolean;
  addedAt: string;
}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (el?: HTMLElement) => void;
      };
    };
  }
}

export default function TweetsPage() {
  const [tweets, setTweets] = useState<TweetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [widgetsReady, setWidgetsReady] = useState(false);

  const loadWidgets = useCallback(() => {
    if (window.twttr?.widgets) {
      window.twttr.widgets.load();
    }
  }, []);

  useEffect(() => {
    fetch("/api/tweets")
      .then((r) => r.json())
      .then((data) => {
        setTweets(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && widgetsReady) {
      // Small delay so DOM is ready
      setTimeout(loadWidgets, 100);
    }
  }, [loading, widgetsReady, loadWidgets]);

  const pinned = tweets.filter((t) => t.pinned);
  const rest = tweets.filter((t) => !t.pinned);

  return (
    <div className="max-w-2xl mx-auto">
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => setWidgetsReady(true)}
      />

      <h1 className="text-3xl font-bold mb-2">Tweets</h1>
      <p className="text-meta-gray mb-8">
        Posts from{" "}
        <a
          href="https://x.com/bayes_pr"
          target="_blank"
          rel="noopener noreferrer"
          className="text-meta-gray hover:text-charcoal"
        >
          @bayes_pr
        </a>
      </p>

      {loading ? (
        <p className="text-meta-gray">Loading tweets...</p>
      ) : tweets.length === 0 ? (
        <p className="text-meta-gray">No tweets added yet.</p>
      ) : (
        <div className="space-y-6">
          {pinned.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-widest text-meta-gray mb-3">
                Pinned
              </div>
              {pinned.map((tweet) => (
                <TweetEmbed key={tweet.id} tweet={tweet} />
              ))}
            </div>
          )}

          {rest.map((tweet) => (
            <TweetEmbed key={tweet.id} tweet={tweet} />
          ))}
        </div>
      )}
    </div>
  );
}

function TweetEmbed({ tweet }: { tweet: TweetEntry }) {
  return (
    <div className="border-t border-charcoal/10 pt-4">
      {tweet.note && (
        <p className="text-sm text-charcoal/70 italic mb-2">{tweet.note}</p>
      )}
      <blockquote className="twitter-tweet" data-dnt="true" data-theme="light">
        <a href={tweet.url}>{tweet.url}</a>
      </blockquote>
    </div>
  );
}
