import { describe, it, expect } from 'vitest'
import { buildSmartFallback } from '@/app/api/chat/lib/smartFallback'
import { buildRagResponse } from '@/app/api/chat/lib/ragResponseBuilder'
import { buildCatalogResponse, matchIntent, catalog } from '@/app/api/chat/lib/questionCatalog'
import { ChatDataContext } from '@/app/api/chat/lib/types'
import { RetrievedChunk } from '@/lib/rag/types'

function makeData(overrides?: Partial<ChatDataContext>): ChatDataContext {
  return {
    profile: {
      name: 'Jhon Keneth Ryan Namias',
      title: 'Full Stack Engineer & AI Automation Specialist',
      email: 'pp.namias@gmail.com',
      location: 'Manila, Philippines',
      github: 'https://github.com/PP-Namias',
      linkedin: 'https://www.linkedin.com/in/pp-namias/',
      summary: 'Full-stack engineer focused on high-impact systems.',
      highlights: { yearsExperience: 3, projectsCompleted: 25, primaryTechnologies: ['React', 'TypeScript', 'Node.js'] },
      education: [{
        degree: 'BS Computer Science', institution: 'University of Caloocan City',
        location: 'Caloocan City, Philippines', startedAt: '2022-08', endedAt: null,
        gpa: '1.40', honors: ['Dean\'s Lister'], relevantCourses: ['Data Structures', 'Algorithms'],
      }],
    },
    experiences: [
      { company: 'J5 Pharmacy', position: 'Software Developer', summary: 'Built clinic systems', country: 'Philippines', modality: 'Remote', type: 'Contract', startedAt: '2025-06', endedAt: '2025-12', technologies: ['React', 'Node.js'], achievements: ['Real-time competitor monitoring', 'Automated inventory'] },
      { company: 'Wilshire Financial Network', position: 'AI Solutions Developer', summary: 'AI automation', country: 'US', modality: 'Remote', type: 'Contract', startedAt: '2025-06', endedAt: '2025-09', technologies: ['Python', 'LLMs'], achievements: ['Built AI tools'] },
      { company: 'Aeternitas Chapels', position: 'Software Engineering Intern', summary: 'Internal tools', country: 'Philippines', modality: 'On-site', type: 'Internship', startedAt: '2025-06', endedAt: '2025-09', technologies: ['PHP', 'Laravel'], achievements: ['Built scheduling system'] },
    ],
    projects: [
      { title: 'Car Dealership Manager', description: 'A car dealership management program', year: 2022, repositoryURL: 'https://github.com/PP-Namias/Car-Dealership-Management-Program', tags: ['C++'] },
      { title: 'Billing Management System', description: 'A billing management system', year: 2023, repositoryURL: 'https://github.com/PP-Namias/Billing-Management-System', tags: ['PHP', 'MySQL'] },
      { title: 'Biometric IoT Attendance', description: 'IoT attendance system', year: 2024, repositoryURL: 'https://github.com/PP-Namias/Biometric-Attendance-System-Using-IOT', tags: ['IoT', 'Python'] },
    ],
    technologies: [
      { name: 'React', category: 'Frontend', proficiency: 90 },
      { name: 'TypeScript', category: 'Frontend', proficiency: 85 },
      { name: 'Node.js', category: 'Backend', proficiency: 85 },
      { name: 'Python', category: 'Backend', proficiency: 80 },
      { name: 'PostgreSQL', category: 'Databases', proficiency: 75 },
      { name: 'Docker', category: 'DevOps', proficiency: 70 },
    ],
    certifications: [
      { title: 'Software Engineer Intern', issuer: 'HackerRank', issuedAt: '2024' },
      { title: 'Frontend Developer (React)', issuer: 'HackerRank', issuedAt: '2024' },
      { title: 'SQL (Advanced)', issuer: 'HackerRank', issuedAt: '2024' },
    ],
    memberships: [{ name: 'PSIA', url: 'https://psia.org', joinedAt: '2024' }],
    socials: [
      { name: 'Email', link: 'pp.namias@gmail.com' },
      { name: 'GitHub', link: 'https://github.com/PP-Namias' },
      { name: 'Cal', link: 'https://cal.com/pp-namias' },
    ],
    ...overrides,
  }
}

