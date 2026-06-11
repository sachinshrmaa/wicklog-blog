import Link from 'next/link';
import Image from 'next/image';
import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1 className="scroll-mt-20 text-3xl font-bold tracking-tight mt-10 mb-4" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="scroll-mt-20 text-2xl font-semibold tracking-tight mt-10 mb-3" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="scroll-mt-20 text-xl font-semibold mt-8 mb-2" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="scroll-mt-20 text-lg font-semibold mt-6 mb-2" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p className="leading-7 [&:not(:first-child)]:mt-5" {...props}>
      {children}
    </p>
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith('http');
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link underline underline-offset-4 hover:opacity-80 transition-opacity"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href ?? '#'}
        className="text-link underline underline-offset-4 hover:opacity-80 transition-opacity"
        {...props}
      >
        {children}
      </Link>
    );
  },
  ul: ({ children, ...props }) => (
    <ul className="my-5 ml-6 list-disc space-y-1.5" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="my-5 ml-6 list-decimal space-y-1.5" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mt-5 border-l-4 border-primary pl-5 italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: (props) => <hr className="my-8 border-border" {...props} />,
  table: ({ children, ...props }) => (
    <div className="my-6 w-full overflow-auto rounded-lg border border-border">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-muted/50" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th
      className="px-4 py-2 text-left font-medium text-muted-foreground"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-2 border-t border-border" {...props}>
      {children}
    </td>
  ),
  img: ({ src, alt, ...props }) => {
    if (!src) return null;
    return (
      <span className="block my-6">
        <Image
          src={src}
          alt={alt ?? ''}
          width={800}
          height={450}
          className="rounded-lg border border-border w-full h-auto"
          {...(props as object)}
        />
        {alt && (
          <span className="mt-2 block text-center text-xs text-muted-foreground">
            {alt}
          </span>
        )}
      </span>
    );
  },
  // rehype-pretty-code wraps code in <figure> — pre/code are handled by it
  pre: ({ children, ...props }) => (
    <pre className="overflow-x-auto" {...props}>
      {children}
    </pre>
  ),
};
