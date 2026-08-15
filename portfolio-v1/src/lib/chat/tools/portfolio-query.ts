import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import type { ChatDataContext } from '@/app/api/chat/lib/types';

function queryCategory(context: ChatDataContext, category: string): string {
  switch (category) {
    case 'projects':
      return context.projects.map((p) => `• ${p.title || 'Untitled'} (${p.year || 'N/A'}): ${p.description || ''}`).join('\n');
    case 'experience':
      return context.experiences.map((e) => `• ${e.position || 'Role'} at ${e.company || 'Company'} (${e.startedAt || 'N/A'} - ${e.endedAt || 'Present'})`).join('\n');
    case 'skills':
      return context.technologies.map((t) => `• ${t.name || 'Unknown'} (${t.category || 'General'}) - ${t.proficiency || 0}%`).join('\n');
    case 'certifications':
      return context.certifications.map((c) => `• ${c.title || 'Certification'} - ${c.issuer || 'Issuer'} (${c.issuedAt || 'N/A'})`).join('\n');
    case 'blog':
      return 'Blog content is available. Ask a specific question about a blog post.';
    case 'testimonials':
      return 'Testimonials are available. Ask about recommendations.';
    case 'contact':
      return `Email: ${context.profile.email || 'N/A'}\nGitHub: ${context.profile.github || 'N/A'}\nLinkedIn: ${context.profile.linkedin || 'N/A'}`;
    default:
      return `Unknown category: ${category}. Available: projects, experience, skills, certifications, blog, testimonials, contact`;
  }
}

function createPortfolioQueryTool(context: () => ChatDataContext | null) {
  return new DynamicStructuredTool({
    name: 'portfolio_query',
    description: 'Query portfolio data by category. Returns structured data from the portfolio CMS content.',
    schema: z.object({
      category: z.enum(['projects', 'experience', 'skills', 'certifications', 'blog', 'testimonials', 'contact'])
        .describe('The portfolio category to query'),
    }),
    func: async ({ category }: { category: string }): Promise<string> => {
      const ctx = context();
      if (!ctx) {
        return 'Portfolio context is not available. Please try asking again.';
      }
      return queryCategory(ctx, category);
    },
  });
}

export { createPortfolioQueryTool };
