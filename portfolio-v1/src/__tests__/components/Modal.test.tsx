import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Modal } from '@/components/ui/Modal';

// Mock framer-motion
vi.mock('framer-motion', () => {
  const R = require('react');
  return {
    motion: {
      div: R.forwardRef(function MockMotionDiv(
        { children, className, onClick, role, ...props }: Record<string, unknown>,
        ref: React.Ref<HTMLDivElement>
      ) {
        return R.createElement('div', { ref, className, onClick, role, ...props }, children);
      }),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe('Modal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';
  });

  it('renders nothing when closed', () => {
    render(
      <Modal open={false} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('renders children when open', () => {
    render(
      <Modal open={true} onClose={mockOnClose}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('renders title in header when provided', () => {
    render(
      <Modal open={true} onClose={mockOnClose} title="Test Title">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders close button in header when title is provided', () => {
    render(
      <Modal open={true} onClose={mockOnClose} title="Test Title">
        <p>Content</p>
      </Modal>
    );
    const closeBtn = screen.getByLabelText('Close modal');
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders floating close button when no title', () => {
    render(
      <Modal open={true} onClose={mockOnClose}>
        <p>Content</p>
      </Modal>
    );
    const closeBtn = screen.getByLabelText('Close modal');
    expect(closeBtn).toBeInTheDocument();
  });

  it('closes on Escape key press', () => {
    render(
      <Modal open={true} onClose={mockOnClose}>
        <p>Content</p>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll when open', () => {
    render(
      <Modal open={true} onClose={mockOnClose}>
        <p>Content</p>
      </Modal>
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    const { unmount } = render(
      <Modal open={true} onClose={mockOnClose}>
        <p>Content</p>
      </Modal>
    );
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('has dialog role with aria-modal', () => {
    render(
      <Modal open={true} onClose={mockOnClose} title="Test">
        <p>Content</p>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('applies fullScreen sizing classes', () => {
    render(
      <Modal open={true} onClose={mockOnClose} fullScreen>
        <p>Content</p>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('max-w-5xl');
    expect(dialog.className).toContain('max-h-[92vh]');
  });

  it('applies default sizing classes when not fullScreen', () => {
    render(
      <Modal open={true} onClose={mockOnClose}>
        <p>Content</p>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('max-w-2xl');
    expect(dialog.className).toContain('max-h-[85vh]');
  });

  it('closes when clicking the backdrop', () => {
    render(
      <Modal open={true} onClose={mockOnClose}>
        <p>Content</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    const backdropLayer = dialog.parentElement;
    expect(backdropLayer).toBeTruthy();

    fireEvent.click(backdropLayer as HTMLElement);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside the modal panel', () => {
    render(
      <Modal open={true} onClose={mockOnClose}>
        <p>Content</p>
      </Modal>
    );

    fireEvent.click(screen.getByRole('dialog'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('wraps focus from last to first on Tab', () => {
    render(
      <Modal open={true} onClose={mockOnClose} title="Focus Test">
        <button>First custom</button>
        <button>Last custom</button>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close modal');
    const lastCustom = screen.getByText('Last custom');

    lastCustom.focus();
    fireEvent.keyDown(document, { key: 'Tab' });

    expect(document.activeElement).toBe(closeButton);
  });

  it('wraps focus from first to last on Shift+Tab', () => {
    render(
      <Modal open={true} onClose={mockOnClose} title="Focus Test">
        <button>First custom</button>
        <button>Last custom</button>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close modal');
    const lastCustom = screen.getByText('Last custom');

    closeButton.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });

    expect(document.activeElement).toBe(lastCustom);
  });

  it('returns early from focus trap when no focusable elements are found', () => {
    render(
      <Modal open={true} onClose={mockOnClose}>
        <p>Content</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    const emptyList = document.querySelectorAll<HTMLElement>('.__no-focusables__');
    const spy = vi.spyOn(dialog, 'querySelectorAll').mockReturnValue(
      emptyList as unknown as NodeListOf<HTMLElement>
    );

    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByText('Content')).toBeInTheDocument();

    spy.mockRestore();
  });
});
