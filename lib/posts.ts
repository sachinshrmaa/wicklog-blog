import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: string[];
  author: string;
  coverImage?: string;
}

export interface Post {
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

function calcReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx') && !f.startsWith('_'));

  return files
    .map((filename) => {
      const filePath = path.join(POSTS_DIR, filename);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(raw);

      return {
        frontmatter: data as PostFrontmatter,
        content,
        readingTime: calcReadingTime(content),
      };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.frontmatter.slug === slug);
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((p) => p.frontmatter.tags?.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.tags?.includes(tag));
}
