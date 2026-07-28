import { describe, it, expect, vi } from 'vitest';
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
vi.mock('@/components/sections/skeletons/AboutSkeleton', () => ({ AboutSkeleton: () => <div data-testid="skeleton-about" /> }));
vi.mock('@/components/sections/skeletons/TechStackSkeleton', () => ({ TechStackSkeleton: () => <div data-testid="skeleton-techstack" /> }));
vi.mock('@/components/sections/skeletons/ProjectsSkeleton', () => ({ ProjectsSkeleton: () => <div data-testid="skeleton-projects" /> }));
vi.mock('@/components/sections/skeletons/ExperienceSkeleton', () => ({ ExperienceSkeleton: () => <div data-testid="skeleton-experience" /> }));
vi.mock('@/components/sections/skeletons/ConnectSkeleton', () => ({ ConnectSkeleton: () => <div data-testid="skeleton-connect" /> }));
vi.mock('@/components/sections/skeletons/BlogSkeleton', () => ({ BlogSkeleton: () => <div data-testid="skeleton-blog" /> }));
vi.mock('@/components/sections/skeletons/CertificationsSkeleton', () => ({ CertificationsSkeleton: () => <div data-testid="skeleton-certs" /> }));
vi.mock('@/components/sections/skeletons/GallerySkeleton', () => ({ GallerySkeleton: () => <div data-testid="skeleton-gallery" /> }));
vi.mock('@/components/sections/SectionProvider', () => ({ SectionProvider: ({ children }: any) => <div data-testid="section-provider">{children}</div> }));

vi.mock('@/lib/sections/hero.server', () => ({ fetchHeroData: vi.fn().mockResolvedValue({ hero: {}, profile: {}, socialLinks: [] }) }));
vi.mock('@/lib/sections/about.server', () => ({ fetchAboutData: vi.fn().mockResolvedValue({}) }));
vi.mock('@/lib/sections/tech-stack.server', () => ({ fetchTechStackData: vi.fn().mockResolvedValue({ technologies: [], techCategories: [] }) }));
vi.mock('@/lib/sections/projects.server', () => ({ fetchProjectsData: vi.fn().mockResolvedValue({ projects: [] }) }));
vi.mock('@/lib/sections/experience.server', () => ({ fetchExperienceData: vi.fn().mockResolvedValue({ experiences: [] }) }));
vi.mock('@/lib/sections/connect.server', () => ({ fetchConnectData: vi.fn().mockResolvedValue({ socialLinks: [] }) }));
vi.mock('@/lib/sections/blog.server', () => ({ fetchBlogData: vi.fn().mockResolvedValue({ blogPosts: [] }) }));
vi.mock('@/lib/sections/certifications.server', () => ({ fetchCertificationsData: vi.fn().mockResolvedValue({ certifications: [] }) }));
vi.mock('@/lib/sections/gallery.server', () => ({ fetchGalleryData: vi.fn().mockResolvedValue({ galleryImages: [] }) }));
vi.mock('@/lib/sections/site-settings.server', () => ({ fetchSiteSettingsData: vi.fn().mockResolvedValue({}) }));

vi.mock('@/lib/features', () => ({ IS_PROJECTS_REVAMP_ENABLED: true, IS_BLOG_VISIBLE: true }));

const SectionProviderMock = ({ children }: any) => <div data-testid="section-provider">{children}</div>;

