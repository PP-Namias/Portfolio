import {
  ChatDataContext,
  CertificationData,
  SocialData,
} from './types';
import {
  hasAnyKeyword,
  isAchievementsIntent,
  isGreetingIntent,
  isPresetIntent,
  isProfileIntroIntent,
} from './intentClassifier';

const FALLBACK_NOTICE =
  "Here’s a direct answer based on Keneth’s verified portfolio data.";

function findSocialLink(socials: SocialData[], name: string): string | null {
  const social = socials.find((item) => item.name?.toLowerCase() === name.toLowerCase());
  return social?.link || null;
}

function getCertificationImpactScore(cert: CertificationData): number {
  const title = cert.title?.toLowerCase() || '';
  const issuer = cert.issuer?.toLowerCase() || '';
  const tags = Array.isArray(cert.tags) ? cert.tags.map((tag) => tag.toLowerCase()) : [];

  let score = 0;

  if (title.includes('software engineer')) score += 10;
  if (title.includes('frontend developer')) score += 8;
  if (title.includes('rest api')) score += 7;
  if (title.includes('sql (advanced)')) score += 7;
  if (title.includes('cybersecurity')) score += 7;
  if (title.includes('problem solving (intermediate)')) score += 6;
  if (title.includes('2nd place') || title.includes('competition')) score += 6;
  if (title.includes('(intermediate)')) score += 4;
  if (title.includes('(advanced)')) score += 4;

  if (issuer.includes('hackerrank')) score += 3;
  if (issuer.includes('ibm')) score += 3;
  if (issuer.includes('aws') || issuer.includes('google')) score += 2;

  if (tags.some((tag) => ['software engineering', 'algorithms', 'problem solving', 'security', 'award', 'achievement'].includes(tag))) {
    score += 2;
  }

  return score;
}

