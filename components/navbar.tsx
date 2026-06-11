import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './theme-toggle';
import { SITE_URL } from '@/lib/utils';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-3xl items-center justify-between">
        <nav className="flex items-center gap-6 text-sm font-medium">
          <a href={SITE_URL} className="flex items-center">
            <Image
              src="/blog/logo.svg"
              alt="Wicklog"
              width={120}
              height={32}
              className="h-9 w-auto"
              priority
            />
          </a>
          <Link
            href="/"
            className="text-muted-foreground font-medium hover:text-foreground transition-colors"
          >
            Blog
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
