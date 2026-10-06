'use client';

import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/toc';
import { cn } from '@/lib/utils';

function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    const onScroll = () => {
      // The last heading above the top ~third of the viewport is the one being read.
      const line = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }
      setActive(current ?? elements[0].id);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids]);

  return active;
}

function TocLinks({ headings, active, onNavigate }: { headings: Heading[]; active: string | null; onNavigate?: () => void }) {
  return (
    <ul className="space-y-1 border-l border-border text-sm">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={onNavigate}
            aria-current={active === h.id ? 'location' : undefined}
            className={cn(
              '-ml-px block border-l-2 py-1 leading-snug transition-colors',
              h.level === 3 ? 'pl-7' : 'pl-4',
              active === h.id
                ? 'border-primary font-medium text-foreground dark:border-link'
                : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
            )}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Sticky sidebar version (desktop). */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const active = useActiveHeading(headings.map((h) => h.id));
  return (
    <nav aria-label="On this page">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
      <TocLinks headings={headings} active={active} />
    </nav>
  );
}

/** Collapsible version shown above the article on smaller screens. */
export function MobileTableOfContents({ headings }: { headings: Heading[] }) {
  const [open, setOpen] = useState(false);
  const active = useActiveHeading(headings.map((h) => h.id));
  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="group mb-10 rounded-xl border border-border bg-card lg:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
        On this page
        <svg className="transition-transform group-open:rotate-180" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="px-4 pb-4">
        <TocLinks headings={headings} active={active} onNavigate={() => setOpen(false)} />
      </div>
    </details>
  );
}
