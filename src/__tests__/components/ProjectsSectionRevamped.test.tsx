import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    useReducedMotion: () => false,
  };
});

const mockProjects = [
  {
    title: 'Live App',
    image: '',
    description: 'A live project',
    tags: ['React', 'TypeScript'],
    year: 2025,
    liveURL: 'https://example.com',
    repositoryURL: null,
    processURL: null,
    status: 'completed' as const,
    tier: 'featured' as const,
    showcaseDetail: false,
    shortDescription: 'A live project',
    slug: 'live-app',
  },
  {
    title: 'Showcase Project',
    image: '',
    description: 'A showcase project without a live URL',
    tags: ['Python', 'AI'],
    year: 2024,
    liveURL: null,
    repositoryURL: 'https://github.com/test/repo',
    processURL: null,
    status: 'completed' as const,
    tier: 'standard' as const,
    showcaseDetail: true,
    shortDescription: 'A showcase project',
    slug: 'showcase-project',
  },
];

vi.mock('@/hooks/useCmsContent', () => ({
  useCmsContent: () => ({ projects: mockProjects }),
}));

describe('ProjectsSectionRevamped', () => {
  it('renders the section heading with project count', async () => {
    const { ProjectsSectionRevamped } = await import('@/components/sections/ProjectsSectionRevamped');
    render(<ProjectsSectionRevamped />);
    expect(screen.getByText('Projects')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
  });

  it('renders both tabs', async () => {
    const { ProjectsSectionRevamped } = await import('@/components/sections/ProjectsSectionRevamped');
    render(<ProjectsSectionRevamped />);
    expect(screen.getByText(/Live Projects/)).toBeDefined();
    expect(screen.getByText(/Showcase/)).toBeDefined();
  });

  it('defaults to Live Projects tab showing only live projects', async () => {
    const { ProjectsSectionRevamped } = await import('@/components/sections/ProjectsSectionRevamped');
    render(<ProjectsSectionRevamped />);
    expect(screen.getByText('Live App')).toBeDefined();
    expect(screen.queryByText('Showcase Project')).toBeNull();
  });
});
