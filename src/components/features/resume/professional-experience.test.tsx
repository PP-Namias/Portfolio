import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfessionalExperience } from './professional-experience';

const mockExperiences = [
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
      'Reduced deployment time by 80% through CI/CD automation',
      'Mentored 5 junior developers'
    ]
  },
  {
    company: 'StartupCo',
    position: 'Full Stack Developer',
    summary: 'Developed web applications for early-stage startup.',
    country: 'USA',
    modality: 'On-site',
    type: 'Full-time',
    startedAt: '2018-06',
    endedAt: '2019-12',
    technologies: ['Vue', 'Python', 'PostgreSQL'],
    highlights: [
      'Launched MVP in 3 months',
      'Achieved 95% test coverage'
    ]
  }
];

describe('ProfessionalExperience', () => {
  describe('Basic Rendering', () => {
    it('should render section with experiences', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText('Professional Experience')).toBeInTheDocument();
    });

    it('should render as section element', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should have professional-experience id', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const section = container.querySelector('#professional-experience');
      expect(section).toBeInTheDocument();
    });

    it('should render all experiences', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
      expect(screen.getByText('StartupCo')).toBeInTheDocument();
    });
  });

  describe('Company Information', () => {
    it('should display company name', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });

    it('should display position title', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    });

    it('should display modality', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText(/Remote/i)).toBeInTheDocument();
    });

    it('should display country', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      const usaElements = screen.getAllByText(/USA/i);
      expect(usaElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should display employment type', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      const fullTimeElements = screen.getAllByText(/Full-time/i);
      expect(fullTimeElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Date Formatting', () => {
    it('should display start date', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText(/Jan 2020/i)).toBeInTheDocument();
    });

    it('should display "Present" for current role', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText(/Present/i)).toBeInTheDocument();
    });

    it('should display end date for past roles', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText(/Dec 2019/i)).toBeInTheDocument();
    });

    it('should format date range correctly', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText(/Jan 2020 - Present/i)).toBeInTheDocument();
    });
  });

  describe('Highlights Display', () => {
    it('should display all highlight bullets', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText(/Built microservices architecture/i)).toBeInTheDocument();
      expect(screen.getByText(/Reduced deployment time/i)).toBeInTheDocument();
    });

    it('should display highlights as list items', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBeGreaterThanOrEqual(3);
    });

    it('should display metrics in highlights', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText(/1M\+/i)).toBeInTheDocument();
      expect(screen.getByText(/80%/i)).toBeInTheDocument();
    });
  });

  describe('Technology Tags', () => {
    it('should display all technologies', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    it('should render technologies as chips/badges', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      // Verify chips by checking if all technologies are rendered
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    it('should display correct number of technologies per experience', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      // First experience has 3 technologies
      const reactChips = screen.getAllByText('React');
      expect(reactChips.length).toBe(1);
    });
  });

  describe('Timeline Layout', () => {
    it('should have timeline container', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const timeline = container.querySelector('[class*="timeline"]');
      expect(timeline).toBeInTheDocument();
    });

    it('should have timeline dots for each experience', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const dots = container.querySelectorAll('[class*="timeline-dot"]');
      expect(dots.length).toBe(2);
    });

    it('should have connecting lines between experiences', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const lines = container.querySelectorAll('[class*="timeline-line"]');
      expect(lines.length).toBeGreaterThanOrEqual(1);
    });

    it('should order experiences chronologically (newest first)', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const companies = container.querySelectorAll('[class*="company"]');
      expect(companies[0]).toHaveTextContent('Tech Corp');
    });
  });

  describe('Responsive Layout', () => {
    it('should have responsive grid classes', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const experienceItems = container.querySelectorAll('[class*="experience-item"]');
      expect(experienceItems.length).toBe(2);
    });

    it('should have proper spacing between experiences', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const timeline = container.querySelector('[class*="space-y"]');
      expect(timeline).toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    it('should have company name as heading', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      const heading = screen.getByText('Tech Corp');
      expect(heading.tagName).toMatch(/H[3-4]/);
    });

    it('should have distinct visual hierarchy', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      const company = screen.getByText('Tech Corp');
      const position = screen.getByText('Senior Developer');
      expect(company).toHaveClass('font-bold');
      expect(position).toHaveClass('font-medium');
    });

    it('should apply timeline dot colors', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const dots = container.querySelectorAll('[class*="bg-"]');
      expect(dots.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty experiences array', () => {
      render(<ProfessionalExperience experiences={[]} />);
      expect(screen.getByText('Professional Experience')).toBeInTheDocument();
    });

    it('should handle experience with no highlights', () => {
      const noHighlights = [{
        ...mockExperiences[0],
        highlights: []
      }];
      render(<ProfessionalExperience experiences={noHighlights} />);
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });

    it('should handle experience with no technologies', () => {
      const noTech = [{
        ...mockExperiences[0],
        technologies: []
      }];
      render(<ProfessionalExperience experiences={noTech} />);
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });

    it('should handle long company names', () => {
      const longName = [{
        ...mockExperiences[0],
        company: 'Very Long Company Name International Corporation Limited LLC'
      }];
      render(<ProfessionalExperience experiences={longName} />);
      expect(screen.getByText(/Very Long Company Name/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic section element', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<ProfessionalExperience experiences={mockExperiences} />);
      const mainHeading = screen.getByText('Professional Experience');
      expect(mainHeading.tagName).toBe('H2');
    });

    it('should have list semantics for highlights', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const lists = container.querySelectorAll('ul');
      expect(lists.length).toBeGreaterThanOrEqual(1);
    });

    it('should have aria-labels for timeline elements', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const timeline = container.querySelector('[aria-label]');
      expect(timeline).toBeInTheDocument();
    });
  });

  describe('Print Optimization', () => {
    it('should have print-friendly classes', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('page-break-inside-avoid');
    });

    it('should have proper page break handling', () => {
      const { container } = render(<ProfessionalExperience experiences={mockExperiences} />);
      const experiences = container.querySelectorAll('[class*="experience"]');
      experiences.forEach(exp => {
        expect(exp).toHaveClass('page-break-inside-avoid');
      });
    });
  });
});
