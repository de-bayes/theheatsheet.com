"use client";

import { useState } from "react";

function Frac({ num, den }: { num: React.ReactNode; den: React.ReactNode }) {
  return (
    <span className="inline-flex flex-col items-center mx-1 align-middle">
      <span className="px-1 leading-tight">{num}</span>
      <span className="w-full h-px bg-charcoal/80" />
      <span className="px-1 leading-tight">{den}</span>
    </span>
  );
}

function fmt(n: number): string {
  return (n * 100).toFixed(1) + "%";
}

export default function BayesCalculator() {
  const [priorGood, setPriorGood] = useState(0.5);
  const [pEvidenceGood, setPEvidenceGood] = useState(0.1);
  const [pEvidenceBad, setPEvidenceBad] = useState(0.6);

  const pEvidence =
    pEvidenceGood * priorGood + pEvidenceBad * (1 - priorGood);
  const posterior =
    pEvidence > 0 ? (pEvidenceGood * priorGood) / pEvidence : 0;

  return (
    <div className="mt-10 max-w-xl mx-auto">
      {/* Formula display */}
      <div className="text-center mb-8 overflow-x-auto">
        <div className="inline-block text-base md:text-lg italic font-serif whitespace-nowrap">
          <span className="not-italic text-charcoal/50 text-sm mr-2">
            Bayes&apos; Theorem
          </span>
          <br className="md:hidden" />
          <span className="mt-2 inline-block">
            P(<span className="not-italic">Good</span> | <span className="not-italic">404</span>)
            {" = "}
            <Frac
              num={
                <>
                  P(<span className="not-italic">404</span> | <span className="not-italic">Good</span>)
                  {" · "}
                  P(<span className="not-italic">Good</span>)
                </>
              }
              den={
                <>P(<span className="not-italic">404</span>)</>
              }
            />
          </span>
        </div>
      </div>

      {/* Expanded denominator */}
      <div className="text-center mb-10 overflow-x-auto">
        <div className="inline-block text-xs md:text-sm italic font-serif text-charcoal/60 whitespace-nowrap">
          where P(<span className="not-italic">404</span>)
          {" = "}
          P(<span className="not-italic">404</span> | <span className="not-italic">Good</span>)
          {" · "}
          P(<span className="not-italic">Good</span>)
          {" + "}
          P(<span className="not-italic">404</span> | <span className="not-italic">¬Good</span>)
          {" · "}
          P(<span className="not-italic">¬Good</span>)
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-6 mb-8">
        <SliderRow
          label={<>P(<span className="not-italic">Good</span>)</>}
          description="Prior: probability I'm a good programmer"
          value={priorGood}
          onChange={setPriorGood}
        />
        <SliderRow
          label={<>P(<span className="not-italic">404</span> | <span className="not-italic">Good</span>)</>}
          description="Likelihood of a 404 if I am good"
          value={pEvidenceGood}
          onChange={setPEvidenceGood}
        />
        <SliderRow
          label={<>P(<span className="not-italic">404</span> | <span className="not-italic">¬Good</span>)</>}
          description="Likelihood of a 404 if I am not good"
          value={pEvidenceBad}
          onChange={setPEvidenceBad}
        />
      </div>

      {/* Result */}
      <div className="text-center border-t border-charcoal/10 pt-6">
        <div className="text-sm text-meta-gray uppercase tracking-widest mb-2">
          Posterior
        </div>
        <div className="font-logo text-4xl md:text-5xl font-light text-charcoal">
          {fmt(posterior)}
        </div>
        <div className="text-sm italic text-charcoal/50 mt-2 font-serif">
          P(<span className="not-italic">Good Programmer</span> | <span className="not-italic">You Hit a 404</span>)
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  description,
  value,
  onChange,
}: {
  label: React.ReactNode;
  description: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-serif italic">{label}</span>
        <span className="text-sm font-mono text-charcoal/70 tabular-nums">
          {fmt(value)}
        </span>
      </div>
      <div className="text-xs text-meta-gray mb-2">{description}</div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(value * 100)}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="w-full h-1 bg-charcoal/10 rounded appearance-none cursor-pointer accent-charcoal"
      />
    </div>
  );
}
