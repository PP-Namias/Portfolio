import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ProjectDetailModal } from '@/components/ui/ProjectDetailModal';

vi.mock('framer-motion', () => {
  const R = require('react');
  return {
    motion: {
      div: R.forwardRef(function MockMotionDiv(
        { children, className, onClick, ...props }: Record<string, unknown>,
        ref: React.Ref<HTMLDivElement>
      ) {
        return R.createElement('div', { ref, className, onClick, ...props }, children);
      }),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

vi.mock('next/image', () => ({
  default: ({
    alt = '',
    src = '',
    fill: _fill,
    priority: _priority,
    ...props
  }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={typeof alt === 'string' ? alt : ''} src={typeof src === 'string' ? src : ''} {...props} />
  ),
}));

describe('ProjectDetailModal', () => {
  const mockOnClose = vi.fn();

  const project = {
    title: 'Modal Enabled Project',
    image: 'modal-project.png',
    description: 'A project that validates the project details modal workflow.',
    repositoryURL: 'https://github.com/example/modal-project',
    liveURL: 'https://modal-project.example.com',
    processURL: 'https://docs.example.com/modal-project',
    detailURL: 'https://modal-project.example.com/details',
    tags: ['React', 'TypeScript', 'Vitest'],
    year: 2026,
    category: 'Web Platform',
    role: 'Full Stack Developer',
    status: 'completed' as const,
    impactMetrics: [{ label: 'Users', value: '10,000+' }],
    gallery: [{ image: 'gallery-shot.png', caption: 'Primary dashboard' }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when project is null', () => {
    render(<ProjectDetailModal open={true} onClose={mockOnClose} project={null} />);
    expect(screen.queryByText('Modal Enabled Project')).not.toBeInTheDocument();
  });

  it('renders project information when open', () => {
    render(<ProjectDetailModal open={true} onClose={mockOnClose} project={project} />);

    expect(screen.getByText('Modal Enabled Project')).toBeInTheDocument();
    expect(screen.getByText(/validates the project details modal workflow/i)).toBeInTheDocument();
    expect(screen.getByText('Impact Highlights')).toBeInTheDocument();
    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
  });

  it('prioritizes detailURL for the primary project action', () => {
    render(<ProjectDetailModal open={true} onClose={mockOnClose} project={project} />);

    const fullProjectLink = screen.getByRole('link', { name: /Open Full Project/i });
    expect(fullProjectLink).toHaveAttribute('href', 'https://modal-project.example.com/details');
  });

  it('calls onClose from modal close control', () => {
    render(<ProjectDetailModal open={true} onClose={mockOnClose} project={project} />);

    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
