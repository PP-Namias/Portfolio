import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return { ...actual, useReducedMotion: () => false };
});

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('@/components/ui/Card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock('@/components/ui/ThemeToggle', () => ({
  ThemeToggle: () => <button>ThemeToggle</button>,
}));

vi.mock('@/lib/cms-content.server', () => ({
  getCmsContent: vi.fn().mockResolvedValue({
    projects: [
      {
        title: 'Project Alpha',
        slug: 'project-alpha',
        description: 'First project',
        shortDescription: 'First',
        image: '',
        tags: ['React'],
        year: 2025,
        liveURL: 'https://alpha.example.com',
        repositoryURL: null,
        status: 'completed',
        tier: 'featured',
        showcaseDetail: false,
      },
      {
        title: 'Project Beta',
        slug: 'project-beta',
        description: 'Second project',
        shortDescription: 'Second',
        image: '',
        tags: ['Python'],
        year: 2024,
        liveURL: null,
        repositoryURL: 'https://github.com/test/beta',
        status: 'completed',
        tier: 'standard',
        showcaseDetail: true,
      },
    ],
  }),
}));

import ProjectsPage from '@/app/projects/page';

describe('ProjectsPage', () => {
  it('renders title and description', async () => {
    const element = await ProjectsPage();
    render(element);
    expect(screen.getByText('Projects')).toBeDefined();
    expect(screen.getByText(/Explore all projects/i)).toBeDefined();
  });

  it('renders back link to homepage', async () => {
    const element = await ProjectsPage();
    render(element);
    const backLink = screen.getByText('Back to Portfolio').closest('a');
    expect(backLink).toBeDefined();
    expect(backLink?.getAttribute('href')).toBe('/');
  });

  it('renders ThemeToggle', async () => {
    const element = await ProjectsPage();
    render(element);
    expect(screen.getByText('ThemeToggle')).toBeDefined();
  });

  it('renders project cards', async () => {
    const element = await ProjectsPage();
    render(element);
    expect(screen.getByText('Project Alpha')).toBeDefined();
    expect(screen.getByText('Project Beta')).toBeDefined();
  });

  it('renders within a main landmark', async () => {
    const element = await ProjectsPage();
    render(element);
    expect(document.querySelector('#main-content')).toBeDefined();
  });
});
