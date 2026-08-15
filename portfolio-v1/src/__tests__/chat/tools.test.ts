import { describe, it, expect, vi, beforeEach } from 'vitest';
import { webSearchTool } from '@/lib/chat/tools/web-search';
import { calculatorTool } from '@/lib/chat/tools/calculator';
import { stockPriceTool } from '@/lib/chat/tools/stock-price';
import { sendMessageTool } from '@/lib/chat/tools/send-message';
import { createTools } from '@/lib/chat/tools';
import type { ChatDataContext } from '@/app/api/chat/lib/types';

describe('Calculator Tool', () => {
  it('should add two numbers', async () => {
    const result = await calculatorTool.invoke({ first_num: 5, second_num: 3, operation: 'add' });
    const parsed = JSON.parse(result);
    expect(parsed.result).toBe(8);
  });

  it('should subtract two numbers', async () => {
    const result = await calculatorTool.invoke({ first_num: 10, second_num: 4, operation: 'sub' });
    const parsed = JSON.parse(result);
    expect(parsed.result).toBe(6);
  });

  it('should multiply two numbers', async () => {
    const result = await calculatorTool.invoke({ first_num: 6, second_num: 7, operation: 'mul' });
    const parsed = JSON.parse(result);
    expect(parsed.result).toBe(42);
  });

  it('should divide two numbers', async () => {
    const result = await calculatorTool.invoke({ first_num: 10, second_num: 2, operation: 'div' });
    const parsed = JSON.parse(result);
    expect(parsed.result).toBe(5);
  });

  it('should handle division by zero', async () => {
    const result = await calculatorTool.invoke({ first_num: 10, second_num: 0, operation: 'div' });
    const parsed = JSON.parse(result);
    expect(parsed.error).toBeDefined();
    expect(parsed.error).toContain('Division by zero');
  });

  it('should handle negative numbers', async () => {
    const result = await calculatorTool.invoke({ first_num: -5, second_num: 3, operation: 'add' });
    const parsed = JSON.parse(result);
    expect(parsed.result).toBe(-2);
  });
});

describe('Web Search Tool', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a result string for a query', async () => {
    const result = await webSearchTool.invoke({ query: 'test query' });
    expect(typeof result).toBe('string');
  });
});

describe('Stock Price Tool', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubEnv('ALPHA_VANTAGE_API_KEY', '');
  });

  it('should return not-configured message when API key missing', async () => {
    const result = await stockPriceTool.invoke({ symbol: 'AAPL' });
    expect(result).toContain('not configured');
  });

  it('should attempt API call when key is present', async () => {
    vi.stubEnv('ALPHA_VANTAGE_API_KEY', 'test-key-123');
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({}), { status: 200 })
    );
    try {
      const result = await stockPriceTool.invoke({ symbol: 'AAPL' });
      expect(result).toBeDefined();
    } finally {
      fetchSpy.mockRestore();
    }
  });
});

describe('Send Message Tool', () => {
  it('should return confirmation message', async () => {
    const result = await sendMessageTool.invoke({
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello, I would like to connect.',
      subject: 'Collaboration Inquiry',
    });
    const parsed = JSON.parse(result);
    expect(parsed.status).toBe('requires_confirmation');
    expect(parsed.action).toBe('contact');
    expect(parsed.message).toContain('Test User');
  });

  it('should validate email format', async () => {
    await expect(
      sendMessageTool.invoke({
        name: 'Test',
        email: 'invalid-email',
        message: 'Hi',
        subject: 'Hello',
      })
    ).rejects.toThrow();
  });
});

describe('createTools', () => {
  it('should create all 5 tools', () => {
    const contextProvider = () => null;
    const tools = createTools(contextProvider);
    expect(tools).toHaveLength(5);
    const toolNames = tools.map((t) => t.name);
    expect(toolNames).toContain('web_search');
    expect(toolNames).toContain('calculator');
    expect(toolNames).toContain('stock_price');
    expect(toolNames).toContain('portfolio_query');
    expect(toolNames).toContain('send_message');
  });

  it('should create portfolio query tool that uses context', async () => {
    const mockContext: ChatDataContext = {
      profile: { name: 'Keneth', title: 'Engineer' },
      experiences: [{ company: 'Test Co', position: 'Dev', startedAt: '2025', endedAt: null }],
      projects: [{ title: 'Test Project', description: 'A test project', year: 2025, repositoryURL: null, liveURL: null, tags: [] }],
      technologies: [{ name: 'TypeScript', category: 'Languages', proficiency: 90 }],
      certifications: [{ title: 'AWS Certified', issuer: 'Amazon', year: 2025 }],
      memberships: [],
      socials: [],
    };
    const contextProvider = () => mockContext;
    const tools = createTools(contextProvider);
    const portfolioTool = tools.find((t) => t.name === 'portfolio_query');
    expect(portfolioTool).toBeDefined();
    if (portfolioTool) {
      const result = await portfolioTool.invoke({ category: 'projects' });
      expect(result).toContain('Test Project');
    }
  });

  it('portfolio_query rejects invalid category via schema', async () => {
    const mockContext: ChatDataContext = {
      profile: { name: 'Keneth', title: 'Engineer' },
      experiences: [],
      projects: [],
      technologies: [],
      certifications: [],
      memberships: [],
      socials: [],
    };
    const contextProvider = () => mockContext;
    const tools = createTools(contextProvider);
    const portfolioTool = tools.find((t) => t.name === 'portfolio_query');
    expect(portfolioTool).toBeDefined();
    if (portfolioTool) {
      await expect(
        portfolioTool.invoke({ category: 'invalid_category' })
      ).rejects.toThrow('Received tool input did not match expected schema');
    }
  });

  it('portfolio_query returns result for each valid category', async () => {
    const mockContext: ChatDataContext = {
      profile: { name: 'Keneth', title: 'Engineer' },
      experiences: [{ company: 'Test Co', position: 'Dev', startedAt: '2025', endedAt: null }],
      projects: [{ title: 'Test Project', description: 'A test project', year: 2025, repositoryURL: null, liveURL: null, tags: [] }],
      technologies: [{ name: 'TypeScript', category: 'Languages', proficiency: 90 }],
      certifications: [{ title: 'AWS Certified', issuer: 'Amazon', year: 2025 }],
      memberships: [],
      socials: [],
    };
    const contextProvider = () => mockContext;
    const tools = createTools(contextProvider);
    const portfolioTool = tools.find((t) => t.name === 'portfolio_query');
    expect(portfolioTool).toBeDefined();
    if (portfolioTool) {
      const categories = ['projects', 'experience', 'skills', 'certifications', 'contact'] as const;
      for (const cat of categories) {
        const result = await portfolioTool.invoke({ category: cat });
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
      }
    }
  });
});
