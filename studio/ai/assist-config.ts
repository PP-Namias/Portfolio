import {type AssistLanguageConfig} from '@sanity/assist'

/**
 * Sanity Assist configuration for cross-field AI instructions.
 * These instructions help Assist understand relationships between fields
 * and provide contextually relevant suggestions.
 */
export const assistInstructions: AssistLanguageConfig = {
  instructions: {
    profile: `You are helping edit a portfolio profile. The profile contains personal information, professional summary, social links, and education. When suggesting content:
- Keep the tone professional but personable
- Focus on impact and expertise
- Use action-oriented language
- Consider the portfolio context (this is for a personal website)`,

    project: `You are helping edit a portfolio project. Projects showcase work with titles, descriptions, technologies, and links. When suggesting content:
- Highlight technical skills and achievements
- Use specific metrics when possible
- Keep descriptions concise but detailed
- Consider the project card context (limited space)`,

    experience: `You are helping edit a work experience entry. Experiences contain roles, companies, dates, and descriptions. When suggesting content:
- Focus on responsibilities and achievements
- Use action verbs (led, built, implemented, improved)
- Quantify impact where possible
- Keep descriptions professional`,

    post: `You are helping edit a blog post. Posts have titles, excerpts, body content, and tags. When suggesting content:
- Write engaging, SEO-friendly content
- Use clear, concise language
- Consider the reader's perspective
- Include relevant technical details`,

    certification: `You are helping edit a certification entry. Certifications have titles, issuers, dates, and categories. When suggesting content:
- Keep titles accurate and complete
- Suggest appropriate categories
- Use official certification names`,

    category: `You are helping edit a content category. Categories organize content by topic. When suggesting content:
- Keep category names clear and concise
- Use consistent naming conventions
- Consider how users would search for this content`,

    galleryImage: `You are helping edit a gallery image entry. Gallery images have captions and alt text. When suggesting content:
- Write descriptive alt text for accessibility
- Keep captions concise but informative
- Consider the visual context`,
  },
}
