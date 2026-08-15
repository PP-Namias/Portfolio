import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

vi.mock('lenis/react', () => ({
  ReactLenis: ({ children, root, options, className }: any) => (
    <div
      data-testid="react-lenis"
      data-root={root}
      data-options={JSON.stringify(options)}
      className={className}
    >
      {children}
    </div>
  ),
}))

import { LenisProvider } from '@/components/ui/LenisProvider'
import { LenisInner } from '@/components/ui/LenisInner'

describe('LenisProvider', () => {
  it('renders children', () => {
    render(
      <LenisProvider>
        <div data-testid="child">Hello</div>
      </LenisProvider>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})

describe('LenisInner', () => {
  it('wraps children in ReactLenis with root and correct options', () => {
    render(
      <LenisInner>
        <div data-testid="child">Content</div>
      </LenisInner>
    )
    const lenis = screen.getByTestId('react-lenis')
    expect(lenis).toBeInTheDocument()
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('passes root=true to ReactLenis', () => {
    render(
      <LenisInner>
        <span>test</span>
      </LenisInner>
    )
    expect(screen.getByTestId('react-lenis')).toHaveAttribute('data-root', 'true')
  })

  it('passes smooth wheel options', () => {
    render(
      <LenisInner>
        <span>test</span>
      </LenisInner>
    )
    const options = JSON.parse(
      screen.getByTestId('react-lenis').getAttribute('data-options') || '{}'
    )
    expect(options.smoothWheel).toBe(true)
    expect(options.lerp).toBe(0.12)
    expect(options.duration).toBe(1.2)
  })
})
