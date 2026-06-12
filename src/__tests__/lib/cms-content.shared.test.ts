import { describe, it, expect } from 'vitest';
import { fallbackCmsContent } from '@/lib/cms-content.shared';

describe('fallbackCmsContent', () => {
  it('has profile with required fields', () => {
    expect(fallbackCmsContent.profile).toBeDefined();
    expect(fallbackCmsContent.profile.fullName).toBe('Keneth Nolasco');
    expect(fallbackCmsContent.profile.title).toBe('Full Stack Engineer');
    expect(fallbackCmsContent.profile.email).toBe('keneth.nolasco.dev@gmail.com');
  });

  it('has highlights with numeric values', () => {
    expect(fallbackCmsContent.profile.highlights.yearsExperience).toBeTypeOf('number');
    expect(fallbackCmsContent.profile.highlights.yearsExperience).toBeGreaterThan(0);
    expect(fallbackCmsContent.profile.highlights.completedProjects).toBeTypeOf('number');
    expect(fallbackCmsContent.profile.highlights.completedProjects).toBeGreaterThan(0);
    expect(fallbackCmsContent.profile.highlights.techStack).toBeTypeOf('number');
    expect(fallbackCmsContent.profile.highlights.techStack).toBeGreaterThan(0);
  });

  it('has heroRoles array', () => {
    expect(fallbackCmsContent.profile.heroRoles).toBeInstanceOf(Array);
    expect(fallbackCmsContent.profile.heroRoles.length).toBeGreaterThan(0);
  });

  it('has education array', () => {
    expect(fallbackCmsContent.profile.education).toBeInstanceOf(Array);
    expect(fallbackCmsContent.profile.education.length).toBeGreaterThan(0);
  });

  it('has experiences array', () => {
    expect(fallbackCmsContent.experiences).toBeInstanceOf(Array);
    expect(fallbackCmsContent.experiences.length).toBeGreaterThan(0);
  });

  it('has projects array', () => {
    expect(fallbackCmsContent.projects).toBeInstanceOf(Array);
    expect(fallbackCmsContent.projects.length).toBeGreaterThan(0);
  });

  it('has technologies array', () => {
    expect(fallbackCmsContent.technologies).toBeInstanceOf(Array);
    expect(fallbackCmsContent.technologies.length).toBeGreaterThan(0);
  });

  it('has certifications array', () => {
    expect(fallbackCmsContent.certifications).toBeInstanceOf(Array);
    expect(fallbackCmsContent.certifications.length).toBeGreaterThan(0);
  });

  it('has socials array', () => {
    expect(fallbackCmsContent.socials).toBeInstanceOf(Array);
    expect(fallbackCmsContent.socials.length).toBeGreaterThan(0);
  });

  it('has aboutSection with blocks', () => {
    expect(fallbackCmsContent.aboutSection).toBeDefined();
    expect(fallbackCmsContent.aboutSection.blocks).toBeInstanceOf(Array);
    expect(fallbackCmsContent.aboutSection.blocks.length).toBeGreaterThan(0);
  });

  it('each project has required fields', () => {
    fallbackCmsContent.projects.forEach((p) => {
      expect(p.title).toBeDefined();
      expect(p.category).toBeDefined();
      expect(p.technologies).toBeInstanceOf(Array);
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
      expect(t.proficiency).toBeTypeOf('number');
      expect(t.proficiency).toBeGreaterThanOrEqual(0);
      expect(t.proficiency).toBeLessThanOrEqual(100);
    });
  });
});
