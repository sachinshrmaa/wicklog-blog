import { BLOG_URL } from './utils';

export function ogImageUrl(title?: string, description?: string): string {
  const params = new URLSearchParams();
  if (title) params.set('title', title);
  if (description) params.set('description', description);
  const qs = params.toString();
  return `${BLOG_URL}/og${qs ? `?${qs}` : ''}`;
}
