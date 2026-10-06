import Link from 'next/link';
import Image from 'next/image';
import type { MDXComponents } from 'mdx/types';

// Typography (sizes, spacing, colours) comes from the `prose` classes and the
// typography config in tailwind.config.ts. Overrides here are behavioural only.
export const mdxComponents: MDXComponents = {
  a: ({ href = '#', children, ...props }) => {
    if (/^https?:\/\//.test(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    }
    // In-page anchors, mailto: etc. aren't routes — skip next/link (and its basePath).
    if (!href.startsWith('/')) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  },
  table: ({ children, ...props }) => (
    <div className="my-8 w-full overflow-x-auto rounded-xl border border-border">
      <table {...props}>{children}</table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-muted/60" {...props}>
      {children}
    </thead>
  ),
  // Markdown wraps standalone images in <p>, so use spans rather than <figure>.
  img: ({ src, alt }) => {
    if (!src) return null;
    return (
      <span className="my-8 block">
        <Image
          src={src}
          alt={alt ?? ''}
          width={1600}
          height={900}
          sizes="(min-width: 1024px) 720px, 100vw"
          className="m-0 h-auto w-full rounded-xl border border-border shadow-sm"
        />
        {alt && <span className="mt-3 block text-center text-sm text-muted-foreground">{alt}</span>}
      </span>
    );
  },
};
