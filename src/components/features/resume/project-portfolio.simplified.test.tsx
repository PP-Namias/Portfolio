import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectPortfolio } from './project-portfolio';

const mockProjects = [
  {
    title: 'Story Adaptive Game Engine',
    image: 'placeholder.png',
    description: 'Built GPT-integrated text adventure platform',
    repositoryURL: null,
    liveURL: 'https://text-adventure.vercel.app',
    processURL: null,
    tags: ['React', 'TypeScript', 'GPT-4', 'AI'],
    year: 2025,
  },
  {
    title: 'Java Rice',
    image: 'placeholder.png',
    description: 'Interactive Food Ordering System',
    repositoryURL: 'https://github.com/test/java-rice',
    liveURL: null,
    processURL: null,
    tags: ['Java', 'Swing', 'GUI'],
    year: 2024,
  },
  {
    title: 'Student Attendance System',
    image: 'placeholder.png',
    description: 'Attendance tracking with QR scanning',
    repositoryURL: 'https://github.com/test/attendance',
    liveURL: null,
    processURL: null,
    tags: ['C#', 'WPF', 'PostgreSQL'],
    year: 2023,
  },
];

describe('ProjectPortfolio - Simplified Tests', () => {
  describe('Core Rendering', () => {
    it('should render all projects initially', () => {
      render(<ProjectPortfolio projects={mockProjects} />);
      
      expect(screen.getByText('Story Adaptive Game Engine')).toBeInTheDocument();
      expect(screen.getByText('Java Rice')).toBeInTheDocument();
      expect(screen.getByText('Student Attendance System')).toBeInTheDocument();
    });

    it('should display correct project count', () => {
      render(<ProjectPortfolio projects={mockProjects} />);
      expect(screen.getByText(/3 projects/i)).toBeInTheDocument();
    });

    it('should render section header', () => {
      render(<ProjectPortfolio projects={mockProjects} />);
      expect(screen.getByText('Projects')).toBeInTheDocument();
    });

    it('should render filter controls', () => {
      render(<ProjectPortfolio projects={mockProjects} />);
      
      expect(screen.getByText(/filter by technology/i)).toBeInTheDocument();
      expect(screen.getByText(/filter by year/i)).toBeInTheDocument();
    });

    it('should render view toggle buttons', () => {
      render(<ProjectPortfolio projects={mockProjects} />);
      
      expect(screen.getByLabelText(/grid view/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/list view/i)).toBeInTheDocument();
    });
  });

  describe('Project Cards', () => {
    it('should display project descriptions', () => {
      render(<ProjectPortfolio projects={mockProjects} />);
      
      expect(screen.getByText(/GPT-integrated text adventure platform/i)).toBeInTheDocument();
      expect(screen.getByText(/Interactive Food Ordering System/i)).toBeInTheDocument();
      expect(screen.getByText(/Attendance tracking with QR scanning/i)).toBeInTheDocument();
    });

    it('should display project years', () => {
      render(<ProjectPortfolio projects={mockProjects} />);
      
      // Years appear in project cards
      const yearElements = screen.getAllByText('2025');
      expect(yearElements.length).toBeGreaterThan(0);
    });

    it('should display technology tags', () => {
      render(<ProjectPortfolio projects={mockProjects} />);
      
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Java')).toBeInTheDocument();
      expect(screen.getByText('C#')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<ProjectPortfolio projects={mockProjects} />);
      
      // Should have View Live button for Story Adaptive Game Engine
      const viewLiveButtons = screen.getAllByText(/view live/i);
      expect(viewLiveButtons.length).toBeGreaterThan(0);
      
      // Should have View Code button for Java Rice
      const viewCodeButtons = screen.getAllByText(/view code/i);
      expect(viewCodeButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Layout and Styling', () => {
    it('should have grid layout class', () => {
      const { container } = render(<ProjectPortfolio projects={mockProjects} />);
      const gridContainer = container.querySelector('.grid');
      
      expect(gridContainer).toBeInTheDocument();
    });

    it('should render as section element', () => {
      const { container } = render(<ProjectPortfolio projects={mockProjects} />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should have projects id', () => {
      const { container } = render(<ProjectPortfolio projects={mockProjects} />);
      const section = container.querySelector('section');
      
      expect(section).toHaveAttribute('id', 'projects');
    });

    it('should have print-friendly classes', () => {
      const { container } = render(<ProjectPortfolio projects={mockProjects} />);
      const section = container.querySelector('section');
      
      expect(section).toHaveClass('page-break-inside-avoid');
    });
  });

  describe('Empty State', () => {
    it('should display message when no projects provided', () => {
      render(<ProjectPortfolio projects={[]} />);
      
      expect(screen.getByText(/no projects to display/i)).toBeInTheDocument();
    });

    it('should show 0 projects count', () => {
      render(<ProjectPortfolio projects={[]} />);
      
      expect(screen.getByText(/0 projects/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic section element', () => {
      const { container } = render(<ProjectPortfolio projects={mockProjects} />);
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<ProjectPortfolio projects={mockProjects} />);
      const heading = screen.getByRole('heading', { name: /projects/i });
      
      expect(heading.tagName).toBe('H2');
    });

    it('should have aria-labels for filter buttons', () => {
      render(<ProjectPortfolio projects={mockProjects} />);
      
      expect(screen.getByLabelText(/filter by technology/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/filter by year/i)).toBeInTheDocument();
    });

    it('should have aria-labels for view toggle buttons', () => {
      render(<ProjectPortfolio projects={mockProjects} />);
      
      expect(screen.getByLabelText(/grid view/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/list view/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid classes', () => {
      const { container } = render(<ProjectPortfolio projects={mockProjects} />);
      const gridContainer = container.querySelector('.grid');
      
      expect(gridContainer).toHaveClass('grid-cols-1');
      expect(gridContainer).toHaveClass('md:grid-cols-2');
      expect(gridContainer).toHaveClass('lg:grid-cols-3');
    });

    it('should have responsive filter layout', () => {
      const { container } = render(<ProjectPortfolio projects={mockProjects} />);
      const filterContainer = container.querySelector('.flex-wrap');
      
      expect(filterContainer).toBeInTheDocument();
    });
  });

  describe('Print Optimization', () => {
    it('should hide filters in print', () => {
      const { container } = render(<ProjectPortfolio projects={mockProjects} />);
      const filterContainer = container.querySelector('.no-print');
      
      expect(filterContainer).toBeInTheDocument();
    });

    it('should have print-friendly section classes', () => {
      const { container } = render(<ProjectPortfolio projects={mockProjects} />);
      const section = container.querySelector('.resume-section');
      
      expect(section).toBeInTheDocument();
    });
  });

  describe('Data Integrity', () => {
    it('should handle projects with no repository URL', () => {
      render(<ProjectPortfolio projects={mockProjects} />);
      
      // Story Adaptive Game Engine has no repository
      const project = screen.getByText('Story Adaptive Game Engine');
      expect(project).toBeInTheDocument();
    });

    it('should handle projects with no live URL', () => {
      render(<ProjectPortfolio projects={mockProjects} />);
      
      // Java Rice has no live URL
      const project = screen.getByText('Java Rice');
      expect(project).toBeInTheDocument();
    });

    it('should display all provided tags', () => {
      render(<ProjectPortfolio projects={mockProjects} />);
      
      // Check various tags are displayed
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Swing')).toBeInTheDocument();
      expect(screen.getByText('WPF')).toBeInTheDocument();
    });
  });
});
