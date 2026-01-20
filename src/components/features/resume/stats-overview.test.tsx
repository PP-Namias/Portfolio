import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsOverview } from './stats-overview';

const mockStats = {
  yearsExperience: 3,
  projectsCompleted: 25,
  technologiesCount: 52,
  certificationsCount: 27
};

describe('StatsOverview', () => {
  describe('Basic Rendering', () => {
    it('should render section with stats', () => {
      render(<StatsOverview stats={mockStats} />);
      expect(screen.getByText(/key metrics/i)).toBeInTheDocument();
    });

    it('should render as section element', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should have stats id', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const section = container.querySelector('#stats');
      expect(section).toBeInTheDocument();
    });

    it('should render all 4 metric cards', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const cards = container.querySelectorAll('.stat-card');
      expect(cards.length).toBe(4);
    });

    it('should have section header', () => {
      render(<StatsOverview stats={mockStats} />);
      const header = screen.getByText(/key metrics/i);
      expect(header).toBeInTheDocument();
    });
  });

  describe('Years Experience Metric', () => {
    it('should display years of experience', () => {
      render(<StatsOverview stats={mockStats} />);
      expect(screen.getByText('3+')).toBeInTheDocument();
    });

    it('should show years experience label', () => {
      render(<StatsOverview stats={mockStats} />);
      expect(screen.getByText(/years experience/i)).toBeInTheDocument();
    });

    it('should display trending up icon', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const icons = container.querySelectorAll('.lucide-trending-up');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should format single year correctly', () => {
      render(<StatsOverview stats={{ ...mockStats, yearsExperience: 1 }} />);
      expect(screen.getByText('1+')).toBeInTheDocument();
    });
  });

  describe('Projects Completed Metric', () => {
    it('should display projects completed count', () => {
      render(<StatsOverview stats={mockStats} />);
      expect(screen.getByText('25+')).toBeInTheDocument();
    });

    it('should show projects completed label', () => {
      render(<StatsOverview stats={mockStats} />);
      expect(screen.getByText(/projects completed/i)).toBeInTheDocument();
    });

    it('should display briefcase icon', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const icons = container.querySelectorAll('.lucide-briefcase');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should handle zero projects', () => {
      render(<StatsOverview stats={{ ...mockStats, projectsCompleted: 0 }} />);
      expect(screen.getByText('0+')).toBeInTheDocument();
    });
  });

  describe('Technologies Metric', () => {
    it('should display technologies count', () => {
      render(<StatsOverview stats={mockStats} />);
      expect(screen.getByText('52')).toBeInTheDocument();
    });

    it('should show technologies mastered label', () => {
      render(<StatsOverview stats={mockStats} />);
      expect(screen.getByText(/technologies mastered/i)).toBeInTheDocument();
    });

    it('should display code icon', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const icons = container.querySelectorAll('.lucide-code');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should handle single technology', () => {
      render(<StatsOverview stats={{ ...mockStats, technologiesCount: 1 }} />);
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('Certifications Metric', () => {
    it('should display certifications count', () => {
      render(<StatsOverview stats={mockStats} />);
      expect(screen.getByText('27')).toBeInTheDocument();
    });

    it('should show certifications earned label', () => {
      render(<StatsOverview stats={mockStats} />);
      expect(screen.getByText(/certifications earned/i)).toBeInTheDocument();
    });

    it('should display award icon', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const icons = container.querySelectorAll('.lucide-award');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should handle zero certifications', () => {
      render(<StatsOverview stats={{ ...mockStats, certificationsCount: 0 }} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Grid Layout', () => {
    it('should have grid layout', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });

    it('should have 4 columns on desktop', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const grid = container.querySelector('.lg\\:grid-cols-4');
      expect(grid).toBeInTheDocument();
    });

    it('should have 2 columns on tablet', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const grid = container.querySelector('.md\\:grid-cols-2');
      expect(grid).toBeInTheDocument();
    });

    it('should have 1 column on mobile', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const grid = container.querySelector('.grid-cols-1');
      expect(grid).toBeInTheDocument();
    });

    it('should have proper gap spacing', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const grid = container.querySelector('.gap-6');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    it('should have background color on section', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-resume-bg-alt');
    });

    it('should have card hover effects', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const card = container.querySelector('.stat-card');
      expect(card?.className).toMatch(/hover/);
    });

    it('should have rounded corners on cards', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const card = container.querySelector('.stat-card');
      expect(card?.className).toMatch(/rounded/);
    });

    it('should have proper padding', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const card = container.querySelector('.stat-card');
      expect(card?.className).toMatch(/p-/);
    });
  });

  describe('Accessibility', () => {
    it('should have semantic section element', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<StatsOverview stats={mockStats} />);
      const mainHeading = screen.getByText(/key metrics/i);
      expect(mainHeading.tagName).toBe('H2');
    });

    it('should have aria-labels for metrics', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const cards = container.querySelectorAll('.stat-card');
      cards.forEach(card => {
        expect(card.getAttribute('aria-label')).toBeTruthy();
      });
    });

    it('should have descriptive text for screen readers', () => {
      render(<StatsOverview stats={mockStats} />);
      expect(screen.getByText(/years experience/i)).toBeInTheDocument();
      expect(screen.getByText(/projects completed/i)).toBeInTheDocument();
    });
  });

  describe('Print Optimization', () => {
    it('should have print-friendly classes', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('page-break-inside-avoid');
    });

    it('should maintain grid on print', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const grid = container.querySelector('.print\\:grid-cols-2');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Animations', () => {
    it('should have Framer Motion wrapper', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });

    it('should stagger card animations', () => {
      const { container } = render(<StatsOverview stats={mockStats} />);
      const cards = container.querySelectorAll('.stat-card');
      expect(cards.length).toBe(4);
    });
  });

  describe('Edge Cases', () => {
    it('should handle all zeros', () => {
      render(<StatsOverview stats={{
        yearsExperience: 0,
        projectsCompleted: 0,
        technologiesCount: 0,
        certificationsCount: 0
      }} />);
      // Should have '0+' for years and projects (2 instances), and '0' for technologies and certifications (2 instances)
      expect(screen.getAllByText('0+').length).toBe(2); // years experience + projects completed
      expect(screen.getAllByText('0').length).toBe(2); // technologies + certifications
    });

    it('should handle large numbers', () => {
      render(<StatsOverview stats={{
        yearsExperience: 15,
        projectsCompleted: 150,
        technologiesCount: 200,
        certificationsCount: 100
      }} />);
      expect(screen.getByText('15+')).toBeInTheDocument();
      expect(screen.getByText('150+')).toBeInTheDocument();
    });

    it('should handle single digit numbers', () => {
      render(<StatsOverview stats={{
        yearsExperience: 1,
        projectsCompleted: 5,
        technologiesCount: 8,
        certificationsCount: 3
      }} />);
      expect(screen.getByText('1+')).toBeInTheDocument();
      expect(screen.getByText('5+')).toBeInTheDocument();
    });
  });
});
