import { describe, it, expect } from 'vitest';
import { fallbackCmsContent } from '@/lib/cms-content.shared';

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
});
