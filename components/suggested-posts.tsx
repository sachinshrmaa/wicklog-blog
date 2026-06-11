import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import { TagChip } from './post-card';

interface SuggestedPostsProps {
  currentSlug: string;
  currentTags: string[];
  allPosts: Post[];
}

export function SuggestedPosts({ currentSlug, currentTags, allPosts }: SuggestedPostsProps) {
  const others = allPosts.filter((p) => p.frontmatter.slug !== currentSlug);

  // Score by shared tags, fall back to recency
  const scored = others
    .map((post) => ({
      post,
      score: post.frontmatter.tags?.filter((t) => currentTags.includes(t)).length ?? 0,
    }))
    .sort((a, b) => b.score - a.score || 0);

  const suggested = scored.slice(0, 3).map((s) => s.post);

  if (suggested.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="text-lg font-semibold text-foreground mb-6">Suggested reads</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {suggested.map((post) => (
          <Link
            key={post.frontmatter.slug}
            href={`/${post.frontmatter.slug}`}
            className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:shadow-md transition-all"
          >
            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.frontmatter.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {post.frontmatter.title}
            </h3>

            {post.frontmatter.description && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {post.frontmatter.description}
              </p>
            )}

            <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted-foreground">
              <time dateTime={post.frontmatter.date}>{formatDate(post.frontmatter.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
