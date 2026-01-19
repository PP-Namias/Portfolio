import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Resume } from './resume-container';

describe('ResumeContainer', () => {
  it('should render children correctly', () => {
    render(
      <Resume.Container>
        <div>Test Content</div>
      </Resume.Container>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should have max-width constraint', () => {
    const { container } = render(
      <Resume.Container>
        <div>Test</div>
      </Resume.Container>
    );
    const resumeDiv = container.firstChild as HTMLElement;
    expect(resumeDiv).toHaveClass('max-w-[1000px]');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Resume.Container className="custom-class">
        <div>Test</div>
      </Resume.Container>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should have resume-container class', () => {
    const { container } = render(
      <Resume.Container>
        <div>Test</div>
      </Resume.Container>
    );
    expect(container.firstChild).toHaveClass('resume-container');
  });
});

describe('ResumeSection', () => {
  it('should render section content', () => {
    render(
      <Resume.Section>
        <div>Section Content</div>
      </Resume.Section>
    );
    expect(screen.getByText('Section Content')).toBeInTheDocument();
  });

  it('should render with border by default', () => {
    const { container } = render(
      <Resume.Section>Content</Resume.Section>
    );
    expect(container.firstChild).toHaveClass('border-b');
  });

  it('should render without border when noBorder is true', () => {
    const { container } = render(
      <Resume.Section noBorder>Content</Resume.Section>
    );
    expect(container.firstChild).not.toHaveClass('border-b');
  });

  it('should render with id attribute', () => {
    render(<Resume.Section id="test-section">Content</Resume.Section>);
    expect(screen.getByText('Content').closest('section')).toHaveAttribute('id', 'test-section');
  });

  it('should have print-friendly class', () => {
    const { container } = render(
      <Resume.Section>Content</Resume.Section>
    );
    expect(container.firstChild).toHaveClass('page-break-inside-avoid');
  });
});

describe('ResumeSectionHeader', () => {
  it('should render header text', () => {
    render(<Resume.Header>Test Header</Resume.Header>);
    expect(screen.getByText('Test Header')).toBeInTheDocument();
  });

  it('should render as h2 element', () => {
    render(<Resume.Header>Test Header</Resume.Header>);
    const header = screen.getByText('Test Header');
    expect(header.tagName).toBe('H2');
  });

  it('should have uppercase styling', () => {
    const { container } = render(<Resume.Header>Test</Resume.Header>);
    expect(container.firstChild).toHaveClass('uppercase');
  });

  it('should have resume-section-header class', () => {
    const { container } = render(<Resume.Header>Test</Resume.Header>);
    expect(container.firstChild).toHaveClass('resume-section-header');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Resume.Header className="custom-header">Test</Resume.Header>
    );
    expect(container.firstChild).toHaveClass('custom-header');
  });
});
