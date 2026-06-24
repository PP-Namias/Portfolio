import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { SWRConfig } from 'swr';
import { ResumeModal } from '@/components/ui/ResumeModal';

const fallbackResumeUrl = '/resume.pdf';
const gatewayResumeUrl = '/api/media/sanity/encoded-resume?exp=1&sig=1';

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

// Helper to render with a fresh SWR cache
function renderWithFreshSWR(ui: React.ReactElement) {
  return render(<SWRConfig value={{ provider: () => new Map() }}>{ui}</SWRConfig>);
}

describe('ResumeModal', () => {
  const mockOnClose = vi.fn();
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as typeof fetch;
  });

  const mockResumeResponse = (resumeUrl = gatewayResumeUrl) => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ resumeUrl, isActive: true }),
    });
  };

  it('renders nothing when closed', () => {
    renderWithFreshSWR(<ResumeModal open={false} onClose={mockOnClose} />);
    expect(screen.queryByText('Resume')).not.toBeInTheDocument();
  });

  it('renders modal with Resume title when open', () => {
    mockResumeResponse();
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('renders Open PDF button with correct href', async () => {
    mockResumeResponse(gatewayResumeUrl);
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />);
    await waitFor(() => {
      const openLink = screen.getByText('Open PDF').closest('a');
      expect(openLink).toHaveAttribute('href', gatewayResumeUrl);
      expect(openLink).toHaveAttribute('target', '_blank');
      expect(openLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('hydrates the resume URL from the runtime endpoint', async () => {
    mockResumeResponse(gatewayResumeUrl);
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />);

    // Wait for SWR to finish loading and iframe to appear
    await waitFor(() => {
      const pdfIframe = screen.getByTitle('Resume PDF Viewer');
      expect(pdfIframe).toHaveAttribute('src', gatewayResumeUrl);
    });
    expect(fetchMock).toHaveBeenCalledWith('/api/resume');
  });

  it('shows loading state while fetching resume URL', () => {
    // Never resolve fetch so loading state persists
    fetchMock.mockReturnValue(new Promise(() => {}));
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText('Loading resume...')).toBeInTheDocument();
  });

  it('falls back to local resume when runtime lookup fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('offline'));

    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />);

    // SWR swallows the error, data stays undefined, resumeUrl falls to fallbackResumeUrl
    await waitFor(() => {
      const pdfIframe = screen.getByTitle('Resume PDF Viewer');
      expect(pdfIframe).toHaveAttribute('src', fallbackResumeUrl);
    });

    // The toolbar "Open PDF" button should also use the fallback URL
    const openLink = screen.getByText('Open PDF');
    expect(openLink.closest('a')).toHaveAttribute('href', fallbackResumeUrl);
  });

  it('has a close button that calls onClose', async () => {
    mockResumeResponse(gatewayResumeUrl);
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
