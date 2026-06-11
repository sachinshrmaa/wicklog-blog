import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { SuggestedPosts } from '@/components/suggested-posts';
import { mdxComponents } from '@/components/mdx-components';
import { TagChip } from '@/components/post-card';
import { formatDate, BLOG_URL, SITE_NAME } from '@/lib/utils';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.frontmatter.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const { frontmatter } = post;
  const ogImage = `${BLOG_URL}/og?title=${encodeURIComponent(frontmatter.title)}&description=${encodeURIComponent(frontmatter.description ?? '')}`;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    authors: [{ name: frontmatter.author }],
    openGraph: {
      type: 'article',
      title: frontmatter.title,
      description: frontmatter.description,
      url: `${BLOG_URL}/${frontmatter.slug}`,
      publishedTime: frontmatter.date,
      tags: frontmatter.tags,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${BLOG_URL}/${frontmatter.slug}`,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const { frontmatter, content, readingTime } = post;

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            { behavior: 'wrap', properties: { className: ['anchor'] } },
          ],
          [
            rehypePrettyCode,
            {
              theme: { dark: 'github-dark', light: 'github-light' },
              keepBackground: false,
            },
          ],
        ],
      },
    },
    components: mdxComponents,
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    author: {
      '@type': 'Person',
      name: frontmatter.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: 'https://wicklog.in',
    },
    url: `${BLOG_URL}/${frontmatter.slug}`,
    ...(frontmatter.coverImage && { image: frontmatter.coverImage }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

        <article>
          <header className="mb-10">
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {frontmatter.tags.map((tag) => (
                  <TagChip key={tag} tag={tag} />
                ))}
              </div>
            )}

            <h1 className="text-3xl font-bold tracking-tight leading-tight text-foreground sm:text-4xl">
              {frontmatter.title}
            </h1>

            {frontmatter.description && (
              <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
                {frontmatter.description}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground border-t border-border pt-5">
              <span className="font-medium text-foreground">{frontmatter.author}</span>
              <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
              <span>{readingTime}</span>
            </div>
          </header>

          {frontmatter.coverImage && (
            <div className="mb-10 overflow-hidden rounded-lg border border-border">
              <Image
                src={frontmatter.coverImage}
                alt={frontmatter.title}
                width={800}
                height={450}
                className="w-full h-auto"
                priority
              />
            </div>
          )}

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {mdxContent}
          </div>
        </article>

        <SuggestedPosts
          currentSlug={frontmatter.slug}
          currentTags={frontmatter.tags ?? []}
          allPosts={allPosts}
        />

        <footer className="mt-10 pt-8 border-t border-border">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to all posts
          </Link>
        </footer>
      </div>
    </>
  );
}