function makeChunk(overrides: Partial<RetrievedChunk>): RetrievedChunk {
  return { docId: 'test', docType: 'project', chunkIndex: 0, text: 'Test chunk', metadata: {}, score: 0.85, ...overrides }
}

describe('questionCatalog', () => {
  describe('matchIntent', () => {
    it('matches greeting intents', () => {
      const e = matchIntent('hi')
      expect(e?.name).toBe('greeting')
    })
    it('matches who_is intents', () => {
      expect(matchIntent('who is keneth')?.name).toBe('who_is')
      expect(matchIntent('tell me about yourself')?.name).toBe('who_is')
      expect(matchIntent('who are you')?.name).toBe('who_is')
    })
    it('matches project intents', () => {
      expect(matchIntent('tell me about your projects')?.name).toBe('projects')
      expect(matchIntent('what have you built')?.name).toBe('projects')
    })
    it('matches project_detail intents', () => {
      expect(matchIntent('tell me about car dealership')?.name).toBe('project_detail')
      expect(matchIntent('billing management system')?.name).toBe('project_detail')
    })
    it('matches experience intents', () => {
      expect(matchIntent('what is your work experience')?.name).toBe('experience')
      expect(matchIntent('where have you worked')?.name).toBe('experience')
    })
    it('matches experience_detail intents', () => {
      expect(matchIntent('role at j5 pharmacy')?.name).toBe('experience_detail')
      expect(matchIntent('wilshire financial network')?.name).toBe('experience_detail')
    })
    it('matches skills intents', () => {
      expect(matchIntent('what technologies do you use')?.name).toBe('skills')
      expect(matchIntent('tech stack')?.name).toBe('skills')
    })
    it('matches skill_detail intents', () => {
      expect(matchIntent('tell me about react')?.name).toBe('skill_detail')
    })
    it('matches certification intents', () => {
      expect(matchIntent('what certifications do you have')?.name).toBe('certifications')
      expect(matchIntent('hackerrank certificates')?.name).toBe('certifications')
    })
    it('matches education intents', () => {
      expect(matchIntent('education background')?.name).toBe('education')
      expect(matchIntent('where did you study')?.name).toBe('education')
      expect(matchIntent('gwa')?.name).toBe('education')
    })
    it('matches contact intents', () => {
      expect(matchIntent('how can i contact you')?.name).toBe('contact')
      expect(matchIntent('linkedin')?.name).toBe('contact')
    })
    it('matches resume intents', () => {
      expect(matchIntent('resume')?.name).toBe('resume')
      expect(matchIntent('download cv')?.name).toBe('resume')
    })
    it('matches booking intents', () => {
      expect(matchIntent('schedule a meeting')?.name).toBe('booking')
      expect(matchIntent('book a call')?.name).toBe('booking')
    })
    it('matches achievements intents', () => {
      expect(matchIntent('achievements')?.name).toBe('achievements')
      expect(matchIntent('what are your highlights')?.name).toBe('achievements')
    })
    it('matches out_of_scope intents', () => {
      expect(matchIntent('what is the weather in paris')?.name).toBe('out_of_scope')
      expect(matchIntent('who is the president')?.name).toBe('out_of_scope')
    })
  })

  describe('buildCatalogResponse', () => {
    it('greeting returns warm response with name and title', () => {
      const r = buildCatalogResponse('hi', makeData())
      expect(r).toContain('Jhon Keneth Ryan Namias')
      expect(r).toContain('Full Stack Engineer')
      expect(r).not.toContain('Here\u2019s a direct answer based on')
    })
    it('who_is returns comprehensive intro with stats', () => {
      const r = buildCatalogResponse('who is keneth', makeData())
      expect(r).toContain('3+ years')
      expect(r).toContain('25+ completed projects')
      expect(r).toContain('React, TypeScript, Node.js')
    })
    it('projects returns project list with tags', () => {
      const r = buildCatalogResponse('projects', makeData())
      expect(r).toContain('3 featured projects')
      expect(r).toContain('Car Dealership Manager')
    })
    it('experience returns roles with technologies', () => {
      const r = buildCatalogResponse('work experience', makeData())
      expect(r).toContain('Software Developer')
      expect(r).toContain('J5 Pharmacy')
      expect(r).toContain('Node.js')
    })
    it('education returns degree and school with GWA', () => {
      const r = buildCatalogResponse('education', makeData())
      expect(r).toContain('BS Computer Science')
      expect(r).toContain('University of Caloocan City')
      expect(r).toContain('1.40')
    })
    it('skills returns categorized technologies', () => {
      const r = buildCatalogResponse('skills', makeData())
      expect(r).toContain('React')
      expect(r).toContain('TypeScript')
      expect(r).toContain('Node.js')
      expect(r).toContain('Python')
    })
    it('contact returns email and social links', () => {
      const r = buildCatalogResponse('contact', makeData())
      expect(r).toContain('pp.namias@gmail.com')
      expect(r).toContain('github.com/PP-Namias')
    })
    it('resume returns resume action', () => {
      const r = buildCatalogResponse('resume', makeData())
      expect(r).toContain('[ACTION:resume]')
    })
    it('booking returns booking action', () => {
      const r = buildCatalogResponse('schedule a call', makeData())
      expect(r).toContain('[ACTION:booking]')
      expect(r).toContain('cal.com')
    })
    it('out_of_scope returns polite redirect', () => {
      const r = buildCatalogResponse('what is the weather in paris', makeData())
      expect(r).toContain('portfolio assistant')
      expect(r).not.toContain('Here\u2019s')
    })
    it('certifications returns cert details', () => {
      const r = buildCatalogResponse('certifications', makeData())
      expect(r).toContain('HackerRank')
      expect(r).toContain('Software Engineer Intern')
    })
    it('achievements returns highlight list', () => {
      const r = buildCatalogResponse('achievements', makeData())
      expect(r).toContain('HackForGov')
      expect(r).toContain('financial network')
    })
    it('memberships returns org details', () => {
      const r = buildCatalogResponse('psia', makeData())
      expect(r).toContain('PSIA')
    })
    it('blog returns blog description', () => {
      const r = buildCatalogResponse('does keneth have a blog', makeData())
      expect(r).toContain('namias.tech')
    })
  })
})

