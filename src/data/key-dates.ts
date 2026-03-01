export interface KeyDate {
  label: string;
  date: string; // YYYY-MM-DD
  type: "election" | "primary" | "deadline" | "event";
}

// Key 2026 midterm dates
// Source: 270toWin 2026 State Primary Calendar
const keyDates: KeyDate[] = [
  { label: "TX primary", date: "2026-03-03", type: "primary" },
  { label: "NC primary", date: "2026-03-03", type: "primary" },
  { label: "AR primary", date: "2026-03-03", type: "primary" },
  { label: "MS primary", date: "2026-03-10", type: "primary" },
  { label: "IL primary", date: "2026-03-17", type: "primary" },
  { label: "IN primary", date: "2026-05-05", type: "primary" },
  { label: "OH primary", date: "2026-05-05", type: "primary" },
  { label: "NE primary", date: "2026-05-12", type: "primary" },
  { label: "LA primary", date: "2026-05-16", type: "primary" },
  { label: "AL primary", date: "2026-05-19", type: "primary" },
  { label: "GA primary", date: "2026-05-19", type: "primary" },
  { label: "PA primary", date: "2026-05-19", type: "primary" },
  { label: "KY primary", date: "2026-05-19", type: "primary" },
  { label: "OR primary", date: "2026-05-19", type: "primary" },
  { label: "TX runoff", date: "2026-05-26", type: "primary" },
  { label: "CA primary", date: "2026-06-02", type: "primary" },
  { label: "NJ primary", date: "2026-06-02", type: "primary" },
  { label: "IA primary", date: "2026-06-02", type: "primary" },
  { label: "NV primary", date: "2026-06-09", type: "primary" },
  { label: "SC primary", date: "2026-06-09", type: "primary" },
  { label: "NY primary", date: "2026-06-23", type: "primary" },
  { label: "MD primary", date: "2026-06-23", type: "primary" },
  { label: "CO primary", date: "2026-06-30", type: "primary" },
  { label: "AZ primary", date: "2026-07-21", type: "primary" },
  { label: "MI primary", date: "2026-08-04", type: "primary" },
  { label: "VA primary", date: "2026-08-04", type: "primary" },
  { label: "WA primary", date: "2026-08-04", type: "primary" },
  { label: "TN primary", date: "2026-08-06", type: "primary" },
  { label: "WI primary", date: "2026-08-11", type: "primary" },
  { label: "MN primary", date: "2026-08-11", type: "primary" },
  { label: "FL primary", date: "2026-08-18", type: "primary" },
  { label: "NH primary", date: "2026-09-08", type: "primary" },
  { label: "Election Day", date: "2026-11-03", type: "election" },
];

export function getUpcomingDates(): (KeyDate & { daysUntil: number })[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return keyDates
    .map((d) => {
      const target = new Date(d.date + "T00:00:00");
      const diff = target.getTime() - now.getTime();
      const daysUntil = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return { ...d, daysUntil };
    })
    .filter((d) => d.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}
