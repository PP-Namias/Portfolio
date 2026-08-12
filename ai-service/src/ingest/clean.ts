const CONTROL_CHARS = /\p{Cc}/gu;
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
const BLOCK_TAG_NAMES = new Set([
  'p',
  'div',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
  'ul',
  'ol',
  'blockquote',
  'br',
]);

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
  const text = decodeEntities(html);
  let out = '';
  let i = 0;
  while (i < text.length) {
    if (text[i] !== '<') {
      out += text[i];
      i += 1;
      continue;
    }
    const end = text.indexOf('>', i + 1);
    if (end === -1) {
      i += 1;
      continue;
    }
    const rawTag = text.slice(i + 1, end).trim();
    const tagName = ((rawTag.startsWith('/') ? rawTag.slice(1) : rawTag).split(/[\s/]/)[0] ?? '').toLowerCase();
    if (tagName === 'li' && !rawTag.startsWith('/')) {
      out += '- ';
    } else if (BLOCK_TAG_NAMES.has(tagName)) {
      out += '\n';
    }
    i = end + 1;
  }
  return out
    .replace(/\p{Cc}/gu, (ch) => (ch === '\t' || ch === '\n' || ch === '\r' ? ch : ' '))
    .replace(/\r\n?/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
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
