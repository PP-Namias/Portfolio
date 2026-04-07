import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

const openModalMock = vi.fn();

vi.mock('framer-motion', () => {
  const R = require('react');

  const motion = new Proxy(
    {},
    {
      get: (_, tag: string) =>
        R.forwardRef(function MotionTag(
          { children, ...props }: Record<string, unknown>,
          ref: React.Ref<HTMLElement>
        ) {
          return R.createElement(tag, { ref, ...props }, children);
        }),
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useMotionValue: () => ({ set: vi.fn() }),
    useSpring: () => 0,
  };
});

vi.mock('next/image', () => ({
  default: ({ alt = '', src = '', ...props }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={typeof alt === 'string' ? alt : ''}
      src={typeof src === 'string' ? src : ''}
      {...props}
    />
  ),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('@/hooks/useModal', () => ({
  useModal: () => ({
    openModal: openModalMock,
    closeModal: vi.fn(),
  }),
}));

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    mounted: true,
    isDark: true,
    toggleTheme: vi.fn(),
  }),
}));

vi.mock('@/hooks/useAccentColor', () => ({
  ACCENT_SCHEMES: [{ name: 'pink', label: 'Pink', preview: '#db2777' }],
  useAccentColor: () => ({
    mounted: true,
    scheme: { name: 'pink', label: 'Pink', preview: '#db2777' },
    setScheme: vi.fn(),
  }),
}));

vi.mock('@/lib/features', () => ({
  IS_BLOG_VISIBLE: false,
}));

vi.mock('@/data/profile', () => ({
  profile: {
    name: 'Jhon Keneth Ryan Namias',
    title: 'Full Stack Engineer',
    email: 'pp.namias@gmail.com',
    phone: '+63 999 000 0000',
    location: 'Manila, Philippines',
    github: 'https://github.com/PP-Namias',
    linkedin: 'https://www.linkedin.com/in/pp-namias/',
    summary: 'Paragraph one.\n\nParagraph two.\n\nParagraph three.',
    highlights: {
      yearsExperience: 5,
      projectsCompleted: 20,
      primaryTechnologies: ['React', 'TypeScript'],
    },
    education: [
      {
        degree: 'BS Computer Science',
        institution: 'University of Caloocan City',
        location: 'Caloocan City, Philippines',
        startedAt: '2022-01-01',
        endedAt: null,
        gpa: '1.40',
        honors: ['Dean\'s List'],
        relevantCourses: ['Algorithms'],
      },
    ],
  },
}));

vi.mock('@/data/socials', () => ({
  socialLinks: [
    { name: 'cal', icon: 'calendar', label: 'Schedule a Meeting', link: 'https://cal.com/pp-namias', featured: true },
    { name: 'email', icon: 'mail', label: 'Email', link: 'mailto:pp.namias@gmail.com' },
    { name: 'github', icon: 'github', label: 'GitHub', link: 'https://github.com/PP-Namias' },
    { name: 'linkedin', icon: 'linkedin', label: 'LinkedIn', link: 'https://linkedin.com/in/pp-namias' },
    { name: 'x', icon: 'twitter', label: 'X', link: 'https://x.com/pp_namias' },
    { name: 'instagram', icon: 'instagram', label: 'Instagram', link: 'https://instagram.com/pp_namias' },
  ],
}));

vi.mock('@/data/techStack', () => ({
  technologies: [
    { name: 'TypeScript', logo: 'ts', category: 'Languages', proficiency: 5 },
    { name: 'Python', logo: 'py', category: 'Languages', proficiency: 5 },
    { name: 'React', logo: 'react', category: 'Frontend', proficiency: 5 },
    { name: 'Next.js', logo: 'next', category: 'Frontend', proficiency: 5 },
    { name: 'Node.js', logo: 'node', category: 'Backend', proficiency: 5 },
    { name: 'PostgreSQL', logo: 'pg', category: 'Database', proficiency: 4 },
  ],
  techCategories: {
    Languages: [
      { name: 'TypeScript', logo: 'ts', category: 'Languages', proficiency: 5 },
      { name: 'Python', logo: 'py', category: 'Languages', proficiency: 5 },
    ],
    Frontend: [
      { name: 'React', logo: 'react', category: 'Frontend', proficiency: 5 },
      { name: 'Next.js', logo: 'next', category: 'Frontend', proficiency: 5 },
    ],
    Backend: [{ name: 'Node.js', logo: 'node', category: 'Backend', proficiency: 5 }],
    Database: [{ name: 'PostgreSQL', logo: 'pg', category: 'Database', proficiency: 4 }],
  },
}));

