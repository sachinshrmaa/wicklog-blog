import type { Metadata } from 'next';
import { DM_Sans, EB_Garamond, Fira_Code } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ogImageUrl } from '@/lib/og';
import { BLOG_TITLE, BLOG_DESCRIPTION, BLOG_URL } from '@/lib/utils';
import './globals.css';

const sans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const serif = EB_Garamond({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const mono = Fira_Code({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(BLOG_URL),
  title: {
    default: BLOG_TITLE,
    template: `%s — ${BLOG_TITLE}`,
  },
  description: BLOG_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BLOG_URL,
    siteName: BLOG_TITLE,
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    images: [{ url: ogImageUrl(), width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    images: [ogImageUrl()],
  },
  alternates: {
    canonical: BLOG_URL,
    types: { 'application/rss+xml': [{ url: `${BLOG_URL}/feed.xml`, title: BLOG_TITLE }] },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <main id="main" className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
