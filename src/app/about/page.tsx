import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — The Heat Sheet",
  description:
    "The Heat Sheet is a nonpartisan political analysis publication built on calibration, transparency, and accountability.",
};

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
          <div className="h-1 w-16 rounded bg-gradient-to-r from-brand-red via-brand-orange to-brand-blue" />
        </div>

        <div className="text-lg md:text-xl leading-relaxed space-y-5 text-charcoal/85">
          <p>
            In competitive swimming, a heat sheet is the document handed out
            before a meet that lists every race, every competitor, their seed
            times, and their lane assignments. It&apos;s the essential reference
            &mdash; a compact, data-rich summary of who&apos;s racing, where
            they stand, and what to expect.
          </p>
          <p>
            That&apos;s exactly what we aim to be for American politics: the
            essential reference for every competitive race, who&apos;s running,
            where they stand, and what to watch for.
          </p>
          <p className="text-charcoal/65 text-base md:text-lg">
            The name also works on its own terms &mdash; &ldquo;heat&rdquo;
            implies intensity, competition, and pressure; &ldquo;sheet&rdquo;
            implies a reference document, a data source, a ratings page. You
            don&apos;t need to know anything about swimming for the name to
            land.
          </p>
        </div>
      </section>

      {/* ---- What We Are ---- */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-xs uppercase tracking-widest text-meta-gray mb-5">
          What We Are
        </h2>
        <div className="text-lg leading-relaxed space-y-4">
          <p>
            The Heat Sheet is a nonpartisan political analysis publication built
            by young analysts who believe election forecasting should be
            transparent, calibrated, and accountable. We combine the qualitative
            race-rating tradition of the Cook Political Report with the
            quantitative rigor of model-based forecasting and the
            market-informed thinking of the prediction market ecosystem.
          </p>
          <p>
            We are not just another ratings site. We rate races, but we also
            grade the raters. We analyze campaign money, but we measure whether
            it actually works. We track prediction markets, but we tell you
            which ones to trust. Every claim we make is backed by data, and
            every projection we publish is scored after the fact.
          </p>
        </div>
      </section>

      {/* ---- Our Thesis ---- */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-xs uppercase tracking-widest text-meta-gray mb-5">
          Our Thesis
        </h2>
        <div className="text-lg leading-relaxed space-y-4">
          <p>
            The current political forecasting landscape has a gap. Qualitative
            raters like Cook, Sabato, and Inside Elections produce expert
            judgments but refuse to attach probabilities to their ratings and
            optimize for reputational safety over calibration. Quantitative
            outlets like the late FiveThirtyEight and Split Ticket build models
            but don&apos;t systematically hold other forecasters accountable.
            Prediction markets offer real-time pricing but suffer from
            illiquidity, wide bid-ask spreads, and a lack of independent quality
            assessment.
          </p>
          <p>
            The Heat Sheet sits at the intersection of all three. We publish
            race ratings with explicit probability estimates. We grade decision
            desks and forecasters on accuracy and calibration. We evaluate
            prediction markets on health and reliability. And we investigate
            whether campaign spending actually moves the needle.
          </p>
        </div>
      </section>

      {/* ---- Core Principles ---- */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-xs uppercase tracking-widest text-meta-gray mb-5">
          Core Principles
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-2">
              Calibration Over Accuracy
            </h3>
            <p className="text-lg leading-relaxed text-charcoal/85">
              A &ldquo;Lean R&rdquo; that wins by 25 points is a worse
              prediction than a &ldquo;Toss Up&rdquo; that wins by 1, even
              though both &ldquo;called it right.&rdquo; We optimize for each
              rating category actually meaning what it says. After every
              election, we publish a full calibration report grading our own
              performance.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Radical Transparency</h3>
            <p className="text-lg leading-relaxed text-charcoal/85">
              Every rating we publish includes our reasoning. Every model we
              build has its methodology documented. We show our work because we
              believe forecasting without transparency is just punditry with a
              spreadsheet.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">
              Accountability for Everyone
            </h3>
            <p className="text-lg leading-relaxed text-charcoal/85">
              If we grade decision desks on their calls, we grade ourselves too.
              If we critique a prediction market&apos;s liquidity, we disclose
              our own positions. The political forecasting world needs more
              accountability, and that starts with us.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Nonpartisan Analysis</h3>
            <p className="text-lg leading-relaxed text-charcoal/85">
              Our team members have their own political views. We do not pretend
              otherwise. But our ratings, models, and analysis are built to be
              as free of partisan bias as possible. The diversity of viewpoints
              on our team acts as a check on any one perspective dominating our
              output.
            </p>
          </div>
        </div>
      </section>

      {/* ---- What We Publish ---- */}
      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-widest text-meta-gray mb-5">
          What We Publish
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="border border-charcoal/10 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-1">Race Ratings</h3>
            <p className="text-base leading-relaxed text-charcoal/70">
              Every competitive House, Senate, and gubernatorial race rated with
              explicit probability estimates and margin ranges.
            </p>
          </div>

          <div className="border border-charcoal/10 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-1">The Spread</h3>
            <p className="text-base leading-relaxed text-charcoal/70">
              When prediction markets, expert ratings, and fundamentals disagree
              on the same race &mdash; we break down why and who we think is
              right.
            </p>
          </div>

          <div className="border border-charcoal/10 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-1">
              Decision Desk Scorecards
            </h3>
            <p className="text-base leading-relaxed text-charcoal/70">
              Grading AP, DDHQ, Fox, CNN, and NBC on election night speed,
              accuracy, and the tradeoff between the two.
            </p>
          </div>

          <div className="border border-charcoal/10 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-1">
              Prediction Market Health Grades
            </h3>
            <p className="text-base leading-relaxed text-charcoal/70">
              Not all markets are created equal. We grade them on liquidity,
              volume, spreads, and convergence.
            </p>
          </div>

          <div className="border border-charcoal/10 rounded-lg p-6 md:col-span-2">
            <h3 className="text-lg font-bold mb-1">
              Campaign Finance Effectiveness
            </h3>
            <p className="text-base leading-relaxed text-charcoal/70">
              Measuring whether campaign spending actually moves the needle
              &mdash; Wins Above Replacement for political money.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
