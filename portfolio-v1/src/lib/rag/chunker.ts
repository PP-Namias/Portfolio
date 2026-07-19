import { Chunk, DocType } from './types'
import type { CmsContent } from '@/lib/cms-content.shared'

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

function chunkText(text: string, docId: string, docType: string, metadata: Record<string, unknown>): Chunk[] {
  const maxTokens = 512
  const overlap = 64
  const chunks: Chunk[] = []
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean)

  let currentText = ''
  let currentTokens = 0
  let chunkIndex = 0

  for (const sentence of sentences) {
    const sentenceTokens = estimateTokens(sentence)

    if (currentTokens + sentenceTokens > maxTokens && currentText) {
      chunks.push({
        docId,
        docType,
        chunkIndex,
        text: currentText.trim(),
        metadata: { ...metadata, chunkCount: chunks.length + 1 },
      })
      chunkIndex++
      const overlapSentences = currentText.split(/(?<=[.!?])\s+/).slice(-2).join(' ')
      currentText = overlapSentences
      currentTokens = estimateTokens(overlapSentences)
    }

    currentText += (currentText ? ' ' : '') + sentence
    currentTokens += sentenceTokens
  }

  if (currentText.trim()) {
    chunks.push({
      docId,
      docType,
      chunkIndex,
      text: currentText.trim(),
      metadata: { ...metadata, chunkCount: chunks.length + 1 },
    })
  }

  return chunks
}

function chunkProjects(cms: CmsContent): Chunk[] {
  const chunks: Chunk[] = []
  for (const project of cms.projects) {
    const docId = `project:${project.slug || project.title}`
    const metadata = { title: project.title, year: project.year, tags: project.tags }

    const projectTitle = `Project: ${project.title}`
    if (project.description) {
      chunks.push({
        docId,
        docType: 'project',
        chunkIndex: 0,
        text: `${projectTitle} — ${project.description}`,
        metadata: { ...metadata, field: 'summary' },
      })
    }
    if (project.challenge) {
      chunks.push({
        docId,
        docType: 'project',
        chunkIndex: 1,
        text: `${projectTitle} — Challenge: ${project.challenge}`,
        metadata: { ...metadata, field: 'challenge' },
      })
    }
    if (project.solution) {
      chunks.push({
        docId,
        docType: 'project',
        chunkIndex: 2,
        text: `${projectTitle} — Solution: ${project.solution}`,
        metadata: { ...metadata, field: 'solution' },
      })
    }
    if (project.result) {
      chunks.push({
        docId,
        docType: 'project',
        chunkIndex: 3,
        text: `${projectTitle} — Result: ${project.result}`,
        metadata: { ...metadata, field: 'result' },
      })
    }

    if (project.highlights?.length) {
      chunks.push({
        docId,
        docType: 'project',
        chunkIndex: 4,
        text: `${projectTitle} — Highlights: ${project.highlights.join('. ')}`,
        metadata: { ...metadata, field: 'highlights' },
      })
    }

    if (project.shortDescription) {
      chunks.push({
        docId,
        docType: 'project',
        chunkIndex: 5,
        text: `${projectTitle} — ${project.shortDescription}`,
        metadata: { ...metadata, field: 'shortDescription' },
      })
    }
  }
  return chunks
}

function chunkExperiences(cms: CmsContent): Chunk[] {
  const chunks: Chunk[] = []
  for (const exp of cms.experiences) {
    const docId = `experience:${exp.company}:${exp.position}`
    const metadata = { company: exp.company, position: exp.position }

    const expTitle = `Experience: ${exp.position} at ${exp.company}`
    const summaryParts: string[] = []
    if (exp.position) summaryParts.push(`Position: ${exp.position}`)
    if (exp.company) summaryParts.push(`Company: ${exp.company}`)
    if (exp.summary) summaryParts.push(exp.summary)
    if (exp.type) summaryParts.push(`Type: ${exp.type}`)
    if (exp.modality) summaryParts.push(`Work Model: ${exp.modality}`)
    if (exp.country) summaryParts.push(`Location: ${exp.country}`)
    if (exp.startedAt) summaryParts.push(`Started: ${exp.startedAt}`)
    if (exp.endedAt) summaryParts.push(`Ended: ${exp.endedAt}`)

    chunks.push({
      docId,
      docType: 'experience',
      chunkIndex: 0,
      text: `${expTitle} — ${summaryParts.join('. ')}`,
      metadata: { ...metadata, field: 'summary' },
    })

    if (exp.achievements?.length) {
      chunks.push({
        docId,
        docType: 'experience',
        chunkIndex: 1,
        text: `${expTitle} — Achievements: ${exp.achievements.join('. ')}`,
        metadata: { ...metadata, field: 'achievements' },
      })
    }

    if (exp.technologies?.length) {
      chunks.push({
        docId,
        docType: 'experience',
        chunkIndex: 2,
        text: `${expTitle} — ${collapseTechList(exp.technologies)}`,
        metadata: { ...metadata, field: 'technologies' },
      })
    }
  }
  return chunks
}

function chunkCertifications(cms: CmsContent): Chunk[] {
  const chunks: Chunk[] = []
  for (const cert of cms.certifications) {
    if (!cert.title) continue
    const docId = `certification:${cert.title}`
    const text = [
      `Certification: ${cert.title}`,
      cert.issuer && `Issuer: ${cert.issuer}`,
      cert.issuedAt && `Issued: ${cert.issuedAt}`,
      cert.tags?.length && `Tags: ${cert.tags.join(', ')}`,
    ]
      .filter(Boolean)
      .join('. ')

    chunks.push({
      docId,
      docType: 'certification',
      chunkIndex: 0,
      text,
      metadata: { title: cert.title, issuer: cert.issuer },
    })
  }
  return chunks
}

