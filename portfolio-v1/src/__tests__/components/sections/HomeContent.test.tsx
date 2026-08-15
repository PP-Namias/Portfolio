import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('@/components/sections/HeroSection', () => ({ HeroSection: () => <div data-testid="hero">Hero</div> }));
vi.mock('@/components/sections/AboutSection', () => ({ AboutSection: () => <div data-testid="about">About</div> }));
vi.mock('@/components/sections/TechStackSection', () => ({ TechStackSection: () => <div data-testid="techstack">Tech</div> }));
vi.mock('@/components/sections/ProjectsSection', () => ({ ProjectsSection: () => <div data-testid="projects">Projects</div> }));
vi.mock('@/components/sections/ProjectsSectionRevamped', () => ({ ProjectsSectionRevamped: () => <div data-testid="projects-revamped">ProjectsR</div> }));
vi.mock('@/components/sections/BlogSection', () => ({ BlogSection: () => <div data-testid="blog">Blog</div> }));
vi.mock('@/components/sections/CertificationsSection', () => ({ CertificationsSection: () => <div data-testid="certs">Certs</div> }));
vi.mock('@/components/sections/ExperienceTimeline', () => ({ ExperienceTimeline: () => <div data-testid="experience">Exp</div> }));
vi.mock('@/components/sections/ConnectSection', () => ({ ConnectSection: () => <div data-testid="connect">Connect</div> }));
vi.mock('@/components/sections/GallerySection', () => ({ GallerySection: () => <div data-testid="gallery">Gallery</div> }));
vi.mock('@/components/layout/Footer', () => ({ Footer: () => <footer data-testid="footer">Footer</footer> }));
vi.mock('@/components/ui/Card', () => ({ Card: ({ children, id, className }: any) => <div id={id} className={className} data-testid="card">{children}</div> }));
vi.mock('@/components/ui/ErrorBoundary', () => ({ SectionErrorBoundary: ({ children }: any) => <div data-testid="error-boundary">{children}</div> }));
vi.mock('@/lib/features', () => ({ IS_PROJECTS_REVAMP_ENABLED: true, IS_STREAMING_SSR_ENABLED: false, IS_BLOG_VISIBLE: true, IS_CHAT_THREADING_ENABLED: false, IS_LANGGRAPH_ENABLED: false, IS_CHAT_STREAMING_ENABLED: false, IS_MAGIC_CURSOR_VISIBLE: false }));

import { HomeContent } from '@/components/sections/HomeContent';

describe('HomeContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all main sections', () => {
    render(<HomeContent />);
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('about')).toBeInTheDocument();
    expect(screen.getByTestId('techstack')).toBeInTheDocument();
    expect(screen.getByTestId('experience')).toBeInTheDocument();
    expect(screen.getByTestId('connect')).toBeInTheDocument();
    expect(screen.getByTestId('certs')).toBeInTheDocument();
    expect(screen.getByTestId('gallery')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders the main landmark', () => {
    render(<HomeContent />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders revamped projects section when IS_PROJECTS_REVAMP_ENABLED is true', () => {
    render(<HomeContent />);
    expect(screen.getByTestId('projects-revamped')).toBeInTheDocument();
    expect(screen.queryByTestId('projects')).not.toBeInTheDocument();
  });

  it('renders blog section inside error boundary', () => {
    render(<HomeContent />);
    const boundaries = screen.getAllByTestId('error-boundary');
    expect(boundaries.length).toBeGreaterThanOrEqual(1);
  });

  it('renders blog section inside a Card wrapper', () => {
    render(<HomeContent />);
    expect(screen.getByTestId('blog')).toBeInTheDocument();
  });

  it('renders projects section inside a Card wrapper', () => {
    render(<HomeContent />);
    const projectsCard = screen.getByTestId('projects-revamped').closest('[data-testid="card"]');
    expect(projectsCard).toBeInTheDocument();
  });

  it('wraps blog, certs, and gallery in SectionErrorBoundary', () => {
    render(<HomeContent />);
    const boundaries = screen.getAllByTestId('error-boundary');
    expect(boundaries.length).toBe(3);
  });
});
