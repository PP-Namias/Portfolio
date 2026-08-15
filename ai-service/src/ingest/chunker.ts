import { cleanText, portableTextToPlainText } from './clean';
import type { Chunk, ChunkMetadata, DocType } from './types';
import type {
  AboutSectionDoc,
  CertificationDoc,
  ExperienceDoc,
  MembershipDoc,
  PostDoc,
  ProfileDoc,
  ProjectDoc,
  RecommendationDoc,
  TechStackDoc,
} from '../sanity/types';

const DEFAULT_MAX_TOKENS = 512;
const DEFAULT_OVERLAP_TOKENS = 64;

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function chunkText(
  text: string,
  options: { maxTokens?: number; overlapTokens?: number } = {},
): string[] {
  const maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;
  const overlapTokens = options.overlapTokens ?? DEFAULT_OVERLAP_TOKENS;
  const sentences = splitSentences(text);
  const chunks: string[] = [];
  let current = '';
  let currentTokens = 0;

  const buildOverlap = (source: string): string => {
    const parts = splitSentences(source);
    const overlap: string[] = [];
    let tokens = 0;
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i]!;
      const partTokens = estimateTokens(part);
      if (tokens + partTokens > overlapTokens && overlap.length > 0) {
        break;
      }
      overlap.unshift(part);
      tokens += partTokens;
    }
    return overlap.join(' ');
  };

  for (const sentence of sentences) {
    const sentenceTokens = estimateTokens(sentence);

    if (currentTokens + sentenceTokens > maxTokens && current) {
      chunks.push(current.trim());
      const overlap = buildOverlap(current);
      current = overlap;
      currentTokens = estimateTokens(overlap);
    }

    current += (current ? ' ' : '') + sentence;
    currentTokens += sentenceTokens;
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

export function resolveUrlPath(docType: DocType, slug?: string): string {
  switch (docType) {
    case 'project':
      return slug ? `/projects/${slug}` : '/projects';
    case 'post':
      return slug ? `/blog/${slug}` : '/blog';
    case 'certification':
      return '/certifications';
    case 'experience':
      return '/experience';
    case 'technology':
      return '/skills';
    case 'membership':
      return '/about';
    default:
      return '/';
  }
}

function buildChunk(
  docId: string,
  docType: DocType,
  chunkIndex: number,
  text: string,
  metadata: ChunkMetadata,
): Chunk {
  const cleaned = cleanText(text);
  return {
    docId,
    docType,
    chunkIndex,
    text: cleaned,
    metadata,
  };
}

export function chunkProfile(doc: ProfileDoc): Chunk[] {
  const chunks: Chunk[] = [];
  const updatedAt = doc._updatedAt;
  const base: ChunkMetadata = { title: doc.fullName, urlPath: '/', updatedAt };

  const parts: string[] = [
    doc.fullName && `Name: ${doc.fullName}`,
    doc.title && `Title: ${doc.title}`,
    doc.summary && `Summary: ${doc.summary}`,
    doc.email && `Email: ${doc.email}`,
    doc.phone && `Phone: ${doc.phone}`,
    doc.location && `Location: ${doc.location}`,
    doc.github && `GitHub: ${doc.github}`,
    doc.linkedin && `LinkedIn: ${doc.linkedin}`,
    doc.availabilityLabel && `Availability: ${doc.availabilityLabel}`,
    doc.highlights?.yearsExperience !== undefined &&
      `Years of Experience: ${doc.highlights.yearsExperience}`,
    doc.highlights?.projectsCompleted !== undefined &&
      `Projects Completed: ${doc.highlights.projectsCompleted}`,
    doc.highlights?.primaryTechnologies?.length &&
      `Primary Technologies: ${doc.highlights.primaryTechnologies.join(', ')}`,
  ].filter((part): part is string => typeof part === 'string');

  const profileText = parts.join('. ');
  if (profileText) {
    chunks.push(buildChunk('profile:main', 'profile', 0, profileText, base));
  }

  const education = doc.education?.[0];
  if (education) {
    const eduParts: Array<string | false> = [
      `Education: ${education.degree}`,
      education.institution && `Institution: ${education.institution}`,
      education.location && `Location: ${education.location}`,
      education.startedAt && `Started: ${education.startedAt}`,
      education.endedAt && `Ended: ${education.endedAt}`,
      education.gpa && `GWA: ${education.gpa}`,
      education.honors?.length && `Honors: ${education.honors.join(', ')}`,
      education.relevantCourses?.length && `Relevant Courses: ${education.relevantCourses.join(', ')}`,
    ].filter((part): part is string => typeof part === 'string');

    chunks.push(
      buildChunk('profile:main', 'profile', 1, eduParts.join('. '), {
        ...base,
        field: 'education',
      }),
    );
  }

  return chunks;
}

export function chunkAbout(doc: AboutSectionDoc): Chunk[] {
  const chunks: Chunk[] = [];
  const updatedAt = doc._updatedAt;
  const base: ChunkMetadata = { title: 'About', urlPath: '/', updatedAt };

  const portable = doc.aboutContent ? portableTextToPlainText(doc.aboutContent) : '';
  const paragraphs = [...(doc.aboutParagraphs ?? []), ...(portable ? portable.split(/\n{2,}/) : [])]
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  paragraphs.forEach((paragraph, index) => {
    chunks.push(buildChunk('about:main', 'about', index, paragraph, { ...base, field: 'about' }));
  });

  return chunks;
}

export function chunkTechStack(doc: TechStackDoc): Chunk[] {
  const chunks: Chunk[] = [];
  const updatedAt = doc._updatedAt;

  for (const technology of doc.technologies ?? []) {
    if (!technology.name) {
      continue;
    }
    chunks.push(
      buildChunk(
        `technology:${technology.name}`,
        'technology',
        0,
        `Technology: ${technology.name}. Category: ${technology.category || 'General'}. Proficiency: ${technology.proficiency ?? 0}%.`,
        {
          title: technology.name,
          category: technology.category,
          urlPath: '/skills',
          updatedAt,
        },
      ),
    );
  }

  return chunks;
}

export function chunkExperience(doc: ExperienceDoc): Chunk[] {
  const chunks: Chunk[] = [];
  const updatedAt = doc._updatedAt;
  const title = `${doc.role ?? 'Role'} at ${doc.company ?? 'Unknown'}`;
  const base: ChunkMetadata = {
    title,
    category: doc.company,
    urlPath: resolveUrlPath('experience'),
    updatedAt,
    tags: doc.tags,
  };

  const summaryParts: Array<string | false> = [
    doc.role && `Position: ${doc.role}`,
    doc.company && `Company: ${doc.company}`,
    doc.summary,
    doc.employmentType && `Type: ${doc.employmentType}`,
    doc.workModel && `Work Model: ${doc.workModel}`,
    doc.location && `Location: ${doc.location}`,
    doc.startDate && `Started: ${doc.startDate}`,
    doc.endDate && `Ended: ${doc.endDate}`,
  ].filter((part): part is string => typeof part === 'string');

  const summary = summaryParts.join('. ');
  if (summary) {
    chunks.push(buildChunk(`experience:${doc._id}`, 'experience', 0, summary, { ...base, field: 'summary' }));
  }

  if (doc.featuredStory) {
    chunks.push(
      buildChunk(`experience:${doc._id}`, 'experience', chunks.length, doc.featuredStory, {
        ...base,
        field: 'featuredStory',
      }),
    );
  }

  if (doc.achievements?.length) {
    chunks.push(
      buildChunk(`experience:${doc._id}`, 'experience', chunks.length, `Achievements: ${doc.achievements.join('. ')}`, {
        ...base,
        field: 'achievements',
      }),
    );
  }

  return chunks;
}

export function chunkProject(doc: ProjectDoc): Chunk[] {
  const chunks: Chunk[] = [];
  const updatedAt = doc._updatedAt;
  const title = doc.title ?? doc.slug ?? 'Untitled Project';
  const base: ChunkMetadata = {
    title,
    slug: doc.slug,
    category: doc.category,
    urlPath: resolveUrlPath('project', doc.slug),
    updatedAt,
    tags: doc.technologies,
  };
  const docId = `project:${doc.slug || doc._id}`;

  const sections: Array<{ field: string; text?: string }> = [
    { field: 'summary', text: doc.summary },
    { field: 'challenge', text: doc.challenge },
    { field: 'solution', text: doc.solution },
    { field: 'result', text: doc.result },
    { field: 'shortDescription', text: doc.shortDescription },
    {
      field: 'highlights',
      text: doc.highlights?.length ? `Highlights: ${doc.highlights.join('. ')}` : undefined,
    },
    {
      field: 'impact',
      text: doc.achievements?.length ? `Impact Metrics: ${doc.achievements.join('. ')}` : undefined,
    },
  ];

  for (const section of sections) {
    if (!section.text) {
      continue;
    }
    const label = section.field.charAt(0).toUpperCase() + section.field.slice(1);
    chunks.push(
      buildChunk(docId, 'project', chunks.length, `${title} — ${label}: ${section.text}`, {
        ...base,
        field: section.field,
      }),
    );
  }

  return chunks;
}

export function chunkCertification(doc: CertificationDoc): Chunk[] {
  const chunks: Chunk[] = [];
  if (!doc.title) {
    return chunks;
  }

  const text = [
    `Certification: ${doc.title}`,
    doc.issuer && `Issuer: ${doc.issuer}`,
    doc.issuedAt && `Issued: ${doc.issuedAt}`,
    doc.tags?.length && `Tags: ${doc.tags.join(', ')}`,
  ]
    .filter(Boolean)
    .join('. ');

  chunks.push(
    buildChunk(`certification:${doc._id}`, 'certification', 0, text, {
      title: doc.title,
      category: doc.issuer,
      urlPath: resolveUrlPath('certification'),
      updatedAt: doc._updatedAt,
      tags: doc.tags,
    }),
  );

  return chunks;
}

export function chunkPost(doc: PostDoc): Chunk[] {
  const chunks: Chunk[] = [];
  const title = doc.title ?? doc.slug ?? 'Untitled Post';
  const updatedAt = doc.publishedAt ?? doc._updatedAt;
  const base: ChunkMetadata = {
    title,
    slug: doc.slug,
    category: doc.categories?.join(', ') || undefined,
    urlPath: resolveUrlPath('post', doc.slug),
    updatedAt,
    tags: doc.tags,
  };
  const docId = `post:${doc.slug || doc._id}`;

  const body = doc.body ? portableTextToPlainText(doc.body) : '';
  const bodyChunks = chunkText(body);
  bodyChunks.forEach((text, index) => {
    chunks.push(buildChunk(docId, 'post', index, text, { ...base, field: 'body' }));
  });

  if (doc.excerpt) {
    chunks.push(
      buildChunk(docId, 'post', chunks.length, `Excerpt: ${doc.excerpt}`, { ...base, field: 'excerpt' }),
    );
  }

  return chunks;
}

export function chunkMembership(doc: MembershipDoc): Chunk[] {
  const chunks: Chunk[] = [];
  if (!doc.name) {
    return chunks;
  }

  const text = [
    `Membership: ${doc.name}`,
    doc.url && `URL: ${doc.url}`,
    doc.joinedAt && `Joined: ${doc.joinedAt}`,
  ]
    .filter(Boolean)
    .join('. ');

  chunks.push(
    buildChunk(`membership:${doc._id}`, 'membership', 0, text, {
      title: doc.name,
      urlPath: resolveUrlPath('membership'),
      updatedAt: doc._updatedAt,
    }),
  );

  return chunks;
}

export function chunkRecommendation(doc: RecommendationDoc): Chunk[] {
  const chunks: Chunk[] = [];
  if (!doc.quote || !doc.name) {
    return chunks;
  }

  const text = `Recommendation from ${doc.name}${doc.title ? `, ${doc.title}` : ''}${
    doc.company ? ` at ${doc.company}` : ''
  }: "${doc.quote}"`;

  chunks.push(
    buildChunk(`recommendation:${doc._id}`, 'recommendation', 0, text, {
      title: doc.name,
      category: doc.company,
      urlPath: resolveUrlPath('recommendation'),
      updatedAt: doc._updatedAt,
      tags: doc.relationship ? [doc.relationship] : undefined,
    }),
  );

  return chunks;
}
