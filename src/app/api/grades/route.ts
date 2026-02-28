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
    // Validate date format
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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Meta endpoint: list available dates
  if (searchParams.get("dates") !== null) {
    return NextResponse.json({
      available_dates: listAvailableDates(),
    });
  }

  const dateParam = searchParams.get("date");
  const data = loadGrades(dateParam);

  if (!data) {
    return NextResponse.json(
      {
        error: "Not found",
        message: dateParam
          ? `No grades data for date "${dateParam}". Use ?dates to list available dates.`
          : "No grades data available.",
      },
      { status: 404 }
    );
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
      return NextResponse.json(
        { error: "Race not found", race_id: rid },
        { status: 404 }
      );
    }
    return NextResponse.json({ date: data.date, race });
  }

  return NextResponse.json({
    date: data.date,
    total: races.length,
    races,
  });
}
