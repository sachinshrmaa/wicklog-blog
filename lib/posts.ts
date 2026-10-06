import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import matter from 'gray-matter';
import { BLOG_AUTHOR } from './utils';
import { tagLabel, tagSlug } from './tags';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

export interface PostFrontmatter {
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD) the post was first published. */
  date: string;
  /** ISO date of the last meaningful content revision, if any. */
  updated?: string;
  slug: string;
  tags: string[];
  author: string;
  coverImage?: string;
  /** Drafts are excluded from production builds but visible in `next dev`. */
  draft?: boolean;
}

export interface Post {
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

/** Everything a list/card needs — no MDX body, so it's cheap to send to the client. */
export type PostSummary = Pick<Post, 'frontmatter' | 'readingTime'>;

export interface Tag {
  slug: string;
  label: string;
  count: number;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function calcReadingTime(content: string): string {
  const text = content
    .replace(/```[\s\S]*?```/g, ' ') // code blocks
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ') // MDX comments
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1'); // keep link text, drop URLs
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

function parseFrontmatter(data: Record<string, unknown>, filename: string): PostFrontmatter {
  const fail = (msg: string): never => {
    throw new Error(`[posts] ${filename}: ${msg}`);
  };
  const str = (key: string, required = true): string | undefined => {
    const value = data[key];
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (required) fail(`frontmatter "${key}" is required`);
    return undefined;
  };

  const date = str('date')!;
  if (!ISO_DATE.test(date)) fail(`"date" must be YYYY-MM-DD, got "${date}"`);
  const updated = str('updated', false);
  if (updated && !ISO_DATE.test(updated)) fail(`"updated" must be YYYY-MM-DD, got "${updated}"`);

  const tags = data.tags ?? [];
  if (!Array.isArray(tags) || tags.some((t) => typeof t !== 'string')) {
    fail('"tags" must be a list of strings');
  }

  return {
    title: str('title')!,
    description: str('description')!,
    date,
    updated,
    slug: str('slug')!,
    tags: Array.from(new Set((tags as string[]).map(tagSlug))),
    author: str('author', false) ?? BLOG_AUTHOR,
    coverImage: str('coverImage', false),
    draft: data.draft === true,
  };
}

const loadPosts = cache((): Post[] => {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const includeDrafts = process.env.NODE_ENV !== 'production';
  const seen = new Map<string, string>();

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx') && !f.startsWith('_'))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
      const { data, content } = matter(raw);
      const frontmatter = parseFrontmatter(data, filename);

      const clash = seen.get(frontmatter.slug);
      if (clash) throw new Error(`[posts] duplicate slug "${frontmatter.slug}" in ${clash} and ${filename}`);
      seen.set(frontmatter.slug, filename);

      return { frontmatter, content, readingTime: calcReadingTime(content) };
    })
    .filter((post) => includeDrafts || !post.frontmatter.draft)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
});

export function getAllPosts(): Post[] {
  return loadPosts();
}

export function getAllPostSummaries(): PostSummary[] {
  return loadPosts().map(({ frontmatter, readingTime }) => ({ frontmatter, readingTime }));
}

export function getPostBySlug(slug: string): Post | undefined {
  return loadPosts().find((p) => p.frontmatter.slug === slug);
}

export function getAllTags(): Tag[] {
  const counts = new Map<string, number>();
  loadPosts().forEach((p) => p.frontmatter.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  return Array.from(counts, ([slug, count]) => ({ slug, label: tagLabel(slug), count })).sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label)
  );
}

export function getPostsByTag(slug: string): Post[] {
  return loadPosts().filter((p) => p.frontmatter.tags.includes(slug));
}

/** Posts sharing the most tags with `post`, most recent first among ties. */
export function getRelatedPosts(post: Post, limit = 3): PostSummary[] {
  const tags = new Set(post.frontmatter.tags);
  return getAllPostSummaries()
    .filter((p) => p.frontmatter.slug !== post.frontmatter.slug)
    .map((p) => ({ p, score: p.frontmatter.tags.filter((t) => tags.has(t)).length }))
    .sort((a, b) => b.score - a.score) // stable: ties keep date order
    .slice(0, limit)
    .map(({ p }) => p);
}