function buildFallbackResponse(rawMessage: string, data: ChatDataContext): string {
  const { profile, experiences, projects, technologies, certifications, socials } = data;
  const message = rawMessage.toLowerCase();

  const hasTechName = (tech: { name?: string }): tech is { name: string } =>
    typeof tech.name === 'string' && tech.name.length > 0;

  const name = profile.name || 'Jhon Keneth Ryan Namias';
  const title = profile.title || 'Full Stack Engineer & AI Automation Specialist';
  const email = profile.email || 'pp.namias@gmail.com';
  const location = profile.location || 'Manila, Philippines';
  const github = profile.github || findSocialLink(socials, 'github') || 'https://github.com/PP-Namias';
  const linkedin = profile.linkedin || findSocialLink(socials, 'linkedin') || 'https://www.linkedin.com/in/pp-namias/';
  const cal = findSocialLink(socials, 'cal') || 'https://cal.com/pp-namias';
  const years = profile.highlights?.yearsExperience ?? 4;

  const topByCategory = (category: string, limit: number): string[] => {
    return [...technologies]
      .filter((tech) => tech.category === category && tech.name)
      .sort((a, b) => (b.proficiency ?? 0) - (a.proficiency ?? 0))
      .slice(0, limit)
      .filter(hasTechName)
      .map((tech) => tech.name);
  };

  const coreStack = [...technologies]
    .filter((tech) => tech.name)
    .sort((a, b) => (b.proficiency ?? 0) - (a.proficiency ?? 0))
    .slice(0, 6)
    .filter(hasTechName)
    .map((tech) => tech.name)
    .join(', ');

  const frontendStack = topByCategory('Frontend', 4).join(', ');
  const backendStack = topByCategory('Backend', 4).join(', ');
  const dataStack = [...topByCategory('Databases', 3), ...topByCategory('Data Science', 2)].join(', ');

  const latestProjects = [...projects]
    .filter((project) => project.title)
    .slice(0, 3)
    .map((project) => {
      const links = [project.liveURL, project.repositoryURL].filter(Boolean).join(' | ');
      const yearSegment = project.year ? ` (${project.year})` : '';
      const linksSegment = links ? `\n  ${links}` : '';
      return `• ${project.title}${yearSegment}${linksSegment}`;
    })
    .join('\n');

  const latestExperience = [...experiences]
    .filter((experience) => experience.position && experience.company)
    .sort((a, b) => (b.startedAt || '').localeCompare(a.startedAt || ''))
    .slice(0, 3)
    .map((experience) => {
      const end = experience.endedAt || 'Present';
      return `• ${experience.position} at ${experience.company} (${experience.startedAt || 'N/A'} - ${end})`;
    })
    .join('\n');

  const topImpactCertifications = [...certifications]
    .filter((cert) => cert.title && cert.issuer)
    .sort((a, b) => getCertificationImpactScore(b) - getCertificationImpactScore(a))
    .slice(0, 5)
    .map((cert) => {
      const issuedAtSegment = cert.issuedAt ? ` (${cert.issuedAt})` : '';
      return `• ${cert.title} - ${cert.issuer}${issuedAtSegment}`;
    })
    .join('\n');

  const education = Array.isArray(profile.education) ? profile.education[0] : undefined;

  if (hasAnyKeyword(message, ['resume', 'cv'])) {
    return `${FALLBACK_NOTICE}\n\nI've attached Keneth's resume for you to view or download:\n[ACTION:resume]`;
  }

  if (hasAnyKeyword(message, ['schedule', 'book', 'meeting', 'call', 'hire', 'collaborat'])) {
    return `${FALLBACK_NOTICE}\n\nYou can book time with Keneth here: ${cal}\n\nHe offers 15-minute and 30-minute slots for project discussions, consulting, and collaboration.\n[ACTION:booking]`;
  }

  if (hasAnyKeyword(message, ['email', 'contact', 'reach', 'linkedin', 'github', 'social'])) {
    return `${FALLBACK_NOTICE}\n\nHere are the best ways to reach Keneth:\n• Email: ${email}\n• LinkedIn: ${linkedin}\n• GitHub: ${github}\n• Schedule: ${cal}\n\nUse the quick actions below to open each channel directly.\n[ACTION:email]\n[ACTION:linkedin]\n[ACTION:github]\n[ACTION:booking]`;
  }

  if (hasAnyKeyword(message, ['skill', 'tech', 'stack', 'language', 'framework'])) {
    return `${FALLBACK_NOTICE}\n\nKeneth specializes in a modern full-stack and AI automation stack:\n• Core engineering: ${coreStack || 'React, TypeScript, Node.js, Next.js, JavaScript, TailwindCSS'}\n• Frontend: ${frontendStack || 'React, Next.js, TailwindCSS, Bootstrap'}\n• Backend & APIs: ${backendStack || 'Node.js, FastAPI, Flask, Laravel'}\n• Data & databases: ${dataStack || 'MySQL, PostgreSQL, Supabase, Pandas, NumPy'}\n\nHe focuses on production-grade web systems and AI-powered automation workflows for real business operations.\n[ACTION:projects]\n[ACTION:experience]`;
  }

  if (hasAnyKeyword(message, ['project', 'portfolio', 'built', 'build'])) {
    return `${FALLBACK_NOTICE}\n\nHere are some featured projects by Keneth:\n${latestProjects}\n\nIf you want, I can also break down a specific project's tech stack and impact.\n[ACTION:experience]\n[ACTION:contact]`;
  }

  if (hasAnyKeyword(message, ['experience', 'work', 'career', 'role', 'company'])) {
    return `${FALLBACK_NOTICE}\n\nKeneth's recent roles include:\n${latestExperience}\n\nHe has worked across full-stack engineering, AI automation, and technical leadership.\n[ACTION:projects]\n[ACTION:contact]`;
  }

  if (hasAnyKeyword(message, ['certification', 'certificate', 'award', 'hackerrank'])) {
    return `${FALLBACK_NOTICE}\n\nKeneth has ${certifications.length} certifications. Most impactful highlights:\n${topImpactCertifications}\n\nThese certifications highlight verified strength in software engineering, React/frontend, backend APIs, databases, and cybersecurity foundations.`;
  }

  if (hasAnyKeyword(message, ['education', 'school', 'university', 'college', 'gpa', 'gwa'])) {
    if (!education) {
      return `${FALLBACK_NOTICE}\n\nKeneth is currently based in ${location} and actively building production-grade software and AI automation solutions.`;
    }

    return `${FALLBACK_NOTICE}\n\nEducation:\n• ${education.degree || 'BS Computer Science'}\n• ${education.institution || 'University of Caloocan City'} (${education.startedAt || '2022'} - ${education.endedAt || 'Present'})\n• GWA: ${education.gpa || '1.40'} (Philippine grading system: 1.0 is highest, 5.0 is lowest)\n• Honors: ${education.honors?.join(', ') || 'N/A'}`;
  }

  if (isAchievementsIntent(message)) {
    return `${FALLBACK_NOTICE}\n\nKeneth's key achievements include:\n• Led a 9-engineer team building a student platform used by 1000+ students with 99.8% uptime\n• Built a HIPAA-compliant clinic system for 1000+ patients, reducing manual workload by 60%\n• Delivered AI automation for a US financial network using Eleven Labs + LLM workflows\n• Built legal workflow software with a Supreme Court attorney and improved case access speed by 35%\n• Earned 2nd Place in a university programming competition and completed ${certifications.length} certifications\n\nIf you want, I can break these down by technical scope, business impact, or leadership impact.`;
  }

  if (isProfileIntroIntent(message) || isGreetingIntent(rawMessage)) {
    return `${FALLBACK_NOTICE}\n\n${name} is a ${title} based in ${location}. He focuses on full-stack product engineering and AI automation, with ${years}+ years of experience and 25+ completed projects.\n\nQuick actions you can explore now:\n• Skills and tech stack\n• Featured projects\n• Work experience\n• Certifications\n• Contact channels\n[ACTION:skills]\n[ACTION:projects]\n[ACTION:experience]\n[ACTION:certifications]\n[ACTION:contact]`;
  }

  return `${FALLBACK_NOTICE}\n\n${name} is a ${title} with ${years}+ years of experience in web engineering and AI automation.\n\nI can help with:\n• Technical skills and stack\n• Featured projects\n• Work experience\n• Certifications\n• Contact and scheduling\n[ACTION:skills]\n[ACTION:projects]\n[ACTION:experience]\n[ACTION:certifications]\n[ACTION:contact]`;
}

function buildPresetResponse(rawMessage: string, data: ChatDataContext): string | null {
  if (!isPresetIntent(rawMessage)) {
    return null;
  }

  const withFallbackLead = buildFallbackResponse(rawMessage, data);
  const leadPrefix = `${FALLBACK_NOTICE}\n\n`;

  if (withFallbackLead.startsWith(leadPrefix)) {
    return withFallbackLead.slice(leadPrefix.length);
  }

  return withFallbackLead.replace(FALLBACK_NOTICE, '').trimStart();
}

export {
  FALLBACK_NOTICE,
  buildFallbackResponse,
  buildPresetResponse,
  findSocialLink,
  getCertificationImpactScore,
};

export { hasAnyKeyword } from './intentClassifier';
