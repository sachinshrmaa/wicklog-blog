import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container max-w-2xl px-4 py-28 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary dark:text-link">404</p>
      <h1 className="mt-4 font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">This page took a stop-loss</h1>
      <p className="mt-4 text-muted-foreground">The article you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
      >
        Browse all articles
      </Link>
    </div>
  );
}
