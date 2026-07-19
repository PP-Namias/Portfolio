import { ChatDataContext, ExperienceData, ProjectData, TechnologyData, CertificationData, SocialData, MembershipData } from './types'

type ResponseBuilder = (data: ChatDataContext, msg: string) => string

interface CatalogEntry {
  name: string
  match: (msg: string) => boolean
  response: ResponseBuilder
}

function topByCategory(technologies: TechnologyData[], category: string, limit: number): string[] {
  return [...technologies]
    .filter(t => t.category === category && t.name)
    .sort((a, b) => (b.proficiency ?? 0) - (a.proficiency ?? 0))
    .slice(0, limit)
    .map(t => t.name!)
}

function findSocial(socials: SocialData[], name: string): string | undefined {
  return socials.find(s => s.name?.toLowerCase() === name.toLowerCase())?.link
}

function formatExperience(exp: ExperienceData): string {
  const end = exp.endedAt || 'Present'
  const techs = exp.technologies?.length ? ` (${exp.technologies.join(', ')})` : ''
  return `${exp.position} at ${exp.company} (${exp.startedAt} – ${end}, ${exp.modality || 'On-site'}${techs})`
}

function formatProject(p: ProjectData): string {
  const links = [p.liveURL, p.repositoryURL].filter(Boolean).join(' | ')
  const tags = p.tags?.slice(0, 6).join(', ') || ''
  return `${p.title || 'Untitled'} (${p.year || 'N/A'}) — ${p.description || ''}${tags ? ` [${tags}]` : ''}${links ? ` ${links}` : ''}`
}

const knownProjectSlugs = ['billing management', 'biometric', 'car dealership', 'case master', 'casemaster', 'clinic', 'inventory', 'e-commerce', 'ecommerce', 'pos', 'chatbot', 'portfolio']
const knownCompanySlugs = ['j5 pharmacy', 'wilshire', 'aeternitas', 'chapels', 'columbarium', 'freelance', 'ucg']
const knownTechNames = ['react', 'typescript', 'javascript', 'node', 'python', 'next.js', 'tailwind', 'docker', 'sql', 'mongodb', 'postgresql', 'graphql', 'laravel', 'flask', 'fastapi']

