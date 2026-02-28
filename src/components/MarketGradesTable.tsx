"use client";

import { useState, useMemo, useEffect, useRef } from "react";

type Race = {
  race_id: string;
  event_ticker?: string | null;
  kalshi_url?: string | null;
  chamber: string;
  state: string;
  state_name: string;
  label: string;
  grade: string;
  liquidity_score: number;
  volume_pct?: number | null;
  spread_pct?: number | null;
  oi_pct?: number | null;
  rating: string | null;
  margin: number | null;
};

type Chamber = "Senate" | "Governor" | "House";

type SortKey = "label" | "grade" | "score" | "volume" | "spread" | "oi";
type SortDir = "asc" | "desc";

const CHAMBERS: Chamber[] = ["Senate", "Governor", "House"];

const GRADE_ORDER: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, F: 4 };

// Heat map: green (good) -> yellow (mid) -> red (bad)
// Returns an rgba background-color string
function heatBg(value: number): string {
  // value is 0-1, where 1 = best
  const clamped = Math.max(0, Math.min(1, value));
  // green:  74, 222, 128  (emerald-ish)
  // yellow: 250, 204, 21
  // red:    248, 113, 113
  let r: number, g: number, b: number;
  if (clamped >= 0.5) {
    const t = (clamped - 0.5) * 2; // 0 at mid, 1 at top
    r = Math.round(250 + (74 - 250) * t);
    g = Math.round(204 + (222 - 204) * t);
    b = Math.round(21 + (128 - 21) * t);
  } else {
    const t = clamped * 2; // 0 at bottom, 1 at mid
    r = Math.round(248 + (250 - 248) * t);
    g = Math.round(113 + (204 - 113) * t);
    b = Math.round(113 + (21 - 113) * t);
  }
  return `rgba(${r}, ${g}, ${b}, 0.28)`;
}

const GRADE_HEAT: Record<string, number> = { A: 1, B: 0.75, C: 0.5, D: 0.25, F: 0 };

function pctVal(v: number | null | undefined): number {
  return v != null ? v : -1;
}

function fmtPctl(v: number | null | undefined): string {
  if (v == null) return "--";
  return String(Math.round(v * 100));
}

