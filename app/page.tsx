import { getAllPostSummaries, getAllTags } from '@/lib/posts';
import { BROAD_TAGS } from '@/lib/tags';
import { PostList } from '@/components/post-list';
import { BLOG_DESCRIPTION } from '@/lib/utils';

export default function BlogIndexPage() {
  const posts = getAllPostSummaries();
  const topics = getAllTags()
    .filter((t) => t.count >= 2 && !BROAD_TAGS.has(t.slug))
    .slice(0, 8);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_15%_0%,hsl(var(--primary)/0.10),transparent),radial-gradient(ellipse_50%_70%_at_90%_10%,hsl(270_40%_70%/0.12),transparent)]"
        />
        <div className="container relative max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary dark:text-link">WickLog Blog</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-6xl">
            Trade with data, not hunches.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {BLOG_DESCRIPTION} Written for Indian F&amp;O and equity traders.
          </p>
        </div>
      </section>

      <div className="container max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet — check back soon.</p>
        ) : (
          <PostList posts={posts} topics={topics} />
        )}
      </div>
    </>
  );
}
