"use client";

import { useEffect, useState, useMemo } from "react";

interface TweetEntry {
  id: string;
  url: string;
  authorName: string;
  handle: string;
  text: string;
  date?: string;
}

export default function TweetsPage() {
  const [tweets, setTweets] = useState<TweetEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tweets")
      .then((r) => r.json())
      .then((data) => {
        setTweets(data);
        setLoading(false);
      });
  }, []);

  // Split tweets into two columns, interleaving
  const [colA, colB] = useMemo(() => {
    const a: TweetEntry[] = [];
    const b: TweetEntry[] = [];
    tweets.forEach((t, i) => {
      if (i % 2 === 0) a.push(t);
      else b.push(t);
    });
    return [a, b];
  }, [tweets]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Tweets</h1>
        <p className="text-meta-gray">Loading...</p>
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Tweets</h1>
        <p className="text-meta-gray">No tweets yet.</p>
      </div>
    );
  }

  // Need enough tweets for the scroll effect — if too few, just show a static grid
  const animate = tweets.length >= 4;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Tweets</h1>
        <p className="text-meta-gray text-sm">
          Latest from the team on{" "}
          <a
            href="https://x.com/bayes_pr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-meta-gray hover:text-charcoal"
          >
            X / Twitter
          </a>
        </p>
      </div>

      {animate ? (
        <div className="slot-columns">
          <ScrollColumn tweets={colA} direction="up" />
          <ScrollColumn tweets={colB} direction="down" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tweets.map((t) => (
            <TweetCard key={t.id} tweet={t} />
          ))}
        </div>
      )}

      {/* CSS for the slot machine effect */}
      <style jsx>{`
        .slot-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          height: 600px;
          overflow: hidden;
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 8%,
            black 92%,
            transparent 100%
          );
        }

        @media (max-width: 640px) {
          .slot-columns {
            grid-template-columns: 1fr;
            height: 500px;
          }
        }
      `}</style>
    </div>
  );
}

function ScrollColumn({
  tweets,
  direction,
}: {
  tweets: TweetEntry[];
  direction: "up" | "down";
}) {
  // Duplicate list for seamless loop
  const items = [...tweets, ...tweets];

  const animName = direction === "up" ? "scrollUp" : "scrollDown";
  // Approximate card height (padding + text + gap) ~176px per card
  const singleSetHeight = tweets.length * 176;
  const duration = tweets.length * 6; // 6s per tweet

  return (
    <div className="relative overflow-hidden h-full">
      <div
        className="scroll-track flex flex-col gap-4"
        style={{
          animation: `${animName} ${duration}s linear infinite`,
        }}
      >
        {items.map((t, i) => (
          <TweetCard key={`${t.id}-${i}`} tweet={t} />
        ))}
      </div>

      <style jsx>{`
        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-${singleSetHeight}px);
          }
        }

        @keyframes scrollDown {
          0% {
            transform: translateY(-${singleSetHeight}px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .scroll-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

function TweetCard({ tweet }: { tweet: TweetEntry }) {
  return (
    <a
      href={tweet.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block no-underline group"
    >
      <div className="border border-charcoal/10 rounded-xl p-4 bg-white/40 hover:bg-white/70 hover:border-charcoal/20 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-charcoal/10 flex items-center justify-center text-xs font-bold text-charcoal/50 shrink-0">
            {tweet.authorName.charAt(0)}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-sm text-charcoal block leading-tight truncate">
              {tweet.authorName}
            </span>
            <span className="text-xs text-meta-gray leading-tight">
              {tweet.handle}
            </span>
          </div>
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 ml-auto text-meta-gray/50 shrink-0"
            fill="currentColor"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
        <p className="text-sm text-charcoal/80 leading-relaxed line-clamp-4 group-hover:text-charcoal transition-colors">
          {tweet.text}
        </p>
        {tweet.date && (
          <p className="text-xs text-meta-gray mt-2">{tweet.date}</p>
        )}
      </div>
    </a>
  );
}
