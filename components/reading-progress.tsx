'use client';

import { useEffect, useRef } from 'react';

/** Thin bar under the navbar showing how far through the article the reader is. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = target.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -top / Math.max(1, height - window.innerHeight)));
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [targetId]);

  return (
    <div className="fixed inset-x-0 top-16 z-40 h-0.5" aria-hidden="true">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-primary dark:bg-link" />
    </div>
  );
}
