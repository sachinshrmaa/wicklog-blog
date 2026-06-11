import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const SITE_URL = 'https://wicklog.in';
export const BLOG_URL = `${SITE_URL}/blog`;
export const SITE_NAME = 'Wicklog';
export const BLOG_TITLE = 'Wicklog Blog';
export const BLOG_DESCRIPTION = 'Writing about finance, investing, and building products.';
export const BLOG_AUTHOR = 'Sachin Sharma';
