import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts';
import { renderMDX } from '@/lib/mdx';
import { ogImageUrl } from '@/lib/og';
import Link from 'next/link';
import { extractHeadings } from '@/lib/toc';
import { primaryTopic, tagLabel } from '@/lib/tags';
import { SuggestedPosts } from '@/components/suggested-posts';
import { TagChip } from '@/components/tag-chip';
import { MobileTableOfContents, TableOfContents } from '@/components/table-of-contents';
import { ReadingProgress } from '@/components/reading-progress';
import { ShareButtons } from '@/components/share-buttons';
import { CtaCard } from '@/components/cta-card';
import { formatDate, BLOG_URL, BLOG_TITLE, SITE_NAME, SITE_URL } from '@/lib/utils';

interface PageProps {
  params: { slug: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.frontmatter.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const { frontmatter } = post;
  const url = `${BLOG_URL}/${frontmatter.slug}`;
  const image = frontmatter.coverImage ?? ogImageUrl(frontmatter.title, frontmatter.description);

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    authors: [{ name: frontmatter.author }],
    keywords: frontmatter.tags,
    openGraph: {
      type: 'article',
      siteName: BLOG_TITLE,
      locale: 'en_IN',
      title: frontmatter.title,
      description: frontmatter.description,
      url,
      publishedTime: frontmatter.date,
      modifiedTime: frontmatter.updated ?? frontmatter.date,
      authors: [frontmatter.author],
      tags: frontmatter.tags,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export default async function PostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const { frontmatter, content, readingTime } = post;
  const mdxContent = await renderMDX(content);
  const url = `${BLOG_URL}/${frontmatter.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.updated ?? frontmatter.date,
    author: { '@type': 'Person', name: frontmatter.author },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    image: frontmatter.coverImage ?? ogImageUrl(frontmatter.title, frontmatter.description),
    keywords: frontmatter.tags.join(', '),
  };

  const headings = extractHeadings(content).filter((h) => h.level === 2);
  const showToc = headings.length >= 3;
  const primaryTag = primaryTopic(frontmatter.tags);
  const initials = frontmatter.author
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so content can never close the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ReadingProgress targetId="article-body" />

      <div className="container max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_250px]">
          <div className="min-w-0 max-w-3xl">
            <article>
              <header className="mb-10">
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link href="/" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                  {primaryTag && (
                    <>
                      <span aria-hidden="true">/</span>
                      <Link href={`/tags/${primaryTag}`} className="font-medium text-primary hover:underline underline-offset-4 dark:text-link">
                        {tagLabel(primaryTag)}
                      </Link>
                    </>
                  )}
                </nav>

                <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.12] tracking-tight text-foreground sm:text-5xl">
                  {frontmatter.title}
                </h1>

                <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">{frontmatter.description}</p>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                    >
                      {initials}
                    </span>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{frontmatter.author}</p>
                      <p className="text-muted-foreground">
                        <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
                        {frontmatter.updated && frontmatter.updated !== frontmatter.date && (
                          <>
                            {' · Updated '}
                            <time dateTime={frontmatter.updated}>{formatDate(frontmatter.updated)}</time>
                          </>
                        )}
                        {' · '}
                        {readingTime}
                      </p>
                    </div>
                  </div>
                  <ShareButtons url={url} title={frontmatter.title} />
                </div>
              </header>

              {frontmatter.coverImage && (
                <div className="mb-10 overflow-hidden rounded-2xl border border-border">
                  <Image
                    src={frontmatter.coverImage}
                    alt={frontmatter.title}
                    width={1200}
                    height={630}
                    sizes="(min-width: 1024px) 768px, 100vw"
                    className="h-auto w-full"
                    priority
                  />
                </div>
              )}

              {showToc && <MobileTableOfContents headings={headings} />}

              <div id="article-body" className="prose prose-neutral max-w-none dark:prose-invert">
                {mdxContent}
              </div>
            </article>

            <footer className="mt-14 space-y-6 border-t border-border pt-8">
              {frontmatter.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-sm text-muted-foreground">Topics</span>
                  {frontmatter.tags.map((tag) => (
                    <TagChip key={tag} tag={tag} />
                  ))}
                </div>
              )}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">Found this useful? Share it with a trading friend.</p>
                <ShareButtons url={url} title={frontmatter.title} />
              </div>
              <div className="lg:hidden">
                <CtaCard />
              </div>
            </footer>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {showToc && <TableOfContents headings={headings} />}
              <CtaCard />
            </div>
          </aside>
        </div>

        <SuggestedPosts posts={getRelatedPosts(post)} />
      </div>
    </>
  );
}
