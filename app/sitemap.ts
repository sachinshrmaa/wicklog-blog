import type { MetadataRoute } from 'next';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { BLOG_URL } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latest = posts[0]?.frontmatter;

  return [
    {
      url: BLOG_URL,
      lastModified: latest ? new Date(latest.updated ?? latest.date) : undefined,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...posts.map(({ frontmatter }) => ({
      url: `${BLOG_URL}/${frontmatter.slug}`,
      lastModified: new Date(frontmatter.updated ?? frontmatter.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...getAllTags().map((tag) => ({
      url: `${BLOG_URL}/tags/${tag.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ];
}
