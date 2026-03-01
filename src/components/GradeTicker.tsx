"use client";

import { useEffect, useState } from "react";

interface DateItem {
  label: string;
  daysUntil: number;
  type: "election" | "primary" | "deadline" | "event";
}

function typeColor(type: string): string {
  if (type === "election") return "text-brand-red font-bold";
  if (type === "primary") return "text-charcoal/50";
  if (type === "deadline") return "text-[#b45309]";
  return "text-charcoal/40";
}

function daysLabel(days: number): string {
  if (days === 0) return "TODAY";
  if (days === 1) return "1d";
  return `${days}d`;
}

export default function CountdownTicker({ dates }: { dates: DateItem[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || dates.length === 0) return null;

  const tripled = [...dates, ...dates, ...dates];

  return (
    <div className="relative overflow-hidden py-2">
      <div className="flex items-center gap-4 animate-ticker whitespace-nowrap">
        {tripled.map((item, i) => (
          <span
            key={`${item.label}-${i}`}
            className="inline-flex items-center gap-1 text-[11px] tracking-wider uppercase font-semibold"
          >
            <span className={typeColor(item.type)}>{item.label}</span>
            <span className="text-charcoal/30 font-semibold">{daysLabel(item.daysUntil)}</span>
            {i < tripled.length - 1 && (
              <span className="text-charcoal/15 ml-2">&middot;</span>
            )}
          </span>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-cream to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-cream to-transparent pointer-events-none" />
    </div>
  );
}
