import { describe, it, expect, vi } from 'vitest';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    useReducedMotion: () => false,
  };
});

vi.mock('@/lib/media', () => ({
  resolveContentImageSrc: (src: string) => src,
}));

const mockProject = {
  title: 'Test Project',
  image: '/images/test.jpg',
  imageAlt: 'Test project image',
  description: 'A test project for unit testing',
  challenge: 'The challenge was testing',
  solution: 'We solved it with mocks',
  result: 'All tests pass',
  tags: ['React', 'TypeScript', 'Vitest'],
  year: 2025,
  category: 'Web App',
  role: 'Developer',
  status: 'completed' as const,
  tier: 'featured' as const,
  showcaseDetail: true,
  shortDescription: 'A test project',
  highlights: ['First highlight', 'Second highlight'],
  liveURL: 'https://example.com',
  repositoryURL: 'https://github.com/test/repo',
  processURL: null,
  detailURL: 'https://example.com',
  slug: 'test-project',
  gallery: [
    { image: '/images/gallery1.jpg', caption: 'Gallery image 1', alt: 'Gallery 1', credit: '', source: '', license: '' },
  ],
};

describe('ProjectDetailPage', () => {
  it('renders project title', async () => {
    const { ProjectDetailPage } = await import('@/components/sections/ProjectDetailPage');
    const { render, screen } = await import('@testing-library/react');
    render(<ProjectDetailPage project={mockProject} />);
    expect(screen.getByText('Test Project')).toBeDefined();
  });

  it('renders project description', async () => {
    const { ProjectDetailPage } = await import('@/components/sections/ProjectDetailPage');
    const { render, screen } = await import('@testing-library/react');
    render(<ProjectDetailPage project={mockProject} />);
    expect(screen.getAllByText('A test project for unit testing').length).toBeGreaterThanOrEqual(1);
  });

  it('renders challenge/solution/result sections', async () => {
    const { ProjectDetailPage } = await import('@/components/sections/ProjectDetailPage');
    const { render, screen } = await import('@testing-library/react');
    render(<ProjectDetailPage project={mockProject} />);
    expect(screen.getAllByText('Challenge').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Solution').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Result').length).toBeGreaterThanOrEqual(1);
  });

  it('renders highlights list', async () => {
    const { ProjectDetailPage } = await import('@/components/sections/ProjectDetailPage');
    const { render, screen } = await import('@testing-library/react');
    render(<ProjectDetailPage project={mockProject} />);
    expect(screen.getAllByText('First highlight').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Second highlight').length).toBeGreaterThanOrEqual(1);
  });

  it('renders tech stack tags', async () => {
    const { ProjectDetailPage } = await import('@/components/sections/ProjectDetailPage');
    const { render, screen } = await import('@testing-library/react');
    render(<ProjectDetailPage project={mockProject} />);
    expect(screen.getAllByText('React').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Vitest').length).toBeGreaterThanOrEqual(1);
  });

  it('renders action links', async () => {
    const { ProjectDetailPage } = await import('@/components/sections/ProjectDetailPage');
    const { render, screen } = await import('@testing-library/react');
    render(<ProjectDetailPage project={mockProject} />);
    expect(screen.getAllByText('Live Demo').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Source Code').length).toBeGreaterThanOrEqual(1);
  });

  it('renders back link', async () => {
    const { ProjectDetailPage } = await import('@/components/sections/ProjectDetailPage');
    const { render, screen } = await import('@testing-library/react');
    render(<ProjectDetailPage project={mockProject} />);
    expect(screen.getAllByText('Back to Portfolio').length).toBeGreaterThanOrEqual(1);
  });

  it('renders gallery section', async () => {
    const { ProjectDetailPage } = await import('@/components/sections/ProjectDetailPage');
    const { render, screen } = await import('@testing-library/react');
    render(<ProjectDetailPage project={mockProject} />);
    expect(screen.getAllByText('Gallery').length).toBeGreaterThanOrEqual(1);
  });
});
