import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const PNG_PATH = join(process.cwd(), 'public', 'og-image.png');

function readPng() {
  return readFileSync(PNG_PATH);
}

describe('static OG image', () => {
  it('public/og-image.png exists and is a valid PNG', () => {
    const buf = readPng();
    const sig = buf.slice(0, 8).toString('hex');
    expect(sig).toBe('89504e470d0a1a0a');
  });

  it('public/og-image.png is exactly 1200x630', () => {
    const buf = readPng();
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    expect(width).toBe(1200);
    expect(height).toBe(630);
  });

  it('public/og-image.png exceeds the platform minimum sizes', () => {
    const buf = readPng();
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    expect(width).toBeGreaterThanOrEqual(600);
    expect(height).toBeGreaterThanOrEqual(315);
  });
});