function sortRaces(races: Race[], key: SortKey, dir: SortDir): Race[] {
  const sorted = [...races].sort((a, b) => {
    let cmp = 0;
    switch (key) {
      case "label":
        cmp = a.label.localeCompare(b.label);
        break;
      case "grade":
        cmp =
          (GRADE_ORDER[a.grade] ?? 99) - (GRADE_ORDER[b.grade] ?? 99);
        break;
      case "score":
        cmp = a.liquidity_score - b.liquidity_score;
        break;
      case "volume":
        cmp = pctVal(a.volume_pct) - pctVal(b.volume_pct);
        break;
      case "spread":
        cmp = pctVal(a.spread_pct) - pctVal(b.spread_pct);
        break;
      case "oi":
        cmp = pctVal(a.oi_pct) - pctVal(b.oi_pct);
        break;
    }
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const CHAMBER_SHORTHAND: Record<string, Chamber> = {
  s: "Senate",
  g: "Governor",
  h: "House",
};

function parseSearch(query: string): {
  chamber?: Chamber;
  state?: string;
  district?: string;
} {
  const parts = query.toLowerCase().trim().split("/");
  const result: { chamber?: Chamber; state?: string; district?: string } = {};

  if (parts[0] && CHAMBER_SHORTHAND[parts[0]]) {
    result.chamber = CHAMBER_SHORTHAND[parts[0]];
  }
  if (parts[1]) {
    result.state = parts[1].toUpperCase();
  }
  if (parts[2]) {
    result.district = String(parseInt(parts[2], 10));
  }
  return result;
}

export default function MarketGradesTable({
  races,
  date,
}: {
  races: Race[];
  date: string;
}) {
  const [chamber, setChamber] = useState<Chamber>("Senate");
  const [sortKey, setSortKey] = useState<SortKey>("grade");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Cmd+K to open search
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearch("");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Parse search and apply chamber switch
  const parsed = useMemo(() => parseSearch(search), [search]);
  const activeChamber = parsed.chamber ?? chamber;

  const filtered = useMemo(() => {
    let result = races.filter((r) => r.chamber === activeChamber);

    if (parsed.state) {
      result = result.filter((r) =>
        r.state.startsWith(parsed.state!)
      );
    }

    if (parsed.district) {
      result = result.filter((r) => {
        const dash = r.label.indexOf("-");
        if (dash === -1) return false;
        const num = String(parseInt(r.label.slice(dash + 1), 10));
        return num === parsed.district;
      });
    }

    return result;
  }, [races, activeChamber, parsed.state, parsed.district]);

  const sorted = useMemo(
    () => sortRaces(filtered, sortKey, sortDir),
    [filtered, sortKey, sortDir]
  );

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function handleChamber(c: Chamber) {
    setChamber(c);
    setSearch("");
    setSearchOpen(false);
    setSortKey("grade");
    setSortDir("asc");
  }

  function clearSearch() {
    setSearch("");
    setSearchOpen(false);
  }

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return null;
    return (
      <span className="ml-1 text-charcoal/40">
        {sortDir === "asc" ? "\u25B2" : "\u25BC"}
      </span>
    );
  };

  const thClass =
    "pb-2 px-2 font-semibold cursor-pointer select-none text-right whitespace-nowrap";

  return (
    <div>
      <p className="text-sm text-meta-gray mb-6">
        Last updated: {formatDate(date)}
      </p>

      {/* Chamber tabs + search */}
      <div className="flex items-end gap-x-6 mb-6 border-b border-charcoal/10">
        {CHAMBERS.map((c) => (
          <button
            key={c}
            onClick={() => handleChamber(c)}
            className={`pb-2 text-sm uppercase tracking-wider transition-colors ${
              activeChamber === c
                ? "text-charcoal border-b-2 border-charcoal font-semibold"
                : "text-charcoal/50 hover:text-charcoal/70"
            }`}
          >
            {c}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-x-3 pb-2">
          {searchOpen ? (
            <div className="flex items-center gap-x-2">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="s/ak or h/co/3"
                className="bg-transparent border-b border-charcoal/20 text-sm w-32 focus:outline-none focus:border-charcoal/50 placeholder:text-charcoal/30"
              />
              <button
                onClick={clearSearch}
                className="text-charcoal/40 hover:text-charcoal/70 text-xs"
              >
                Esc
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-charcoal/40 hover:text-charcoal/70 text-xs flex items-center gap-x-1"
            >
              <span className="border border-charcoal/20 rounded px-1 py-0.5 text-[10px]">
                {"\u2318"}K
              </span>
            </button>
          )}
          <span className="text-sm text-meta-gray">
            {sorted.length} race{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm min-w-[580px]">
          <thead>
            <tr className="border-b border-charcoal/10 text-left">
              <th
                className="pb-2 px-2 font-semibold cursor-pointer select-none"
                onClick={() => handleSort("label")}
              >
                Race{sortIndicator("label")}
              </th>
              <th
                className="pb-2 px-2 font-semibold cursor-pointer select-none w-16 text-center"
                onClick={() => handleSort("grade")}
              >
                Grade{sortIndicator("grade")}
              </th>
              <th
                className={thClass}
                onClick={() => handleSort("score")}
                title="Composite liquidity score (0-100)"
              >
                Score{sortIndicator("score")}
              </th>
              <th
                className={thClass}
                onClick={() => handleSort("volume")}
                title="Volume percentile within chamber"
              >
                Vol{sortIndicator("volume")}
              </th>
              <th
                className={thClass}
                onClick={() => handleSort("spread")}
                title="Spread percentile within chamber (tighter = higher)"
              >
                Spread{sortIndicator("spread")}
              </th>
              <th
                className={thClass}
                onClick={() => handleSort("oi")}
                title="Open interest percentile within chamber"
              >
                OI{sortIndicator("oi")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((race) => (
              <tr
                key={race.race_id}
                className="group border-b border-charcoal/10 hover:bg-charcoal/5 transition-colors"
              >
                <td className="py-2 px-2">
                  {race.kalshi_url ? (
                    <a
                      href={race.kalshi_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-charcoal no-underline group-hover:underline group-hover:decoration-wavy group-hover:decoration-charcoal/30 group-hover:underline-offset-2 transition-colors hover:text-charcoal"
                    >
                      {race.label}
                    </a>
                  ) : (
                    race.label
                  )}
                </td>
                <td
                  className="py-2 px-2 text-center cursor-default"
                  style={{ backgroundColor: heatBg(GRADE_HEAT[race.grade] ?? 0) }}
                >
                  <span
                    className={
                      race.grade === "A" ? "font-bold" : "font-medium"
                    }
                  >
                    {race.grade}
                  </span>
                </td>
                <td
                  className="py-2 px-2 text-right tabular-nums"
                  style={{ backgroundColor: heatBg(race.liquidity_score) }}
                >
                  {Math.round(race.liquidity_score * 100)}
                </td>
                <td
                  className="py-2 px-2 text-right tabular-nums"
                  style={{ backgroundColor: race.volume_pct != null ? heatBg(race.volume_pct) : undefined }}
                >
                  {fmtPctl(race.volume_pct)}
                </td>
                <td
                  className="py-2 px-2 text-right tabular-nums"
                  style={{ backgroundColor: race.spread_pct != null ? heatBg(race.spread_pct) : undefined }}
                >
                  {fmtPctl(race.spread_pct)}
                </td>
                <td
                  className="py-2 px-2 text-right tabular-nums"
                  style={{ backgroundColor: race.oi_pct != null ? heatBg(race.oi_pct) : undefined }}
                >
                  {fmtPctl(race.oi_pct)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
