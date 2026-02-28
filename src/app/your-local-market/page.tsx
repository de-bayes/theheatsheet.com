import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import gradesData from "@/data/grades/latest.json";
import MarketGradesTable from "@/components/MarketGradesTable";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Your Local Market -- The Heat Sheet",
  description:
    "Every House, gubernatorial, and Senate prediction market graded daily on volume, spreads, and open interest.",
};

export default async function YourLocalMarketPage() {
  const post = await getPostBySlug("your-local-market");
  if (!post) notFound();

  return (
    <div>
      {/* Hero */}
      <div className="max-w-3xl mx-auto mb-12 text-center">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center bg-[#e8dff0] px-3 py-1.5 text-xs uppercase tracking-widest font-semibold text-[#5b4a7a]">
            <Link
              href="/tags/prediction-markets"
              className="text-[#5b4a7a] no-underline hover:underline hover:decoration-wavy hover:decoration-[#5b4a7a]/40 hover:underline-offset-2 transition-all"
            >
              Prediction Markets
            </Link>
            <span className="mx-1.5 text-[#5b4a7a]/30">&middot;</span>
            <Link
              href="/tags/2026-midterms"
              className="text-[#5b4a7a] no-underline hover:underline hover:decoration-wavy hover:decoration-[#5b4a7a]/40 hover:underline-offset-2 transition-all"
            >
              2026 Midterms
            </Link>
            <span className="mx-1.5 text-[#5b4a7a]/30">&middot;</span>
            <Link
              href="/the-spread"
              className="text-[#5b4a7a] no-underline hover:underline hover:decoration-wavy hover:decoration-[#5b4a7a]/40 hover:underline-offset-2 transition-all"
            >
              The Spread
            </Link>
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          Your Local Market
        </h1>
        <p className="text-sm uppercase tracking-widest text-meta-gray mb-6">
          Published by{" "}
          <Link
            href="/partners/ryanm"
            className="text-meta-gray hover:text-charcoal no-underline hover:underline hover:decoration-wavy hover:decoration-charcoal/30 hover:underline-offset-2 transition-colors"
          >
            Ryan McComb
          </Link>
        </p>
        <p className="text-lg md:text-xl leading-relaxed text-charcoal/75 mb-8">
          Not all prediction markets are created equal. We grade every House,
          gubernatorial, and Senate market daily on volume, spreads, and open
          interest -- so you know which prices to trust.
        </p>
        <div className="rounded-2xl overflow-hidden border border-charcoal/10 mb-8">
          <Image
            src="/images/your-local-market-hero.png"
            alt="A red food truck labeled Fresh Market Kalshi, loaded with produce"
            width={1536}
            height={1024}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Article intro */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="h-px w-16 bg-charcoal/20 mb-8" />
        <p className="text-lg leading-relaxed text-charcoal/85">
          Prediction markets are increasingly cited as if every price is equally
          meaningful -- but a 62% backed by deep liquidity is a fundamentally
          different signal than a 62% in a market nobody&apos;s trading. We pull
          data from Kalshi every day and score each race on three dimensions --
          trading volume, bid-ask spread, and open interest -- then roll those
          into a single letter grade, A through F. Click any column header to
          sort. Click a race to visit the market on Kalshi.
        </p>
      </div>

      {/* Live grades table */}
      <div className="mb-16">
        <MarketGradesTable races={gradesData.races} date={gradesData.date} />
      </div>

      {/* Methodology */}
      <div className="max-w-3xl mx-auto">
        <div className="border-t border-charcoal/10 pt-10">
          <h2 className="text-2xl font-bold mb-2">Methodology</h2>
          <div className="flex items-center gap-3 text-sm text-meta-gray mb-8">
            <span>
              By{" "}
              <Link
                href={`/partners/${post.authorSlug}`}
                className="text-meta-gray hover:text-charcoal no-underline hover:underline underline-offset-2 transition-colors"
              >
                {post.author}
              </Link>
            </span>
            <span>&middot;</span>
            <span>{post.readingTime} min read</span>
          </div>
          <div
            className="article-content text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>
      </div>
      <BackToTop />
    </div>
  );
}
