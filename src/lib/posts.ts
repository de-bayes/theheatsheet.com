import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  authorSlug?: string;
  image?: string;
  category?: string;
  tags?: string[];
  pinned?: boolean;
  readingTime: number;
}

function slugifyTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-");
}

export function getAllTags(): { tag: string; slug: string; count: number }[] {
  const posts = getAllPosts();
  const map = new Map<string, { tag: string; count: number }>();
  for (const p of posts) {
    for (const t of p.tags ?? []) {
      const s = slugifyTag(t);
      const existing = map.get(s);
      if (existing) existing.count++;
      else map.set(s, { tag: t, count: 1 });
    }
  }
  return Array.from(map.entries()).map(([slug, v]) => ({ slug, ...v }));
}

export function getPostsByTag(tagSlug: string): PostMeta[] {
  return getAllPosts().filter(
    (p) => p.tags?.some((t) => slugifyTag(t) === tagSlug),
  );
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export interface Post extends PostMeta {
  contentHtml: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const filenames = fs.readdirSync(postsDirectory);
  const posts = filenames
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const slug = name.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, name);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        author: data.author,
        authorSlug: data.authorSlug || undefined,
        image: data.image || undefined,
        category: data.category || undefined,
        tags: data.tags || undefined,
        pinned: data.pinned || undefined,
        readingTime: estimateReadingTime(content),
      } as PostMeta;
    });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html, { sanitize: false }).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    author: data.author,
    authorSlug: data.authorSlug || undefined,
    image: data.image || undefined,
    category: data.category || undefined,
    tags: data.tags || undefined,
    pinned: data.pinned || undefined,
    readingTime: estimateReadingTime(content),
    contentHtml,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];

  return fs
    .readdirSync(postsDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}
