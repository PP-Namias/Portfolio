import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { onError, ...rest } = props
    return (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      <img
        data-testid="next-image"
        {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
        onError={onError as React.EventHandler<React.SyntheticEvent>}
      />
    )
  },
}))

describe('OptimizedImage', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders next/image with src', async () => {
    const { default: OptimizedImage } = await import('@/components/ui/OptimizedImage')
    render(<OptimizedImage src="/test.jpg" alt="test image" width={100} height={100} />)
    const img = screen.getByTestId('next-image')
    expect(img).not.toBeNull()
    expect(img.getAttribute('alt')).toBe('test image')
  })

  it('sets quality to 85 by default', async () => {
    const { default: OptimizedImage } = await import('@/components/ui/OptimizedImage')
    render(<OptimizedImage src="/test.jpg" alt="test" width={100} height={100} />)
    const img = screen.getByTestId('next-image')
    expect(img.getAttribute('quality')).toBe('85')
  })

  it('allows quality override', async () => {
    const { default: OptimizedImage } = await import('@/components/ui/OptimizedImage')
    render(<OptimizedImage src="/test.jpg" alt="test" width={100} height={100} quality={50} />)
    const img = screen.getByTestId('next-image')
    expect(img.getAttribute('quality')).toBe('50')
  })

  it('shows placeholder on error for non-sanity URL', async () => {
    const { default: OptimizedImage } = await import('@/components/ui/OptimizedImage')
    render(<OptimizedImage src="/broken.jpg" alt="broken" width={100} height={100} />)
    const img = screen.getByTestId('next-image')
    fireEvent.error(img)
    expect(screen.getByLabelText('broken')).not.toBeNull()
  })

  it('shows placeholder with default alt on error', async () => {
    const { default: OptimizedImage } = await import('@/components/ui/OptimizedImage')
    render(<OptimizedImage src="/broken.jpg" width={100} height={100} />)
    const img = screen.getByTestId('next-image')
    fireEvent.error(img)
    expect(screen.getByLabelText('Image placeholder')).not.toBeNull()
  })
})
