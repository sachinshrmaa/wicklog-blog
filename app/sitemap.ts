import type { MetadataRoute } from 'next';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { BLOG_URL } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const tags = getAllTags();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BLOG_URL}/${post.frontmatter.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${BLOG_URL}/tags/${encodeURIComponent(tag)}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [
    {
      url: BLOG_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...postEntries,
    ...tagEntries,
  ];
}
