import type { PostSummary } from '@/lib/posts';
import { PostCard } from './post-card';

export function SuggestedPosts({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-20 border-t border-border pt-12" aria-labelledby="suggested-heading">
      <h2 id="suggested-heading" className="font-serif text-3xl font-medium tracking-tight text-foreground">
        Keep reading
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.frontmatter.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