function chunkBlogPosts(cms: CmsContent): Chunk[] {
  const chunks: Chunk[] = []
  for (const post of cms.blogPosts) {
    if (!post.content) continue
    const docId = `post:${post.slug}`
    const metadata = { title: post.title, date: post.date, tags: post.tags }

    const bodyChunks = chunkText(post.content, docId, 'post', metadata)
    chunks.push(...bodyChunks)

    if (post.excerpt) {
      chunks.push({
        docId,
        docType: 'post',
        chunkIndex: bodyChunks.length,
        text: post.excerpt,
        metadata: { ...metadata, field: 'excerpt' },
      })
    }
  }
  return chunks
}

function chunkProfile(cms: CmsContent): Chunk[] {
  const profile = cms.profile
  const docId = 'profile:main'

  const parts: string[] = [
    profile.name && `Name: ${profile.name}`,
    profile.title && `Title: ${profile.title}`,
    profile.summary && `Summary: ${profile.summary}`,
    profile.email && `Email: ${profile.email}`,
    profile.location && `Location: ${profile.location}`,
    profile.github && `GitHub: ${profile.github}`,
    profile.linkedin && `LinkedIn: ${profile.linkedin}`,
    profile.availabilityLabel && `Availability: ${profile.availabilityLabel}`,
    profile.highlights?.yearsExperience && `Years of Experience: ${profile.highlights.yearsExperience}`,
    profile.highlights?.projectsCompleted && `Projects Completed: ${profile.highlights.projectsCompleted}`,
    profile.highlights?.primaryTechnologies?.length && `Primary Technologies: ${profile.highlights.primaryTechnologies.join(', ')}`,
  ].filter((s): s is string => typeof s === 'string')

  const profileText = parts.join('. ')

  const chunks: Chunk[] = [{
    docId,
    docType: 'profile',
    chunkIndex: 0,
    text: profileText,
    metadata: { name: profile.name },
  }]

  const education = profile.education?.[0]
  if (education) {
    const eduParts: string[] = [
      `Education: ${education.degree}`,
      education.institution && `Institution: ${education.institution}`,
      education.location && `Location: ${education.location}`,
      education.startedAt && `Started: ${education.startedAt}`,
      education.endedAt && `Status: ${education.endedAt}`,
      education.gpa && `GWA: ${education.gpa}`,
      education.honors?.length && `Honors: ${education.honors.join(', ')}`,
      education.relevantCourses?.length && `Relevant Courses: ${education.relevantCourses.join(', ')}`,
    ].filter((s): s is string => typeof s === 'string')

    chunks.push({
      docId,
      docType: 'profile',
      chunkIndex: 1,
      text: eduParts.join('. '),
      metadata: { name: profile.name, field: 'education' },
    })
  }

  return chunks
}

function collapseTechList(technologies: string[]): string {
  return `Technologies: ${technologies.join(', ')}`
}

function chunkTechnologies(cms: CmsContent): Chunk[] {
  const chunks: Chunk[] = []
  for (const tech of cms.technologies) {
    if (!tech.name) continue
    const docId = `technology:${tech.name}`
    chunks.push({
      docId,
      docType: 'technology',
      chunkIndex: 0,
      text: `Technology: ${tech.name}. Category: ${tech.category || 'General'}. Proficiency: ${tech.proficiency ?? 0}%.`,
      metadata: { name: tech.name, category: tech.category, proficiency: tech.proficiency },
    })
  }
  return chunks
}

function chunkMemberships(cms: CmsContent): Chunk[] {
  const chunks: Chunk[] = []
  for (const membership of cms.memberships) {
    if (!membership.name) continue
    const docId = `membership:${membership.name}`
    const text = [
      `Membership: ${membership.name}`,
      membership.url && `URL: ${membership.url}`,
      membership.joinedAt && `Joined: ${membership.joinedAt}`,
    ].filter(Boolean).join('. ')

    chunks.push({
      docId,
      docType: 'membership',
      chunkIndex: 0,
      text,
      metadata: { name: membership.name },
    })
  }
  return chunks
}

function chunkRecommendations(cms: CmsContent): Chunk[] {
  const chunks: Chunk[] = []
  for (const rec of cms.recommendations) {
    if (!rec.quote || !rec.name) continue
    const docId = `recommendation:${rec.name}`
    chunks.push({
      docId,
      docType: 'recommendation',
      chunkIndex: 0,
      text: `Recommendation from ${rec.name}${rec.title ? `, ${rec.title}` : ''}${rec.company ? ` at ${rec.company}` : ''}: "${rec.quote}"`,
      metadata: { name: rec.name, title: rec.title, company: rec.company },
    })
  }
  return chunks
}

export function chunkAllCmsContent(cms: CmsContent): Chunk[] {
  return [
    ...chunkProfile(cms),
    ...chunkProjects(cms),
    ...chunkExperiences(cms),
    ...chunkCertifications(cms),
    ...chunkBlogPosts(cms),
    ...chunkTechnologies(cms),
    ...chunkMemberships(cms),
    ...chunkRecommendations(cms),
  ]
}
