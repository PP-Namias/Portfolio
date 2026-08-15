import { logger } from '../lib/logger';
import {
  fetchAboutSection,
  fetchCertifications,
  fetchExperiences,
  fetchMemberships,
  fetchPosts,
  fetchProfile,
  fetchProjects,
  fetchRecommendations,
  fetchTechStack,
} from '../sanity/groq';
import {
  chunkAbout,
  chunkCertification,
  chunkExperience,
  chunkMembership,
  chunkPost,
  chunkProfile,
  chunkProject,
  chunkRecommendation,
  chunkTechStack,
} from './chunker';
import { dedupeChunks } from './dedup';
import type { Chunk, IngestionResult } from './types';

export async function prepareKnowledgeBase(): Promise<IngestionResult> {
  const [profile, about, techStack, experiences, projects, certifications, posts, memberships, recommendations] =
    await Promise.all([
      fetchProfile(),
      fetchAboutSection(),
      fetchTechStack(),
      fetchExperiences(),
      fetchProjects(),
      fetchCertifications(),
      fetchPosts(),
      fetchMemberships(),
      fetchRecommendations(),
    ]);

  const chunks: Chunk[] = [];
  let documents = 0;
  let skippedEmpty = 0;

  const append = (doc: unknown, built: Chunk[]): void => {
    if (doc === null || doc === undefined) {
      return;
    }
    documents++;
    if (built.length === 0) {
      skippedEmpty++;
      return;
    }
    chunks.push(...built);
  };

  append(profile, profile ? chunkProfile(profile) : []);
  append(about, about ? chunkAbout(about) : []);
  append(techStack, techStack ? chunkTechStack(techStack) : []);
  for (const doc of experiences) {
    append(doc, chunkExperience(doc));
  }
  for (const doc of projects) {
    append(doc, chunkProject(doc));
  }
  for (const doc of certifications) {
    append(doc, chunkCertification(doc));
  }
  for (const doc of posts) {
    append(doc, chunkPost(doc));
  }
  for (const doc of memberships) {
    append(doc, chunkMembership(doc));
  }
  for (const doc of recommendations) {
    append(doc, chunkRecommendation(doc));
  }

  const { chunks: unique, removed: deduplicated } = dedupeChunks(chunks);

  const byType: Record<string, number> = {};
  for (const chunk of unique) {
    byType[chunk.docType] = (byType[chunk.docType] ?? 0) + 1;
  }

  const stats = {
    documents,
    chunks: unique.length,
    skippedEmpty,
    deduplicated,
    byType,
    generatedAt: new Date().toISOString(),
  };

  logger.info({ stats }, 'knowledge base prepared');
  return { chunks: unique, stats };
}
