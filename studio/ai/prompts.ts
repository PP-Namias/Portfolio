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
  ],
}

export function getActionsForType(type: string): AiAction[] {
  return AI_ACTIONS[type] || []
}
