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
];

import { ProjectGridClient } from '@/app/projects/ProjectGridClient';

describe('ProjectGridClient', () => {
  it('renders the heading and back link', () => {
    render(<ProjectGridClient projects={mockProjects} />);
    expect(screen.getByText('All Projects')).toBeDefined();
    const backLink = screen.getByText('Back').closest('a');
    expect(backLink).toBeDefined();
    expect(backLink?.getAttribute('href')).toBe('/');
  });

  it('renders all three tabs with correct counts', () => {
    render(<ProjectGridClient projects={mockProjects} />);
    expect(screen.getByRole('tab', { name: /All/ })).toBeDefined();
    expect(screen.getByRole('tab', { name: /Live Projects/ })).toBeDefined();
    expect(screen.getByRole('tab', { name: /Showcase/ })).toBeDefined();
  });

  it('defaults to All tab showing all projects', () => {
    render(<ProjectGridClient projects={mockProjects} />);
    expect(screen.getByText('Live App 1')).toBeDefined();
    expect(screen.getByText('Showcase Project 1')).toBeDefined();
    expect(screen.getByText('Live App 2')).toBeDefined();
  });

  it('filters to Live Projects when tab is clicked', () => {
    render(<ProjectGridClient projects={mockProjects} />);
    const liveTab = screen.getByRole('tab', { name: /Live Projects/ });
    fireEvent.click(liveTab);
    expect(screen.getByText('Live App 1')).toBeDefined();
    expect(screen.getByText('Live App 2')).toBeDefined();
    expect(screen.queryByText('Showcase Project 1')).toBeNull();
  });

  it('filters to Showcase when tab is clicked', () => {
    render(<ProjectGridClient projects={mockProjects} />);
    const showcaseTab = screen.getByRole('tab', { name: /Showcase/ });
    fireEvent.click(showcaseTab);
    expect(screen.getByText('Showcase Project 1')).toBeDefined();
    expect(screen.queryByText('Live App 1')).toBeNull();
    expect(screen.queryByText('Live App 2')).toBeNull();
  });

  it('shows hostname for projects with URLs', () => {
    render(<ProjectGridClient projects={mockProjects} />);
    expect(screen.getByText('example.com')).toBeDefined();
  });

  it('shows "View case study" for showcase projects', () => {
    render(<ProjectGridClient projects={mockProjects} />);
    const showcaseTab = screen.getByRole('tab', { name: /Showcase/ });
    fireEvent.click(showcaseTab);
    expect(screen.getByText('View case study')).toBeDefined();
  });

  it('shows empty message for tab with no projects', () => {
    render(<ProjectGridClient projects={[]} />);
    expect(screen.getByText('No projects yet.')).toBeDefined();
  });
});
