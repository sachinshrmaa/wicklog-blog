'use client';

import { useState, useMemo } from 'react';
import type { Post } from '@/lib/posts';
import { PostCard } from './post-card';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.frontmatter.title.toLowerCase().includes(q) ||
        p.frontmatter.description?.toLowerCase().includes(q) ||
        p.frontmatter.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [posts, query]);

  return (
    <div>
      <div className="relative mb-10">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <input
          type="search"
          placeholder="Search posts by title, tag, or keyword…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground text-sm">
            No posts found for &ldquo;{query}&rdquo;
          </p>
          <button
            onClick={() => setQuery('')}
            className="mt-3 text-sm text-primary hover:underline underline-offset-4"
          >
            Clear search
          </button>
        </div>
      ) : (
        <section>
          {query && (
            <p className="mb-6 text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
            </p>
          )}
          {filtered.map((post) => (
            <PostCard key={post.frontmatter.slug} post={post} />
          ))}
        </section>
      )}
    </div>
  );
}
