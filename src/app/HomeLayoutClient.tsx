"use client";

import { useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

type StickySide = 'left' | 'right' | null;

interface HomeLayoutClientProps {
  heroNode: ReactNode;
  aboutNode: ReactNode;
  techStackNode: ReactNode;
  projectsNode: ReactNode;
  experienceNode: ReactNode;
  connectNode: ReactNode;
  certificationsNode: ReactNode;
  galleryNode: ReactNode;
}

export function HomeLayoutClient({
  heroNode,
  aboutNode,
  techStackNode,
  projectsNode,
  experienceNode,
  connectNode,
  certificationsNode,
  galleryNode,
}: HomeLayoutClientProps) {
  const leftColumnRef = useRef<HTMLDivElement | null>(null);
  const rightColumnRef = useRef<HTMLDivElement | null>(null);
  const [stickySide, setStickySide] = useState<StickySide>('right');

  useEffect(() => {
    const updateStickySide = () => {
      if (window.innerWidth < 1024) {
        setStickySide(null);
        return;
      }

      const leftHeight = leftColumnRef.current?.getBoundingClientRect().height ?? 0;
      const rightHeight = rightColumnRef.current?.getBoundingClientRect().height ?? 0;

      if (!leftHeight || !rightHeight) {
        return;
      }

      const equalHeightThreshold = 24;
      if (Math.abs(leftHeight - rightHeight) <= equalHeightThreshold) {
        setStickySide(null);
        return;
      }

      setStickySide(leftHeight < rightHeight ? 'left' : 'right');
    };

    updateStickySide();

    const observer = new ResizeObserver(() => {
      updateStickySide();
    });

    if (leftColumnRef.current) {
      observer.observe(leftColumnRef.current);
    }

    if (rightColumnRef.current) {
      observer.observe(rightColumnRef.current);
    }

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
    <main id="main-content" className="mx-auto max-w-container px-4 sm:px-6 pt-8 lg:pt-12">
      <Card className="mb-4">
        {heroNode}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[62%_1fr] lg:items-start gap-4 mt-4">
        <div className={leftColumnClass}>
          <div ref={leftColumnRef} className="space-y-4">
            <Card>
              {aboutNode}
            </Card>

            <Card>
              {techStackNode}
            </Card>

            <Card>
              {projectsNode}
            </Card>
          </div>
        </div>

        <div className={rightColumnClass}>
          <div ref={rightColumnRef} className="space-y-4">
            <Card>
              {experienceNode}
            </Card>
            <Card>
              {connectNode}
            </Card>
          </div>
        </div>
      </div>

      <Card className="mt-4">
        {certificationsNode}
      </Card>

      <Card className="mt-4">
        {galleryNode}
      </Card>

      <Footer />
    </main>
  );
}