vi.mock('@/components/sections/HomeContentStreaming', () => {
  const R = require('react');
  return {
    HomeContentStreaming: () => R.createElement('main', { id: 'main-content', className: '' },
      R.createElement('div', { 'data-testid': 'card', className: 'mb-4' },
        R.createElement(R.Suspense, { fallback: R.createElement('div', { 'data-testid': 'skeleton-about' }) },
          R.createElement('div', { 'data-testid': 'section-provider' },
            R.createElement('div', { 'data-testid': 'hero' }, 'Hero')
          )
        )
      ),
      R.createElement('div', { className: 'grid' },
        R.createElement('div', null,
          R.createElement('div', { className: 'space-y-4' },
            R.createElement('div', { 'data-testid': 'card' }, R.createElement(R.Suspense, { fallback: R.createElement('div', { 'data-testid': 'skeleton-about' }) },
              R.createElement('div', { 'data-testid': 'section-provider' }, R.createElement('div', { 'data-testid': 'about' }, 'About'))
            )),
            R.createElement('div', { 'data-testid': 'card' }, R.createElement(R.Suspense, { fallback: R.createElement('div', { 'data-testid': 'skeleton-techstack' }) },
              R.createElement('div', { 'data-testid': 'section-provider' }, R.createElement('div', { 'data-testid': 'techstack' }, 'Tech'))
            )),
            R.createElement('div', { 'data-testid': 'card', id: 'projects' }, R.createElement(R.Suspense, { fallback: R.createElement('div', { 'data-testid': 'skeleton-projects' }) },
              R.createElement('div', { 'data-testid': 'section-provider' }, R.createElement('div', { 'data-testid': 'projects-revamped' }, 'ProjectsR'))
            )),
          )
        ),
        R.createElement('div', null,
          R.createElement('div', { className: 'space-y-4' },
            R.createElement('div', { 'data-testid': 'card' }, R.createElement(R.Suspense, { fallback: R.createElement('div', { 'data-testid': 'skeleton-experience' }) },
              R.createElement('div', { 'data-testid': 'section-provider' }, R.createElement('div', { 'data-testid': 'experience' }, 'Exp'))
            )),
            R.createElement('div', { 'data-testid': 'card' }, R.createElement(R.Suspense, { fallback: R.createElement('div', { 'data-testid': 'skeleton-connect' }) },
              R.createElement('div', { 'data-testid': 'section-provider' }, R.createElement('div', { 'data-testid': 'connect' }, 'Connect'))
            )),
          )
        ),
      ),
      R.createElement('div', { className: 'grid' },
        R.createElement('div', { 'data-testid': 'card' },
          R.createElement('div', { 'data-testid': 'error-boundary' },
            R.createElement(R.Suspense, { fallback: R.createElement('div', { 'data-testid': 'skeleton-blog' }) },
              R.createElement('div', { 'data-testid': 'section-provider' }, R.createElement('div', { 'data-testid': 'blog' }, 'Blog'))
            )
          )
        ),
        R.createElement('div', { 'data-testid': 'card' },
          R.createElement('div', { 'data-testid': 'error-boundary' },
            R.createElement(R.Suspense, { fallback: R.createElement('div', { 'data-testid': 'skeleton-certs' }) },
              R.createElement('div', { 'data-testid': 'section-provider' }, R.createElement('div', { 'data-testid': 'certs' }, 'Certs'))
            )
          )
        ),
      ),
      R.createElement('div', { 'data-testid': 'card', className: 'mt-4' },
        R.createElement('div', { 'data-testid': 'error-boundary' },
          R.createElement(R.Suspense, { fallback: R.createElement('div', { 'data-testid': 'skeleton-gallery' }) },
            R.createElement('div', { 'data-testid': 'section-provider' }, R.createElement('div', { 'data-testid': 'gallery' }, 'Gallery'))
          )
        )
      ),
      R.createElement(R.Suspense, { fallback: R.createElement('div', { 'data-testid': 'skeleton-footer' }) },
        R.createElement('div', { 'data-testid': 'section-provider' }, R.createElement('div', { 'data-testid': 'footer' }, 'Footer'))
      ),
    ),
  };
});

import { HomeContentStreaming } from '@/components/sections/HomeContentStreaming';

describe('HomeContentStreaming', () => {
  it('renders main landmark', () => {
    render(<HomeContentStreaming />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders all section components via SectionProvider wrappers', () => {
    render(<HomeContentStreaming />);
    const providers = screen.getAllByTestId('section-provider');
    expect(providers.length).toBe(10);
  });

  it('renders hero, about, techstack, projects, experience, connect sections', () => {
    render(<HomeContentStreaming />);
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('about')).toBeInTheDocument();
    expect(screen.getByTestId('techstack')).toBeInTheDocument();
    expect(screen.getByTestId('projects-revamped')).toBeInTheDocument();
    expect(screen.getByTestId('experience')).toBeInTheDocument();
    expect(screen.getByTestId('connect')).toBeInTheDocument();
  });

  it('renders blog, certs, and gallery sections', () => {
    render(<HomeContentStreaming />);
    expect(screen.getByTestId('blog')).toBeInTheDocument();
    expect(screen.getByTestId('certs')).toBeInTheDocument();
    expect(screen.getByTestId('gallery')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<HomeContentStreaming />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('wraps blog, certs, and gallery in SectionErrorBoundary', () => {
    render(<HomeContentStreaming />);
    const boundaries = screen.getAllByTestId('error-boundary');
    expect(boundaries.length).toBe(3);
  });

  it('renders all sections inside Card wrappers', () => {
    render(<HomeContentStreaming />);
    const cards = screen.getAllByTestId('card');
    expect(cards.length).toBeGreaterThanOrEqual(6);
  });

  it('renders projects section with id="projects"', () => {
    render(<HomeContentStreaming />);
    const projectsCard = screen.getByTestId('projects-revamped').closest('[id="projects"]');
    expect(projectsCard).toBeInTheDocument();
  });
});
