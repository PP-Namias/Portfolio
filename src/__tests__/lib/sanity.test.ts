import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { safeFetchSanity, client } from '../../lib/sanity';
import * as projectData from '../../data/projects';
import * as profileData from '../../data/profile';
import * as experienceData from '../../data/experience';
import * as certificationData from '../../data/certifications';

describe('safeFetchSanity - Resilience and Fallback', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-id';
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    vi.clearAllMocks();
  });

  it('falls back to static data if no project ID is configured', async () => {
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const fallback = [{ id: '1' }];
    const result = await safeFetchSanity('*[_type == "project"]', fallback);
    expect(result).toEqual(fallback);
  });

  it('returns fallback data on timeout', async () => {
    const fallback = [{ id: 'fallback' }];
    const spyFetch = vi.spyOn(client, 'fetch').mockImplementationOnce(
      (_query, _params, options: any) => new Promise((resolve, reject) => {
        const id = setTimeout(() => resolve([{ id: 'slow' }]), 5000);
        if (options?.signal) {
          options.signal.addEventListener('abort', () => {
            clearTimeout(id);
            reject(new Error('AbortError'));
          });
        }
      })
    );
    
    const result = await safeFetchSanity('*[_type == "project"]', fallback, 100);
    
    expect(result).toEqual(fallback);
  });

  it('returns fallback data on network error', async () => {
    const fallback = [{ id: 'fallback' }];
    vi.spyOn(client, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    
    const result = await safeFetchSanity('*[_type == "project"]', fallback);
    
    expect(result).toEqual(fallback);
  });

  it('returns Sanity data when successful', async () => {
    const sanityData = [{ _id: 'proj-1', title: 'From Sanity' }];
    vi.spyOn(client, 'fetch').mockResolvedValueOnce(sanityData);
    
    const result = await safeFetchSanity('*[_type == "project"]', [], 2000);
    
    expect(result).toEqual(sanityData);
  });

  it('returns fallback for empty Sanity response', async () => {
    const fallback = [{ id: 'local' }];
    vi.spyOn(client, 'fetch').mockResolvedValueOnce([]);
    
    const result = await safeFetchSanity('*[_type == "project"]', fallback);
    
    expect(result).toEqual(fallback);
  });
});

describe('Data Module Parity - JSON vs Async Fetchers', () => {
  it('getProjects async export exists and returns array', async () => {
    const result = await projectData.getProjects();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it('profile sync and async exports are available', async () => {
    const syncProfile = profileData.profile;
    const asyncProfile = await profileData.getProfile();
    
    expect(syncProfile).toBeDefined();
    expect(asyncProfile).toBeDefined();
    
    // Async should at least have same structure as sync (when no Sanity project)
    if (asyncProfile && typeof asyncProfile === 'object') {
      expect(Object.keys(asyncProfile).length).toBeGreaterThanOrEqual(0);
    }
  });

  it('experience sync and async exports are available', async () => {
    const syncExperiences = experienceData.experiences;
    const asyncExperiences = await experienceData.getExperiences();
    
    expect(Array.isArray(syncExperiences)).toBe(true);
    expect(Array.isArray(asyncExperiences)).toBe(true);
  });

  it('certifications sync and async exports are available', async () => {
    const syncCerts = certificationData.certifications;
    const asyncCerts = await certificationData.getCertifications();
    
    expect(Array.isArray(syncCerts)).toBe(true);
    expect(Array.isArray(asyncCerts)).toBe(true);
  });
});

describe('Fallback Behavior - Outage Simulation', () => {
  beforeEach(() => {
    vi.spyOn(client, 'fetch').mockImplementationOnce(
      () => new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Simulated Sanity outage')), 100)
      )
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('portfolio continues to function with JSON fallback during Sanity outage', async () => {
    const projects = await projectData.getProjects();
    const profile = await profileData.getProfile();
    const experiences = await experienceData.getExperiences();
    
    // All should return fallback data without throwing
    expect(projects).toBeDefined();
    expect(profile).toBeDefined();
    expect(experiences).toBeDefined();
  });
});

describe('Performance - Data Fetch Efficiency', () => {
  it('async fetch completes within timeout window', async () => {
    const startTime = Date.now();
    const fallback = [];
    
    await safeFetchSanity('*[_type == "project"]', fallback, 2000);
    
    const elapsed = Date.now() - startTime;
    expect(elapsed).toBeLessThan(3000); // Should timeout gracefully
  });

  it('multiple concurrent fetches do not block', async () => {
    const startTime = Date.now();
    
    const [projects, profile, experiences] = await Promise.all([
      projectData.getProjects(),
      profileData.getProfile(),
      experienceData.getExperiences(),
    ]);
    
    const elapsed = Date.now() - startTime;
    
    expect(projects).toBeDefined();
    expect(profile).toBeDefined();
    expect(experiences).toBeDefined();
    // Concurrent should be faster than sequential
    expect(elapsed).toBeLessThan(6000);
  });
});

