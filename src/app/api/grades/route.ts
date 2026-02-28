import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const gradesDir = path.join(process.cwd(), "src/data/grades");

interface Race {
  race_id: string;
  event_ticker?: string;
  kalshi_url?: string;
  chamber: string;
  state: string;
  state_name: string;
  label: string;
  grade: string;
  liquidity_score: number;
  volume_pct: number;
  spread_pct: number;
  oi_pct: number;
  rating: string;
  margin: number | null;
}

interface GradesFile {
  date: string;
  total_races: number;
  races: Race[];
}

function loadGrades(dateParam: string | null): GradesFile | null {
  let filePath: string;
  if (!dateParam || dateParam === "latest") {
    filePath = path.join(gradesDir, "latest.json");
  } else {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) return null;
    filePath = path.join(gradesDir, `${dateParam}.json`);
  }
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function listAvailableDates(): string[] {
  return fs
    .readdirSync(gradesDir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map((f) => f.replace(".json", ""))
    .sort()
    .reverse();
}

// ---------------------------------------------------------------------------
// ASCII table formatter
// ---------------------------------------------------------------------------
function pad(str: string, len: number): string {
  return str.length >= len ? str.slice(0, len) : str + " ".repeat(len - str.length);
}

function padLeft(str: string, len: number): string {
  return str.length >= len ? str.slice(0, len) : " ".repeat(len - str.length) + str;
}

function gradeBar(score: number): string {
  const filled = Math.round(score * 10);
  return "\u2588".repeat(filled) + "\u2591".repeat(10 - filled);
}

function formatTable(races: Race[], date: string): string {
  const lines: string[] = [];

  // Header
  lines.push("");
  lines.push("  THE HEAT SHEET — Market Grades");
  lines.push(`  ${date}                ${races.length} race${races.length !== 1 ? "s" : ""}`);
  lines.push("");

  if (races.length === 0) {
    lines.push("  No races match your filters.");
    lines.push("");
    return lines.join("\n");
  }

  // Column widths
  const cW = { race: 14, grade: 5, liq: 12, vol: 5, spr: 5, oi: 5, rating: 10, margin: 7 };

  // Top border
  const sep =
    "  \u250C" +
    "\u2500".repeat(cW.race + 2) + "\u252C" +
    "\u2500".repeat(cW.grade + 2) + "\u252C" +
    "\u2500".repeat(cW.liq + 2) + "\u252C" +
    "\u2500".repeat(cW.vol + 2) + "\u252C" +
    "\u2500".repeat(cW.spr + 2) + "\u252C" +
    "\u2500".repeat(cW.oi + 2) + "\u252C" +
    "\u2500".repeat(cW.rating + 2) + "\u252C" +
    "\u2500".repeat(cW.margin + 2) +
    "\u2510";

  const mid =
    "  \u251C" +
    "\u2500".repeat(cW.race + 2) + "\u253C" +
    "\u2500".repeat(cW.grade + 2) + "\u253C" +
    "\u2500".repeat(cW.liq + 2) + "\u253C" +
    "\u2500".repeat(cW.vol + 2) + "\u253C" +
    "\u2500".repeat(cW.spr + 2) + "\u253C" +
    "\u2500".repeat(cW.oi + 2) + "\u253C" +
    "\u2500".repeat(cW.rating + 2) + "\u253C" +
    "\u2500".repeat(cW.margin + 2) +
    "\u2524";

  const bot =
    "  \u2514" +
    "\u2500".repeat(cW.race + 2) + "\u2534" +
    "\u2500".repeat(cW.grade + 2) + "\u2534" +
    "\u2500".repeat(cW.liq + 2) + "\u2534" +
    "\u2500".repeat(cW.vol + 2) + "\u2534" +
    "\u2500".repeat(cW.spr + 2) + "\u2534" +
    "\u2500".repeat(cW.oi + 2) + "\u2534" +
    "\u2500".repeat(cW.rating + 2) + "\u2534" +
    "\u2500".repeat(cW.margin + 2) +
    "\u2518";

  function row(
    race: string, grade: string, liq: string,
    vol: string, spr: string, oi: string,
    rating: string, margin: string
  ): string {
    return (
      "  \u2502 " + pad(race, cW.race) +
      " \u2502 " + pad(grade, cW.grade) +
      " \u2502 " + pad(liq, cW.liq) +
      " \u2502 " + padLeft(vol, cW.vol) +
      " \u2502 " + padLeft(spr, cW.spr) +
      " \u2502 " + padLeft(oi, cW.oi) +
      " \u2502 " + pad(rating, cW.rating) +
      " \u2502 " + padLeft(margin, cW.margin) +
      " \u2502"
    );
  }

  lines.push(sep);
  lines.push(row("Race", "Grade", "Liquidity", "Vol", "Spr", "OI", "Rating", "Margin"));
  lines.push(mid);

  for (const r of races) {
    const label = r.chamber === "House" ? `${r.state}-${r.label}` : r.label;
    const marginStr = r.margin !== null ? `${r.margin > 0 ? "R" : "D"}+${Math.abs(r.margin)}` : "--";

    lines.push(
      row(
        label.slice(0, cW.race),
        r.grade,
        gradeBar(r.liquidity_score),
        (r.volume_pct * 100).toFixed(0),
        (r.spread_pct * 100).toFixed(0),
        (r.oi_pct * 100).toFixed(0),
        r.rating || "--",
        marginStr
      )
    );
  }

  lines.push(bot);
  lines.push("");
  lines.push("  Vol/Spr/OI = percentile rank (0-100). Liquidity = composite score.");
  lines.push("  Margin: R+5 = Republican +5pts. D+3 = Democrat +3pts.");
  lines.push("");

  return lines.join("\n");
}

function formatSingleRace(race: Race, date: string): string {
  const lines: string[] = [];
  const label = race.chamber === "House" ? `${race.state}-${race.label}` : race.label;
  const marginStr = race.margin !== null ? `${race.margin > 0 ? "R" : "D"}+${Math.abs(race.margin)}` : "--";

  lines.push("");
  lines.push(`  ${label} (${race.chamber})`);
  lines.push(`  ${date}`);
  lines.push("");
  lines.push(`  Grade:     ${race.grade}  ${gradeBar(race.liquidity_score)}  ${(race.liquidity_score * 100).toFixed(1)}%`);
  lines.push(`  Rating:    ${race.rating || "--"}`);
  lines.push(`  Margin:    ${marginStr}`);
  lines.push("");
  lines.push(`  Volume:    ${(race.volume_pct * 100).toFixed(0)}th percentile`);
  lines.push(`  Spread:    ${(race.spread_pct * 100).toFixed(0)}th percentile`);
  lines.push(`  Open Int:  ${(race.oi_pct * 100).toFixed(0)}th percentile`);
  lines.push("");
  if (race.kalshi_url) {
    lines.push(`  Kalshi:    ${race.kalshi_url}`);
    lines.push("");
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const format = searchParams.get("format");
  const isTable = format === "table" || format === "pretty";

  // Meta endpoint: list available dates
  if (searchParams.get("dates") !== null) {
    if (isTable) {
      const dates = listAvailableDates();
      const text = "\n  Available dates:\n\n" + dates.map((d) => `    ${d}`).join("\n") + "\n";
      return new NextResponse(text, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    return NextResponse.json({ available_dates: listAvailableDates() });
  }

  const dateParam = searchParams.get("date");
  const data = loadGrades(dateParam);

  if (!data) {
    const msg = dateParam
      ? `No grades data for date "${dateParam}". Use ?dates to list available dates.`
      : "No grades data available.";
    if (isTable) {
      return new NextResponse(`\n  Error: ${msg}\n`, {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    return NextResponse.json({ error: "Not found", message: msg }, { status: 404 });
  }

  // Apply filters
  let races = data.races;

  const chamber = searchParams.get("chamber");
  if (chamber) {
    const c = chamber.toLowerCase();
    races = races.filter((r) => r.chamber.toLowerCase() === c);
  }

  const state = searchParams.get("state");
  if (state) {
    const s = state.toUpperCase();
    races = races.filter((r) => r.state === s);
  }

  const grade = searchParams.get("grade");
  if (grade) {
    const g = grade.toUpperCase();
    races = races.filter((r) => r.grade === g);
  }

  const rating = searchParams.get("rating");
  if (rating) {
    const rt = rating.toLowerCase();
    races = races.filter((r) => r.rating && r.rating.toLowerCase() === rt);
  }

  const minLiq = searchParams.get("min_liquidity");
  if (minLiq) {
    const threshold = parseFloat(minLiq);
    if (!isNaN(threshold)) {
      races = races.filter((r) => r.liquidity_score >= threshold);
    }
  }

  // Single race lookup
  const raceId = searchParams.get("race");
  if (raceId) {
    const rid = raceId.toUpperCase();
    const race = races.find((r) => r.race_id === rid);
    if (!race) {
      if (isTable) {
        return new NextResponse(`\n  Race not found: ${rid}\n`, {
          status: 404,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
      return NextResponse.json({ error: "Race not found", race_id: rid }, { status: 404 });
    }
    if (isTable) {
      return new NextResponse(formatSingleRace(race, data.date), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    return NextResponse.json({ date: data.date, race });
  }

  // Full list
  if (isTable) {
    return new NextResponse(formatTable(races, data.date), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return NextResponse.json({ date: data.date, total: races.length, races });
}
