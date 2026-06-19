import { describe, it, expect } from 'vitest';
import {
  findSocialLink,
  getCertificationImpactScore,
  buildFallbackResponse,
  buildPresetResponse,
  FALLBACK_NOTICE,
} from '@/app/api/chat/lib/fallbackResponder';
import type { ChatDataContext } from '@/app/api/chat/lib/types';

const mockData: ChatDataContext = {
  profile: {
    name: 'Keneth',
    title: 'Full Stack Engineer',
    email: 'keneth@test.com',
    location: 'Manila',
    github: 'https://github.com/test',
    linkedin: 'https://linkedin.com/in/test',
    highlights: { yearsExperience: 4 },
    education: [{
      degree: 'BS Computer Science',
      institution: 'University of Caloocan City',
      startedAt: '2022',
      endedAt: '2026',
      gpa: '1.40',
      honors: ['Cum Laude'],
    }],
  },
  experiences: [
    { position: 'Engineer', company: 'Acme', startedAt: '2024-01', endedAt: null, country: 'Manila', modality: 'Remote', type: 'Full-time', summary: 'Built stuff', technologies: ['React'], highlights: [], achievements: [], relatedProjects: [], images: [] },
    { position: 'Intern', company: 'Startup', startedAt: '2023-01', endedAt: '2023-06', country: 'Manila', modality: 'On-site', type: 'Internship', summary: 'Learned stuff', technologies: ['Python'], highlights: [], achievements: [], relatedProjects: [], images: [] },
  ],
  projects: [
    { title: 'Project A', image: '', imageAlt: '', description: 'Desc A', challenge: '', solution: '', result: '', year: 2024, category: 'Web', featured: true, role: 'Dev', technologies: ['React'], achievements: [], liveURL: 'https://a.com', repositoryURL: 'https://github.com/a', featuredRank: 1, status: 'completed', tier: 'featured', showcaseDetail: false, shortDescription: 'Short A', highlights: [], githubRepo: 'a', readTime: '', tags: [] },
    { title: 'Project B', image: '', imageAlt: '', description: 'Desc B', challenge: '', solution: '', result: '', year: 2023, category: 'AI', featured: false, role: 'Dev', technologies: ['Python'], achievements: [], liveURL: '', repositoryURL: '', featuredRank: 2, status: 'completed', tier: 'standard', showcaseDetail: false, shortDescription: 'Short B', highlights: [], githubRepo: 'b', readTime: '', tags: [] },
  ],
  technologies: [
    { name: 'React', category: 'Frontend', proficiency: 90, logo: '' },
    { name: 'TypeScript', category: 'Frontend', proficiency: 85, logo: '' },
    { name: 'Node.js', category: 'Backend', proficiency: 80, logo: '' },
    { name: 'Python', category: 'Backend', proficiency: 75, logo: '' },
    { name: 'MySQL', category: 'Databases', proficiency: 70, logo: '' },
  ],
  certifications: [
    { title: 'Software Engineer', issuer: 'HackerRank', issuedAt: '2024-01', tags: ['software engineering'] },
    { title: 'React (Intermediate)', issuer: 'HackerRank', issuedAt: '2024-02', tags: ['react'] },
  ],
  socials: [
    { name: 'github', link: 'https://github.com/test' },
    { name: 'linkedin', link: 'https://linkedin.com/in/test' },
  ],
};

describe('fallbackResponder', () => {
  describe('findSocialLink', () => {
    it('finds social by name', () => {
      expect(findSocialLink(mockData.socials, 'github')).toBe('https://github.com/test');
    });

    it('returns null for missing social', () => {
      expect(findSocialLink(mockData.socials, 'twitter')).toBeNull();
    });

    it('is case-insensitive', () => {
      expect(findSocialLink(mockData.socials, 'GitHub')).toBe('https://github.com/test');
    });
  });

  describe('getCertificationImpactScore', () => {
    it('scores software engineer higher', () => {
      const high = getCertificationImpactScore({ title: 'Software Engineer', issuer: 'HackerRank', tags: ['software engineering'] });
      const low = getCertificationImpactScore({ title: 'Basic Quiz', issuer: 'Unknown', tags: [] });
      expect(high).toBeGreaterThan(low);
    });

    it('adds issuer bonuses', () => {
      const hackerrank = getCertificationImpactScore({ title: 'Test', issuer: 'HackerRank', tags: [] });
      const unknown = getCertificationImpactScore({ title: 'Test', issuer: 'Unknown', tags: [] });
      expect(hackerrank).toBeGreaterThan(unknown);
    });
  });

  describe('buildFallbackResponse', () => {
    it('includes FALLBACK_NOTICE', () => {
      const response = buildFallbackResponse('hello', mockData);
      expect(response).toContain(FALLBACK_NOTICE);
    });

    it('responds to resume intent', () => {
      const response = buildFallbackResponse('show resume', mockData);
      expect(response).toContain('[ACTION:resume]');
    });

    it('responds to schedule intent', () => {
      const response = buildFallbackResponse('book a meeting', mockData);
      expect(response).toContain('[ACTION:booking]');
    });

    it('responds to contact intent', () => {
      const response = buildFallbackResponse('email please', mockData);
      expect(response).toContain('[ACTION:email]');
      expect(response).toContain('[ACTION:linkedin]');
    });

    it('responds to skills intent', () => {
      const response = buildFallbackResponse('what are your skills', mockData);
      expect(response).toContain('React');
      expect(response).toContain('[ACTION:projects]');
    });

    it('responds to project intent', () => {
      const response = buildFallbackResponse('show projects', mockData);
      expect(response).toContain('Project A');
      expect(response).toContain('[ACTION:experience]');
    });

    it('responds to experience intent', () => {
      const response = buildFallbackResponse('work experience', mockData);
      expect(response).toContain('Engineer at Acme');
    });

    it('responds to certification intent', () => {
      const response = buildFallbackResponse('certifications', mockData);
      expect(response).toContain('Software Engineer');
    });

    it('responds to education intent', () => {
      const response = buildFallbackResponse('education', mockData);
      expect(response).toContain('BS Computer Science');
      expect(response).toContain('Cum Laude');
    });

    it('responds to greeting', () => {
      const response = buildFallbackResponse('hello', mockData);
      expect(response).toContain('Keneth');
      expect(response).toContain('[ACTION:skills]');
    });

    it('provides default response for unknown intent', () => {
      const response = buildFallbackResponse('random question', mockData);
      expect(response).toContain('[ACTION:skills]');
      expect(response).toContain('[ACTION:projects]');
    });
  });

  describe('buildPresetResponse', () => {
    it('returns null for non-preset intent', () => {
      expect(buildPresetResponse('random question', mockData)).toBeNull();
    });

    it('returns response for preset intent', () => {
      const response = buildPresetResponse('show resume', mockData);
      expect(response).not.toBeNull();
      expect(response).toContain('[ACTION:resume]');
    });

    it('strips FALLBACK_NOTICE prefix', () => {
      const response = buildPresetResponse('show resume', mockData);
      expect(response).not.toContain(FALLBACK_NOTICE);
    });
  });
});
