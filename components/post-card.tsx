import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { frontmatter, readingTime } = post;

  return (
    <article className="group border-b border-border py-8 first:pt-0 last:border-none">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{readingTime}</span>
        </div>

        <Link href={`/${frontmatter.slug}`} className="block">
          <h2 className="text-xl font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
            {frontmatter.title}
          </h2>

          {frontmatter.description && (
            <p className="mt-1 text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {frontmatter.description}
            </p>
          )}
        </Link>

        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {frontmatter.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function TagChip({ tag }: { tag: string }) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      {tag}
    </Link>
  );
}
