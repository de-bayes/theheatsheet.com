import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About -- The Heat Sheet",
  description:
    "The Heat Sheet is a nonpartisan political analysis publication built on calibration, transparency, and accountability.",
};

const linkClass =
  "text-charcoal underline underline-offset-2 hover:bg-charcoal/5 hover:decoration-wavy hover:decoration-charcoal/30 transition-colors";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* ---- Hero: Origin Story ---- */}
      <section className="mb-16 md:mb-20">
        <p className="text-sm uppercase tracking-widest text-meta-gray mb-6">
          About The Heat Sheet
        </p>

        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
          The essential reference for every competitive race in American
          politics.
        </h1>

        <div className="flex justify-start mb-10">
          <div className="h-px w-16 bg-charcoal/20" />
        </div>

        <div className="text-lg md:text-xl leading-relaxed space-y-5 text-charcoal/85">
          <p>
            In competitive swimming, a heat sheet is the document handed out
            before a meet that lists every race, every competitor, their seed
            times, and their lane assignments. It&apos;s the essential reference
            -- a compact, data-rich summary of who&apos;s racing, where
            they stand, and what to expect.
          </p>
          <p>
            That&apos;s exactly what we aim to be for American politics: the
            essential reference for every competitive race, who&apos;s running,
            where they stand, and what to watch for.
          </p>
          <p className="text-charcoal/65 text-base md:text-lg">
            The name also works on its own terms -- &ldquo;heat&rdquo;
            implies intensity, competition, and pressure; &ldquo;sheet&rdquo;
            implies a reference document, a data source, a ratings page. You
            don&apos;t need to know anything about swimming for the name to
            land.
          </p>
        </div>
      </section>

      {/* ---- What We Do ---- */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          What We Do
        </h2>
        <div className="h-px w-12 bg-brand-red mb-6" />
        <div className="text-lg leading-relaxed space-y-4">
          <p>
            The Heat Sheet is a nonpartisan political analysis publication. We
            rate races with explicit probabilities, grade forecasters on
            calibration, score decision desks on election night, and evaluate
            prediction markets on health and reliability. Every claim is backed
            by data. Every projection is scored after the fact.
          </p>
          <p>
            Our first project,{" "}
            <Link href="/your-local-market" className={linkClass}>
              Your Local Market
            </Link>
            , tackles something nobody else is doing -- grading every House,
            gubernatorial, and Senate prediction market daily on volume, open
            interest, and spreads. It lives under{" "}
            <Link href="/the-spread" className={linkClass}>
              The Spread
            </Link>
            , our prediction market analysis vertical -- where we track
            liquidity, explain what the prices mean, and separate signal from
            noise.
          </p>
        </div>
      </section>

      {/* ---- Who We Are ---- */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Who We Are
        </h2>
        <div className="h-px w-12 bg-brand-red mb-6" />
        <div className="text-lg leading-relaxed space-y-4">
          <p>
            A group of high school students who love data and politics. We
            believe you don&apos;t need a newsroom budget to do election
            forecasting well -- just rigor, transparency, and a willingness to
            be graded on your own predictions.
          </p>
          <p>
            <Link href="/partners" className={linkClass}>
              Meet the partners &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* ---- Contact ---- */}
      <section className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Contact
        </h2>
        <div className="h-px w-12 bg-brand-red mb-6" />
        <div className="text-lg leading-relaxed">
          <p>
            Questions, tips, or partnership inquiries:{" "}
            <a
              href="mailto:ryan@theheatsheet.com"
              className={linkClass}
            >
              ryan@theheatsheet.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
