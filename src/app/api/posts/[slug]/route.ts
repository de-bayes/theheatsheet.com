import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "src/content/posts");

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return NextResponse.json({
    slug,
    title: data.title ?? "",
    date: data.date ?? "",
    excerpt: data.excerpt ?? "",
    author: data.author ?? "",
    authorSlug: data.authorSlug || "",
    image: data.image || "",
    category: data.category || "",
    tags: data.tags || [],
    content,
  });
}

export async function PUT(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const { title, date, excerpt, author, authorSlug, image, category, tags, content } = body;

  const frontmatter: Record<string, unknown> = {
    title: title ?? "",
    date: date ?? "",
    excerpt: excerpt ?? "",
  };
  if (author) frontmatter.author = author;
  if (authorSlug) frontmatter.authorSlug = authorSlug;
  if (image) frontmatter.image = image;
  if (category) frontmatter.category = category;
  if (tags && tags.length > 0) frontmatter.tags = tags;

  const fileContent = matter.stringify(content ?? "", frontmatter);
  fs.writeFileSync(filePath, fileContent, "utf8");

  return NextResponse.json({ slug });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  fs.unlinkSync(filePath);
  return NextResponse.json({ deleted: slug });
}
