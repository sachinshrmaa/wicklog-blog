import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { getAllTags, getPostsByTag } from '@/lib/posts';
import { tagLabel, tagSlug } from '@/lib/tags';
import { PostCard } from '@/components/post-card';
import { TagChip } from '@/components/tag-chip';
import { BLOG_URL, BLOG_TITLE } from '@/lib/utils';

interface PageProps {
  params: { tag: string };
}

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const label = tagLabel(params.tag);
  return {
    title: label,
    description: `Articles about ${label} on the ${BLOG_TITLE}.`,
    alternates: { canonical: `${BLOG_URL}/tags/${params.tag}` },
  };
}

export default function TagPage({ params }: PageProps) {
  // Old tag URLs used raw names (e.g. /tags/Ticker%20AI) — send them to the slug.
  const slug = tagSlug(decodeURIComponent(params.tag));
  if (slug !== params.tag) permanentRedirect(`/tags/${slug}`);

  const posts = getPostsByTag(slug);
  if (posts.length === 0) notFound();

  const otherTags = getAllTags()
    .filter((t) => t.slug !== slug)
    .slice(0, 12);

  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <div className="container max-w-6xl px-4 py-14 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <span aria-hidden="true">/</span>
            <span>Topics</span>
          </nav>
          <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">{tagLabel(slug)}</h1>
          <p className="mt-3 text-muted-foreground">
            {posts.length} {posts.length === 1 ? 'article' : 'articles'}
          </p>
        </div>
      </section>

      <div className="container max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.frontmatter.slug} post={post} />
          ))}
        </div>

        {otherTags.length > 0 && (
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="text-sm font-semibold text-foreground">More topics</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {otherTags.map((t) => (
                <TagChip key={t.slug} tag={t.slug} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
