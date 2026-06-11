import type { Metadata } from 'next';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { PostList } from '@/components/post-list';
import { TagChip } from '@/components/post-card';
import { BLOG_TITLE, BLOG_DESCRIPTION } from '@/lib/utils';

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="container max-w-3xl py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Blog</h1>
        <p className="mt-2 text-muted-foreground">{BLOG_DESCRIPTION}</p>

        {tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        )}
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet — check back soon.</p>
      ) : (
        <PostList posts={posts} />
      )}
    </div>
  );
}
