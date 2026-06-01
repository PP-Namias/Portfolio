export function parseDateLike(value: unknown): Date | null {
  if (typeof value !== 'string') {
    return null
  }
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }
  if (trimmed.toLowerCase() === 'present') {
    return null
  }
  const date = new Date(trimmed)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  return date
}

export function formatDuration(startDate: unknown, endDate: unknown, now = new Date()): string {
  const start = parseDateLike(startDate)
  if (!start) {
    return ''
  }
  const end = parseDateLike(endDate) || (endDate && String(endDate).toLowerCase() === 'present' ? null : parseDateLike(endDate)) || now

  let months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  if (end.getDate() < start.getDate()) {
    months -= 1
  }
  if (months < 0) {
    return ''
  }

  const years = Math.floor(months / 12)
  const rem = months % 12

  if (years === 0) {
    return `${rem} mo`
  }
  if (rem === 0) {
    return `${years} yr`
  }
  return `${years} yr ${rem} mo`
}

export function countPortableTextWords(blocks: unknown): number {
  if (!Array.isArray(blocks)) {
    return 0
  }
  let total = 0
  for (const block of blocks) {
    if (!block || typeof block !== 'object') {
      continue
    }
    const children = (block as {children?: unknown[]}).children
    if (!Array.isArray(children)) {
      continue
    }
    for (const child of children) {
      if (!child || typeof child !== 'object') {
        continue
      }
      const text = (child as {text?: unknown}).text
      if (typeof text === 'string' && text.trim()) {
        total += text.trim().split(/\s+/).length
      }
    }
  }
  return total
}

export function estimateReadingTime(blocks: unknown, wordsPerMinute = 220): string {
  const words = countPortableTextWords(blocks)
  if (words === 0) {
    return ''
  }
  const minutes = Math.max(1, Math.round(words / wordsPerMinute))
  return `${minutes} min read`
}
