import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Decision Desk Scorecards — The Heat Sheet",
  description:
    "Grading AP, DDHQ, Fox, CNN, NBC, and other decision desks on speed, accuracy, and the tradeoff between the two.",
};

export default function DecisionDeskPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Decision Desk Scorecards
      </h1>
      <p className="text-lg leading-relaxed text-meta-gray mb-8">
        Nobody systematically tracks how well AP, DDHQ, Fox Decision Desk, CNN,
        NBC, and other outlets perform on election night. We do. For every
        election, we log every race call with a timestamp — who called it, when
        they called it, whether they were right, and whether they had to retract.
      </p>
      <div className="border border-charcoal/10 rounded-lg p-10 text-center">
        <p className="text-meta-gray text-lg">
          Scorecards will be published after the 2026 elections.
        </p>
      </div>
    </div>
  );
}
