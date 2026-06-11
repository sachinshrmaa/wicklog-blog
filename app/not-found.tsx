import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container max-w-3xl py-24 text-center">
      <p className="text-5xl font-bold text-primary mb-4">404</p>
      <h1 className="text-2xl font-semibold text-foreground mb-2">Page not found</h1>
      <p className="text-muted-foreground mb-8">
        The post or page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4"
      >
        ← Back to blog
      </Link>
    </div>
  );
}
