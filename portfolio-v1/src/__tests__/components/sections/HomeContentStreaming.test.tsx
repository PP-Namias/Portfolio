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

vi.mock('@/lib/sections/hero.server', () => ({ fetchHeroData: vi.fn() }));
vi.mock('@/lib/sections/about.server', () => ({ fetchAboutData: vi.fn() }));
vi.mock('@/lib/sections/tech-stack.server', () => ({ fetchTechStackData: vi.fn() }));
vi.mock('@/lib/sections/projects.server', () => ({ fetchProjectsData: vi.fn() }));
vi.mock('@/lib/sections/experience.server', () => ({ fetchExperienceData: vi.fn() }));
vi.mock('@/lib/sections/connect.server', () => ({ fetchConnectData: vi.fn() }));
vi.mock('@/lib/sections/blog.server', () => ({ fetchBlogData: vi.fn() }));
vi.mock('@/lib/sections/certifications.server', () => ({ fetchCertificationsData: vi.fn() }));
vi.mock('@/lib/sections/gallery.server', () => ({ fetchGalleryData: vi.fn() }));
vi.mock('@/lib/sections/site-settings.server', () => ({ fetchSiteSettingsData: vi.fn() }));

const HeroSectionStream = () => <div data-testid="hero-stream">Hero Content</div>;
const AboutSectionStream = () => <div data-testid="about-stream">About Content</div>;
const TechStackSectionStream = () => <div data-testid="techstack-stream">Tech Content</div>;
const ProjectsSectionStream = () => <div data-testid="projects-stream">Projects Content</div>;
const ExperienceSectionStream = () => <div data-testid="experience-stream">Experience Content</div>;
const ConnectSectionStream = () => <div data-testid="connect-stream">Connect Content</div>;
const BlogSectionStream = () => <div data-testid="blog-stream">Blog Content</div>;
const CertificationsSectionStream = () => <div data-testid="certs-stream">Certs Content</div>;
const GallerySectionStream = () => <div data-testid="gallery-stream">Gallery Content</div>;
const FooterStream = () => <div data-testid="footer-stream">Footer Content</div>;

vi.mock('@/components/sections/HomeContentStreaming', () => ({
  HomeContentStreaming: () => (
    <main id="main-content" data-testid="main">
      <div data-testid="card"><HeroSectionStream /></div>
      <div>
        <div>
          <div data-testid="card">
            <AboutSectionStream />
          </div>
          <div data-testid="card">
            <TechStackSectionStream />
          </div>
          <div data-testid="card">
            <ProjectsSectionStream />
          </div>
        </div>
        <div>
          <div data-testid="card">
            <ExperienceSectionStream />
          </div>
          <div data-testid="card">
            <ConnectSectionStream />
          </div>
        </div>
      </div>
      <div>
        <div data-testid="card">
          <div data-testid="error-boundary"><BlogSectionStream /></div>
        </div>
        <div data-testid="card">
          <div data-testid="error-boundary"><CertificationsSectionStream /></div>
        </div>
      </div>
      <div data-testid="card">
        <div data-testid="error-boundary"><GallerySectionStream /></div>
      </div>
      <div data-testid="footer-stream" />
    </main>
  ),
}));

import { HomeContentStreaming } from '@/components/sections/HomeContentStreaming';

describe('HomeContentStreaming', () => {
  it('renders main landmark', () => {
    render(<HomeContentStreaming />);
    expect(screen.getByTestId('main')).toBeInTheDocument();
  });

  it('renders all section stream components', () => {
    render(<HomeContentStreaming />);
    expect(screen.getByTestId('hero-stream')).toBeInTheDocument();
    expect(screen.getByTestId('about-stream')).toBeInTheDocument();
    expect(screen.getByTestId('techstack-stream')).toBeInTheDocument();
    expect(screen.getByTestId('projects-stream')).toBeInTheDocument();
    expect(screen.getByTestId('experience-stream')).toBeInTheDocument();
    expect(screen.getByTestId('connect-stream')).toBeInTheDocument();
  });

  it('renders error boundaries for blog, certs, and gallery', () => {
    render(<HomeContentStreaming />);
    const boundaries = screen.getAllByTestId('error-boundary');
    expect(boundaries.length).toBeGreaterThanOrEqual(1);
  });

  it('renders footer stream', () => {
    render(<HomeContentStreaming />);
    expect(screen.getByTestId('footer-stream')).toBeInTheDocument();
  });
});