vi.mock('@/data/projects', () => ({
  projects: [
    {
      title: 'Featured App',
      image: 'featured.png',
      description: 'Main project',
      repositoryURL: 'https://github.com/example/featured',
      liveURL: 'https://featured.app',
      processURL: 'https://docs.featured.app',
      tags: ['React', 'TypeScript', 'Node.js', 'AI', 'Cloud'],
      year: 2026,
    },
    {
      title: 'Proj 2',
      image: 'p2.png',
      description: 'Second project',
      repositoryURL: 'https://github.com/example/p2',
      liveURL: null,
      processURL: null,
      tags: ['React', 'Node.js', 'API'],
      year: 2025,
    },
    {
      title: 'Proj 3',
      image: 'p3.png',
      description: 'Third project',
      repositoryURL: null,
      liveURL: 'https://p3.app',
      processURL: null,
      tags: ['Next.js', 'TS', 'SSR'],
      year: 2025,
    },
    {
      title: 'Proj 4',
      image: 'p4.png',
      description: 'Fourth project',
      repositoryURL: null,
      liveURL: null,
      processURL: null,
      tags: ['Python', 'FastAPI', 'Docker'],
      year: 2024,
    },
    {
      title: 'Proj 5',
      image: 'p5.png',
      description: 'Fifth project',
      repositoryURL: null,
      liveURL: null,
      processURL: null,
      tags: ['Go', 'Redis', 'Cloud'],
      year: 2024,
    },
  ],
}));

vi.mock('@/data/certifications', () => ({
  certifications: [
    { title: 'Cert 1', image: 'c1.png', issuer: 'Org A', issuedAt: '2025-01-01', tags: [] },
    { title: 'Cert 2', image: 'c2.png', issuer: 'Org A', issuedAt: '2025-01-01', tags: [] },
    { title: 'Cert 3', image: 'c3.png', issuer: 'Org B', issuedAt: '2025-01-01', tags: [] },
    { title: 'Cert 4', image: 'c4.png', issuer: 'Org B', issuedAt: '2025-01-01', tags: [] },
    { title: 'Cert 5', image: 'c5.png', issuer: 'Org C', issuedAt: '2025-01-01', tags: [] },
    { title: 'Cert 6', image: 'c6.png', issuer: 'Org C', issuedAt: '2025-01-01', tags: [] },
    { title: 'Cert 7', image: 'c7.png', issuer: 'Org C', issuedAt: '2025-01-01', tags: [] },
  ],
}));

vi.mock('@/data/experience', () => ({
  experiences: [
    {
      company: 'MASH',
      position: 'Project Manager',
      summary: 'Led delivery and architecture.',
      country: 'PH',
      modality: 'Hybrid',
      type: 'Full-time',
      startedAt: '2025-01-01',
      endedAt: null,
      technologies: ['React', 'Node.js'],
      highlights: ['Managed team'],
      achievements: ['Increased output'],
      relatedProjects: [],
      images: [],
    },
    {
      company: 'X',
      position: 'Engineer',
      summary: 'Built systems',
      country: 'PH',
      modality: 'On-site',
      type: 'Full-time',
      startedAt: '2024-01-01',
      endedAt: '2024-12-01',
      technologies: ['Python'],
      highlights: ['Shipped features'],
      achievements: ['Reduced bugs'],
      relatedProjects: [],
      images: [],
    },
    {
      company: 'Y',
      position: 'Technician',
      summary: 'Maintained hardware',
      country: 'PH',
      modality: 'On-site',
      type: 'Full-time',
      startedAt: '2023-01-01',
      endedAt: '2023-12-01',
      technologies: ['Linux'],
      highlights: ['Improved uptime'],
      achievements: ['Award'],
      relatedProjects: [],
      images: [],
    },
    {
      company: 'Z',
      position: 'Intern',
      summary: 'Supported delivery',
      country: 'PH',
      modality: 'Remote',
      type: 'Internship',
      startedAt: '2022-01-01',
      endedAt: '2022-12-01',
      technologies: ['HTML'],
      highlights: ['Learned fast'],
      achievements: ['Completed project'],
      relatedProjects: [],
      images: [],
    },
  ],
}));

vi.mock('@/data/gallery', () => ({
  galleryImages: [
    { title: 'Img 1', mediaType: 'image', media: 'g1.png', tags: ['Event'], createdAt: '2024-01-01' },
    { title: 'Img 2', mediaType: 'image', media: 'g2.png', tags: ['Event'], createdAt: '2024-01-01' },
    { title: 'Img 3', mediaType: 'image', media: 'g3.png', tags: ['Workshop'], createdAt: '2024-01-01' },
    { title: 'Img 4', mediaType: 'image', media: 'g4.png', tags: ['Workshop'], createdAt: '2024-01-01' },
    { title: 'Img 5', mediaType: 'image', media: 'g5.png', tags: ['Conference'], createdAt: '2024-01-01' },
    { title: 'Img 6', mediaType: 'image', media: 'g6.png', tags: ['Conference'], createdAt: '2024-01-01' },
    { title: 'Img 7', mediaType: 'image', media: 'g7.png', tags: ['Meetup'], createdAt: '2024-01-01' },
    { title: 'Img 8', mediaType: 'image', media: 'g8.png', tags: ['Meetup'], createdAt: '2024-01-01' },
    { title: 'Img 9', mediaType: 'image', media: 'g9.png', tags: ['Team'], createdAt: '2024-01-01' },
    { title: 'Img 10', mediaType: 'image', media: 'g10.png', tags: ['Team'], createdAt: '2024-01-01' },
  ],
}));

