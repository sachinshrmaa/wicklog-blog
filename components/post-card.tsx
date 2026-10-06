import { forwardRef } from 'react';
import Link from 'next/link';
import type { PostSummary } from '@/lib/posts';
import { primaryTopic, tagLabel } from '@/lib/tags';
import { cn, formatDate } from '@/lib/utils';

function PostMeta({ post, className }: { post: PostSummary; className?: string }) {
  const { frontmatter, readingTime } = post;
  return (
    <div className={cn('flex items-center gap-2 text-xs text-muted-foreground', className)}>
      <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
      <span aria-hidden="true">·</span>
      <span>{readingTime}</span>
      {frontmatter.draft && (
        <span className="rounded bg-destructive px-1.5 py-0.5 font-medium text-destructive-foreground">Draft</span>
      )}
    </div>
  );
}

function Eyebrow({ tag }: { tag?: string }) {
  if (!tag) return null;
  return <span className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-link">{tagLabel(tag)}</span>;
}

/** Grid card. The whole card is one link, so tags render as text (no nested links). */
export const PostCard = forwardRef<HTMLAnchorElement, { post: PostSummary }>(function PostCard({ post }, ref) {
  const { frontmatter } = post;
  return (
    <Link
      ref={ref}
      href={`/${frontmatter.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Eyebrow tag={primaryTopic(frontmatter.tags)} />
      <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary dark:group-hover:text-link">
        {frontmatter.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{frontmatter.description}</p>
      <PostMeta post={post} className="mt-auto pt-5" />
    </Link>
  );
});

export function FeaturedPostCard({ post }: { post: PostSummary }) {
  const { frontmatter } = post;
  return (
    <Link
      href={`/${frontmatter.slug}`}
      className="group relative block overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-80 dark:bg-primary/20"
      />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">Latest</span>
          <Eyebrow tag={primaryTopic(frontmatter.tags)} />
        </div>
        <h2 className="mt-5 max-w-3xl font-serif text-3xl font-medium leading-[1.15] tracking-tight text-foreground sm:text-4xl">
          {frontmatter.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{frontmatter.description}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <PostMeta post={post} className="text-sm" />
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary dark:text-link">
            Read article
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
