import { getAllPosts } from '@/lib/posts';
import { BLOG_DESCRIPTION, BLOG_TITLE, BLOG_URL } from '@/lib/utils';
import { tagLabel } from '@/lib/tags';

export const dynamic = 'force-static';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
  const posts = getAllPosts();

  const items = posts
    .map(({ frontmatter: fm }) => {
      const url = `${BLOG_URL}/${fm.slug}`;
      return `    <item>
      <title>${escape(fm.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(fm.description)}</description>
      <pubDate>${new Date(fm.date).toUTCString()}</pubDate>
      <dc:creator>${escape(fm.author)}</dc:creator>
${fm.tags.map((t) => `      <category>${escape(tagLabel(t))}</category>`).join('\n')}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escape(BLOG_TITLE)}</title>
    <link>${BLOG_URL}</link>
    <description>${escape(BLOG_DESCRIPTION)}</description>
    <language>en-in</language>
    <atom:link href="${BLOG_URL}/feed.xml" rel="self" type="application/rss+xml" />
${posts[0] ? `    <lastBuildDate>${new Date(posts[0].frontmatter.date).toUTCString()}</lastBuildDate>\n` : ''}${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
