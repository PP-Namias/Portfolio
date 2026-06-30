import { describe, it, expect } from 'vitest';
import {
  fallbackCmsContent,
  fallbackBlogPosts,
  buildTechCategories,
  type CmsContent,
} from '@/lib/cms-content.shared';

describe('fallbackCmsContent', () => {
  it('has profile with required fields', () => {
    expect(fallbackCmsContent.profile).toBeDefined();
    expect(typeof fallbackCmsContent.profile.name).toBe('string');
    expect(typeof fallbackCmsContent.profile.title).toBe('string');
    expect(typeof fallbackCmsContent.profile.email).toBe('string');
  });

  it('has highlights with numeric values', () => {
    expect(fallbackCmsContent.profile.highlights).toBeDefined();
    expect(typeof fallbackCmsContent.profile.highlights.yearsExperience).toBe('number');
    expect(typeof fallbackCmsContent.profile.highlights.projectsCompleted).toBe('number');
  });

  it('has hero object', () => {
    expect(fallbackCmsContent.hero).toBeDefined();
    expect(fallbackCmsContent.hero.roles).toBeInstanceOf(Array);
    expect(typeof fallbackCmsContent.hero.availabilityLabel).toBe('string');
    expect(typeof fallbackCmsContent.hero.profileImageUrl).toBe('string');
  });

  it('has education array', () => {
    expect(fallbackCmsContent.profile.education).toBeInstanceOf(Array);
  });

  it('has experiences array', () => {
    expect(fallbackCmsContent.experiences).toBeInstanceOf(Array);
  });

  it('has projects array', () => {
    expect(fallbackCmsContent.projects).toBeInstanceOf(Array);
    expect(fallbackCmsContent.projects.length).toBeGreaterThan(0);
  });

  it('has technologies array', () => {
    expect(fallbackCmsContent.technologies).toBeInstanceOf(Array);
  });

  it('has certifications array', () => {
    expect(fallbackCmsContent.certifications).toBeInstanceOf(Array);
  });

  it('has socialLinks array', () => {
    expect(fallbackCmsContent.socialLinks).toBeInstanceOf(Array);
  });

  it('has about with paragraphs', () => {
    expect(fallbackCmsContent.about).toBeDefined();
    expect(fallbackCmsContent.about.paragraphs).toBeInstanceOf(Array);
    expect(fallbackCmsContent.about.paragraphs.length).toBeGreaterThan(0);
  });

  it('each project has required fields', () => {
    fallbackCmsContent.projects.forEach((p) => {
      expect(p.title).toBeDefined();
      expect(p.category).toBeDefined();
      expect(p.tags).toBeInstanceOf(Array);
    });
  });

  it('each experience has required fields', () => {
    fallbackCmsContent.experiences.forEach((e) => {
      expect(e.position).toBeDefined();
      expect(e.company).toBeDefined();
      expect(e.startedAt).toBeDefined();
      expect(e.technologies).toBeInstanceOf(Array);
    });
  });

  it('each technology has required fields', () => {
    fallbackCmsContent.technologies.forEach((t) => {
      expect(t.name).toBeDefined();
      expect(t.category).toBeDefined();
      expect(typeof t.proficiency).toBe('number');
      expect(t.proficiency).toBeGreaterThanOrEqual(0);
      expect(t.proficiency).toBeLessThanOrEqual(100);
    });
  });

  it('has seoSettings with required fields', () => {
    expect(fallbackCmsContent.seoSettings).toBeDefined();
    expect(typeof fallbackCmsContent.seoSettings.siteTitle).toBe('string');
    expect(typeof fallbackCmsContent.seoSettings.canonicalUrl).toBe('string');
    expect(typeof fallbackCmsContent.seoSettings.noindex).toBe('boolean');
    expect(typeof fallbackCmsContent.seoSettings.nofollow).toBe('boolean');
  });

  it('has siteSettings with footer and blog', () => {
    expect(fallbackCmsContent.siteSettings.footer).toBeDefined();
    expect(typeof fallbackCmsContent.siteSettings.footer.copyright).toBe('string');
    expect(fallbackCmsContent.siteSettings.blog).toBeDefined();
    expect(typeof fallbackCmsContent.siteSettings.blog.title).toBe('string');
  });

  it('has blogPosts array with fallback posts', () => {
    expect(fallbackCmsContent.blogPosts).toBeInstanceOf(Array);
    expect(fallbackCmsContent.blogPosts.length).toBe(2);
  });

  it('has galleryImages, memberships, recommendations arrays', () => {
    expect(fallbackCmsContent.galleryImages).toBeInstanceOf(Array);
    expect(fallbackCmsContent.memberships).toBeInstanceOf(Array);
    expect(fallbackCmsContent.recommendations).toBeInstanceOf(Array);
  });
});

describe('fallbackBlogPosts', () => {
  it('contains exactly 2 blog posts', () => {
    expect(fallbackBlogPosts).toHaveLength(2);
  });

  it('each post has required fields', () => {
    fallbackBlogPosts.forEach((post) => {
      expect(post.id).toBeDefined();
      expect(post.slug).toBeDefined();
      expect(post.title).toBeDefined();
      expect(post.excerpt).toBeDefined();
      expect(post.content).toBeDefined();
      expect(post.date).toBeDefined();
      expect(post.readTime).toBeDefined();
      expect(post.tags).toBeInstanceOf(Array);
      expect(post.coverImage).toBeDefined();
      expect(typeof post.featured).toBe('boolean');
    });
  });

  it('has distinct slugs', () => {
    const slugs = fallbackBlogPosts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('buildTechCategories', () => {
  it('groups technologies by category', () => {
    const techs = [
      { name: 'React', category: 'Frontend', proficiency: 90 },
      { name: 'Node.js', category: 'Backend', proficiency: 85 },
      { name: 'Vue', category: 'Frontend', proficiency: 70 },
    ] as CmsContent['technologies'];

    const result = buildTechCategories(techs);
    expect(Object.keys(result)).toEqual(['Frontend', 'Backend']);
    expect(result['Frontend']).toHaveLength(2);
    expect(result['Backend']).toHaveLength(1);
  });

  it('returns empty object for empty input', () => {
    const result = buildTechCategories([]);
    expect(result).toEqual({});
  });

  it('handles single category', () => {
    const techs = [
      { name: 'TypeScript', category: 'Language', proficiency: 95 },
      { name: 'JavaScript', category: 'Language', proficiency: 95 },
    ] as CmsContent['technologies'];

    const result = buildTechCategories(techs);
    expect(Object.keys(result)).toEqual(['Language']);
    expect(result['Language']).toHaveLength(2);
  });
});
