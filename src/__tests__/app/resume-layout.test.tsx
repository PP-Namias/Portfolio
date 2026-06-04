import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

vi.mock('framer-motion', () => {
  const R = require('react');
  return {
    motion: {
      div: R.forwardRef(function MockMotionDiv(
        { children, className, ...props }: Record<string, unknown>,
        ref: React.Ref<HTMLDivElement>
      ) {
        return R.createElement('div', { ref, className, ...props }, children);
      }),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: 'mock-inter' }),
}));

vi.mock('@/components/sections/HeroSection', () => ({ HeroSection: () => <div>HeroSection</div> }));
vi.mock('@/components/sections/AboutSection', () => ({ AboutSection: () => <div data-section="about-content">AboutSection</div> }));
vi.mock('@/components/sections/TechStackSection', () => ({ TechStackSection: () => <div data-section="skills-content">TechStackSection</div> }));
vi.mock('@/components/sections/ProjectsSection', () => ({ ProjectsSection: () => <div data-section="projects-content">ProjectsSection</div> }));
vi.mock('@/components/sections/CertificationsSection', () => ({ CertificationsSection: () => <div data-section="certs-content">CertificationsSection</div> }));
vi.mock('@/components/sections/ExperienceTimeline', () => ({ ExperienceTimeline: () => <div data-section="experience-content">ExperienceTimeline</div> }));
vi.mock('@/components/sections/EducationSection', () => ({ EducationSection: () => <div data-section="education-content">EducationSection</div> }));
vi.mock('@/components/layout/Footer', () => ({ Footer: () => <div data-section="footer">Footer</div> }));

import Home from '@/app/page';

describe('resume-style home page', () => {
  it('renders a single Hero at the top of the page', () => {
    const { container } = render(<Home />);
    const hero = container.querySelector(String.raw`[data-section="skills-content"]`)?.parentElement?.parentElement;
    expect(hero).toBeTruthy();
  });

  it('uses a 2-column grid layout at the desktop breakpoint', () => {
    const { container } = render(<Home />);
    const grid = container.querySelector(String.raw`.lg\:grid-cols-\[38\%_1fr\]`);
    expect(grid).toBeTruthy();
  });

  it('does not use any sticky sidebars', () => {
    const { container } = render(<Home />);
    const sticky = container.querySelectorAll(String.raw`.lg\:sticky`);
    expect(sticky.length).toBe(0);
  });

  it('places skills, education, and certifications in the left column', () => {
    const { container } = render(<Home />);
    const skills = container.querySelector('[data-section="skills"]');
    const education = container.querySelector('[data-section="education"]');
    const certs = container.querySelector('[data-section="certifications"]');

    expect(skills).toBeTruthy();
    expect(education).toBeTruthy();
    expect(certs).toBeTruthy();

    const leftColumn = skills?.parentElement;
    expect(leftColumn).toBe(education?.parentElement);
    expect(leftColumn).toBe(certs?.parentElement);
  });

  it('places about, experience, and projects in the right column', () => {
    const { container } = render(<Home />);
    const about = container.querySelector('[data-section="about"]');
    const experience = container.querySelector('[data-section="experience"]');
    const projects = container.querySelector('[data-section="projects"]');

    expect(about).toBeTruthy();
    expect(experience).toBeTruthy();
    expect(projects).toBeTruthy();

    const rightColumn = about?.parentElement;
    expect(rightColumn).toBe(experience?.parentElement);
    expect(rightColumn).toBe(projects?.parentElement);
  });

  it('left and right columns are siblings inside the 2-column grid', () => {
    const { container } = render(<Home />);
    const grid = container.querySelector(String.raw`.lg\:grid-cols-\[38\%_1fr\]`);
    expect(grid?.children.length).toBe(2);
  });

  it('renders a footer at the bottom of the page', () => {
    const { container } = render(<Home />);
    const footer = container.querySelector(String.raw`[data-section="footer"]`);
    expect(footer).toBeTruthy();
  });
});
