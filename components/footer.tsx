import Image from 'next/image';
import { footerNav, legalNav } from '@/lib/site';
import { BLOG_URL, SITE_URL } from '@/lib/utils';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/30">
      <div className="container max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <a href={SITE_URL} className="inline-flex" aria-label="WickLog home">
              <Image src="/blog/logo-wordmark.svg" alt="WickLog" width={321} height={75} className="h-7 w-auto dark:invert dark:hue-rotate-180" />
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The AI trading journal built for Indian traders. Import your trades, find the patterns costing you
              money, and fix them.
            </p>
            <a
              href={`${BLOG_URL}/feed.xml`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
                <circle cx="5" cy="19" r="1" />
              </svg>
              RSS feed
            </a>
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-foreground">{group.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} WickLog. Built with 💚 for Indian traders.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNav.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-foreground transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
