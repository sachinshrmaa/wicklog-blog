import Link from 'next/link';
import { tagLabel } from '@/lib/tags';
import { cn } from '@/lib/utils';

export function TagChip({ tag, className }: { tag: string; className?: string }) {
  return (
    <Link
      href={`/tags/${tag}`}
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground',
        className
      )}
    >
      {tagLabel(tag)}
    </Link>
  );
}
