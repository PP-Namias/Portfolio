import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectPreviewModal } from './project-preview-modal';

const mockProject = {
  title: 'Story Adaptive Game Engine',
  image: 'placeholder.png',
  description: 'Built GPT-integrated text adventure platform with dynamic narrative generation.',
  repositoryURL: 'https://github.com/test/repo',
  liveURL: 'https://example.com',
  processURL: null,
  tags: ['JavaScript', 'TypeScript', 'GPT', 'AI', 'Machine Learning', 'Game Engine', 'Web App', 'React', 'Node.js', 'Vercel', 'MongoDB', 'Express'],
  year: 2025,
};

const mockProjectNoLinks = {
  ...mockProject,
  repositoryURL: null,
  liveURL: null,
};

describe('ProjectPreviewModal', () => {
  describe('Basic Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={false}
          onClose={() => {}}
        />
      );
      expect(screen.queryByTestId('project-modal')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByTestId('project-modal')).toBeInTheDocument();
    });

    it('should not render when project is null', () => {
      render(
        <ProjectPreviewModal
          project={null}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.queryByTestId('project-modal')).not.toBeInTheDocument();
    });

    it('should render project title', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByText('Story Adaptive Game Engine')).toBeInTheDocument();
    });

    it('should render project year', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByText('2025')).toBeInTheDocument();
    });

    it('should render project description', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByText(/GPT-integrated text adventure/i)).toBeInTheDocument();
    });
  });

  describe('Tags Display', () => {
    it('should render technology tags', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('GPT')).toBeInTheDocument();
    });

    it('should limit visible tags to 10', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      // Mock project has 12 tags, so should show "+2 more"
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });

    it('should show Technologies label', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByText('Technologies')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render View Live button when liveURL exists', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByTestId('live-link')).toBeInTheDocument();
      expect(screen.getByText('View Live')).toBeInTheDocument();
    });

    it('should render View Code button when repositoryURL exists', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByTestId('repo-link')).toBeInTheDocument();
      expect(screen.getByText('View Code')).toBeInTheDocument();
    });

    it('should not render View Live button when liveURL is null', () => {
      render(
        <ProjectPreviewModal
          project={mockProjectNoLinks}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.queryByTestId('live-link')).not.toBeInTheDocument();
    });

    it('should not render View Code button when repositoryURL is null', () => {
      render(
        <ProjectPreviewModal
          project={mockProjectNoLinks}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.queryByTestId('repo-link')).not.toBeInTheDocument();
    });

    it('should have correct href for live link', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      const liveLink = screen.getByTestId('live-link');
      expect(liveLink).toHaveAttribute('href', 'https://example.com');
    });

    it('should have correct href for repo link', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      const repoLink = screen.getByTestId('repo-link');
      expect(repoLink).toHaveAttribute('href', 'https://github.com/test/repo');
    });
  });

  describe('Close Functionality', () => {
    it('should render close button', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByTestId('close-button')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={onClose}
        />
      );
      fireEvent.click(screen.getByTestId('close-button'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      const onClose = vi.fn();
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={onClose}
        />
      );
      fireEvent.click(screen.getByTestId('modal-backdrop'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should render Close text button in footer', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role dialog', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal attribute', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby pointing to title', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'project-title');
    });

    it('should have aria-label on close button', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      expect(screen.getByTestId('close-button')).toHaveAttribute('aria-label', 'Close modal');
    });
  });

  describe('Visual Styling', () => {
    it('should have backdrop with blur effect', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      const backdrop = screen.getByTestId('modal-backdrop');
      expect(backdrop).toHaveClass('backdrop-blur-sm');
    });

    it('should have modal with rounded corners', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      const modal = screen.getByTestId('project-modal');
      expect(modal).toHaveClass('rounded-xl');
    });

    it('should have shadow on modal', () => {
      render(
        <ProjectPreviewModal
          project={mockProject}
          isOpen={true}
          onClose={() => {}}
        />
      );
      const modal = screen.getByTestId('project-modal');
      expect(modal).toHaveClass('shadow-2xl');
    });
  });
});
