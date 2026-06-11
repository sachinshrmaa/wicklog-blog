import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BLOG_TITLE, BLOG_DESCRIPTION, BLOG_URL } from '@/lib/utils';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(BLOG_URL),
  title: {
    default: BLOG_TITLE,
    template: `%s — ${BLOG_TITLE}`,
  },
  description: BLOG_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BLOG_URL,
    siteName: BLOG_TITLE,
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
  },
  alternates: {
    canonical: BLOG_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
