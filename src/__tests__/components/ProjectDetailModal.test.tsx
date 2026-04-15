import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

vi.mock('framer-motion', () => {
  const R = require('react');

  return {
    motion: {
      div: R.forwardRef(function MotionDiv(
        { children, ...props }: Record<string, unknown>,
        ref: React.Ref<HTMLDivElement>
      ) {
        return R.createElement('div', { ref, ...props }, children);
      }),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

vi.mock('next/image', () => ({
  default: ({ alt = '', src = '', fill: _fill, priority: _priority, ...props }: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={typeof alt === 'string' ? alt : ''}
      src={typeof src === 'string' ? src : ''}
      {...props}
    />
  ),
}));

import { ProjectDetailModal } from '@/components/ui/ProjectDetailModal';

const sampleProject = {
  title: 'Sample Project',
  image: 'sample.png',
  description: 'A sample project description.',
  repositoryURL: 'https://github.com/example/sample',
  liveURL: 'https://example.com/sample',
  processURL: null,
  tags: ['React', 'TypeScript'],
  year: 2026,
  category: 'Web Platform',
  role: 'Frontend Engineer',
  status: 'completed' as const,
  impactMetrics: [{ label: 'Usage', value: '1000+ sessions' }],
  gallery: [{ image: 'sample.png', caption: 'Main interface' }],
};

describe('ProjectDetailModal', () => {
  it('renders content when open with a project', () => {
    render(<ProjectDetailModal open onClose={vi.fn()} project={sampleProject} />);

    expect(screen.getByRole('dialog', { name: 'Sample Project' })).toBeInTheDocument();
    expect(screen.getByText('A sample project description.')).toBeInTheDocument();
    expect(screen.getByText('Impact Highlights')).toBeInTheDocument();
    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<ProjectDetailModal open onClose={onClose} project={sampleProject} />);

    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key press', () => {
    const onClose = vi.fn();
    render(<ProjectDetailModal open onClose={onClose} project={sampleProject} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders nothing when project is null', () => {
    render(<ProjectDetailModal open onClose={vi.fn()} project={null} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
