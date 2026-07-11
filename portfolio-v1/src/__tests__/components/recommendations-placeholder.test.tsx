import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
  },
}));

vi.mock('@/hooks/useCarousel', () => ({
  useCarousel: () => ({
    currentIndex: 0,
    goTo: vi.fn(),
    setIsHovered: vi.fn(),
  }),
}));

vi.mock('@/data/recommendations', () => ({
  recommendations: [
    { quote: '...', name: 'Sample Recommender', title: 'Role', company: 'Company' },
  ],
}));

import { RecommendationsCarousel } from '@/components/sections/RecommendationsCarousel';

describe('RecommendationsCarousel placeholder branch', () => {
  it('renders coming soon state for placeholder testimonials', () => {
    render(<RecommendationsCarousel />);

    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Testimonials coming soon')).toBeInTheDocument();
  });
});
