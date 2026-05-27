import { beforeEach, describe, expect, it } from 'vitest';
import {
  buildMediaGatewayUrl,
  decodeGatewayTarget,
  encodeGatewayTarget,
  isSanityCdnUrl,
} from '@/lib/media-gateway';

describe('media gateway helpers', () => {
  beforeEach(() => {
    delete process.env.SANITY_MEDIA_GATEWAY_SECRET;
  });

  it('encodes and decodes sanity asset targets safely', () => {
    const target = 'https://cdn.sanity.io/images/project/production/image-800x600.jpg?w=800';
    const encoded = encodeGatewayTarget(target);

    expect(decodeGatewayTarget(encoded)).toBe(target);
    expect(isSanityCdnUrl(target)).toBe(false);
    expect(isSanityCdnUrl('https://cdn.sanity.io/images/project/production/image-800x600.jpg')).toBe(true);
  });

  it('builds a same-origin gateway url for sanity assets', () => {
    process.env.SANITY_MEDIA_GATEWAY_SECRET = 'unit-test-media-secret';

    const url = buildMediaGatewayUrl('https://cdn.sanity.io/images/project/production/image-800x600.jpg', {
      width: 320,
      quality: 70,
      sign: true,
    });

    expect(url).toContain('/api/media/sanity/');
    expect(url).toContain('w=320');
    expect(url).toContain('q=70');
    expect(url).toContain('exp=');
    expect(url).toContain('sig=');
  });

  it('returns an empty string for unsupported remote urls', () => {
    expect(buildMediaGatewayUrl('https://example.com/image.jpg')).toBe('');
  });
});
