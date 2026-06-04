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

// Helper to render with a fresh SWR cache. SWR's default provider
// is a module-level Map that persists across tests, so we wrap
// each render in SWRConfig with a per-test cache provider. This
// way 'keeps the local fallback' does not see the cached success
// from the previous 'hydrates the resume URL' test.
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
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('renders download PDF button', async () => {
    mockResumeResponse(gatewayResumeUrl);
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />);
    await waitFor(() => {
      const downloadLink = screen.getByText('Download PDF').closest('a');
      expect(downloadLink).toHaveAttribute('href', gatewayResumeUrl);
      expect(downloadLink).toHaveAttribute('download');
    });
  });

  it('hydrates the resume URL from the runtime endpoint', async () => {
    mockResumeResponse(gatewayResumeUrl);
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />);
    const pdfIframe = screen.getByTitle('Resume PDF Viewer');
    expect(pdfIframe).toBeInTheDocument();

    // Wait until the iframe src has been hydrated by the SWR
    // fetch. The text 'Download PDF' is present immediately
    // because the fallback URL is always rendered, so we cannot
    // use that as the wait condition.
    await waitFor(() => expect(pdfIframe).toHaveAttribute('src', `${gatewayResumeUrl}#view=FitH`));
    // The SWR fetcher calls fetch(url) with no second arg; SWR
    // owns the abort/retry lifecycle internally. The test
    // asserts only that the endpoint was hit, not the call shape.
    expect(fetchMock).toHaveBeenCalledWith('/api/resume');
  });

  it('has a fallback download link for unsupported browsers', async () => {
    mockResumeResponse(gatewayResumeUrl);
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />);
    const fallbackText = screen.getByText(/doesn't support embedded PDF/i);
    expect(fallbackText).toBeInTheDocument();

    await waitFor(() => {
      const fallbackLink = screen.getByText('Download Resume').closest('a');
      expect(fallbackLink).toHaveAttribute('href', gatewayResumeUrl);
      expect(fallbackLink).toHaveAttribute('download');
    });
  });

  it('keeps the local fallback resume when runtime lookup fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('offline'));

    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />);

    const fallbackLink = await screen.findByText('Download Resume');
    expect(fallbackLink.closest('a')).toHaveAttribute('href', fallbackResumeUrl);
  });

  it('has a close button that calls onClose', () => {
    mockResumeResponse(gatewayResumeUrl);
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />);
    // The ResumeModal toolbar has its own close button
    const closeButtons = screen.getAllByLabelText('Close');
    fireEvent.click(closeButtons[0]);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
