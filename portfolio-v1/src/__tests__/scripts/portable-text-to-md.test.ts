import { describe, it, expect } from 'vitest'
import { portableTextToMarkdown } from '../../../scripts/lib/portable-text-to-md'

describe('portableTextToMarkdown', () => {
  it('returns empty string for non-array input', () => {
    expect(portableTextToMarkdown(null)).toBe('')
    expect(portableTextToMarkdown(undefined)).toBe('')
    expect(portableTextToMarkdown('string')).toBe('')
  })

  it('converts simple paragraph', () => {
    const blocks = [
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Hello world' }] },
    ]
    expect(portableTextToMarkdown(blocks)).toBe('Hello world')
  })

  it('converts h1 heading', () => {
    const blocks = [{ _type: 'block', style: 'h1', children: [{ _type: 'span', text: 'Title' }] }]
    expect(portableTextToMarkdown(blocks)).toBe('# Title')
  })

  it('converts h2 heading', () => {
    const blocks = [{ _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Section' }] }]
    expect(portableTextToMarkdown(blocks)).toBe('## Section')
  })

  it('converts h3 heading', () => {
    const blocks = [
      { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Subsection' }] },
    ]
    expect(portableTextToMarkdown(blocks)).toBe('### Subsection')
  })

  it('converts multiple blocks', () => {
    const blocks = [
      { _type: 'block', style: 'h1', children: [{ _type: 'span', text: 'Title' }] },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Body text' }] },
    ]
    const md = portableTextToMarkdown(blocks)
    expect(md).toContain('# Title')
    expect(md).toContain('Body text')
  })

  it('skips empty blocks', () => {
    const blocks = [
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: '' }] },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Content' }] },
    ]
    expect(portableTextToMarkdown(blocks)).toBe('Content')
  })

  it('handles image blocks and non-block objects', () => {
    const blocks = [
      null,
      { _type: 'image', asset: { _ref: 'img-1' } },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Real content' }] },
    ]
    const md = portableTextToMarkdown(blocks)
    expect(md).toContain('Real content')
  })

  it('handles blocks without children', () => {
    const blocks = [{ _type: 'block', style: 'normal' }]
    expect(portableTextToMarkdown(blocks)).toBe('')
  })

  it('handles multiple children in one block', () => {
    const blocks = [
      {
        _type: 'block',
        style: 'normal',
        children: [
          { _type: 'span', text: 'Hello ' },
          { _type: 'span', text: 'world' },
        ],
      },
    ]
    expect(portableTextToMarkdown(blocks)).toBe('Hello world')
  })
})
