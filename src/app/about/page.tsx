import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About — The Heat Sheet",
  description:
    "The Heat Sheet is a nonpartisan political analysis publication built on calibration, transparency, and accountability.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <Image
          src="/logo-hat.svg"
          alt="The Heat Sheet"
          width={200}
          height={200}
          className="mx-auto mb-6 w-40 h-40 md:w-48 md:h-48"
        />
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          About The Heat Sheet
        </h1>
        <div className="flex justify-center mt-4">
          <div className="h-1 w-24 rounded bg-gradient-to-r from-brand-red via-brand-orange to-brand-blue" />
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <span className="inline-block w-1.5 h-8 rounded bg-brand-red" />
          What We Are
        </h2>
        <p className="text-lg leading-relaxed mb-4">
          The Heat Sheet is a nonpartisan political analysis publication built by
          young analysts who believe election forecasting should be transparent,
          calibrated, and accountable. We combine the qualitative race-rating
          tradition of the Cook Political Report with the quantitative rigor of
          model-based forecasting and the market-informed thinking of the
          prediction market ecosystem.
        </p>
        <p className="text-lg leading-relaxed">
          We are not just another ratings site. We rate races, but we also grade
          the raters. We analyze campaign money, but we measure whether it
          actually works. We track prediction markets, but we tell you which ones
          to trust. Every claim we make is backed by data, and every projection
          we publish is scored after the fact.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <span className="inline-block w-1.5 h-8 rounded bg-brand-orange" />
          Our Thesis
        </h2>
        <p className="text-lg leading-relaxed mb-4">
          The current political forecasting landscape has a gap. Qualitative
          raters like Cook, Sabato, and Inside Elections produce expert judgments
          but refuse to attach probabilities to their ratings and optimize for
          reputational safety over calibration. Quantitative outlets like the
          late FiveThirtyEight and Split Ticket build models but don&apos;t
          systematically hold other forecasters accountable. Prediction markets
          offer real-time pricing but suffer from illiquidity, wide bid-ask
          spreads, and a lack of independent quality assessment.
        </p>
        <p className="text-lg leading-relaxed">
          The Heat Sheet sits at the intersection of all three. We publish race
          ratings with explicit probability estimates. We grade decision desks
          and forecasters on accuracy and calibration. We evaluate prediction
          markets on health and reliability. And we investigate whether campaign
          spending actually moves the needle.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <span className="inline-block w-1.5 h-8 rounded bg-brand-blue" />
          Why &ldquo;The Heat Sheet&rdquo;?
        </h2>
        <p className="text-lg leading-relaxed mb-4">
          In competitive swimming, a heat sheet is the document handed out before
          a meet that lists every race, every competitor, their seed times, and
          their lane assignments. It&apos;s the essential reference &mdash; a
          compact, data-rich summary of who&apos;s racing, where they stand, and
          what to expect. That&apos;s exactly what we aim to be for American
          politics: the essential reference for every competitive race,
          who&apos;s running, where they stand, and what to watch for.
        </p>
        <p className="text-lg leading-relaxed">
          The name also works on its own terms &mdash; &ldquo;heat&rdquo;
          implies intensity, competition, and pressure; &ldquo;sheet&rdquo;
          implies a reference document, a data source, a ratings page. You
          don&apos;t need to know anything about swimming for the name to land.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <span className="inline-block w-1.5 h-8 rounded bg-brand-red" />
          Core Principles
        </h2>

        <div className="space-y-8">
          <div className="border-l-2 border-charcoal/10 pl-6">
            <h3 className="text-xl font-bold mb-2">
              1. Calibration Over Accuracy
            </h3>
            <p className="text-lg leading-relaxed">
              A &ldquo;Lean R&rdquo; that wins by 25 points is a worse
              prediction than a &ldquo;Toss Up&rdquo; that wins by 1, even
              though both &ldquo;called it right.&rdquo; We optimize for each
              rating category actually meaning what it says. After every
              election, we publish a full calibration report grading our own
              performance.
            </p>
          </div>

          <div className="border-l-2 border-charcoal/10 pl-6">
            <h3 className="text-xl font-bold mb-2">
              2. Radical Transparency
            </h3>
            <p className="text-lg leading-relaxed">
              Every rating we publish includes our reasoning. Every model we
              build has its methodology documented. We show our work because we
              believe forecasting without transparency is just punditry with a
              spreadsheet.
            </p>
          </div>

          <div className="border-l-2 border-charcoal/10 pl-6">
            <h3 className="text-xl font-bold mb-2">
              3. Accountability for Everyone
            </h3>
            <p className="text-lg leading-relaxed">
              If we grade decision desks on their calls, we grade ourselves too.
              If we critique a prediction market&apos;s liquidity, we disclose
              our own positions. The political forecasting world needs more
              accountability, and that starts with us.
            </p>
          </div>

          <div className="border-l-2 border-charcoal/10 pl-6">
            <h3 className="text-xl font-bold mb-2">
              4. Nonpartisan Analysis
            </h3>
            <p className="text-lg leading-relaxed">
              Our team members have their own political views. We do not pretend
              otherwise. But our ratings, models, and analysis are built to be as
              free of partisan bias as possible. The diversity of viewpoints on
              our team acts as a check on any one perspective dominating our
              output.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          <span className="inline-block w-1.5 h-8 rounded bg-brand-blue" />
          What We Publish
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-charcoal/[0.03] rounded-lg p-5">
            <h3 className="text-xl font-bold mb-1">Race Ratings</h3>
            <p className="text-base leading-relaxed text-charcoal/80">
              Every competitive House, Senate, and gubernatorial race rated with
              explicit probability estimates and margin ranges.
            </p>
          </div>

          <div className="bg-charcoal/[0.03] rounded-lg p-5">
            <h3 className="text-xl font-bold mb-1">The Spread</h3>
            <p className="text-base leading-relaxed text-charcoal/80">
              When prediction markets, expert ratings, and fundamentals disagree
              on the same race &mdash; we break down why and who we think is right.
            </p>
          </div>

          <div className="bg-charcoal/[0.03] rounded-lg p-5">
            <h3 className="text-xl font-bold mb-1">
              Decision Desk Scorecards
            </h3>
            <p className="text-base leading-relaxed text-charcoal/80">
              Grading AP, DDHQ, Fox, CNN, and NBC on election night speed,
              accuracy, and the tradeoff between the two.
            </p>
          </div>

          <div className="bg-charcoal/[0.03] rounded-lg p-5">
            <h3 className="text-xl font-bold mb-1">
              Prediction Market Health Grades
            </h3>
            <p className="text-base leading-relaxed text-charcoal/80">
              Not all markets are created equal. We grade them on liquidity,
              volume, spreads, and convergence.
            </p>
          </div>

          <div className="bg-charcoal/[0.03] rounded-lg p-5 md:col-span-2">
            <h3 className="text-xl font-bold mb-1">
              Campaign Finance Effectiveness
            </h3>
            <p className="text-base leading-relaxed text-charcoal/80">
              Measuring whether campaign spending actually moves the needle &mdash;
              Wins Above Replacement for political money.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
