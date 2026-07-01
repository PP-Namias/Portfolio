import { describe, it, expect } from 'vitest'
import { markdownToPortableText } from '../../../scripts/lib/md-to-portable-text'

describe('markdownToPortableText', () => {
  it('converts simple paragraph', () => {
    const blocks = markdownToPortableText('Hello world')
    expect(blocks).toHaveLength(1)
    expect(blocks[0]._type).toBe('block')
    expect(blocks[0].style).toBe('normal')
    expect(blocks[0].children[0].text).toBe('Hello world')
  })

  it('converts h1 heading', () => {
    const blocks = markdownToPortableText('# Title')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].style).toBe('h1')
    expect(blocks[0].children[0].text).toBe('Title')
  })

  it('converts h2 heading', () => {
    const blocks = markdownToPortableText('## Section')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].style).toBe('h2')
  })

  it('converts h3 heading', () => {
    const blocks = markdownToPortableText('### Subsection')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].style).toBe('h3')
  })

  it('converts h4 heading', () => {
    const blocks = markdownToPortableText('#### Deep')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].style).toBe('h4')
  })

  it('converts bullet list', () => {
    const blocks = markdownToPortableText('- Item one\n- Item two')
    expect(blocks).toHaveLength(2)
    expect(blocks[0].listItem).toBe('bullet')
    expect(blocks[0].children[0].text).toBe('Item one')
  })

  it('converts numbered list', () => {
    const blocks = markdownToPortableText('1. First\n2. Second')
    expect(blocks).toHaveLength(2)
    expect(blocks[0].listItem).toBe('number')
    expect(blocks[0].children[0].text).toBe('First')
  })

  it('converts blockquote', () => {
    const blocks = markdownToPortableText('> Quote text')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].style).toBe('blockquote')
    expect(blocks[0].children[0].text).toBe('Quote text')
  })

  it('converts code block', () => {
    const blocks = markdownToPortableText('```js\nconst x = 1;\n```')
    expect(blocks).toHaveLength(1)
    expect(blocks[0].style).toBe('code')
    expect(blocks[0].children[0].text).toContain('const x = 1;')
  })

  it('skips empty lines', () => {
    const blocks = markdownToPortableText('Hello\n\n\nWorld')
    expect(blocks).toHaveLength(2)
  })

  it('handles code fences without creating malformed blocks', () => {
    const blocks = markdownToPortableText('```js\nconst x = 1;\n```')
    const nonCodeNormal = blocks.filter(
      (b) => b._type === 'block' && b.style === 'normal' && b.children?.[0]?.text?.includes('```')
    )
    expect(nonCodeNormal).toHaveLength(0)
  })

  it('converts multiple headings and paragraphs', () => {
    const md = '# Title\n\nParagraph one.\n\n## Section\n\nParagraph two.'
    const blocks = markdownToPortableText(md)
    expect(blocks.length).toBeGreaterThanOrEqual(4)
    expect(blocks[0].style).toBe('h1')
    expect(blocks[1].style).toBe('normal')
    expect(blocks[2].style).toBe('h2')
    expect(blocks[3].style).toBe('normal')
  })

  it('generates unique keys', () => {
    const blocks = markdownToPortableText('Line 1\nLine 2')
    expect(blocks[0]._key).not.toBe(blocks[1]._key)
  })
})
