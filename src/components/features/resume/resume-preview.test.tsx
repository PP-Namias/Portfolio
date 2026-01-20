import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ResumePreview from '@/routes/resume-preview';

// Mock the core service
vi.mock('@/hooks/use-core', () => ({
  useCore: () => ({
    queryProfile: () => ({
      data: {
        name: 'John Doe',
        title: 'Software Engineer',
        email: 'john@example.com',
        phone: '+1 234 567 8900',
        location: 'San Francisco, CA',
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        summary: 'Experienced software engineer with expertise in web development.',
        highlights: {
          yearsExperience: 5,
          projectsCompleted: 30,
          primaryTechnologies: ['React', 'TypeScript', 'Node.js']
        }
      },
      isLoading: false,
      error: null
    }),
    queryTechnologies: () => ({
      data: [
        { name: 'React', category: 'Frontend', proficiency: 90, logo: 'react' },
        { name: 'TypeScript', category: 'Languages', proficiency: 85, logo: 'typescript' },
        { name: 'Node.js', category: 'Backend', proficiency: 80, logo: 'nodejs' }
      ],
      isLoading: false,
      error: null
    }),
    queryExperiences: () => ({
      data: [
        {
          company: 'Tech Corp',
          position: 'Senior Developer',
          summary: 'Led development team building scalable applications.',
          country: 'USA',
          modality: 'Remote',
          type: 'Full-time',
          startedAt: '2020-01',
          endedAt: null,
          technologies: ['React', 'TypeScript', 'Node.js'],
          highlights: [
            'Built microservices architecture serving 1M+ users',
            'Reduced deployment time by 80% through CI/CD automation'
          ]
        }
      ],
      isLoading: false,
      error: null
    }),
    queryProjects: () => ({
      data: [
        {
          title: 'Story Adaptive Game Engine',
          image: 'story-game.jpg',
          description: 'AI-powered game engine',
          repositoryURL: 'https://github.com/test/game-engine',
          liveURL: 'https://game-engine.test',
          processURL: null,
          tags: ['React', 'TypeScript', 'GPT-4'],
          year: 2025
        }
      ],
      isLoading: false,
      error: null
    }),
    queryCertifications: () => ({
      data: [
        {
          title: 'AWS Certified Developer',
          image: 'aws-cert.jpg',
          issuer: 'Amazon Web Services',
          issuedAt: '2023-06',
          tags: ['AWS', 'Cloud', 'DevOps']
        }
      ],
      isLoading: false,
      error: null
    }),
    downloadResumeMutation: {
      mutate: vi.fn()
    }
  })
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('ResumePreview Integration', () => {
  describe('Page Structure', () => {
    it('should render Resume Container', async () => {
      const { container } = renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        expect(container.querySelector('.resume-container')).toBeInTheDocument();
      });
    });

    it('should have max-width constraint', async () => {
      const { container } = renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        const resumeDiv = container.querySelector('.max-w-\\[1000px\\]');
        expect(resumeDiv).toBeInTheDocument();
      });
    });

    it('should render all three Phase 1 components', async () => {
      renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        // Header component
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        // Professional Summary section
        expect(screen.getByText('Professional Summary')).toBeInTheDocument();
        expect(screen.getByText(/Experienced software engineer/i)).toBeInTheDocument();
      });
    });

    it('should render TechnicalSkills component (Phase 2.1)', async () => {
      renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        expect(screen.getByText('Technical Skills')).toBeInTheDocument();
      });
    });
  });

  describe('Data Integration', () => {
    it('should display profile name from data', async () => {
      renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('should display profile title from data', async () => {
      renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      });
    });

    it('should display contact email from data', async () => {
      renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
      });
    });

    it('should display summary text from data', async () => {
      renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        expect(screen.getByText(/Experienced software engineer/i)).toBeInTheDocument();
      });
    });

    it('should display years experience from highlights', async () => {
      renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        expect(screen.getByText('5+ Years Experience')).toBeInTheDocument();
      });
    });

    it('should display projects completed from highlights', async () => {
      renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        expect(screen.getByText('30+ Projects Delivered')).toBeInTheDocument();
      });
    });

    it('should display all primary technologies', async () => {
      renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        // Use getAllByText since these technologies appear in multiple places (summary + technical skills)
        expect(screen.getAllByText('React').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('Node.js').length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Component Integration', () => {
    it('should render ResumeHeader with correct props', async () => {
      const { container } = renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        const header = container.querySelector('header');
        expect(header).toBeInTheDocument();
        expect(header).toHaveClass('resume-section');
      });
    });

    it('should render ProfessionalSummary with correct props', async () => {
      const { container } = renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        const summarySection = container.querySelector('#summary');
        expect(summarySection).toBeInTheDocument();
        expect(summarySection).toHaveClass('bg-resume-bg-alt');
      });
    });

    it('should have proper section ordering', async () => {
      const { container } = renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        const sections = container.querySelectorAll('section, header');
        expect(sections.length).toBeGreaterThanOrEqual(3);
        // Header should come first
        expect(sections[0].tagName).toBe('HEADER');
        // Summary should come second
        expect(sections[1].getAttribute('id')).toBe('summary');
        // Technical Skills should come third
        expect(sections[2].getAttribute('id')).toBe('technical-skills');
      });
    });
  });

  describe('Loading States', () => {
    it('should not show loading when data is available', async () => {
      renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('TechnicalSkills Integration (Phase 2)', () => {
    it('should render Technical Skills section', async () => {
      renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        expect(screen.getByText('Technical Skills')).toBeInTheDocument();
      });
    });

    it('should display technologies with proficiency', async () => {
      renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        // Use getAllByText since technologies appear in both summary and technical skills
        expect(screen.getAllByText('React').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('TypeScript').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('Node.js').length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should display proficiency percentages', async () => {
      renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        expect(screen.getByText('90%')).toBeInTheDocument();
        expect(screen.getByText('85%')).toBeInTheDocument();
        expect(screen.getByText('80%')).toBeInTheDocument();
      });
    });

    it('should group technologies by category', async () => {
      renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        expect(screen.getByText('Frontend')).toBeInTheDocument();
        expect(screen.getByText('Languages')).toBeInTheDocument();
        expect(screen.getByText('Backend')).toBeInTheDocument();
      });
    });

    it('should only render technologies with proficiency data', async () => {
      const { container } = renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        const technicalSkillsSection = container.querySelector('#technical-skills');
        expect(technicalSkillsSection).toBeInTheDocument();
        // Should have 3 technologies with proficiency
        const techNames = container.querySelectorAll('#technical-skills .font-medium');
        expect(techNames.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should have responsive container classes', async () => {
      const { container } = renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        const resumeContainer = container.querySelector('.resume-container');
        expect(resumeContainer).toHaveClass('mx-auto');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure', async () => {
      const { container } = renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        expect(container.querySelector('header')).toBeInTheDocument();
        expect(container.querySelector('section')).toBeInTheDocument();
        expect(container.querySelector('h1')).toBeInTheDocument();
        expect(container.querySelector('h2')).toBeInTheDocument();
      });
    });

    it('should have proper heading hierarchy', async () => {
      renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        const h1 = screen.getByText('John Doe');
        const h2 = screen.getByText('Professional Summary');
        expect(h1.tagName).toBe('H1');
        expect(h2.tagName).toBe('H2');
      });
    });
  });

  describe('Print Optimization', () => {
    it('should have print-friendly classes on sections', async () => {
      const { container } = renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        const sections = container.querySelectorAll('section');
        sections.forEach(section => {
          expect(section).toHaveClass('page-break-inside-avoid');
        });
      });
    });

    it('should have no-print class on download button', async () => {
      const { container } = renderWithQueryClient(<ResumePreview />);
      await waitFor(() => {
        const noPrintElement = container.querySelector('.no-print');
        expect(noPrintElement).toBeInTheDocument();
      });
    });
  });
});
