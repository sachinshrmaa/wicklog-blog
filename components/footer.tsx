import Image from 'next/image';
import { SITE_URL } from '@/lib/utils';

const footerLinks = [
  { label: 'Terms', href: `${SITE_URL}/terms` },
  { label: 'Privacy', href: `${SITE_URL}/privacy-policy` },
  { label: 'Refunds', href: `${SITE_URL}/refund-policy` },
  { label: 'Cookies', href: `${SITE_URL}/cookie-policy` },
  { label: 'Disclaimer', href: `${SITE_URL}/disclaimer` },
  { label: 'Acceptable Use', href: `${SITE_URL}/acceptable-use` },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-6 mt-16">
      <div className="container max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <a href={SITE_URL} className="flex items-center shrink-0">
          <Image
            src="/blog/logo.svg"
            alt="Wicklog"
            width={120}
            height={32}
            className="h-7 w-auto"
          />
        </a>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="text-sm text-muted-foreground shrink-0">
          &copy; {new Date().getFullYear()} Wicklog. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
