import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResumeHeader } from './resume-header';

const mockContactInfo = {
  email: 'test@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  github: 'https://github.com/testuser',
  linkedin: 'https://linkedin.com/in/testuser'
};

describe('ResumeHeader', () => {
  describe('Basic Rendering', () => {
    it('should render name correctly', () => {
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should render title correctly', () => {
      render(
        <ResumeHeader
          name="John Doe"
          title="Full Stack Developer"
          contact={mockContactInfo}
        />
      );
      expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
    });

    it('should render as header element', () => {
      const { container } = render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      expect(container.querySelector('header')).toBeInTheDocument();
    });

    it('should have resume-section class', () => {
      const { container } = render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      expect(container.querySelector('header')).toHaveClass('resume-section');
    });
  });

  describe('Contact Information', () => {
    it('should render email with mailto link', () => {
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      const emailLink = screen.getByText(mockContactInfo.email).closest('a');
      expect(emailLink).toHaveAttribute('href', `mailto:${mockContactInfo.email}`);
    });

    it('should render phone with tel link', () => {
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      const phoneLink = screen.getByText(mockContactInfo.phone).closest('a');
      expect(phoneLink).toHaveAttribute('href', `tel:${mockContactInfo.phone}`);
    });

    it('should render location', () => {
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      expect(screen.getByText(mockContactInfo.location)).toBeInTheDocument();
    });

    it('should render GitHub link', () => {
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      const githubLink = screen.getByLabelText('GitHub Profile');
      expect(githubLink).toHaveAttribute('href', mockContactInfo.github);
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render LinkedIn link', () => {
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      const linkedinLink = screen.getByLabelText('LinkedIn Profile');
      expect(linkedinLink).toHaveAttribute('href', mockContactInfo.linkedin);
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Download Button', () => {
    it('should render download button', () => {
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      expect(screen.getByRole('button', { name: /download resume/i })).toBeInTheDocument();
    });

    it('should call onDownloadPDF when button is clicked', async () => {
      const user = userEvent.setup();
      const handleDownload = vi.fn();
      
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
          onDownloadPDF={handleDownload}
        />
      );
      
      const button = screen.getByRole('button', { name: /download resume/i });
      await user.click(button);
      
      expect(handleDownload).toHaveBeenCalledTimes(1);
    });

    it('should have no-print class on button container', () => {
      const { container } = render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      const buttonContainer = container.querySelector('.no-print');
      expect(buttonContainer).toBeInTheDocument();
    });

    it('should not crash when onDownloadPDF is undefined', async () => {
      const user = userEvent.setup();
      
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      
      const button = screen.getByRole('button', { name: /download resume/i });
      await user.click(button);
      
      // Should not throw error
      expect(button).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('should have flex container', () => {
      const { container } = render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should have responsive flex classes', () => {
      const { container } = render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      const flexContainer = container.querySelector('.md\\:flex-row');
      expect(flexContainer).toBeInTheDocument();
    });
  });

  describe('Typography', () => {
    it('should have large text for name', () => {
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      const nameElement = screen.getByText('John Doe');
      expect(nameElement.tagName).toBe('H1');
      expect(nameElement).toHaveClass('text-4xl');
    });

    it('should have medium text for title', () => {
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      const titleElement = screen.getByText('Software Engineer');
      expect(titleElement).toHaveClass('text-xl');
    });

    it('should have resume-primary color for name', () => {
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      const nameElement = screen.getByText('John Doe');
      expect(nameElement).toHaveClass('text-resume-primary');
    });

    it('should have resume-secondary color for title', () => {
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      const titleElement = screen.getByText('Software Engineer');
      expect(titleElement).toHaveClass('text-resume-secondary');
    });
  });

  describe('Hover Effects', () => {
    it('should have hover transition classes on email link', () => {
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      const emailLink = screen.getByText(mockContactInfo.email).closest('a');
      expect(emailLink).toHaveClass('hover:text-resume-accent');
      expect(emailLink).toHaveClass('transition-colors');
    });

    it('should have hover transition classes on phone link', () => {
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      const phoneLink = screen.getByText(mockContactInfo.phone).closest('a');
      expect(phoneLink).toHaveClass('hover:text-resume-accent');
      expect(phoneLink).toHaveClass('transition-colors');
    });

    it('should have hover transition classes on social links', () => {
      render(
        <ResumeHeader
          name="John Doe"
          title="Software Engineer"
          contact={mockContactInfo}
        />
      );
      const githubLink = screen.getByLabelText('GitHub Profile');
      expect(githubLink).toHaveClass('hover:text-resume-accent');
      expect(githubLink).toHaveClass('transition-colors');
    });
  });
});
