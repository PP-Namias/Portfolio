interface PtBlock {
  _type: 'block'
  _key: string
  style: string
  children: PtChild[]
  listItem?: string
  level?: number
  markDefs: PtMarkDef[]
}

interface PtChild {
  _type: 'span'
  _key: string
  text: string
  marks?: string[]
}

interface PtMarkDef {
  _key: string
  _type: 'link'
  href: string
}

let keyCounter = 0

function genKey(): string {
  keyCounter++
  return `k${keyCounter}`
}

function parseInlineMarks(text: string): { text: string; marks: string[]; markDefs: PtMarkDef[] } {
  const marks: string[] = []
  const markDefs: PtMarkDef[] = []
  let clean = text

  const boldItalic = /\*\*\*(.+?)\*\*\*/g
  clean = clean.replace(boldItalic, (_, m) => m)
  if (boldItalic.test(text)) {
    marks.push('strong', 'em')
  }

  const bold = /\*\*(.+?)\*\*/g
  const boldMatches = text.matchAll(bold)
  for (const match of boldMatches) {
    marks.push('strong')
    clean = clean.replace(match[0], match[1])
  }

  const italic = /\*(.+?)\*/g
  const italicMatches = clean.matchAll(italic)
  for (const match of italicMatches) {
    marks.push('em')
    clean = clean.replace(match[0], match[1])
  }

  const code = /`(.+?)`/g
  const codeMatches = clean.matchAll(code)
  for (const match of codeMatches) {
    marks.push('code')
    clean = clean.replace(match[0], match[1])
  }

  const strikethrough = /~~(.+?)~~/g
  const strikeMatches = clean.matchAll(strikethrough)
  for (const match of strikeMatches) {
    marks.push('strike-through')
    clean = clean.replace(match[0], match[1])
  }

  const link = /\[([^\]]+)\]\(([^)]+)\)/g
  const linkMatches = clean.matchAll(link)
  for (const match of linkMatches) {
    const key = genKey()
    marks.push(`link-${key}`)
    markDefs.push({ _key: key, _type: 'link', href: match[2] })
    clean = clean.replace(match[0], match[1])
  }

  return { text: clean, marks: [...new Set(marks)], markDefs }
}

function createBlock(
  style: string,
  text: string,
  opts?: { listItem?: string; level?: number }
): PtBlock {
  const { text: cleanText, marks, markDefs } = parseInlineMarks(text)
  return {
    _type: 'block',
    _key: genKey(),
    style,
    children: [
      {
        _type: 'span',
        _key: genKey(),
        text: cleanText,
        marks: marks.length > 0 ? marks : undefined,
      },
    ],
    listItem: opts?.listItem,
    level: opts?.level,
    markDefs,
  }
}

export function markdownToPortableText(md: string): PtBlock[] {
  const lines = md.split('\n')
  const blocks: PtBlock[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++
      blocks.push(createBlock('code', codeLines.join('\n')))
      continue
    }

    if (line.startsWith('> ')) {
      blocks.push(createBlock('blockquote', line.slice(2)))
      i++
      continue
    }

    const bulletMatch = line.match(/^(\s*)[-*]\s+(.+)/)
    if (bulletMatch) {
      const level = Math.floor(bulletMatch[1].length / 2) + 1
      blocks.push(createBlock('normal', bulletMatch[2], { listItem: 'bullet', level }))
      i++
      continue
    }

    const numberMatch = line.match(/^(\s*)\d+\.\s+(.+)/)
    if (numberMatch) {
      const level = Math.floor(numberMatch[1].length / 2) + 1
      blocks.push(createBlock('normal', numberMatch[2], { listItem: 'number', level }))
      i++
      continue
    }

    if (line.startsWith('#### ')) {
      blocks.push(createBlock('h4', line.slice(5)))
      i++
      continue
    }
    if (line.startsWith('### ')) {
      blocks.push(createBlock('h3', line.slice(4)))
      i++
      continue
    }
    if (line.startsWith('## ')) {
      blocks.push(createBlock('h2', line.slice(3)))
      i++
      continue
    }
    if (line.startsWith('# ')) {
      blocks.push(createBlock('h1', line.slice(2)))
      i++
      continue
    }

    if (line.startsWith('![')) {
      const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
      if (imgMatch) {
        blocks.push({
          _type: 'image',
          _key: genKey(),
          asset: { _ref: imgMatch[2] },
          alt: imgMatch[1],
        } as unknown as PtBlock)
      }
      i++
      continue
    }

    if (line.trim() === '') {
      i++
      continue
    }

    blocks.push(createBlock('normal', line))
    i++
  }

  return blocks
}
