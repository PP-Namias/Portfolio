import { RetrievedChunk } from '@/lib/rag/types'
import { ChatDataContext, ExperienceData, ProjectData, TechnologyData, CertificationData } from './types'

interface GroupedChunks {
  projects: RetrievedChunk[]
  experiences: RetrievedChunk[]
  certifications: RetrievedChunk[]
  technologies: RetrievedChunk[]
  profile: RetrievedChunk[]
  posts: RetrievedChunk[]
  memberships: RetrievedChunk[]
  recommendations: RetrievedChunk[]
  other: RetrievedChunk[]
}

function groupByDocType(chunks: RetrievedChunk[]): GroupedChunks {
  const groups: GroupedChunks = {
    projects: [], experiences: [], certifications: [],
    technologies: [], profile: [], posts: [],
    memberships: [], recommendations: [], other: [],
  }
  for (const chunk of chunks) {
    const t = chunk.docType
    if (t === 'project') groups.projects.push(chunk)
    else if (t === 'experience') groups.experiences.push(chunk)
    else if (t === 'certification') groups.certifications.push(chunk)
    else if (t === 'technology') groups.technologies.push(chunk)
    else if (t === 'profile') groups.profile.push(chunk)
    else if (t === 'post') groups.posts.push(chunk)
    else if (t === 'membership') groups.memberships.push(chunk)
    else if (t === 'recommendation') groups.recommendations.push(chunk)
    else groups.other.push(chunk)
  }
  return groups
}

function extractUniqueNames(chunks: RetrievedChunk[], label: string): string[] {
  const names = new Set<string>()
  for (const c of chunks) {
    const name = (c.metadata?.title as string) || (c.metadata?.name as string) || (c.metadata?.company as string) || ''
    if (name) names.add(name)
  }
  return [...names]
}

function extractChunkTexts(chunks: RetrievedChunk[]): string[] {
  return chunks.map(c => c.text).filter(Boolean)
}

function buildProjectResponse(chunks: RetrievedChunk[], projects: ProjectData[]): string {
  const names = extractUniqueNames(chunks, 'project')
  if (names.length === 1) {
    const project = projects.find(p => p.title === names[0])
    if (project) {
      const tags = project.tags?.slice(0, 6).join(', ') || 'Various technologies'
      const links = [project.liveURL, project.repositoryURL].filter(Boolean).join(' | ')
      let response = `${project.title} (${project.year || 'year unknown'}) — ${project.description || ''}`
      if (project.challenge || project.solution || project.result) {
        response += '. This project showcases his ability to handle full-cycle development'
      }
      response += `. Built with ${tags}.`
      if (links) response += ` ${links}`
      return response
    }
  }
  const texts = extractChunkTexts(chunks)
  return texts.join(' ') || 'Keneth has worked on several featured projects spanning full-stack web, IoT, and AI automation.'
}

function buildExperienceResponse(chunks: RetrievedChunk[], experiences: ExperienceData[]): string {
  const names = extractUniqueNames(chunks, 'experience')
  if (names.length === 1) {
    const exp = experiences.find(e => `${e.position} at ${e.company}` === names[0])
    if (exp) {
      const end = exp.endedAt || 'Present'
      const techs = exp.technologies?.length ? ` using ${exp.technologies.join(', ')}` : ''
      const achievements = exp.achievements?.length ? ` Key contributions include ${exp.achievements.slice(0, 3).join(', ')}.` : ''
      return `${exp.position} at ${exp.company} (${exp.startedAt} – ${end}, ${exp.modality || 'On-site'}, ${exp.country || 'Philippines'}). ${exp.summary || ''}${achievements}${techs}.`
    }
  }
  const texts = extractChunkTexts(chunks)
  return texts.join(' ') || 'Keneth has experience across software engineering, AI automation, and technical leadership.'
}

function buildCertificationResponse(chunks: RetrievedChunk[]): string {
  const texts = extractChunkTexts(chunks)
  return texts.join(' ') || 'Keneth holds multiple certifications in software engineering, AI, and cybersecurity.'
}

function buildTechnologyResponse(chunks: RetrievedChunk[]): string {
  const names = extractUniqueNames(chunks, 'technology')
  if (names.length <= 3) {
    const texts = extractChunkTexts(chunks)
    return texts.join(' ') || 'Keneth is proficient across a wide range of technologies.'
  }
  return `Keneth is skilled in ${names.join(', ')}, among others.`
}

function buildGenericResponse(chunks: RetrievedChunk[], data: ChatDataContext): string {
  const groups = groupByDocType(chunks)
  const parts: string[] = []

  if (groups.projects.length > 0) {
    const names = extractUniqueNames(groups.projects, 'project')
    parts.push(`On projects: Keneth has worked on ${names.join(', ')}`)
  }
  if (groups.experiences.length > 0) {
    const names = extractUniqueNames(groups.experiences, 'experience')
    parts.push(`On experience: his roles include ${names.join(', ')}`)
  }
  if (groups.technologies.length > 0) {
    const names = extractUniqueNames(groups.technologies, 'technology')
    parts.push(`He is skilled in ${names.join(', ')}`)
  }
  if (groups.certifications.length > 0) {
    parts.push(`He holds ${data.certifications.length} verified certifications`)
  }

  return parts.join('. ') + '.'
}

export function buildRagResponse(chunks: RetrievedChunk[], message: string, data: ChatDataContext): string {
  if (chunks.length === 0) return ''

  const groups = groupByDocType(chunks)
  const msg = message.toLowerCase()
  let response = ''

  if (groups.projects.length > 0 && (msg.includes('project') || msg.includes('built') || groups.projects.length > groups.experiences.length)) {
    response = buildProjectResponse(groups.projects, data.projects)
  } else if (groups.experiences.length > 0 && (msg.includes('experience') || msg.includes('work') || msg.includes('role') || msg.includes('company') || groups.experiences.length >= groups.projects.length)) {
    response = buildExperienceResponse(groups.experiences, data.experiences)
  } else if (groups.certifications.length > 0 && (msg.includes('certification') || groups.certifications.length > groups.technologies.length)) {
    response = buildCertificationResponse(groups.certifications)
  } else if (groups.technologies.length > 0 && (msg.includes('tech') || msg.includes('skill') || msg.includes('language'))) {
    response = buildTechnologyResponse(groups.technologies)
  } else {
    response = buildGenericResponse(chunks, data)
  }

  if (!response) {
    response = buildGenericResponse(chunks, data)
  }

  return response
}
