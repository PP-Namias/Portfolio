interface PtBlock {
  _type: string
  style?: string
  _key?: string
  children?: PtChild[]
  listItem?: string
  level?: number
  markDefs?: PtMarkDef[]
}

interface PtChild {
  _type: string
  _key?: string
  text?: string
  marks?: string[]
}

interface PtMarkDef {
  _key: string
  _type: string
  href?: string
}

function escapeMarkdown(text: string): string {
  return text.replace(/([*_`~\\])/g, '\\$1')
}

function renderInlineMarks(
  text: string,
  marks: string[] | undefined,
  markDefs: PtMarkDef[]
): string {
  if (!marks || marks.length === 0) return text

  let result = text
  for (const mark of marks) {
    if (mark === 'strong') result = `**${result}**`
    else if (mark === 'em') result = `*${result}*`
    else if (mark === 'code') result = `\`${result}\``
    else if (mark === 'underline') result = `<u>${result}</u>`
    else if (mark === 'strike-through') result = `~~${result}~~`
    else if (mark.startsWith('link-')) {
      const def = markDefs.find((d) => d._key === mark)
      if (def?.href) result = `[${result}](${def.href})`
    }
  }
  return result
}

function renderChildren(children: PtChild[] | undefined, markDefs: PtMarkDef[]): string {
  if (!children) return ''
  return children
    .map((child) => {
      if (child._type === 'span') {
        return renderInlineMarks(escapeMarkdown(child.text ?? ''), child.marks, markDefs)
      }
      return ''
    })
    .join('')
}

export function portableTextToMarkdown(blocks: unknown): string {
  if (!Array.isArray(blocks)) return ''

  const lines: string[] = []
  let listType: string | null = null

  for (const block of blocks) {
    if (!block || typeof block !== 'object') continue

    const b = block as PtBlock
    const markDefs = b.markDefs ?? []

    if (b._type === 'block') {
      const text = renderChildren(b.children, markDefs)

      if (!text && !b.listItem) continue

      if (b.listItem) {
        const indent = b.level ? '  '.repeat(b.level - 1) : ''
        const bullet = b.listItem === 'number' ? '1.' : '-'
        lines.push(`${indent}${bullet} ${text}`)
        listType = b.listItem
        continue
      }

      if (listType) {
        lines.push('')
        listType = null
      }

      if (b.style === 'h1') lines.push(`# ${text}`)
      else if (b.style === 'h2') lines.push(`## ${text}`)
      else if (b.style === 'h3') lines.push(`### ${text}`)
      else if (b.style === 'h4') lines.push(`#### ${text}`)
      else if (b.style === 'blockquote') lines.push(`> ${text}`)
      else lines.push(text)

      lines.push('')
    } else if (b._type === 'image') {
      const alt = (b as unknown as { alt?: string }).alt || ''
      const src = (b as unknown as { asset?: { _ref?: string } }).asset?._ref || ''
      if (src) lines.push(`![${alt}](${src})`)
      lines.push('')
    }
  }

  return lines.join('\n').trim()
}
