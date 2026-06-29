import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    useReducedMotion: () => false,
  };
});

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockProjects = [
  {
    title: 'Live App 1',
    image: '',
    description: 'First live project',
    tags: ['React', 'TypeScript'],
    year: 2025,
    liveURL: 'https://example.com',
    repositoryURL: null,
    processURL: null,
    status: 'completed' as const,
    tier: 'featured' as const,
    showcaseDetail: false,
    shortDescription: 'First live project',
    slug: 'live-app-1',
  },
  {
    title: 'Showcase Project 1',
    image: '',
    description: 'First showcase project',
    tags: ['Python', 'AI'],
    year: 2024,
    liveURL: null,
    repositoryURL: 'https://github.com/test/repo',
    processURL: null,
    status: 'completed' as const,
    tier: 'standard' as const,
    showcaseDetail: true,
    shortDescription: 'First showcase project',
    slug: 'showcase-1',
  },
  {
    title: 'Live App 2',
    image: '',
    description: 'Second live project',
    tags: ['Next.js'],
    year: 2023,
    liveURL: 'https://example2.com',
    repositoryURL: null,
    processURL: null,
    status: 'completed' as const,
    tier: 'standard' as const,
    showcaseDetail: false,
    shortDescription: 'Second live project',
    slug: 'live-app-2',
  },
  {
    title: 'Live App 3',
    image: '',
    description: 'Third live project',
    tags: ['Vue'],
    year: 2022,
    liveURL: 'https://example3.com',
    repositoryURL: null,
    processURL: null,
    status: 'completed' as const,
    tier: 'standard' as const,
    showcaseDetail: false,
    shortDescription: 'Third live project',
    slug: 'live-app-3',
  },
  {
    title: 'Live App 4',
    image: '',
    description: 'Fourth live project',
    tags: ['Svelte'],
    year: 2021,
    liveURL: 'https://example4.com',
    repositoryURL: null,
    processURL: null,
    status: 'completed' as const,
    tier: 'standard' as const,
    showcaseDetail: false,
    shortDescription: 'Fourth live project',
    slug: 'live-app-4',
  },
  {
    title: 'Live App 5',
    image: '',
    description: 'Fifth live project',
    tags: ['Angular'],
    year: 2020,
    liveURL: 'https://example5.com',
    repositoryURL: null,
    processURL: null,
    status: 'completed' as const,
    tier: 'standard' as const,
    showcaseDetail: false,
    shortDescription: 'Fifth live project',
    slug: 'live-app-5',
  },
];

vi.mock('@/hooks/useCmsContent', () => ({
  useCmsContent: () => ({ projects: mockProjects }),
}));

describe('ProjectsSectionRevamped', () => {
  it('renders the section heading', async () => {
    const { ProjectsSectionRevamped } = await import('@/components/sections/ProjectsSectionRevamped');
    render(<ProjectsSectionRevamped />);
    expect(screen.getByText('Recent Projects')).toBeDefined();
  });

  it('renders a View All link to /projects', async () => {
    const { ProjectsSectionRevamped } = await import('@/components/sections/ProjectsSectionRevamped');
    render(<ProjectsSectionRevamped />);
    const viewAllLink = screen.getByText(/View All/).closest('a');
    expect(viewAllLink).toBeDefined();
    expect(viewAllLink?.getAttribute('href')).toBe('/projects');
  });

  it('shows only 4 most recent projects', async () => {
    const { ProjectsSectionRevamped } = await import('@/components/sections/ProjectsSectionRevamped');
    render(<ProjectsSectionRevamped />);
    expect(screen.getByText('Live App 1')).toBeDefined();
    expect(screen.getByText('Showcase Project 1')).toBeDefined();
    expect(screen.getByText('Live App 2')).toBeDefined();
    expect(screen.getByText('Live App 3')).toBeDefined();
    expect(screen.queryByText('Live App 4')).toBeNull();
    expect(screen.queryByText('Live App 5')).toBeNull();
  });

  it('does not render tabs', async () => {
    const { ProjectsSectionRevamped } = await import('@/components/sections/ProjectsSectionRevamped');
    render(<ProjectsSectionRevamped />);
    expect(screen.queryByRole('tablist')).toBeNull();
  });

  it('does not render expand/collapse button', async () => {
    const { ProjectsSectionRevamped } = await import('@/components/sections/ProjectsSectionRevamped');
    render(<ProjectsSectionRevamped />);
    expect(screen.queryByText(/Show less/)).toBeNull();
  });
});
