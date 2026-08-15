export type AiAction = {
  id: string
  title: string
  prompt: (value: string, context?: {tone?: string; audience?: string}) => string
  description: string
  tone: 'neutral' | 'shorten' | 'rewrite' | 'expand' | 'creative'
}

export const AI_ACTIONS: Record<string, AiAction[]> = {
  profile: [
    {
      id: 'generate-summary',
      title: 'Generate professional summary',
      description: 'Generate a compelling professional summary from the profile fields.',
      tone: 'creative',
      prompt: (value) =>
        `Write a professional summary (2-3 sentences) for a portfolio based on this information. Focus on impact and expertise.\n\nProfile: ${value}`,
    },
    {
      id: 'optimize-title',
      title: 'Optimize job title',
      description: 'Create 3 optimized job title variants.',
      tone: 'creative',
      prompt: (value) =>
        `Generate 3 professional job title variants that are concise and impactful. Return them separated by " | ".\n\nCurrent title: ${value}`,
    },
    {
      id: 'shorten-summary',
      title: 'Shorten summary',
      description: 'Tighten the summary to under 200 characters.',
      tone: 'shorten',
      prompt: (value) =>
        `Rewrite this professional summary to be under 200 characters while keeping the key message.\n\nSummary: ${value}`,
    },
  ],
  heroSection: [
    {
      id: 'shorten-headline',
      title: 'Shorten headline',
      description: 'Tighten the headline to under 60 characters while keeping the impact.',
      tone: 'shorten',
      prompt: (value) =>
        `Rewrite the following hero headline to be under 60 characters, keep it punchy and personal. Return only the rewritten line.\n\nHeadline: ${value}`,
    },
    {
      id: 'confident-variant',
      title: 'Confident variant',
      description: 'Rewrite with a confident, founder tone.',
      tone: 'rewrite',
      prompt: (value) =>
        `Rewrite the following portfolio hero text in a confident, founder-style tone. Return three variants separated by " | ".\n\nSource: ${value}`,
    },
    {
      id: 'generate-roles',
      title: 'Generate role variants',
      description: 'Generate 5 rotating role descriptions.',
      tone: 'creative',
      prompt: (value) =>
        `Generate 5 professional role descriptions that could rotate in a hero section. Each should be 2-4 words. Return them separated by " | ".\n\nCurrent role: ${value}`,
    },
  ],
  aboutSection: [
    {
      id: 'rephrase-pro',
      title: 'Rephrase professionally',
      description: 'Tighten the about copy into a more professional register.',
      tone: 'rewrite',
      prompt: (value) =>
        `Rephrase the following portfolio about paragraph in a more professional, action-oriented register. Keep the same length and structure.\n\nSource: ${value}`,
    },
    {
      id: 'expand-about',
      title: 'Expand about section',
      description: 'Expand the about section with more detail.',
      tone: 'expand',
      prompt: (value) =>
        `Expand this about section into 3-4 sentences with more detail about expertise and value proposition.\n\nSource: ${value}`,
    },
  ],
  project: [
    {
      id: 'summary-tighten',
      title: 'Tighten summary',
      description: 'Rewrite the project summary into 1-2 sentences for the projects grid.',
      tone: 'shorten',
      prompt: (value) =>
        `Rewrite the following project summary into 1-2 sentences (max 240 characters) suitable for a portfolio card. Keep the technical specificity.\n\nSource: ${value}`,
    },
    {
      id: 'generate-description',
      title: 'Generate description',
      description: 'Generate a detailed project description from the summary.',
      tone: 'expand',
      prompt: (value) =>
        `Write a detailed project description (3-4 paragraphs) for a portfolio case study based on this summary. Include challenge, approach, and results.\n\nSummary: ${value}`,
    },
    {
      id: 'seo-description',
      title: 'SEO meta description',
      description: 'Generate an SEO-optimized meta description.',
      tone: 'shorten',
      prompt: (value) =>
        `Write an SEO meta description (under 160 characters) for this project page.\n\nProject: ${value}`,
    },
    {
      id: 'highlight-bullets',
      title: 'Generate highlights',
      description: 'Generate 5 key highlights for this project.',
      tone: 'creative',
      prompt: (value) =>
        `Generate 5 concise project highlights/achievements. Each should be under 100 characters and outcome-focused.\n\nProject: ${value}`,
    },
  ],
  experience: [
    {
      id: 'generate-description',
      title: 'Generate role description',
      description: 'Generate a professional role description from the title.',
      tone: 'expand',
      prompt: (value) =>
        `Write a professional job description (2-3 sentences) for this role. Focus on responsibilities and impact.\n\nRole: ${value}`,
    },
    {
      id: 'generate-highlights',
      title: 'Generate highlights',
      description: 'Generate 5 achievement highlights for this role.',
      tone: 'creative',
      prompt: (value) =>
        `Generate 5 concise achievement bullets for this role. Each should be under 120 characters and outcome-focused.\n\nRole: ${value}`,
    },
    {
      id: 'suggest-skills',
      title: 'Suggest skills',
      description: 'Suggest relevant skills for this role.',
      tone: 'creative',
      prompt: (value) =>
        `Suggest 8 relevant professional skills for this role. Return them as a comma-separated list.\n\nRole: ${value}`,
    },
  ],
  certification: [
    {
      id: 'achievement-bullets',
      title: 'Generate achievement bullets',
      description: 'Generate 3 achievement bullets for the certification title.',
      tone: 'creative',
      prompt: (value) =>
        `Generate three concise achievement bullets for the certification "${value}". Each bullet should be under 120 characters and outcome-focused.`,
    },
    {
      id: 'suggest-category',
      title: 'Suggest category',
      description: 'Suggest a category for this certification.',
      tone: 'neutral',
      prompt: (value) =>
        `Suggest a category for this certification. Return only the category name.\n\nCertification: ${value}`,
    },
  ],
  post: [
    {
      id: 'tighten-excerpt',
      title: 'Tighten excerpt',
      description: 'Shorten the excerpt to 160 characters or less.',
      tone: 'shorten',
      prompt: (value) =>
        `Shorten the following blog excerpt to 160 characters or less, preserving the hook.\n\nSource: ${value}`,
    },
    {
      id: 'social-card',
      title: 'Social card copy',
      description: 'Generate a social-card caption (LinkedIn-style).',
      tone: 'creative',
      prompt: (value) =>
        `Write a LinkedIn-style social card caption (under 280 characters) for the blog post whose excerpt is below. Include 3 hashtags.\n\nExcerpt: ${value}`,
    },
    {
      id: 'generate-tags',
      title: 'Generate tags',
      description: 'Suggest 5 relevant tags for this post.',
      tone: 'creative',
      prompt: (value) =>
        `Suggest 5 relevant tags for this blog post. Return them as a comma-separated list.\n\nTitle: ${value}`,
    },
    {
      id: 'seo-title',
      title: 'SEO-optimized title',
      description: 'Generate an SEO-optimized title.',
      tone: 'rewrite',
      prompt: (value) =>
        `Rewrite this blog post title to be SEO-optimized (under 60 characters) while keeping it engaging.\n\nTitle: ${value}`,
    },
  ],
  category: [
    {
      id: 'generate-description',
      title: 'Generate description',
      description: 'Generate a category description from the title.',
      tone: 'expand',
      prompt: (value) =>
        `Write a brief category description (1-2 sentences) for "${value}".`,
    },
  ],
  galleryImage: [
    {
      id: 'generate-alt',
      title: 'Generate alt text',
      description: 'Generate descriptive alt text for this image.',
      tone: 'neutral',
      prompt: (value) =>
        `Write descriptive alt text for this image. Be specific about what's shown.\n\nImage context: ${value}`,
    },
  ],
}

export function getActionsForType(type: string): AiAction[] {
  return AI_ACTIONS[type] || []
}