const catalog: CatalogEntry[] = [
  {
    name: 'greeting',
    match: (msg) => /(^|\s)(hi|hello|hey)([!,.?\s]|$)/i.test(msg.trim()),
    response: (data) => {
      const name = data.profile.name || 'Jhon Keneth Ryan Namias'
      const title = data.profile.title || 'Full Stack Engineer & AI Automation Specialist'
      const summary = data.profile.summary || ''
      return `Hello! I'm Keneth's AI assistant. ${name} is a ${title} based in ${data.profile.location || 'Manila, Philippines'}. ${summary} Feel free to ask about his projects, experience, skills, certifications, or anything else you'd like to know!`
    },
  },
  {
    name: 'who_is',
    match: (msg) => msg.includes('who is keneth') || msg.includes('who are you') || msg.includes('tell me about yourself') || msg.includes('tell me about keneth') || msg.includes('about keneth') || msg.includes('introduce yourself'),
    response: (data) => {
      const name = data.profile.name || 'Jhon Keneth Ryan Namias'
      const title = data.profile.title || 'Full Stack Engineer & AI Automation Specialist'
      const loc = data.profile.location || 'Manila, Philippines'
      const years = data.profile.highlights?.yearsExperience ?? 3
      const projects = data.profile.highlights?.projectsCompleted ?? data.projects.length
      const summary = data.profile.summary || ''
      const techs = data.profile.highlights?.primaryTechnologies?.slice(0, 5).join(', ') || 'React, TypeScript, Node.js, AI Automation'
      return `${name}, also known as PP Namias or Keneth, is a ${title} based in ${loc}. ${summary} With ${years}+ years of experience and ${projects}+ completed projects, his technical toolkit spans ${techs}. He is currently a ${data.experiences[0]?.position || 'Software Developer'} at ${data.experiences[0]?.company || 'various companies'} and is pursuing a ${data.profile.education?.[0]?.degree || 'BS Computer Science'} at ${data.profile.education?.[0]?.institution || 'University of Caloocan City'}. What would you like to explore — his projects, experience, or tech stack?`
    },
  },
  {
    name: 'project_detail',
    match: (msg) => knownProjectSlugs.some(name => msg.includes(name)),
    response: (data, msg) => {
      const matched = data.projects.find(p => p.title && msg.includes(p.title.toLowerCase().slice(0, 10)))
      if (matched) return formatProject(matched)
      const fuzzy = data.projects.find(p => {
        const t = (p.title || '').toLowerCase()
        return knownProjectSlugs.some(s => msg.includes(s)) ||
          msg.includes(t.slice(0, 8)) ||
          t.includes(msg.replace(/[^a-z0-9 ]/g, '').trim().split(' ').slice(0, 3).join(' '))
      })
      if (fuzzy) return formatProject(fuzzy)
      return ''
    },
  },
  {
    name: 'projects',
    match: (msg) => msg.includes('project') || msg.includes('portfolio') || msg.includes('built') || msg.includes('build') || msg.includes('developed') || msg.includes('created') || msg.includes('made'),
    response: (data) => {
      const count = data.projects.length
      const latest = data.projects.slice(0, 5).map(formatProject).join('\n• ')
      const tags = [...new Set(data.projects.flatMap(p => p.tags || []))].slice(0, 8).join(', ')
      return `Keneth has built ${count} featured projects spanning full-stack development, IoT, AI automation, and more. Here are some highlights:\n\n• ${latest}\n\nTechnologies across his projects include ${tags || 'React, TypeScript, Node.js, Python, IoT'}. Would you like details on any specific project?`
    },
  },
  {
    name: 'experience_detail',
    match: (msg) => knownCompanySlugs.some(c => msg.includes(c)),
    response: (data, msg) => {
      const matched = data.experiences.find(e => {
        const c = (e.company || '').toLowerCase()
        const p = (e.position || '').toLowerCase()
        return msg.includes(c.slice(0, 8)) || msg.includes(p.slice(0, 8))
      })
      if (matched) {
        const end = matched.endedAt || 'Present'
        const techs = matched.technologies?.length ? ` using ${matched.technologies.join(', ')}` : ''
        const achievements = matched.achievements?.length ? `\n\nKey contributions: ${matched.achievements.slice(0, 4).join('. ')}.` : ''
        return `${matched.position} at ${matched.company} (${matched.startedAt} – ${end}, ${matched.modality || 'On-site'}, ${matched.country || 'Philippines'}). ${matched.summary || ''}${achievements}${techs}.`
      }
      return ''
    },
  },
  {
    name: 'experience',
    match: (msg) => (msg.includes('experience') || msg.includes('work') || msg.includes('career') || msg.includes('job') || msg.includes('employed') || msg.includes('worked') || msg.includes('role') || msg.includes('company') || msg.includes('position')) && !msg.includes('blog'),
    response: (data) => {
      const count = data.experiences.length
      const latest = data.experiences.slice(0, 4).map(formatExperience).join('\n• ')
      const allTechs = [...new Set(data.experiences.flatMap(e => e.technologies || []))]
      return `Keneth has held ${count} professional roles. Here are his most recent positions:\n\n• ${latest}\n\nAcross these roles, he has worked with ${allTechs.join(', ') || 'a wide range of technologies'}. Would you like me to elaborate on any specific role?`
    },
  },
  {
    name: 'skill_detail',
    match: (msg) => knownTechNames.some(name => msg.includes(name)) && !msg.includes('experience'),
    response: (data, msg) => {
      const matched = data.technologies.find(t => t.name && msg.includes(t.name.toLowerCase()))
      if (matched) return `${matched.name} — proficiency: ${matched.proficiency || 0}%. Category: ${matched.category || 'General'}.`
      for (const t of data.technologies) {
        if (t.name && msg.includes(t.name.toLowerCase().slice(0, 4))) {
          return `${t.name} — proficiency: ${t.proficiency || 0}%. Category: ${t.category || 'General'}.`
        }
      }
      return ''
    },
  },
  {
    name: 'skills',
    match: (msg) => msg.includes('skill') || msg.includes('tech') || msg.includes('stack') || msg.includes('language') || msg.includes('framework') || msg.includes('tool') || msg.includes('proficient') || (msg.includes('know') && (msg.includes('tech') || msg.includes('code') || msg.includes('program'))),
    response: (data) => {
      const total = data.technologies.length
      const frontend = topByCategory(data.technologies, 'Frontend', 6).join(', ')
      const backend = topByCategory(data.technologies, 'Backend', 6).join(', ')
      const databases = topByCategory(data.technologies, 'Databases', 4).join(', ')
      const ai = [...topByCategory(data.technologies, 'AI', 4), ...topByCategory(data.technologies, 'Data Science', 3)].filter(Boolean).join(', ')
      const devops = topByCategory(data.technologies, 'DevOps', 4).join(', ')
      return `Keneth is proficient in ${total} technologies across multiple domains:\n\n• Frontend: ${frontend || 'React, Next.js, TypeScript, TailwindCSS'}\n• Backend: ${backend || 'Node.js, Python, Laravel'}\n• Databases: ${databases || 'MySQL, PostgreSQL, Supabase'}\n• AI & Data: ${ai || 'LLMs, Prompt Engineering, Pandas, NumPy'}\n• DevOps: ${devops || 'Docker, Git, CI/CD'}\n\nHis strongest areas are full-stack web engineering and AI automation.`
    },
  },
  {
    name: 'certifications',
    match: (msg) => msg.includes('certification') || msg.includes('certificate') || msg.includes('credential') || msg.includes('hackerrank') || msg.includes('tesda') || msg.includes('license') || msg.includes('accreditation'),
    response: (data) => {
      const count = data.certifications.length
      const topCerts = [...data.certifications]
        .filter(c => c.title && c.issuer)
        .slice(0, 8)
        .map(c => `• ${c.title} — ${c.issuer}${c.issuedAt ? ` (${c.issuedAt})` : ''}`)
        .join('\n')
      const issuers = [...new Set(data.certifications.map(c => c.issuer).filter(Boolean))].join(', ')
      return `Keneth holds ${count} verified certifications from ${issuers || 'HackerRank, TESDA, and other providers'}. Here are some of them:\n\n${topCerts}\n\nThese certifications validate his expertise in software engineering, frontend and backend development, databases, cybersecurity, and problem-solving.`
    },
  },
  {
    name: 'education',
    match: (msg) => msg.includes('education') || msg.includes('school') || msg.includes('university') || msg.includes('college') || msg.includes('degree') || msg.includes('gpa') || msg.includes('gwa') || msg.includes('study') || msg.includes('academic') || msg.includes('course') || msg.includes('student'),
    response: (data) => {
      const edu = Array.isArray(data.profile.education) ? data.profile.education[0] : undefined
      if (!edu) {
        return `Keneth is currently based in ${data.profile.location || 'Manila, Philippines'} and actively building production-grade software. He believes in continuous learning through hands-on projects and certifications.`
      }
      const end = edu.endedAt || 'Expected 2026'
      const honors = edu.honors?.length ? `\n• Honors: ${edu.honors.join(', ')}` : ''
      const courses = edu.relevantCourses?.length ? `\n• Relevant coursework: ${edu.relevantCourses.join(', ')}` : ''
      return `Keneth is pursuing a ${edu.degree || 'BS Computer Science'} at ${edu.institution || 'University of Caloocan City'} (${edu.location || 'Caloocan City, Philippines'}), ${edu.startedAt || '2022'} – ${end}.\n• GWA: ${edu.gpa || '1.40'} (Philippine system: 1.0 is highest)${honors}${courses}\n\nHis academic performance reflects strong analytical and problem-solving skills that carry into his professional work.`
    },
  },
  {
    name: 'contact',
    match: (msg) => msg.includes('email') || msg.includes('contact') || msg.includes('reach') || msg.includes('linkedin') || msg.includes('github') || msg.includes('social') || msg.includes('message') || msg.includes('connect') || msg.includes('get in touch') || msg.includes('hire'),
    response: (data) => {
      const email = data.profile.email || findSocial(data.socials, 'email') || 'pp.namias@gmail.com'
      const github = data.profile.github || findSocial(data.socials, 'github') || 'https://github.com/PP-Namias'
      const linkedin = data.profile.linkedin || findSocial(data.socials, 'linkedin') || 'https://www.linkedin.com/in/pp-namias/'
      const cal = findSocial(data.socials, 'cal') || 'https://cal.com/pp-namias'
      return `Here are the best ways to connect with Keneth:\n\n• Email: ${email}\n• GitHub: ${github}\n• LinkedIn: ${linkedin}\n• Calendar: ${cal} (book 15-min or 30-min slots)\n\nFeel free to reach out for project discussions, collaboration opportunities, or consulting.`
    },
  },
  {
    name: 'resume',
    match: (msg) => msg.includes('resume') || msg.includes('cv') || msg.includes('curriculum') || msg.includes('vitae') || msg.includes('download') || msg.includes('application') || msg.includes('apply'),
    response: (data) => {
      return `I have Keneth's resume ready for you. It covers his ${data.profile.highlights?.yearsExperience ?? 3}+ years of experience, ${data.projects.length} projects, ${data.certifications.length} certifications, and detailed professional background. You can view or download it using the button below.\n[ACTION:resume]`
    },
  },
  {
    name: 'booking',
    match: (msg) => msg.includes('schedule') || msg.includes('book') || msg.includes('meeting') || msg.includes('call') || msg.includes('collaborat') || msg.includes('consult') || msg.includes('discuss') || (msg.includes('talk') && msg.includes('project')) || msg.includes('opportunity'),
    response: (data) => {
      const cal = findSocial(data.socials, 'cal') || 'https://cal.com/pp-namias'
      return `Keneth offers 15-minute and 30-minute meeting slots for project discussions, consulting, and collaboration. You can book a time directly via his calendar:\n\n${cal}\n\nHe is typically available for remote meetings and responds to scheduling requests promptly.\n[ACTION:booking]`
    },
  },
  {
    name: 'achievements',
    match: (msg) => msg.includes('achievement') || msg.includes('accomplishment') || msg.includes('milestone') || msg.includes('highlight') || msg.includes('standout') || msg.includes('award') || msg.includes('competition') || msg.includes('hackathon') || msg.includes('recognition'),
    response: (data) => {
      return `Keneth has several notable achievements that demonstrate his impact:\n\n• Competed in HackForGov 2025 focusing on cybersecurity, web exploitation, and digital forensics.\n• Built AI automation tools for a US-based financial network using Eleven Labs, LLMs, and prompt engineering.\n• Led a 9-engineer team at UCC building an academic platform serving 1000+ students with 99.8% uptime.\n• Built a HIPAA-compliant clinic management system processing 1000+ patients, reducing manual workload by 60%.\n• Collaborated with a Supreme Court attorney on legal workflow software (CaseMaster).\n• Earned 2nd Place in a university programming competition.\n• Active member of the Philippine Software Industry Association and Analytics & AI Association of the Philippines.\n\nHe has also completed ${data.certifications.length} certifications reinforcing his technical depth.`
    },
  },
  {
    name: 'memberships',
    match: (msg) => msg.includes('membership') || msg.includes('association') || msg.includes('organization') || msg.includes('member of') || msg.includes('society') || msg.includes('psia') || msg.includes('aiap') || msg.includes('philippine'),
    response: (data) => {
      if (!data.memberships.length) return ''
      return `Keneth is an active member of professional organizations:\n\n• ${data.memberships.map(m => `${m.name}${m.joinedAt ? ` (since ${m.joinedAt})` : ''}${m.url ? ` — ${m.url}` : ''}`).join('\n• ')}\n\nThese memberships reflect his commitment to staying current with industry trends and best practices.`
    },
  },
  {
    name: 'blog',
    match: (msg) => (msg.includes('blog') || msg.includes('article') || msg.includes('post') || msg.includes('published') || msg.includes('content') || msg.includes('writing')) && !msg.includes('poem') && !msg.includes('compose') && !msg.includes('create'),
    response: () => {
      return `Keneth writes about software engineering, AI automation, and technology insights on his blog at namias.tech. The blog covers topics from full-stack development to AI integration patterns. You can find his latest posts on the blog section of his portfolio.`
    },
  },
  {
    name: 'location',
    match: (msg) => msg.includes('location') || msg.includes('based') || msg.includes('live') || (msg.includes('where') && (msg.includes('keneth') || msg.includes('you') || msg.includes('he'))) || msg.includes('manila') || msg.includes('philippines'),
    response: (data) => {
      return `${data.profile.name || 'Keneth'} is based in ${data.profile.location || 'Manila, Philippines'}. He works remotely and is open to local and international opportunities.`
    },
  },
  {
    name: 'availability',
    match: (msg) => msg.includes('available') || msg.includes('hire') || msg.includes('open to') || msg.includes('looking for') || msg.includes('opportunity') || msg.includes('freelance') || msg.includes('contract'),
    response: (data) => {
      const cal = findSocial(data.socials, 'cal') || 'https://cal.com/pp-namias'
      return `Keneth is open to software engineering and AI automation opportunities. He is available for full-time, contract, and freelance engagements. You can schedule a discussion through his calendar:\n\n${cal}\n\nHe typically responds within 24 hours.\n[ACTION:booking]`
    },
  },
  {
    name: 'out_of_scope',
    match: (msg) => {
      const portfolioKeywords = ['keneth', 'namias', 'pp namias', 'portfolio', 'project', 'skill', 'experience', 'work', 'education', 'certification', 'resume', 'cv', 'contact', 'email', 'github', 'linkedin', 'schedule', 'booking', 'meeting', 'achievement', 'technology', 'blog', 'location', 'about', 'hello', 'hi', 'hey', 'help', 'capabilities', 'what can you']
      const isPortfolioRelated = portfolioKeywords.some(k => msg.includes(k))
      const isGreeting = /(^|\s)(hi|hello|hey)([!,.?\s]|$)/i.test(msg.trim())
      return !isPortfolioRelated && !isGreeting
    },
    response: () => {
      return `I'm Keneth's portfolio assistant — my expertise is limited to Keneth's professional background. I can help with questions about his skills, projects, experience, certifications, education, and contact information. What would you like to know about Keneth?`
    },
  },
]

function matchIntent(msg: string): CatalogEntry | undefined {
  const lower = msg.toLowerCase().trim()
  for (const entry of catalog) {
    if (entry.match(lower)) {
      return entry
    }
  }
  return undefined
}

export function buildCatalogResponse(message: string, data: ChatDataContext): string {
  const lower = message.toLowerCase().trim()
  const matched = matchIntent(lower)
  if (matched) {
    const response = matched.response(data, lower)
    if (response) return response
  }
  const name = data.profile.name || 'Jhon Keneth Ryan Namias'
  const title = data.profile.title || 'Full Stack Engineer & AI Automation Specialist'
  return `${name} is a ${title} with ${data.profile.highlights?.yearsExperience ?? 3}+ years of experience in web engineering and AI automation. Feel free to ask about his projects, experience, skills, or how to reach him. I'm here to help!`
}

export { catalog, matchIntent }
