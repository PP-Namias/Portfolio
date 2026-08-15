import { describe, expect, it } from 'vitest';

import {
  chunkCertification,
  chunkExperience,
  chunkPost,
  chunkProfile,
  chunkProject,
  chunkTechStack,
  chunkText,
  estimateTokens,
  resolveUrlPath,
  splitSentences,
} from '../../src/ingest/chunker';
import type { CertificationDoc, ExperienceDoc, PostDoc, ProfileDoc, ProjectDoc, TechStackDoc } from '../../src/sanity/types';

describe('chunker utilities', () => {
  it('estimates tokens as ~4 chars per token', () => {
    expect(estimateTokens('abcdefgh')).toBe(2);
  });

  it('splits sentences on punctuation boundaries', () => {
    expect(splitSentences('First sentence. Second one! Third?')).toHaveLength(3);
  });

  it('chunks long text with overlap', () => {
    const text = Array.from({ length: 200 }, (_, i) => `Sentence ${i} with some content here.`).join(' ');
    const chunks = chunkText(text, { maxTokens: 64, overlapTokens: 16 });
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0]!.length).toBeLessThanOrEqual(64 * 4 + 80);
    const first = chunks[0]!;
    const second = chunks[1]!;
    expect(second.startsWith(first.slice(-40)) || first.split(' ').slice(-2).join(' ').length > 0).toBe(true);
  });

  it('returns single chunk for short text', () => {
    expect(chunkText('Short text here.')).toEqual(['Short text here.']);
  });

  it('resolves url paths per doc type', () => {
    expect(resolveUrlPath('project', 'my-slug')).toBe('/projects/my-slug');
    expect(resolveUrlPath('post', 'hello')).toBe('/blog/hello');
    expect(resolveUrlPath('experience')).toBe('/experience');
    expect(resolveUrlPath('profile')).toBe('/');
  });
});

function makeDoc(overrides: Partial<ProjectDoc> = {}): ProjectDoc {
  return {
    _id: 'proj-1',
    _updatedAt: '2026-01-01T00:00:00Z',
    title: 'Portfolio Site',
    slug: 'portfolio-site',
    summary: 'A personal portfolio.',
    challenge: 'Hard problem.',
    solution: 'Elegant solution.',
    result: 'Great results.',
    technologies: ['Next.js', 'TypeScript'],
    ...overrides,
  };
}

describe('chunk builders', () => {
  it('chunks projects with field labels and metadata', () => {
    const chunks = chunkProject(makeDoc());
    expect(chunks).toHaveLength(4);
    expect(chunks[0]!.text).toContain('Portfolio Site — Summary: A personal portfolio.');
    expect(chunks[0]!.docId).toBe('project:portfolio-site');
    expect(chunks[0]!.metadata.urlPath).toBe('/projects/portfolio-site');
    expect(chunks[0]!.metadata.tags).toEqual(['Next.js', 'TypeScript']);
    expect(chunks[0]!.metadata.updatedAt).toBe('2026-01-01T00:00:00Z');
  });

  it('skips empty project sections', () => {
    const chunks = chunkProject(makeDoc({ challenge: undefined, result: undefined }));
    expect(chunks.map((c) => c.metadata.field)).toEqual(['summary', 'solution']);
  });

  it('chunks profile into summary and education', () => {
    const profile: ProfileDoc = {
      _id: 'profile-1',
      _updatedAt: '2026-01-01T00:00:00Z',
      fullName: 'PP Namias',
      title: 'Full Stack Developer',
      summary: 'Builds AI-powered products.',
      education: [{ degree: 'BS Computer Science', institution: 'Some University' }],
    };
    const chunks = chunkProfile(profile);
    expect(chunks).toHaveLength(2);
    expect(chunks[0]!.text).toContain('Name: PP Namias');
    expect(chunks[1]!.text).toContain('Education: BS Computer Science');
    expect(chunks[1]!.metadata.field).toBe('education');
  });

  it('chunks experience with summary and achievements', () => {
    const experience: ExperienceDoc = {
      _id: 'exp-1',
      _updatedAt: '2026-01-01T00:00:00Z',
      role: 'Software Engineer',
      company: 'Acme',
      summary: 'Built features.',
      achievements: ['Shipped RAG pipeline', 'Cut latency 40%'],
      tags: ['TypeScript'],
    };
    const chunks = chunkExperience(experience);
    expect(chunks).toHaveLength(2);
    expect(chunks[0]!.text).toContain('Position: Software Engineer');
    expect(chunks[1]!.text).toContain('Achievements: Shipped RAG pipeline. Cut latency 40%');
    expect(chunks[0]!.metadata.category).toBe('Acme');
  });

  it('chunks certifications with issuer', () => {
    const certification: CertificationDoc = {
      _id: 'cert-1',
      _updatedAt: '2026-01-01T00:00:00Z',
      title: 'AWS Certified',
      issuer: 'Amazon',
      issuedAt: '2025-06-01',
      tags: ['Cloud'],
    };
    const chunks = chunkCertification(certification);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]!.text).toContain('Issuer: Amazon');
    expect(chunks[0]!.metadata.urlPath).toBe('/certifications');
  });

  it('chunks posts splitting long bodies', () => {
    const post: PostDoc = {
      _id: 'post-1',
      _updatedAt: '2026-01-01T00:00:00Z',
      title: 'On RAG',
      slug: 'on-rag',
      publishedAt: '2026-01-02T00:00:00Z',
      body: [
        { _type: 'block', style: 'h2', children: [{ text: 'Intro' }] },
        { _type: 'block', children: [{ text: Array.from({ length: 300 }, (_, i) => `Word ${i}`).join(' ') }] },
      ],
      excerpt: 'Short excerpt.',
      categories: ['AI'],
    };
    const chunks = chunkPost(post);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0]!.text).toContain('Intro');
    expect(chunks.some((c) => c.text.includes('Excerpt: Short excerpt.'))).toBe(true);
    expect(chunks[0]!.metadata.urlPath).toBe('/blog/on-rag');
    expect(chunks[0]!.metadata.category).toBe('AI');
  });

  it('chunks tech stack with proficiency', () => {
    const techStack: TechStackDoc = {
      _id: 'tech-1',
      _updatedAt: '2026-01-01T00:00:00Z',
      technologies: [{ name: 'TypeScript', category: 'Language', proficiency: 95 }],
    };
    const chunks = chunkTechStack(techStack);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]!.text).toContain('Proficiency: 95%');
    expect(chunks[0]!.docId).toBe('technology:TypeScript');
  });
});