describe('ragResponseBuilder', () => {
  it('builds project-specific response from chunks', () => {
    const chunks = [makeChunk({
      docType: 'project', docId: 'project:car-dealership', chunkIndex: 0,
      text: 'Project: Car Dealership Manager — A car dealership management program built with C++.',
      metadata: { title: 'Car Dealership Manager', tags: ['C++'], field: 'summary' },
    })]
    const r = buildRagResponse(chunks, 'tell me about car dealership', makeData())
    expect(r).toContain('Car Dealership Manager')
    expect(r).toContain('C++')
  })

  it('builds experience-specific response from chunks', () => {
    const chunks = [makeChunk({
      docType: 'experience', docId: 'experience:j5', chunkIndex: 0,
      text: 'Experience: Software Developer at J5 Pharmacy — Built clinic systems with React and Node.js.',
      metadata: { company: 'J5 Pharmacy', position: 'Software Developer', field: 'summary' },
    })]
    const r = buildRagResponse(chunks, 'role at j5 pharmacy', makeData())
    expect(r).toContain('J5 Pharmacy')
    expect(r).toContain('Software Developer')
  })

  it('builds generic response when multiple types present', () => {
    const chunks = [
      makeChunk({ docType: 'project', text: 'Project A', metadata: { title: 'Project A' } }),
      makeChunk({ docType: 'experience', text: 'Role at X', metadata: { company: 'X', title: 'Role at X' } }),
    ]
    const r = buildRagResponse(chunks, 'tell me about keneth', makeData())
    expect(r).toBeTruthy()
  })

  it('returns empty for empty chunks', () => {
    expect(buildRagResponse([], 'test', makeData())).toBe('')
  })
})

