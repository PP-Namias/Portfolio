import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfessionalSummary } from './professional-summary';

const mockSummaryData = {
  summary: "Passionate Full Stack Developer with 3+ years of experience building scalable web applications. Specialized in React, TypeScript, and Node.js with a proven track record of delivering high-impact projects.",
  highlights: {
    yearsExperience: 3,
    projectsCompleted: 25,
    primaryTechnologies: ["React", "TypeScript", "Node.js"]
  }
};

describe('ProfessionalSummary', () => {
  describe('Basic Rendering', () => {
    it('should render summary text correctly', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      expect(screen.getByText(/Passionate Full Stack Developer/i)).toBeInTheDocument();
    });

    it('should render as section element', () => {
      const { container } = render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('should have id attribute', () => {
      const { container } = render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      expect(container.querySelector('section')).toHaveAttribute('id', 'summary');
    });

    it('should render section header', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      expect(screen.getByText('Professional Summary')).toBeInTheDocument();
    });

    it('should have bg-resume-bg-alt class', () => {
      const { container } = render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      expect(container.querySelector('section')).toHaveClass('bg-resume-bg-alt');
    });
  });

  describe('Summary Text', () => {
    it('should render full summary text', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      expect(screen.getByText(mockSummaryData.summary)).toBeInTheDocument();
    });

    it('should have proper typography classes', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      const paragraph = screen.getByText(mockSummaryData.summary);
      expect(paragraph).toHaveClass('text-base');
      expect(paragraph).toHaveClass('leading-7');
    });

    it('should have resume-primary color', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      const paragraph = screen.getByText(mockSummaryData.summary);
      expect(paragraph).toHaveClass('text-resume-primary');
    });

    it('should have bottom margin', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      const paragraph = screen.getByText(mockSummaryData.summary);
      expect(paragraph).toHaveClass('mb-6');
    });
  });

  describe('Highlight Chips', () => {
    it('should render years experience chip', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      expect(screen.getByText('3+ Years Experience')).toBeInTheDocument();
    });

    it('should render projects completed chip', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      expect(screen.getByText('25+ Projects Delivered')).toBeInTheDocument();
    });

    it('should render all primary technologies', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      mockSummaryData.highlights.primaryTechnologies.forEach(tech => {
        expect(screen.getByText(tech)).toBeInTheDocument();
      });
    });

    it('should render correct number of technology chips', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      const reactChip = screen.getByText('React');
      const typeScriptChip = screen.getByText('TypeScript');
      const nodeChip = screen.getByText('Node.js');
      
      expect(reactChip).toBeInTheDocument();
      expect(typeScriptChip).toBeInTheDocument();
      expect(nodeChip).toBeInTheDocument();
    });

    it('should render Focus label', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      expect(screen.getByText('Focus:')).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('should have flex wrap container', () => {
      const { container } = render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      const highlightsContainer = container.querySelector('.flex.flex-wrap');
      expect(highlightsContainer).toBeInTheDocument();
    });

    it('should have gap between items', () => {
      const { container } = render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      const highlightsContainer = container.querySelector('.flex.flex-wrap');
      expect(highlightsContainer).toHaveClass('gap-4');
    });

    it('should have items-center alignment', () => {
      const { container } = render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      const highlightsContainer = container.querySelector('.flex.flex-wrap');
      expect(highlightsContainer).toHaveClass('items-center');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero years experience', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={{
            ...mockSummaryData.highlights,
            yearsExperience: 0
          }}
        />
      );
      expect(screen.getByText('0+ Years Experience')).toBeInTheDocument();
    });

    it('should handle large numbers for projects', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={{
            ...mockSummaryData.highlights,
            projectsCompleted: 100
          }}
        />
      );
      expect(screen.getByText('100+ Projects Delivered')).toBeInTheDocument();
    });

    it('should handle empty technologies array', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={{
            ...mockSummaryData.highlights,
            primaryTechnologies: []
          }}
        />
      );
      // Should still render Focus label even with no technologies
      expect(screen.getByText('Focus:')).toBeInTheDocument();
    });

    it('should handle single technology', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={{
            ...mockSummaryData.highlights,
            primaryTechnologies: ["React"]
          }}
        />
      );
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('should handle long summary text', () => {
      const longSummary = "This is a very long summary text that goes on and on and on to test how the component handles lengthy content that might wrap to multiple lines or cause layout issues in the component rendering.";
      render(
        <ProfessionalSummary
          summary={longSummary}
          highlights={mockSummaryData.highlights}
        />
      );
      expect(screen.getByText(longSummary)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic section element', () => {
      const { container } = render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      const section = container.querySelector('section');
      expect(section?.tagName).toBe('SECTION');
    });

    it('should have proper heading hierarchy', () => {
      render(
        <ProfessionalSummary
          summary={mockSummaryData.summary}
          highlights={mockSummaryData.highlights}
        />
      );
      const heading = screen.getByText('Professional Summary');
      expect(heading.tagName).toBe('H2');
    });
  });
});
