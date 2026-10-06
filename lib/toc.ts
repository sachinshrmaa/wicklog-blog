import GithubSlugger from 'github-slugger';

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Strip inline markdown so slugs match what rehype-slug generates from rendered text. */
function plainText(md: string): string {
  return md
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links/images → text
    .replace(/`([^`]*)`/g, '$1')
    .replace(/(\*\*|__|\*|_)(.*?)\1/g, '$2')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/** h2/h3 headings from MDX source, with the same ids rehype-slug assigns. */
export function extractHeadings(source: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of source.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) continue;

    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const text = plainText(match[2]);
    // Slug every heading (any level) so duplicate-numbering stays in sync with rehype-slug.
    const id = slugger.slug(text);
    const level = match[1].length;
    if (level === 2 || level === 3) headings.push({ id, text, level });
  }
  return headings;
}
