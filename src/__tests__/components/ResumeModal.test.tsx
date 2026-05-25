import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ResumeModal } from '@/components/ui/ResumeModal';

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

describe('ResumeModal', () => {
  const mockOnClose = vi.fn();

  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as typeof fetch;
  });

  const mockResumeResponse = (resumeUrl = '/sanity-resume.pdf') => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ resumeUrl, isActive: true }),
    });
  };

  it('renders nothing when closed', () => {
    render(<ResumeModal open={false} onClose={mockOnClose} />);
    expect(screen.queryByText('Resume')).not.toBeInTheDocument();
  });

  it('renders modal with Resume title when open', () => {
    render(<ResumeModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('renders download PDF button', () => {
    mockResumeResponse('/resume.pdf');
    render(<ResumeModal open={true} onClose={mockOnClose} />);
    const downloadLink = screen.getByText('Download PDF').closest('a');
    expect(downloadLink).toHaveAttribute('href', '/resume.pdf');
    expect(downloadLink).toHaveAttribute('download');
  });

  it('hydrates the resume URL from the runtime endpoint', async () => {
    mockResumeResponse('/sanity-resume.pdf');
    render(<ResumeModal open={true} onClose={mockOnClose} />);
    const pdfIframe = screen.getByTitle('Resume PDF Viewer');
    expect(pdfIframe).toBeInTheDocument();

    expect(await screen.findByText('Download PDF')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/resume', expect.any(Object));
    expect(pdfIframe).toHaveAttribute('src', '/sanity-resume.pdf#view=FitH');
  });

  it('has a fallback download link for unsupported browsers', () => {
    mockResumeResponse('/resume.pdf');
    render(<ResumeModal open={true} onClose={mockOnClose} />);
    const fallbackText = screen.getByText(/doesn't support embedded PDF/i);
    expect(fallbackText).toBeInTheDocument();

    const fallbackLink = screen.getByText('Download Resume').closest('a');
    expect(fallbackLink).toHaveAttribute('href', '/resume.pdf');
    expect(fallbackLink).toHaveAttribute('download');
  });

  it('has a close button that calls onClose', () => {
    mockResumeResponse('/resume.pdf');
    render(<ResumeModal open={true} onClose={mockOnClose} />);
    // The ResumeModal toolbar has its own close button
    const closeButtons = screen.getAllByLabelText('Close');
    fireEvent.click(closeButtons[0]);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
