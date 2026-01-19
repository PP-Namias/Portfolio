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
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Node.js')).toBeInTheDocument();
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
        expect(sections.length).toBeGreaterThanOrEqual(2);
        // Header should come first
        expect(sections[0].tagName).toBe('HEADER');
        // Summary should come second
        expect(sections[1].getAttribute('id')).toBe('summary');
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
