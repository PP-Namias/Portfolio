'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

type StickySide = 'left' | 'right' | null;

interface StickyTwoColumnProps {
  left: ReactNode;
  right: ReactNode;
}

const DESKTOP_BREAKPOINT = 1024;
const EQUAL_HEIGHT_THRESHOLD = 24;

export function StickyTwoColumn({ left, right }: StickyTwoColumnProps) {
  const leftColumnRef = useRef<HTMLDivElement | null>(null);
  const rightColumnRef = useRef<HTMLDivElement | null>(null);
  const [stickySide, setStickySide] = useState<StickySide>('right');

  useEffect(() => {
    const updateStickySide = () => {
      if (window.innerWidth < DESKTOP_BREAKPOINT) {
        setStickySide(null);
        return;
      }

      const leftHeight = leftColumnRef.current?.getBoundingClientRect().height ?? 0;
      const rightHeight = rightColumnRef.current?.getBoundingClientRect().height ?? 0;

      if (!leftHeight || !rightHeight) return;

      if (Math.abs(leftHeight - rightHeight) <= EQUAL_HEIGHT_THRESHOLD) {
        setStickySide(null);
        return;
      }

      setStickySide(leftHeight < rightHeight ? 'left' : 'right');
    };

    updateStickySide();

    const observer = new ResizeObserver(updateStickySide);
    if (leftColumnRef.current) observer.observe(leftColumnRef.current);
    if (rightColumnRef.current) observer.observe(rightColumnRef.current);
    window.addEventListener('resize', updateStickySide);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateStickySide);
    };
  }, []);

  const leftColumnClass = useMemo(
    () =>
      [
        'order-1 lg:order-none lg:col-start-1 lg:self-start',
        stickySide === 'left' ? 'lg:sticky lg:top-4' : '',
      ]
        .filter(Boolean)
        .join(' '),
    [stickySide]
  );

  const rightColumnClass = useMemo(
    () =>
      [
        'order-2 lg:order-none lg:col-start-2 lg:self-start',
        stickySide === 'right' ? 'lg:sticky lg:top-4' : '',
      ]
        .filter(Boolean)
        .join(' '),
    [stickySide]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[62%_1fr] lg:items-start gap-4 mt-4">
      <div className={leftColumnClass}>
        <div ref={leftColumnRef} className="space-y-4">
          {left}
        </div>
      </div>
      <div className={rightColumnClass}>
        <div ref={rightColumnRef} className="space-y-4">
          {right}
        </div>
      </div>
    </div>
  );
}
