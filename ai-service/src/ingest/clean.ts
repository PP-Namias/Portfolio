const CONTROL_CHARS = /\p{Cc}/gu;
const HTML_TAG = /<[^>]*>/g;
const ENTITY_RE = /&(?:nbsp|amp|lt|gt|quot|#39|apos);/gi;
const ENTITY_MAP: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
};

function decodeEntities(text: string): string {
  return text.replace(ENTITY_RE, (match) => ENTITY_MAP[match.toLowerCase()] ?? match);
}

export function normalizeWhitespace(text: string): string {
  return text
    .replace(CONTROL_CHARS, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stripHtml(html: string): string {
  return decodeEntities(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|ul|ol|blockquote)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(HTML_TAG, '')
    .replace(/<[^>]*/g, '')
    .replace(/[<>]/g, '')
    .trimEnd();
}

export function isLikelyHtml(text: string): boolean {
  return /<\/?[a-z][a-z0-9]*(\s[^>]*)?>/i.test(text);
}

export function portableTextToPlainText(blocks: unknown): string {
  if (!Array.isArray(blocks)) {
    return '';
  }

  const lines: string[] = [];
  for (const block of blocks) {
    if (!block || typeof block !== 'object') {
      continue;
    }

    const candidate = block as {
      _type?: string;
      style?: string;
      listItem?: string;
      children?: Array<{ text?: string }>;
    };

    if (candidate._type === 'image' || candidate._type === 'imageGallery') {
      continue;
    }

    const text = (candidate.children ?? [])
      .map((child) => child.text ?? '')
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text) {
      continue;
    }

    if (candidate.listItem) {
      lines.push(`- ${text}`);
    } else if (candidate.style === 'h1') {
      lines.push(`# ${text}`);
    } else if (candidate.style === 'h2') {
      lines.push(`## ${text}`);
    } else if (candidate.style === 'h3') {
      lines.push(`### ${text}`);
    } else {
      lines.push(text);
    }
  }

  return lines.join('\n').trim();
}

export function cleanText(raw: string): string {
  const source = isLikelyHtml(raw) ? stripHtml(raw) : raw;
  return normalizeWhitespace(source);
}
