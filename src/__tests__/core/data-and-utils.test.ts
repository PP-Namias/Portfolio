import { describe, it, expect } from 'vitest';
import { fallbackCmsContent } from '@/lib/cms-content.shared';
import { cn } from '@/lib/utils';
import { IS_BLOG_VISIBLE } from '@/lib/features';

describe('data module coverage', () => {
  it('exports expected top-level portfolio datasets', () => {
    expect(Array.isArray(fallbackCmsContent.blogPosts)).toBe(true);
    expect(Array.isArray(fallbackCmsContent.certifications)).toBe(true);
    expect(Array.isArray(fallbackCmsContent.experiences)).toBe(true);
    expect(Array.isArray(fallbackCmsContent.galleryImages)).toBe(true);
    expect(Array.isArray(fallbackCmsContent.memberships)).toBe(true);
    expect(Array.isArray(fallbackCmsContent.projects)).toBe(true);
    expect(Array.isArray(fallbackCmsContent.recommendations)).toBe(true);
    expect(Array.isArray(fallbackCmsContent.socialLinks)).toBe(true);
    expect(Array.isArray(fallbackCmsContent.technologies)).toBe(true);
  });

  it('exports profile with identity fields', () => {
    expect(fallbackCmsContent.profile).toBeTruthy();
    expect(typeof fallbackCmsContent.profile.name).toBe('string');
    expect(typeof fallbackCmsContent.profile.email).toBe('string');
    expect(typeof fallbackCmsContent.profile.location).toBe('string');
  });

  it('builds tech categories map from technologies', () => {
    expect(typeof fallbackCmsContent.techCategories).toBe('object');
    for (const tech of fallbackCmsContent.technologies) {
      expect(Array.isArray(fallbackCmsContent.techCategories[tech.category])).toBe(true);
      expect(fallbackCmsContent.techCategories[tech.category].some((item) => item.name === tech.name)).toBe(true);
    }
  });
});

describe('shared utilities and feature flags', () => {
  it('cn joins truthy class names', () => {
    expect(cn('a', undefined, 'b', null, false, 'c')).toBe('a b c');
  });

  it('cn returns empty string for all falsy inputs', () => {
    expect(cn(undefined, null, false, '')).toBe('');
  });

  it('exports blog visibility feature flag as boolean', () => {
    expect(typeof IS_BLOG_VISIBLE).toBe('boolean');
  });
});
