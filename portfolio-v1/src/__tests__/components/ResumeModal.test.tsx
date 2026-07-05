import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import React from 'react'
import { SWRConfig } from 'swr'
import { ResumeModal } from '@/components/ui/ResumeModal'

const gatewayResumeUrl = '/api/media/sanity/encoded-resume?exp=1&sig=1'

vi.mock('framer-motion', () => {
  const R = require('react')
  return {
    motion: {
      div: R.forwardRef(function MockMotionDiv(
        { children, className, onClick, ...props }: Record<string, unknown>,
        ref: React.Ref<HTMLDivElement>
      ) {
        return R.createElement('div', { ref, className, onClick, ...props }, children)
      }),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  }
})

function renderWithFreshSWR(ui: React.ReactElement) {
  return render(<SWRConfig value={{ provider: () => new Map() }}>{ui}</SWRConfig>)
}

describe('ResumeModal', () => {
  const mockOnClose = vi.fn()
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })
    fetchMock.mockReset()
    globalThis.fetch = fetchMock as typeof fetch
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const mockResumeResponse = (resumeUrl = gatewayResumeUrl) => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ resumeUrl, isActive: true }),
    })
  }

  it('renders nothing when closed', () => {
    renderWithFreshSWR(<ResumeModal open={false} onClose={mockOnClose} />)
    expect(screen.queryByText('Resume')).not.toBeInTheDocument()
  })

  it('renders modal with Resume title when open', async () => {
    mockResumeResponse()
    act(() => {
      renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />)
    })
    await waitFor(() => {
      expect(screen.getByText('Resume')).toBeInTheDocument()
    })
  })

  it('renders Open PDF button with correct href', async () => {
    mockResumeResponse(gatewayResumeUrl)
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />)
    await waitFor(() => {
      const openLink = screen.getByText('Download Resume').closest('a')
      expect(openLink).toHaveAttribute('href', gatewayResumeUrl)
      expect(openLink).toHaveAttribute('target', '_blank')
      expect(openLink).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('hydrates the resume URL from the runtime endpoint', async () => {
    mockResumeResponse(gatewayResumeUrl)
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />)

    await waitFor(() => {
      const pdfIframe = screen.getByTitle('Resume PDF Viewer')
      expect(pdfIframe).toHaveAttribute('src', gatewayResumeUrl)
    })
    expect(fetchMock).toHaveBeenCalledWith('/api/resume')
  })

  it('shows loading state while fetching resume URL', () => {
    fetchMock.mockReturnValue(new Promise(() => {}))
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />)
    expect(screen.getByText('Loading resume...')).toBeInTheDocument()
  })

  it('shows no resume available when runtime lookup fails', async () => {
    fetchMock.mockRejectedValueOnce(new Error('offline'))
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />)

    await waitFor(() => {
      expect(screen.getByText('No resume available yet.')).toBeInTheDocument()
    })

    expect(screen.queryByTitle('Resume PDF Viewer')).not.toBeInTheDocument()
    expect(screen.queryByText('Download Resume')).not.toBeInTheDocument()
  })

  it('has a close button that calls onClose', async () => {
    mockResumeResponse(gatewayResumeUrl)
    act(() => {
      renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />)
    })
    await waitFor(() => {
      expect(screen.getByLabelText('Close')).toBeInTheDocument()
    })
    act(() => {
      fireEvent.click(screen.getByLabelText('Close'))
    })
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('shows iframe loading overlay while PDF loads', async () => {
    mockResumeResponse(gatewayResumeUrl)
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />)

    // After SWR loads but before iframe onLoad fires
    await waitFor(() => {
      expect(screen.getByText('Loading PDF...')).toBeInTheDocument()
    })
  })

  it('hides loading overlay when iframe onLoad fires', async () => {
    mockResumeResponse(gatewayResumeUrl)
    const { container } = renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />)

    await waitFor(() => {
      expect(screen.getByText('Loading PDF...')).toBeInTheDocument()
    })

    const iframe = screen.getByTitle('Resume PDF Viewer')
    fireEvent.load(iframe)

    expect(screen.queryByText('Loading PDF...')).not.toBeInTheDocument()
  })

  it('shows no resume available when SWR fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('network error'))
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />)

    await waitFor(() => {
      expect(screen.getByText('No resume available yet.')).toBeInTheDocument()
    })

    expect(screen.queryByText('Retry')).not.toBeInTheDocument()
    expect(screen.queryByText('Open in New Tab')).not.toBeInTheDocument()
  })

  it('shows error UI after timeout if iframe never loads', async () => {
    mockResumeResponse(gatewayResumeUrl)
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />)

    // Wait for SWR to finish
    await waitFor(() => {
      expect(screen.getByTitle('Resume PDF Viewer')).toBeInTheDocument()
    })

    // Advance past the 15s timeout
    await act(async () => {
      vi.advanceTimersByTime(15_000)
    })

    await waitFor(() => {
      expect(screen.getByText('Unable to display the resume inline.')).toBeInTheDocument()
    })
  })

  it('retry button resets states after timeout', async () => {
    mockResumeResponse(gatewayResumeUrl)
    renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />)

    await waitFor(() => {
      expect(screen.getByTitle('Resume PDF Viewer')).toBeInTheDocument()
    })

    // Advance past the 15s timeout (iframe never loads)
    await act(async () => {
      vi.advanceTimersByTime(15_000)
    })

    await waitFor(() => {
      expect(screen.getByText('Unable to display the resume inline.')).toBeInTheDocument()
    })

    // Now mock a successful response for retry
    mockResumeResponse(gatewayResumeUrl)

    await act(async () => {
      fireEvent.click(screen.getByText('Retry'))
    })

    // SWR re-fetches, iframe loading overlay appears
    await waitFor(() => {
      expect(screen.getByText('Loading PDF...')).toBeInTheDocument()
    })
    expect(screen.queryByText('Unable to display the resume inline.')).not.toBeInTheDocument()
  })

  it('resets state when modal reopens', async () => {
    fetchMock.mockRejectedValue(new Error('fail'))
    const { rerender } = renderWithFreshSWR(<ResumeModal open={true} onClose={mockOnClose} />)

    await waitFor(() => {
      expect(screen.getByText('No resume available yet.')).toBeInTheDocument()
    })

    // Close modal
    rerender(
      <SWRConfig value={{ provider: () => new Map() }}>
        <ResumeModal open={false} onClose={mockOnClose} />
      </SWRConfig>
    )

    // Mock successful fetch for reopen
    mockResumeResponse(gatewayResumeUrl)

    // Reopen modal
    rerender(
      <SWRConfig value={{ provider: () => new Map() }}>
        <ResumeModal open={true} onClose={mockOnClose} />
      </SWRConfig>
    )

    // Should show loading, not error
    await waitFor(() => {
      expect(screen.getByText('Loading resume...')).toBeInTheDocument()
    })
    expect(screen.queryByText('No resume available yet.')).not.toBeInTheDocument()
  })
})
