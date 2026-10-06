/**
 * Tags are stored as URL-safe slugs ("ticker-ai"). Frontmatter may use any
 * casing/spacing ("Ticker AI") — it's normalised so variants share one page.
 */
export function tagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Labels that title-casing would get wrong.
const LABELS: Record<string, string> = {
  'ai-trading-journal': 'AI Trading Journal',
  'algo-trading': 'Algo Trading',
  'bank-nifty': 'Bank Nifty',
  'fno-trading': 'F&O Trading',
  smartapi: 'SmartAPI',
  stt: 'STT',
  'ticker-ai': 'Ticker AI',
  'tradervue-alternative': 'Tradervue Alternative',
};

export function tagLabel(slug: string): string {
  return LABELS[slug] ?? slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Tags on most posts — accurate, but useless as a post's headline topic or a filter.
export const BROAD_TAGS = new Set(['trading-journal', 'indian-stock-market']);

/** The most specific tag to show as a post's topic. */
export function primaryTopic(tags: string[]): string | undefined {
  return tags.find((t) => !BROAD_TAGS.has(t)) ?? tags[0];
}
