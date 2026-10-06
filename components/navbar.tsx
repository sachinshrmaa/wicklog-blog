import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './theme-toggle';
import { mainNav, SIGNUP_URL } from '@/lib/site';
import { SITE_URL } from '@/lib/utils';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <a href={SITE_URL} className="flex shrink-0 items-center" aria-label="WickLog home">
            <Image src="/blog/logo-wordmark.svg" alt="WickLog" width={321} height={75} className="h-6 sm:h-7 w-auto dark:invert dark:hue-rotate-180" priority />
          </a>
          <span className="h-5 w-px bg-border" aria-hidden="true" />
          <Link href="/" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
            Blog
          </Link>
        </div>

        <nav aria-label="Main site" className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {mainNav.map((item) => (
            <a key={item.label} href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={SIGNUP_URL}
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground transition-colors sm:inline-block sm:px-2"
          >
            Log in
          </a>
          <a
            href={SIGNUP_URL}
            className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
          >
            <span className="sm:hidden">Start free</span>
            <span className="hidden sm:inline">Get started free</span>
          </a>
        </div>
      </div>
    </header>
  );
}
