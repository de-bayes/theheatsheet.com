import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const tweetsPath = path.join(process.cwd(), "src/data/tweets.json");

export interface TweetEntry {
  id: string;
  url: string;
  authorName: string;
  handle: string;
  text: string;
  date?: string;
  addedAt: string;
}

function readTweets(): TweetEntry[] {
  if (!fs.existsSync(tweetsPath)) return [];
  const raw = fs.readFileSync(tweetsPath, "utf8");
  return JSON.parse(raw);
}

function writeTweets(tweets: TweetEntry[]) {
  fs.writeFileSync(tweetsPath, JSON.stringify(tweets, null, 2) + "\n", "utf8");
}

export async function GET() {
  return NextResponse.json(readTweets());
}

export async function POST(request: Request) {
  const body = await request.json();
  const { url, authorName, handle, text, date } = body;

  if (!url || !authorName || !handle || !text) {
    return NextResponse.json(
      { error: "url, authorName, handle, and text are required" },
      { status: 400 }
    );
  }

  // Extract tweet ID from URL
  const match = url.match(/status\/(\d+)/);
  if (!match) {
    return NextResponse.json(
      { error: "Invalid tweet URL. Expected format: https://x.com/user/status/123456" },
      { status: 400 }
    );
  }

  const id = match[1];
  const tweets = readTweets();

  if (tweets.some((t) => t.id === id)) {
    return NextResponse.json({ error: "Tweet already added" }, { status: 409 });
  }

  const entry: TweetEntry = {
    id,
    url: url.replace("twitter.com", "x.com"),
    authorName,
    handle: handle.startsWith("@") ? handle : `@${handle}`,
    text,
    date: date || undefined,
    addedAt: new Date().toISOString(),
  };

  tweets.unshift(entry);
  writeTweets(tweets);

  return NextResponse.json(entry, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id query param required" }, { status: 400 });
  }

  const tweets = readTweets();
  const filtered = tweets.filter((t) => t.id !== id);

  if (filtered.length === tweets.length) {
    return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
  }

  writeTweets(filtered);
  return NextResponse.json({ deleted: id });
}
