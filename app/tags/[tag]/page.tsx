import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllTags, getPostsByTag } from '@/lib/posts';
import { PostCard } from '@/components/post-card';
import { BLOG_URL, BLOG_TITLE } from '@/lib/utils';

interface PageProps {
  params: { tag: string };
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);
  const posts = getPostsByTag(tag);
  if (posts.length === 0) return {};

  return {
    title: `#${tag}`,
    description: `Posts tagged with "${tag}" on ${BLOG_TITLE}`,
    alternates: {
      canonical: `${BLOG_URL}/tags/${encodeURIComponent(tag)}`,
    },
  };
}

export default function TagPage({ params }: PageProps) {
  const tag = decodeURIComponent(params.tag);
  const posts = getPostsByTag(tag);

  if (posts.length === 0) notFound();

  return (
    <div className="container max-w-3xl py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        All posts
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tag</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mt-1">
          #{tag}
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </header>

      <section>
        {posts.map((post) => (
          <PostCard key={post.frontmatter.slug} post={post} />
        ))}
      </section>
    </div>
  );
}
