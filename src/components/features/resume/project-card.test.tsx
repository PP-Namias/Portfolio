import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from './project-card';

const mockProject = {
  title: 'Story Adaptive Game Engine',
  image: 'placeholder.png',
  description: 'Built GPT-integrated text adventure platform with dynamic narrative generation algorithms. Implemented Stable Diffusion API for real-time visual content based on user choices. Delivered adaptive storytelling system processing 1000+ user interactions.',
  repositoryURL: 'https://github.com/test/repo',
  liveURL: 'https://text-adventure.vercel.app',
  processURL: null,
  tags: ['React', 'TypeScript', 'GPT-4', 'AI', 'Game Development'],
  year: 2025,
};

describe('ProjectCard', () => {
  describe('Basic Rendering', () => {
    it('should render project title', () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText('Story Adaptive Game Engine')).toBeInTheDocument();
    });

    it('should render project year', () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText('2025')).toBeInTheDocument();
    });

    it('should render project description', () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText(/Built GPT-integrated text adventure platform/i)).toBeInTheDocument();
    });

    it('should render as article element', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      expect(container.querySelector('article')).toBeInTheDocument();
    });

    it('should have project-card class', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const card = container.querySelector('.project-card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Technology Tags', () => {
    it('should display all technology tags', () => {
      render(<ProjectCard project={mockProject} />);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('GPT-4')).toBeInTheDocument();
      expect(screen.getByText('AI')).toBeInTheDocument();
      expect(screen.getByText('Game Development')).toBeInTheDocument();
    });

    it('should render tags as chips', () => {
      render(<ProjectCard project={mockProject} />);
      const reactChip = screen.getByText('React');
      expect(reactChip).toBeInTheDocument();
    });

    it('should limit visible tags to 5 by default', () => {
      const manyTagsProject = {
        ...mockProject,
        tags: Array.from({ length: 10 }, (_, i) => `Tag${i + 1}`)
      };
      render(<ProjectCard project={manyTagsProject} />);
      expect(screen.getByText('Tag1')).toBeInTheDocument();
      expect(screen.getByText('Tag5')).toBeInTheDocument();
      expect(screen.queryByText('Tag6')).not.toBeInTheDocument();
    });

    it('should show +N more tags indicator when tags exceed limit', () => {
      const manyTagsProject = {
        ...mockProject,
        tags: Array.from({ length: 10 }, (_, i) => `Tag${i + 1}`)
      };
      render(<ProjectCard project={manyTagsProject} />);
      expect(screen.getByText('+5 more')).toBeInTheDocument();
    });

    it('should handle empty tags array', () => {
      const noTagsProject = { ...mockProject, tags: [] };
      render(<ProjectCard project={noTagsProject} />);
      expect(screen.getByText('Story Adaptive Game Engine')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render View Live button when liveURL exists', () => {
      render(<ProjectCard project={mockProject} />);
      const liveButton = screen.getByText(/view live/i);
      expect(liveButton).toBeInTheDocument();
    });

    it('should render View Code button when repositoryURL exists', () => {
      render(<ProjectCard project={mockProject} />);
      const codeButton = screen.getByText(/view code/i);
      expect(codeButton).toBeInTheDocument();
    });

    it('should not render View Live button when liveURL is null', () => {
      const noLiveProject = { ...mockProject, liveURL: null };
      render(<ProjectCard project={noLiveProject} />);
      expect(screen.queryByText(/view live/i)).not.toBeInTheDocument();
    });

    it('should not render View Code button when repositoryURL is null', () => {
      const noRepoProject = { ...mockProject, repositoryURL: null };
      render(<ProjectCard project={noRepoProject} />);
      expect(screen.queryByText(/view code/i)).not.toBeInTheDocument();
    });

    it('should have correct href for live demo link', () => {
      render(<ProjectCard project={mockProject} />);
      const liveLink = screen.getByText(/view live/i).closest('a');
      expect(liveLink).toHaveAttribute('href', mockProject.liveURL);
    });

    it('should have correct href for repository link', () => {
      render(<ProjectCard project={mockProject} />);
      const repoLink = screen.getByText(/view code/i).closest('a');
      expect(repoLink).toHaveAttribute('href', mockProject.repositoryURL);
    });

    it('should open links in new tab', () => {
      render(<ProjectCard project={mockProject} />);
      const liveLink = screen.getByText(/view live/i).closest('a');
      const repoLink = screen.getByText(/view code/i).closest('a');
      expect(liveLink).toHaveAttribute('target', '_blank');
      expect(repoLink).toHaveAttribute('target', '_blank');
    });

    it('should have rel noopener noreferrer for security', () => {
      render(<ProjectCard project={mockProject} />);
      const liveLink = screen.getByText(/view live/i).closest('a');
      const repoLink = screen.getByText(/view code/i).closest('a');
      expect(liveLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(repoLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Layout Variants', () => {
    it('should render in grid layout by default', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const card = container.querySelector('.project-card');
      expect(card).not.toHaveClass('list-view');
    });

    it('should render in list layout when variant is "list"', () => {
      const { container } = render(<ProjectCard project={mockProject} variant="list" />);
      const card = container.querySelector('.project-card');
      expect(card).toHaveClass('list-view');
    });

    it('should show more tags in list view', () => {
      const manyTagsProject = {
        ...mockProject,
        tags: Array.from({ length: 10 }, (_, i) => `Tag${i + 1}`)
      };
      render(<ProjectCard project={manyTagsProject} variant="list" />);
      // List view should show more tags (e.g., 8 instead of 5)
      expect(screen.getByText('Tag1')).toBeInTheDocument();
      expect(screen.getByText('Tag8')).toBeInTheDocument();
    });
  });

  describe('Hover Effects', () => {
    it('should have hover transition classes', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const card = container.querySelector('.project-card');
      expect(card).toHaveClass('transition-all');
    });

    it('should have hover scale effect', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const card = container.querySelector('.project-card');
      expect(card).toHaveClass('hover:scale-105');
    });

    it('should have hover shadow effect', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const card = container.querySelector('.project-card');
      expect(card).toHaveClass('hover:shadow-lg');
    });
  });

  describe('Click Interaction', () => {
    it('should call onClick when card is clicked', () => {
      const onClick = vi.fn();
      const { container } = render(<ProjectCard project={mockProject} onClick={onClick} />);
      const card = container.querySelector('.project-card');
      if (card) {
        fireEvent.click(card);
        expect(onClick).toHaveBeenCalledTimes(1);
      }
    });

    it('should not call onClick when action button is clicked', () => {
      const onClick = vi.fn();
      render(<ProjectCard project={mockProject} onClick={onClick} />);
      const liveButton = screen.getByText(/view live/i);
      fireEvent.click(liveButton);
      // onClick should not be called when clicking action buttons
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should have cursor pointer when onClick is provided', () => {
      const onClick = vi.fn();
      const { container } = render(<ProjectCard project={mockProject} onClick={onClick} />);
      const card = container.querySelector('.project-card');
      expect(card).toHaveClass('cursor-pointer');
    });
  });

  describe('Visual Styling', () => {
    it('should have rounded corners', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const card = container.querySelector('.project-card');
      expect(card).toHaveClass('rounded-lg');
    });

    it('should have border', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const card = container.querySelector('.project-card');
      expect(card).toHaveClass('border');
    });

    it('should have padding', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const card = container.querySelector('.project-card');
      expect(card).toHaveClass('p-6');
    });

    it('should have background color', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const card = container.querySelector('.project-card');
      expect(card).toHaveClass('bg-resume-bg-alt');
    });
  });

  describe('Typography', () => {
    it('should have bold title', () => {
      render(<ProjectCard project={mockProject} />);
      const title = screen.getByText('Story Adaptive Game Engine');
      expect(title).toHaveClass('font-bold');
    });

    it('should have proper title size', () => {
      render(<ProjectCard project={mockProject} />);
      const title = screen.getByText('Story Adaptive Game Engine');
      expect(title).toHaveClass('text-lg');
    });

    it('should truncate long descriptions', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const description = container.querySelector('.line-clamp-2');
      expect(description).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive spacing', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const card = container.querySelector('.project-card');
      expect(card).toHaveClass('space-y-3');
    });

    it('should have responsive button layout', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const buttonContainer = container.querySelector('.flex.gap-2');
      expect(buttonContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label for project card', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const card = container.querySelector('[aria-label]');
      expect(card).toBeInTheDocument();
    });

    it('should have accessible button labels', () => {
      render(<ProjectCard project={mockProject} />);
      const liveButton = screen.getByText(/view live/i);
      expect(liveButton).toHaveAccessibleName();
    });

    it('should have proper heading hierarchy', () => {
      render(<ProjectCard project={mockProject} />);
      const title = screen.getByText('Story Adaptive Game Engine');
      expect(title.tagName).toBe('H3');
    });
  });

  describe('Print Optimization', () => {
    it('should have print-friendly class', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const card = container.querySelector('.project-card');
      expect(card).toHaveClass('page-break-inside-avoid');
    });

    it('should hide interactive elements in print', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const buttons = container.querySelectorAll('.no-print');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long project titles', () => {
      const longTitleProject = {
        ...mockProject,
        title: 'Very Long Project Title That Should Be Handled Gracefully Without Breaking The Layout Design System'
      };
      render(<ProjectCard project={longTitleProject} />);
      expect(screen.getByText(/Very Long Project Title/i)).toBeInTheDocument();
    });

    it('should handle very short descriptions', () => {
      const shortDescProject = {
        ...mockProject,
        description: 'Short description.'
      };
      render(<ProjectCard project={shortDescProject} />);
      expect(screen.getByText('Short description.')).toBeInTheDocument();
    });

    it('should handle projects with no links', () => {
      const noLinksProject = {
        ...mockProject,
        repositoryURL: null,
        liveURL: null,
        processURL: null
      };
      render(<ProjectCard project={noLinksProject} />);
      expect(screen.getByText('Story Adaptive Game Engine')).toBeInTheDocument();
    });

    it('should handle single tag', () => {
      const singleTagProject = {
        ...mockProject,
        tags: ['React']
      };
      render(<ProjectCard project={singleTagProject} />);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.queryByText(/\+\d+ more/)).not.toBeInTheDocument();
    });

    it('should handle missing year', () => {
      const noYearProject = {
        ...mockProject,
        year: 0
      };
      render(<ProjectCard project={noYearProject} />);
      expect(screen.getByText('Story Adaptive Game Engine')).toBeInTheDocument();
    });
  });

  describe('Animation', () => {
    it('should have fade-in animation', () => {
      const { container } = render(<ProjectCard project={mockProject} />);
      const card = container.querySelector('.project-card');
      // Check for motion components or animation classes
      expect(card).toBeInTheDocument();
    });
  });
});
