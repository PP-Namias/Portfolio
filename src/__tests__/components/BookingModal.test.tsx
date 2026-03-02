import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BookingModal } from '@/components/ui/BookingModal';

// Mock framer-motion
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

describe('BookingModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<BookingModal open={false} onClose={mockOnClose} />);
    expect(container.querySelector('iframe')).not.toBeInTheDocument();
  });

  it('renders the modal with title when open', () => {
    render(<BookingModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText('Schedule a Meeting')).toBeInTheDocument();
  });

  it('renders Cal.com iframe with correct embed URL', () => {
    render(<BookingModal open={true} onClose={mockOnClose} />);
    const iframe = screen.getByTitle(/Book a 15min meeting/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('cal.com/pp-namias/15min'));
    expect(iframe).toHaveAttribute('src', expect.stringContaining('embed=true'));
  });

  it('renders event type selector buttons', () => {
    render(<BookingModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText('15 min')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
  });

  it('switches event type when 30 min button is clicked', () => {
    render(<BookingModal open={true} onClose={mockOnClose} />);
    
    // Click 30 min button
    fireEvent.click(screen.getByText('30 min'));
    
    const iframe = screen.getByTitle(/Book a 30min meeting/i);
    expect(iframe).toHaveAttribute('src', expect.stringContaining('cal.com/pp-namias/30min'));
  });

  it('defaults to 15 min event type', () => {
    render(<BookingModal open={true} onClose={mockOnClose} />);
    const iframe = screen.getByTitle(/Book a 15min meeting/i);
    expect(iframe).toHaveAttribute('src', expect.stringContaining('/15min'));
  });

  it('has a link to open Cal.com externally', () => {
    render(<BookingModal open={true} onClose={mockOnClose} />);
    const externalLink = screen.getByText('Open in Cal.com').closest('a');
    expect(externalLink).toHaveAttribute('href', 'https://cal.com/pp-namias');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has a close button that calls onClose', () => {
    render(<BookingModal open={true} onClose={mockOnClose} />);
    // The BookingModal toolbar has its own close button
    const closeButtons = screen.getAllByLabelText('Close');
    fireEvent.click(closeButtons[0]);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('iframe has lazy loading attribute for performance', () => {
    render(<BookingModal open={true} onClose={mockOnClose} />);
    const iframe = screen.getByTitle(/Book a 15min meeting/i);
    expect(iframe).toHaveAttribute('loading', 'lazy');
  });

  it('iframe allows payment attribute for Cal.com checkout', () => {
    render(<BookingModal open={true} onClose={mockOnClose} />);
    const iframe = screen.getByTitle(/Book a 15min meeting/i);
    expect(iframe).toHaveAttribute('allow', 'payment');
  });
});
