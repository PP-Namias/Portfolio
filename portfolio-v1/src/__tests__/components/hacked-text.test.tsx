import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { HackedText } from '@/components/ui/hacked-text'

describe('HackedText', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders with initial text', async () => {
    await act(async () => {
      render(<HackedText text="Hello" />)
    })
    expect(screen.getByLabelText('Hello')).toBeDefined()
  })

  it('sets aria-label to text', async () => {
    await act(async () => {
      render(<HackedText text="Hello" />)
    })
    expect(screen.getByLabelText('Hello')).toBeDefined()
  })

  it('sets data-value attribute', async () => {
    await act(async () => {
      render(<HackedText text="Hello" />)
    })
    expect(screen.getByLabelText('Hello')).toHaveAttribute('data-value', 'Hello')
  })

  it('applies custom className', async () => {
    await act(async () => {
      render(<HackedText text="Hello" className="custom-class" />)
    })
    const span = screen.getByLabelText('Hello')
    expect(span.className).toContain('custom-class')
  })

  it('runs hack animation on mouse over', async () => {
    await act(async () => {
      render(<HackedText text="AB" />)
    })
    const span = screen.getByLabelText('AB')

    await act(async () => {
      span.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    })

    await act(async () => {
      vi.advanceTimersByTime(100)
    })
    expect(span.textContent).toBeDefined()
  })

  it('restores final text after iteration completes', async () => {
    await act(async () => {
      render(<HackedText text="Hi" />)
    })
    const span = screen.getByLabelText('Hi')

    await act(async () => {
      span.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    })

    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    expect(span.textContent).toBe('Hi')
  })

  it('clears interval on unmount', async () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval')
    let unmount: () => void
    await act(async () => {
      ;({ unmount } = render(<HackedText text="Hi" />))
    })
    unmount!()
    expect(clearSpy).toHaveBeenCalled()
  })
})
