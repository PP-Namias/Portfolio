import { cache } from 'react';
import { querySanity, CONTENT_TAGS } from '@/lib/cms-content.server';

const maybeCache = <T extends (...args: unknown[]) => Promise<AboutData>>(fn: T) => {
  return typeof cache === 'function' ? cache(fn) : fn;
};

function portableTextToParagraphs(blocks: unknown): string[] {
  if (!Array.isArray(blocks)) {
    return [];
  }

  return blocks
    .map((block) => {
      if (!block || typeof block !== 'object') {
        return '';
      }

      const candidate = block as {
        children?: Array<{ text?: string }>;
      };

      return candidate.children?.map((child) => child.text ?? '').join(' ').trim() ?? '';
    })
    .filter(Boolean);
}

export type AboutData = {
  paragraphs: string[];
};

async function fetchAboutDataImpl(): Promise<AboutData> {
  const aboutDoc = await querySanity<{
    aboutContent?: unknown;
    aboutParagraphs?: string[];
  }>(
    '*[_type == "aboutSection"][0]{aboutContent,aboutParagraphs}',
    { tags: CONTENT_TAGS.aboutSection }
  );

  const aboutParagraphsFromPortable = portableTextToParagraphs(aboutDoc?.aboutContent);
  const aboutParagraphsFromLegacy = (aboutDoc?.aboutParagraphs ?? [])
    .map((paragraph) => String(paragraph).trim())
    .filter(Boolean);

  let paragraphs: string[];
  if (aboutParagraphsFromPortable.length > 0) {
    paragraphs = aboutParagraphsFromPortable;
  } else if (aboutParagraphsFromLegacy.length > 0) {
    paragraphs = aboutParagraphsFromLegacy;
  } else {
    paragraphs = [];
  }

  return { paragraphs };
}

export const fetchAboutData = maybeCache(fetchAboutDataImpl);
