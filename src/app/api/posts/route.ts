import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "src/content/posts");

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function GET() {
  if (!fs.existsSync(postsDir)) return NextResponse.json([]);

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title ?? "",
      date: data.date ?? "",
      excerpt: data.excerpt ?? "",
      author: data.author ?? "",
      authorSlug: data.authorSlug || undefined,
      image: data.image || undefined,
      category: data.category || undefined,
      tags: data.tags || [],
      pinned: data.pinned || false,
      readingTime: estimateReadingTime(content),
    };
  });

  posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { slug, title, date, excerpt, author, authorSlug, image, category, tags, pinned, content } = body;

  if (!slug || !title || !content) {
    return NextResponse.json({ error: "slug, title, and content are required" }, { status: 400 });
  }

  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const filePath = path.join(postsDir, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Post with this slug already exists" }, { status: 409 });
  }

  const frontmatter: Record<string, unknown> = { title, date: date || new Date().toISOString().split("T")[0], excerpt: excerpt || "" };
  if (author) frontmatter.author = author;
  if (authorSlug) frontmatter.authorSlug = authorSlug;
  if (image) frontmatter.image = image;
  if (category) frontmatter.category = category;
  if (tags && tags.length > 0) frontmatter.tags = tags;
  if (pinned) frontmatter.pinned = true;

  const fileContent = matter.stringify(content, frontmatter);
  fs.writeFileSync(filePath, fileContent, "utf8");

  return NextResponse.json({ slug }, { status: 201 });
}
