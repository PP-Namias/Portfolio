import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

import { AboutSkeleton } from '@/components/sections/skeletons/AboutSkeleton';
import { BlogSkeleton } from '@/components/sections/skeletons/BlogSkeleton';
import { CertificationsSkeleton } from '@/components/sections/skeletons/CertificationsSkeleton';
import { ConnectSkeleton } from '@/components/sections/skeletons/ConnectSkeleton';
import { ExperienceSkeleton } from '@/components/sections/skeletons/ExperienceSkeleton';
import { GallerySkeleton } from '@/components/sections/skeletons/GallerySkeleton';
import { ProjectsSkeleton } from '@/components/sections/skeletons/ProjectsSkeleton';
import { TechStackSkeleton } from '@/components/sections/skeletons/TechStackSkeleton';

describe('skeleton components', () => {
  const skeletons = [
    { name: 'AboutSkeleton', Component: AboutSkeleton },
    { name: 'BlogSkeleton', Component: BlogSkeleton },
    { name: 'CertificationsSkeleton', Component: CertificationsSkeleton },
    { name: 'ConnectSkeleton', Component: ConnectSkeleton },
    { name: 'ExperienceSkeleton', Component: ExperienceSkeleton },
    { name: 'GallerySkeleton', Component: GallerySkeleton },
    { name: 'ProjectsSkeleton', Component: ProjectsSkeleton },
    { name: 'TechStackSkeleton', Component: TechStackSkeleton },
  ];

  skeletons.forEach(({ name, Component }) => {
    it(`${name} renders without crashing`, () => {
      const { container } = render(<Component />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it(`${name} has aria-hidden on root`, () => {
      const { container } = render(<Component />);
      const root = container.firstChild as HTMLElement;
      expect(root.getAttribute('aria-hidden')).toBe('true');
    });

    it(`${name} contains animate-pulse class`, () => {
      const { container } = render(<Component />);
      const pulseEl = container.querySelector('.animate-pulse');
      expect(pulseEl).toBeInTheDocument();
    });
  });

  it('AboutSkeleton renders with heading and paragraph shimmer blocks', () => {
    const { container } = render(<AboutSkeleton />);
    const roundedDivs = container.querySelectorAll('.rounded');
    expect(roundedDivs.length).toBeGreaterThan(5);
  });

  it('BlogSkeleton renders post shimmer items with rounded-lg containers', () => {
    const { container } = render(<BlogSkeleton />);
    const items = container.querySelectorAll('.flex.gap-3');
    expect(items.length).toBe(3);
  });

  it('CertificationsSkeleton renders grid items with rounded-xl', () => {
    const { container } = render(<CertificationsSkeleton />);
    const items = container.querySelectorAll('.rounded-xl');
    expect(items.length).toBe(6);
  });
});
