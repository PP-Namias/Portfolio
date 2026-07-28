import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockImageResponse = vi.fn();

vi.mock('next/og', () => ({
  ImageResponse: class MockImageResponse {
    constructor(element: unknown, options: Record<string, unknown>) {
      mockImageResponse(element, options);
      this.headers = new Headers();
      this.status = 200;
    }
    headers: Headers;
    status: number;
  },
}));

const ORIGINAL_ENV = process.env;

import OpenGraphImage, { size as ogSize, contentType as ogContentType, runtime as ogRuntime } from '@/app/opengraph-image';
import TwitterImage, { size as twSize, contentType as twContentType, runtime as twRuntime } from '@/app/twitter-image';

describe('OG image routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...ORIGINAL_ENV };
    globalThis.fetch = vi.fn().mockResolvedValue({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    });
  });

  it('opengraph-image exports correct size and content type', () => {
    expect(ogSize).toEqual({ width: 1200, height: 630 });
    expect(ogContentType).toBe('image/png');
    expect(ogRuntime).toBe('edge');
  });

  it('opengraph-image creates ImageResponse with 1200x630 size', async () => {
    const result = await OpenGraphImage();
    expect(result).toBeDefined();
    expect(mockImageResponse).toHaveBeenCalledTimes(1);
    const [, options] = mockImageResponse.mock.calls[0];
    expect(options).toMatchObject({ width: 1200, height: 630 });
  });

  it('twitter-image exports correct size and content type', () => {
    expect(twSize).toEqual({ width: 1200, height: 630 });
    expect(twContentType).toBe('image/png');
    expect(twRuntime).toBe('edge');
  });

  it('twitter-image creates ImageResponse with 1200x630 size', async () => {
    const result = await TwitterImage();
    expect(result).toBeDefined();
    expect(mockImageResponse).toHaveBeenCalledTimes(1);
    const [, options] = mockImageResponse.mock.calls[0];
    expect(options).toMatchObject({ width: 1200, height: 630 });
  });
});
