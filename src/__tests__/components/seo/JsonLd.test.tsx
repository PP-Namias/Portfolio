import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JsonLd } from '@/components/seo/JsonLd'

describe('JsonLd', () => {
  it('renders JSON-LD script tag with data', () => {
    const data = { '@type': 'WebPage', name: 'Test Page' }
    render(<JsonLd data={data} />)
    const script = document.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    expect(script?.innerHTML).toBe(JSON.stringify(data).replace(/"/g, '&quot;'))
  })

  it('returns null when data is null', () => {
    const { container } = render(<JsonLd data={null} />)
    expect(container.querySelector('script')).toBeNull()
  })

  it('returns null when data is undefined', () => {
    const { container } = render(<JsonLd data={undefined} />)
    expect(container.querySelector('script')).toBeNull()
  })

  it('sets id attribute when provided', () => {
    render(<JsonLd data={{ name: 'test' }} id="main-jsonld" />)
    const script = document.getElementById('main-jsonld')
    expect(script).not.toBeNull()
    expect(script?.getAttribute('type')).toBe('application/ld+json')
  })

  it('does not set id when not provided', () => {
    render(<JsonLd data={{ name: 'test' }} />)
    const script = document.querySelector('script[type="application/ld+json"]')
    expect(script?.getAttribute('id')).toBeNull()
  })

  it('serializes complex nested data', () => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'John',
      knows: [{ '@type': 'Person', name: 'Jane' }],
    }
    render(<JsonLd data={data} />)
    const script = document.querySelector('script[type="application/ld+json"]')
    expect(script?.innerHTML).toBe(JSON.stringify(data).replace(/"/g, '&quot;'))
  })
})
