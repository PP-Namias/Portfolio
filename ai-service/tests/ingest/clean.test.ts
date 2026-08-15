import { describe, expect, it } from 'vitest';

import { cleanText, isLikelyHtml, normalizeWhitespace, portableTextToPlainText, stripHtml } from '../../src/ingest/clean';

describe('clean', () => {
  it('normalizes whitespace and strips control characters', () => {
    expect(normalizeWhitespace('  hello\u0000\u0007  world  \n  !  ')).toBe('hello world !');
  });

  it('strips html tags and decodes entities', () => {
    expect(stripHtml('<p>Hello &amp; <strong>world</strong></p>')).toBe('Hello & world');
    expect(stripHtml('<ul><li>One</li><li>Two</li></ul>')).toBe('- One\n- Two');
  });

  it('detects html input', () => {
    expect(isLikelyHtml('<p>text</p>')).toBe(true);
    expect(isLikelyHtml('plain text')).toBe(false);
  });

  it('converts portable text blocks to plain text with heading markers', () => {
    const blocks = [
      { _type: 'block', style: 'h2', children: [{ text: 'About' }] },
      { _type: 'block', style: 'normal', children: [{ text: 'Hello ' }, { text: 'world' }] },
      { _type: 'block', listItem: 'bullet', children: [{ text: 'Item' }] },
      { _type: 'image', asset: { _ref: 'img-1' } },
    ];
    expect(portableTextToPlainText(blocks)).toBe('## About\nHello world\n- Item');
  });

  it('returns empty string for non-array portable text', () => {
    expect(portableTextToPlainText(null)).toBe('');
  });

  it('cleanText handles html and plain input', () => {
    expect(cleanText('<p>  Spaced\n\n content </p>')).toBe('Spaced content');
    expect(cleanText('  plain   text  ')).toBe('plain text');
  });
});
