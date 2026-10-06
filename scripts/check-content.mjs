#!/usr/bin/env node
/**
 * Validates every post in content/posts before a build.
 *
 *   npm run check:content          errors fail the build; warnings are printed
 *   npm run check:content -- --todo  also list hidden TODOs ({/* TODO ... *\/} comments)
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import { createRequire } from 'node:module';

const redirects = createRequire(import.meta.url)('../redirects.js');
const redirected = new Map(redirects.map((r) => [r.source.slice(1), r.destination]));

const POSTS_DIR = 'content/posts';
const PUBLIC_DIR = 'public';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const KNOWN_FIELDS = new Set(['title', 'description', 'date', 'updated', 'slug', 'tags', 'author', 'coverImage', 'draft']);
// Editorial markers that must never render on the live site.
const VISIBLE_PLACEHOLDER = /\[(SCREENSHOT|NEEDS SOURCE|TODO|TBD|IMAGE|INSERT)\b[^\]]*\]/g;

const showTodos = process.argv.includes('--todo');
const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx') && !f.startsWith('_'));

const posts = files.map((file) => {
  const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
  return { file, data, content };
});
const slugs = new Set(posts.map((p) => p.data.slug));

let errors = 0;
let warnings = 0;
const todos = [];

for (const { file, data, content } of posts) {
  const err = (msg) => (errors++, console.error(`  ✖ ${file}: ${msg}`));
  const warn = (msg) => (warnings++, console.warn(`  ⚠ ${file}: ${msg}`));
  const date = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v);

  for (const key of ['title', 'description', 'date', 'slug']) {
    if (!data[key] || !String(date(data[key])).trim()) err(`missing "${key}"`);
  }
  if (data.date && !ISO_DATE.test(date(data.date))) err(`"date" must be YYYY-MM-DD`);
  if (data.updated && !ISO_DATE.test(date(data.updated))) err(`"updated" must be YYYY-MM-DD`);
  if (data.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.slug)) err(`slug "${data.slug}" must be lowercase-kebab-case`);
  if (!Array.isArray(data.tags) || data.tags.length === 0) warn('no tags');
  if (data.description && data.description.length > 160) warn(`description is ${data.description.length} chars (aim for ≤160)`);
  if (data.title && data.title.length > 70) warn(`title is ${data.title.length} chars (aim for ≤70)`);
  const unknown = Object.keys(data).filter((k) => !KNOWN_FIELDS.has(k));
  if (unknown.length) warn(`unknown frontmatter: ${unknown.join(', ')}`);

  if (data.slug && file !== `${data.slug}.mdx`) warn(`filename should match slug: ${data.slug}.mdx`);

  for (const m of content.matchAll(VISIBLE_PLACEHOLDER)) err(`visible placeholder: ${m[0].slice(0, 90)}`);

  for (const m of content.matchAll(/\{\/\*\s*(TODO[\s\S]*?)\*\/\}/g)) todos.push(`${file}: ${m[1].trim().replace(/\s+/g, ' ')}`);

  const images = [...content.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((m) => m[1]);
  if (data.coverImage) images.push(data.coverImage);
  for (const src of images) {
    if (!src.startsWith('/blog/')) err(`image "${src}" should start with /blog/ (the basePath)`);
    else if (!fs.existsSync(path.join(PUBLIC_DIR, src.slice('/blog'.length)))) err(`image not found: ${src}`);
  }

  for (const m of content.matchAll(/\]\((\/[^)\s#]*|https?:\/\/(?:www\.)?wicklog\.in\/blog\/[^)\s#]*)/g)) {
    const href = m[1];
    if (href.startsWith('/blog/images/')) continue;
    if (href.startsWith('http')) {
      warn(`use a relative link for blog posts: ${href} → /${href.split('/blog/')[1]}`);
      continue;
    }
    const target = href.replace(/^\//, '').replace(/\/$/, '');
    if (target.startsWith('tags/') || target === '' || target === 'feed.xml') continue;
    if (redirected.has(target)) err(`link to merged post ${href} — use ${redirected.get(target)}`);
    else if (!slugs.has(target)) err(`broken internal link: ${href}`);
  }

  try {
    await serialize(content, { mdxOptions: { remarkPlugins: [remarkGfm] } });
  } catch (e) {
    err(`MDX does not compile: ${String(e.message).split('\n')[0]}`);
  }
}

for (const r of redirects) {
  if (slugs.has(r.source.slice(1))) (errors++, console.error(`  ✖ redirect source ${r.source} is still a live post`));
  if (!slugs.has(r.destination.slice(1))) (errors++, console.error(`  ✖ redirect target ${r.destination} is not a post`));
}

const seen = new Map();
for (const { file, data } of posts) {
  if (seen.has(data.slug)) (errors++, console.error(`  ✖ duplicate slug "${data.slug}": ${seen.get(data.slug)}, ${file}`));
  seen.set(data.slug, file);
}

if (showTodos) {
  console.log(`\nHidden TODOs (${todos.length}):`);
  todos.forEach((t) => console.log(`  • ${t}`));
}

console.log(`\nChecked ${posts.length} posts: ${errors} error(s), ${warnings} warning(s), ${todos.length} hidden TODO(s).`);
process.exit(errors ? 1 : 0);
