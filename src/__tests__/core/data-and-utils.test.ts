import { describe, it, expect } from 'vitest';
import { blogPosts } from '@/data/blogPosts';
import { certifications } from '@/data/certifications';
import { experiences } from '@/data/experience';
import { galleryImages } from '@/data/gallery';
import { memberships } from '@/data/memberships';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { recommendations } from '@/data/recommendations';
import { socialLinks } from '@/data/socials';
import { technologies, techCategories } from '@/data/techStack';
import { cn } from '@/lib/utils';
import { IS_BLOG_VISIBLE } from '@/lib/features';

describe('data module coverage', () => {
  it('exports expected top-level portfolio datasets', () => {
    expect(Array.isArray(blogPosts)).toBe(true);
    expect(Array.isArray(certifications)).toBe(true);
    expect(Array.isArray(experiences)).toBe(true);
    expect(Array.isArray(galleryImages)).toBe(true);
    expect(Array.isArray(memberships)).toBe(true);
    expect(Array.isArray(projects)).toBe(true);
    expect(Array.isArray(recommendations)).toBe(true);
    expect(Array.isArray(socialLinks)).toBe(true);
    expect(Array.isArray(technologies)).toBe(true);
  });

  it('exports profile with identity fields', () => {
    expect(profile).toBeTruthy();
    expect(typeof profile.name).toBe('string');
    expect(typeof profile.email).toBe('string');
    expect(typeof profile.location).toBe('string');
  });

  it('builds tech categories map from technologies', () => {
    expect(typeof techCategories).toBe('object');
    expect(Object.keys(techCategories).length).toBeGreaterThan(0);

    for (const tech of technologies) {
      expect(techCategories[tech.category]).toBeDefined();
      expect(techCategories[tech.category].some((item) => item.name === tech.name)).toBe(true);
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