vi.mock('@/data/memberships', () => ({
  memberships: [
    { name: 'Org Membership', url: 'https://example.com/membership', joinedAt: '2025-01-01' },
  ],
}));

vi.mock('@/data/recommendations', () => ({
  recommendations: [
    { quote: 'Excellent work.', name: 'Jane Doe', title: 'Lead Engineer', company: 'Tech Co' },
    { quote: 'Great collaborator.', name: 'John Roe', title: 'CTO', company: 'Startup' },
  ],
}));

import { AboutSection } from '@/components/sections/AboutSection';
import { CertificationsSection } from '@/components/sections/CertificationsSection';
import { ConnectSection } from '@/components/sections/ConnectSection';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { GallerySection } from '@/components/sections/GallerySection';
import { HeroSection } from '@/components/sections/HeroSection';
import { MembershipsSection } from '@/components/sections/MembershipsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { RecommendationsCarousel } from '@/components/sections/RecommendationsCarousel';
import { SpeakingSection } from '@/components/sections/SpeakingSection';
import { TechStackSection } from '@/components/sections/TechStackSection';

describe('uncovered section components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('AboutSection renders and toggles full summary', () => {
    render(<AboutSection />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Read more')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Read more'));
    expect(screen.getByText('Show less')).toBeInTheDocument();
    expect(screen.getByText(/Paragraph three/)).toBeInTheDocument();
  });

  it('TechStackSection renders categories and expands all', () => {
    render(<TechStackSection />);
    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
    expect(screen.getByText(/View all/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/View all/i));
    expect(screen.getByText('Database')).toBeInTheDocument();
  });

  it('ProjectsSection renders featured project and toggles all projects', () => {
    render(<ProjectsSection />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Featured App')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/View all/i));
    expect(screen.getByText('Proj 5')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Show less/i));
    expect(screen.queryByText('Proj 5')).not.toBeInTheDocument();
  });

  it('CertificationsSection filters, expands and opens/closes lightbox', () => {
    render(<CertificationsSection />);

    expect(screen.getByText('Certifications')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'Org A' })[0]);
    expect(screen.queryByRole('button', { name: /View all/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /All \(7\)/i }));
    expect(screen.getByRole('button', { name: /View all/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /View all/i }));
    fireEvent.click(screen.getByText('Cert 1'));
    expect(screen.getByRole('dialog', { name: 'Cert 1' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Cert 1' })).not.toBeInTheDocument();
  });

  it('ConnectSection opens booking modal and renders social actions', () => {
    render(<ConnectSection />);
    expect(screen.getByText('Connect')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Schedule a Meeting'));
    expect(openModalMock).toHaveBeenCalledWith('booking');

    expect(screen.getByText('Send Email')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('ExperienceTimeline expands and collapses list', () => {
    render(<ExperienceTimeline />);
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('View Full Experience')).toBeInTheDocument();

    fireEvent.click(screen.getByText('View Full Experience'));
    expect(screen.getByText('Show Less')).toBeInTheDocument();
  });

  it('GallerySection expands and opens lightbox navigation', () => {
    render(<GallerySection />);
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText(/View all/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/View all/i));

    const firstImageButton = screen.getAllByRole('button').find((el) => el.className.includes('rounded-xl overflow-hidden'));
    expect(firstImageButton).toBeDefined();
    if (firstImageButton) {
      fireEvent.click(firstImageButton);
    }

    expect(screen.getByLabelText('Next image')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Next image'));
    fireEvent.click(screen.getByLabelText('Previous image'));
    fireEvent.click(screen.getByLabelText('Close lightbox'));
  });

  it('HeroSection renders CTAs and opens proper modals', async () => {
    render(<HeroSection />);

    expect(screen.getByText('Jhon Keneth Ryan Namias')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Resume'));
    expect(openModalMock).toHaveBeenCalledWith('resume');

    fireEvent.click(screen.getByText('Book a Call'));
    expect(openModalMock).toHaveBeenCalledWith('booking');

    await act(async () => {
      await Promise.resolve();
    });
  });

  it('MembershipsSection and SpeakingSection render call-to-action links', () => {
    render(
      <>
        <MembershipsSection />
        <SpeakingSection />
      </>
    );

    expect(screen.getByText('Memberships')).toBeInTheDocument();
    expect(screen.getByText('Org Membership')).toBeInTheDocument();

    expect(screen.getByText('Speaking')).toBeInTheDocument();
    expect(screen.getByText('Get in touch').closest('a')).toHaveAttribute('href', expect.stringContaining('mailto:'));
  });

  it('RecommendationsCarousel renders card and allows dot navigation', () => {
    render(<RecommendationsCarousel />);

    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText(/Excellent work/i)).toBeInTheDocument();

    const dots = screen.getAllByRole('button', { name: /Go to recommendation/i });
    fireEvent.click(dots[1]);
    expect(screen.getByText(/Great collaborator/i)).toBeInTheDocument();
  });
});
