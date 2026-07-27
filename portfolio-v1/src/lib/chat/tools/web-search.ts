import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

const webSearchTool = new DynamicStructuredTool({
  name: 'web_search',
  description: 'Search the web for current information using DuckDuckGo.',
  schema: z.object({
    query: z.string().describe('The search query string'),
  }),
  func: async ({ query }: { query: string }): Promise<string> => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) return `Web search failed with status ${res.status}`;
      const data = await res.json() as { AbstractText?: string; RelatedTopics?: Array<{ Text?: string; FirstURL?: string }> };
      if (data.AbstractText) return data.AbstractText;
      if (data.RelatedTopics?.length) {
        return data.RelatedTopics.slice(0, 5).map((t) => t.Text || '').filter(Boolean).join('\n');
      }
      return `No results found for "${query}". Try a different query.`;
    } catch (error) {
      return `Web search error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
});

export { webSearchTool };