describe('smartFallback', () => {
  it('uses RAG chunks when available', () => {
    const chunks = [makeChunk({
      docType: 'project',
      text: 'Project: Car Dealership Manager — A C++ project.',
      metadata: { title: 'Car Dealership Manager' },
    })]
    const r = buildSmartFallback('car dealership', makeData(), chunks)
    expect(r).toContain('Car Dealership Manager')
    expect(r).toContain('C++')
  })

  it('falls back to catalog when no RAG chunks', () => {
    const r = buildSmartFallback('hi', makeData())
    expect(r).toContain('Jhon Keneth Ryan Namias')
    expect(r).toContain('Full Stack Engineer')
  })

  it('falls back to catalog when RAG chunks are empty array', () => {
    const r = buildSmartFallback('what certifications', makeData(), [])
    expect(r).toContain('HackerRank')
  })

  it('never returns robotic prefix phrase', () => {
    const tests = [
      buildSmartFallback('hi', makeData()),
      buildSmartFallback('who is keneth', makeData()),
      buildSmartFallback('projects', makeData()),
      buildSmartFallback('skills', makeData()),
      buildSmartFallback('contact', makeData()),
    ]
    for (const t of tests) {
      expect(t).not.toContain('Here\u2019s a direct answer based on')
    }
  })

  it('never returns fallback notice', () => {
    const r = buildSmartFallback('hi', makeData())
    expect(r).not.toContain('FALLBACK_NOTICE')
    expect(r).not.toContain('based on Keneth')
  })

  it('handles unknown questions gracefully', () => {
    const r = buildSmartFallback('something completely random 12345', makeData())
    expect(r).toBeTruthy()
    expect(r.length).toBeGreaterThan(20)
  })
})

describe('catalog completeness', () => {
  it('covers all major intents', () => {
    const names = catalog.map(e => e.name).sort()
    expect(names).toContain('greeting')
    expect(names).toContain('who_is')
    expect(names).toContain('projects')
    expect(names).toContain('project_detail')
    expect(names).toContain('experience')
    expect(names).toContain('experience_detail')
    expect(names).toContain('skills')
    expect(names).toContain('skill_detail')
    expect(names).toContain('certifications')
    expect(names).toContain('education')
    expect(names).toContain('contact')
    expect(names).toContain('resume')
    expect(names).toContain('booking')
    expect(names).toContain('achievements')
    expect(names).toContain('memberships')
    expect(names).toContain('blog')
    expect(names).toContain('location')
    expect(names).toContain('availability')
    expect(names).toContain('out_of_scope')
  })

  it('every catalog entry produces a non-empty response', () => {
    const data = makeData()
    for (const entry of catalog) {
      if (entry.name === 'project_detail' || entry.name === 'experience_detail' || entry.name === 'skill_detail') continue
      const r = entry.response(data)
      expect(r).toBeTruthy()
      expect(r.length).toBeGreaterThan(10)
    }
  })

  it('no response contains the old robotic prefix', () => {
    const data = makeData()
    for (const entry of catalog) {
      if (entry.name === 'project_detail' || entry.name === 'experience_detail' || entry.name === 'skill_detail') continue
      const r = entry.response(data)
      expect(r).not.toContain('Here\u2019s a direct answer based on')
    }
  })
})
