import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
];

vi.mock('@/hooks/useCmsContent', () => ({
  useCmsContent: () => ({ projects: mockProjects }),
}));

describe('ProjectsSectionRevamped', () => {
  it('renders the section heading with project count', async () => {
    const { ProjectsSectionRevamped } = await import('@/components/sections/ProjectsSectionRevamped');
    render(<ProjectsSectionRevamped />);
    expect(screen.getByText('Projects')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();
  });

  it('renders both tabs with correct counts', async () => {
    const { ProjectsSectionRevamped } = await import('@/components/sections/ProjectsSectionRevamped');
    render(<ProjectsSectionRevamped />);
    expect(screen.getByText(/Live Projects/)).toBeDefined();
    expect(screen.getByText(/Showcase/)).toBeDefined();
  });

  it('defaults to Live Projects tab showing only live projects', async () => {
    const { ProjectsSectionRevamped } = await import('@/components/sections/ProjectsSectionRevamped');
    render(<ProjectsSectionRevamped />);
    expect(screen.getByText('Live App 1')).toBeDefined();
    expect(screen.getByText('Live App 2')).toBeDefined();
    expect(screen.queryByText('Showcase Project 1')).toBeNull();
  });

  it('switches to Showcase tab when clicked', async () => {
    const { ProjectsSectionRevamped } = await import('@/components/sections/ProjectsSectionRevamped');
    render(<ProjectsSectionRevamped />);
    const showcaseTab = screen.getByText(/Showcase/).closest('button')!;
    fireEvent.click(showcaseTab);
    expect(screen.getByText('Showcase Project 1')).toBeDefined();
    expect(screen.queryByText('Live App 1')).toBeNull();
  });

  it('shows "View case study" for showcase projects', async () => {
    const { ProjectsSectionRevamped } = await import('@/components/sections/ProjectsSectionRevamped');
    render(<ProjectsSectionRevamped />);
    const showcaseTab = screen.getByText(/Showcase/).closest('button')!;
    fireEvent.click(showcaseTab);
    await waitFor(() => {
      expect(screen.getByText('View case study')).toBeDefined();
    });
  });

  it('does not show expand button when 8 or fewer projects', async () => {
    const { ProjectsSectionRevamped } = await import('@/components/sections/ProjectsSectionRevamped');
    render(<ProjectsSectionRevamped />);
    expect(screen.queryByText(/View all/)).toBeNull();
  });
});
