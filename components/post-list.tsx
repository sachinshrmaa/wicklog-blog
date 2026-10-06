'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { PostSummary, Tag } from '@/lib/posts';
import { tagLabel } from '@/lib/tags';
import { cn } from '@/lib/utils';
import { FeaturedPostCard, PostCard } from './post-card';

const PAGE_SIZE = 12;
// Don't make a page out of a handful of leftovers — fold them into the current one.
const MIN_LAST_PAGE = 4;
// Saved when a reader opens a post from an expanded list, so Back returns them to the same card.
const RETURN_KEY = 'wicklog-blog:return-to';

interface ReturnState {
  visible: number;
  scrollY: number;
}

function readReturnState(): ReturnState | null {
  try {
    const saved = sessionStorage.getItem(RETURN_KEY);
    return saved ? (JSON.parse(saved) as ReturnState) : null;
  } catch {
    return null; // Storage can be unavailable (private mode, blocked cookies).
  }
}

/** One-shot: once used, a later fresh visit starts at the top. */
function clearReturnState() {
  try {
    sessionStorage.removeItem(RETURN_KEY);
  } catch {
    // See above.
  }
}

// True once the list has hydrated in this tab. Later mounts are client-side navigations
// (e.g. Back from a post), where reading storage during render can't cause a hydration mismatch.
let hasHydrated = false;

interface PostListProps {
  posts: PostSummary[];
  /** Topics offered as filters, most-used first. */
  topics: Tag[];
}

export function PostList({ posts, topics }: PostListProps) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<string | null>(null);
  // After Back, render the expanded list immediately so the page is already tall enough
  // when the browser restores the scroll position (otherwise it clamps to a short page).
  const [initial] = useState(() => (hasHydrated ? readReturnState() : null));
  const [visible, setVisible] = useState(initial?.visible ?? PAGE_SIZE);
  const firstNewCard = useRef<HTMLAnchorElement>(null);
  const focusIndex = useRef<number | null>(null);
  const restoreScroll = useRef<number | null>(initial?.scrollY ?? null);

  useEffect(() => {
    if (hasHydrated) {
      clearReturnState(); // client-side mount: already restored during render
      return;
    }
    hasHydrated = true;
    // First load in this tab: restore after hydration so server and client HTML match.
    const saved = readReturnState();
    clearReturnState();
    if (!saved) return;
    restoreScroll.current = saved.scrollY;
    if (saved.visible > PAGE_SIZE) setVisible(saved.visible);
    else requestAnimationFrame(() => window.scrollTo(0, saved.scrollY));
  }, []);

  useEffect(() => {
    if (restoreScroll.current !== null) {
      const y = restoreScroll.current;
      restoreScroll.current = null;
      requestAnimationFrame(() => window.scrollTo(0, y));
    }
    if (focusIndex.current !== null) {
      firstNewCard.current?.focus();
      focusIndex.current = null;
    }
  }, [visible]);

  const rememberPosition = (e: React.MouseEvent) => {
    // Opening in a new tab/window doesn't leave this page — nothing to come back to.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    try {
      const state: ReturnState = { visible, scrollY: window.scrollY };
      sessionStorage.setItem(RETURN_KEY, JSON.stringify(state));
    } catch {
      // See above.
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (topic && !p.frontmatter.tags.includes(topic)) return false;
      if (!q) return true;
      return (
        p.frontmatter.title.toLowerCase().includes(q) ||
        p.frontmatter.description.toLowerCase().includes(q) ||
        p.frontmatter.tags.some((t) => tagLabel(t).toLowerCase().includes(q))
      );
    });
  }, [posts, query, topic]);

  const browsing = !query.trim() && !topic;
  const [featured, ...rest] = filtered;
  const all = browsing ? rest : filtered;
  const end = all.length - visible < MIN_LAST_PAGE ? all.length : visible;
  const grid = all.slice(0, end);
  const remaining = all.length - grid.length;

  // A new filter or search starts from the first page of results.
  const filterBy = (next: { query?: string; topic?: string | null }) => {
    if (next.query !== undefined) setQuery(next.query);
    if (next.topic !== undefined) setTopic(next.topic);
    setVisible(PAGE_SIZE);
  };
  const reset = () => filterBy({ query: '', topic: null });
  const loadMore = () => {
    focusIndex.current = grid.length;
    setVisible((v) => v + PAGE_SIZE);
  };

  return (
    <div>
      {browsing && featured && (
        <div className="mb-14">
          <FeaturedPostCard post={featured} />
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by topic">
          <TopicPill active={!topic} onClick={() => filterBy({ topic: null })}>
            All posts
          </TopicPill>
          {topics.map((t) => (
            <TopicPill key={t.slug} active={topic === t.slug} onClick={() => filterBy({ topic: topic === t.slug ? null : t.slug })}>
              {t.label}
            </TopicPill>
          ))}
        </div>

        <div className="relative w-full lg:w-72 lg:shrink-0">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            aria-label="Search posts"
            placeholder="Search articles…"
            value={query}
            onChange={(e) => filterBy({ query: e.target.value })}
            className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {!browsing && (
        <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          {topic && <> in <span className="font-medium text-foreground">{tagLabel(topic)}</span></>}
          {query.trim() && <> matching &ldquo;{query.trim()}&rdquo;</>}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">No articles match that search.</p>
          <button onClick={reset} className="mt-3 text-sm font-medium text-primary hover:underline underline-offset-4 dark:text-link">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2" onClickCapture={rememberPosition}>
            {grid.map((post, i) => (
              <PostCard
                key={post.frontmatter.slug}
                post={post}
                ref={i === focusIndex.current ? firstNewCard : undefined}
              />
            ))}
          </div>

          {all.length > PAGE_SIZE && (
            <div className="mt-12 flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground" aria-live="polite">
                Showing {grid.length} of {all.length} {browsing ? 'more articles' : 'articles'}
              </p>
              {remaining > 0 && (
                <button
                  type="button"
                  onClick={loadMore}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground shadow-xs transition-colors hover:border-primary/40 hover:bg-muted/50"
                >
                  Load {remaining - PAGE_SIZE < MIN_LAST_PAGE ? remaining : PAGE_SIZE} more
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TopicPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
      )}
    >
      {children}
    </button>
  );
}
