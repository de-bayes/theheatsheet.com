import type { Metadata } from "next";
import Link from "next/link";
import { partners } from "@/data/partners";

export const metadata: Metadata = {
  title: "Partners -- The Heat Sheet",
  description:
    "Meet the partners behind The Heat Sheet -- a group of high school students who love data and politics.",
};

export default function ContributorsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <section className="mb-16 md:mb-20">
        <p className="text-sm uppercase tracking-widest text-meta-gray mb-6">
          Contributors
        </p>

        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
          Meet the Partners
        </h1>

        <div className="flex justify-start mb-10">
          <div className="h-px w-16 bg-charcoal/20" />
        </div>

        <div className="text-lg md:text-xl leading-relaxed space-y-5 text-charcoal/85">
          <p>
            The Heat Sheet is built by a group of high school students who love
            data and politics. We call our team members{" "}
            <strong>Partners</strong> -- because that&apos;s what this is:
            a partnership between people who believe election forecasting should
            be transparent, calibrated, and accountable.
          </p>
        </div>
      </section>

      {/* ---- Partners ---- */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Partners</h2>
        <div className="h-px w-12 bg-brand-red mb-8" />

        <div className="space-y-4">
          {partners.map((partner) => (
            <Link
              key={partner.slug}
              href={`/partners/${partner.slug}`}
              className="group flex items-center justify-between border border-charcoal/10 rounded-lg px-6 py-5 no-underline hover:border-charcoal/30 hover:bg-charcoal/[0.02] transition-colors"
            >
              <div>
                <h3 className="text-xl font-bold text-charcoal group-hover:underline group-hover:decoration-wavy group-hover:decoration-charcoal/30 group-hover:underline-offset-4">
                  {partner.name}
                </h3>
                <p className="text-sm uppercase tracking-widest text-meta-gray mt-1">
                  {partner.role}
                </p>
                <p className="text-base text-charcoal/70 mt-1">
                  {partner.blurb}
                </p>
              </div>
              <span className="text-meta-gray group-hover:text-charcoal transition-colors text-xl ml-4">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- Join Us ---- */}
      <section className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Become a Partner</h2>
        <div className="h-px w-12 bg-brand-red mb-6" />
        <div className="text-lg leading-relaxed space-y-4">
          <p>
            We&apos;re looking for high school and college students who are
            passionate about data, politics, prediction markets, or political
            science. If that sounds like you, we&apos;d love to talk.
          </p>
          <p>
            Reach out at{" "}
            <a
              href="mailto:ryan@theheatsheet.com"
              className="text-brand-red hover:text-brand-red-dark underline underline-offset-2"
            >
              ryan@theheatsheet.com
            </a>{" "}
            to start a conversation about partnering with us.
          </p>
        </div>
      </section>
    </div>
  );
}
