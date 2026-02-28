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
    pinned: data.pinned || false,
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
  const { title, date, excerpt, author, authorSlug, image, category, tags, pinned, content } = body;

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
  if (pinned) frontmatter.pinned = true;

  const fileContent = matter.stringify(content ?? "", frontmatter);
  fs.writeFileSync(filePath, fileContent, "utf8");

  return NextResponse.json({ slug });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  if ("pinned" in body) {
    // When pinning a post, unpin all others first
    if (body.pinned) {
      const allFiles = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
      for (const file of allFiles) {
        if (file === `${slug}.md`) continue;
        const fp = path.join(postsDir, file);
        const r = fs.readFileSync(fp, "utf8");
        const parsed = matter(r);
        if (parsed.data.pinned) {
          delete parsed.data.pinned;
          fs.writeFileSync(fp, matter.stringify(parsed.content, parsed.data), "utf8");
        }
      }
    }

    if (body.pinned) {
      data.pinned = true;
    } else {
      delete data.pinned;
    }
  }

  fs.writeFileSync(filePath, matter.stringify(content, data), "utf8");
  return NextResponse.json({ slug, pinned: !!data.pinned });
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
