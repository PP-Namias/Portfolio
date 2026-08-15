import { describe, it, expect } from 'vitest';
import { chunkAllCmsContent } from '@/lib/rag/chunker';
import type { CmsContent } from '@/lib/cms-content.shared';
import type { Profile, Project, Experience, Certification, BlogPost, Technology, Membership, Recommendation } from '@/types';

function mockCms(overrides?: Partial<CmsContent>): CmsContent {
  return {
    seoSettings: { siteTitle: 'Test', siteDescription: 'Test', canonicalUrl: 'https://test.com', ogImageUrl: '', twitterImageUrl: '', noindex: false, nofollow: false },
    profile: { name: 'Keneth', title: 'Engineer', email: 'keneth@test.com', location: 'Manila', github: '', linkedin: '', summary: 'Full stack engineer.', highlights: { yearsExperience: 5, projectsCompleted: 10, primaryTechnologies: ['React'] }, education: [{ degree: 'BS CS', institution: 'UCC', location: 'Caloocan', startedAt: '2022', endedAt: null, gpa: '1.40', honors: [], relevantCourses: [] }] } as Profile,
    siteSettings: { footer: { leadText: '', linkLabel: '', copyright: '', backToPortfolioLabel: '', contactPrompt: '' }, blog: { title: '', description: '', backLabel: '' } },
    hero: { roles: ['Engineer'], availabilityLabel: '', profileImageUrl: '' },
    about: { paragraphs: ['About text'] },
    experiences: [{ company: 'Test Co', position: 'Developer', summary: 'Built things.', country: 'PH', modality: 'Remote', type: 'Full-time', startedAt: '2024', endedAt: null, technologies: ['React'], highlights: [], achievements: ['Led team', 'Shipped product'], relatedProjects: [], images: [] }] as Experience[],
    projects: [{ title: 'Portfolio', description: 'My portfolio site', challenge: 'Build fast', solution: 'Used Next.js', result: 'Fast site', year: 2025, tags: ['React'], image: '', imageAlt: '', imageCaption: '', imageCredit: '', imageSource: '', imageLicense: '', featured: false, repositoryURL: null, liveURL: null, processURL: null, detailURL: null, previewVideoURL: null, category: '', role: '', impactMetrics: [], featuredRank: null, status: undefined, gallery: [], tier: 'standard', showcaseDetail: false, shortDescription: 'A portfolio', highlights: [], githubRepo: '', slug: 'portfolio' }] as Project[],
    certifications: [{ title: 'AWS Certified', issuer: 'Amazon', issuedAt: '2025', image: '', imageUrl: '', alt: '', caption: '', credit: '', source: '', license: '', tags: ['cloud'] }] as Certification[],
    galleryImages: [],
    memberships: [{ name: 'PSIA', url: 'https://psia.ph', joinedAt: '2025' }] as Membership[],
    recommendations: [{ quote: 'Great work!', name: 'John', title: 'Manager', company: 'Acme', featured: false, relationship: '', companyUrl: '', avatarUrl: '' }] as Recommendation[],
    socialLinks: [],
    technologies: [{ name: 'TypeScript', category: 'Language', proficiency: 90 }] as Technology[],
    techCategories: { Language: [{ name: 'TypeScript', logo: '', category: 'Language', proficiency: 90 }] },
    blogPosts: [{ id: 'post-1', slug: 'hello-world', title: 'Hello World', excerpt: 'First post', content: 'This is the body of my first blog post. It has multiple sentences. And another paragraph.', date: '2025-01-01', readTime: '5 min', tags: ['tech'], coverImage: '', featured: false, metaTitle: '', metaDescription: '' }] as BlogPost[],
    ...overrides,
  } as unknown as CmsContent;
}

describe('chunker', () => {
  it('chunks profile into at least 2 chunks (profile + education)', () => {
    const cms = mockCms();
    const chunks = chunkAllCmsContent(cms);
    const profileChunks = chunks.filter((c) => c.docType === 'profile');
    expect(profileChunks.length).toBeGreaterThanOrEqual(2);
    expect(profileChunks[0].text).toContain('Keneth');
    expect(profileChunks[1].text).toContain('BS CS');
  });

  it('chunks projects with separate fields', () => {
    const cms = mockCms();
    const chunks = chunkAllCmsContent(cms);
    const projectChunks = chunks.filter((c) => c.docType === 'project');
    expect(projectChunks.length).toBeGreaterThanOrEqual(4);
    expect(projectChunks.some((c) => c.metadata.field === 'summary')).toBe(true);
    expect(projectChunks.some((c) => c.metadata.field === 'challenge')).toBe(true);
    expect(projectChunks.some((c) => c.metadata.field === 'solution')).toBe(true);
    expect(projectChunks.some((c) => c.metadata.field === 'result')).toBe(true);
  });

  it('chunks experiences with achievements', () => {
    const cms = mockCms();
    const chunks = chunkAllCmsContent(cms);
    const expChunks = chunks.filter((c) => c.docType === 'experience');
    expect(expChunks.length).toBeGreaterThanOrEqual(2);
    expect(expChunks.some((c) => c.text.includes('Led team'))).toBe(true);
  });

  it('chunks certifications as single chunks', () => {
    const cms = mockCms();
    const chunks = chunkAllCmsContent(cms);
    const certChunks = chunks.filter((c) => c.docType === 'certification');
    expect(certChunks.length).toBe(1);
    expect(certChunks[0].text).toContain('AWS Certified');
  });

  it('chunks blog posts by paragraphs', () => {
    const cms = mockCms();
    const chunks = chunkAllCmsContent(cms);
    const postChunks = chunks.filter((c) => c.docType === 'post');
    expect(postChunks.length).toBeGreaterThanOrEqual(2);
    expect(postChunks.some((c) => c.metadata.field === 'excerpt')).toBe(true);
  });

  it('chunks technologies individually', () => {
    const cms = mockCms();
    const chunks = chunkAllCmsContent(cms);
    const techChunks = chunks.filter((c) => c.docType === 'technology');
    expect(techChunks.length).toBe(1);
    expect(techChunks[0].text).toContain('TypeScript');
  });

  it('chunks memberships and recommendations', () => {
    const cms = mockCms();
    const chunks = chunkAllCmsContent(cms);
    expect(chunks.some((c) => c.docType === 'membership')).toBe(true);
    expect(chunks.some((c) => c.docType === 'recommendation')).toBe(true);
  });

  it('skips projects with no fields', () => {
    const cms = mockCms({ projects: [{ title: 'Empty', description: '', challenge: '', solution: '', result: '', tags: [], slug: 'empty' }] as Project[] });
    const chunks = chunkAllCmsContent(cms);
    const projectChunks = chunks.filter((c) => c.docType === 'project');
    expect(projectChunks.length).toBe(0);
  });

  it('assigns unique docIds and chunkIndices', () => {
    const cms = mockCms();
    const chunks = chunkAllCmsContent(cms);
    const ids = chunks.map((c) => `${c.docId}:${c.chunkIndex}`);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
