import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @google/generative-ai before importing route
type ChatHistoryItem = {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
};

type StartChatArgs = {
  history: ChatHistoryItem[];
};

const mockSendMessage = vi.fn();
const mockStartChat = vi.fn((_args?: StartChatArgs) => ({
  sendMessage: mockSendMessage,
}));
const mockGetGenerativeModel = vi.fn(() => ({
  startChat: mockStartChat,
}));

const mockCmsContent = vi.hoisted(() => ({
  profile: {
    name: 'Jhon Keneth Ryan Namias',
    title: 'Full Stack Engineer & AI Automation Specialist',
    email: 'pp.namias@gmail.com',
    location: 'Manila, Philippines',
    github: 'https://github.com/PP-Namias',
    linkedin: 'https://www.linkedin.com/in/pp-namias/',
    summary: 'Summary paragraph.',
    highlights: {
      yearsExperience: 5,
      projectsCompleted: 20,
      primaryTechnologies: ['React', 'TypeScript'],
    },
    education: [
      {
        degree: 'BS Computer Science',
        institution: 'University of Caloocan City',
        location: 'Caloocan City, Philippines',
        startedAt: '2022-01-01',
        endedAt: null,
        gpa: '1.40',
        honors: ["Dean's List"],
        relevantCourses: ['Algorithms'],
      },
    ],
  },
  experiences: [{ company: 'Test Co', position: 'Dev', startedAt: '2025-01-01', endedAt: null }],
  projects: [{ title: 'Test Project', year: 2025, repositoryURL: null, liveURL: null, tags: ['React'] }],
  technologies: [{ name: 'TypeScript', category: 'Languages', proficiency: 5 }],
  certifications: [{ title: 'Test Cert', issuer: 'Test Org', issuedAt: '2025', tags: [] }],
  memberships: [{ name: 'PSIA', url: 'https://example.com', joinedAt: '2025-01-01' }],
  socialLinks: [{ name: 'github', link: 'https://github.com/PP-Namias' }],
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(function () {
    return { getGenerativeModel: mockGetGenerativeModel };
  }),
}));

vi.mock('@/lib/cms-content.server', () => ({
  getCmsContent: vi.fn(async () => mockCmsContent),
}));

import { GET, POST } from '@/app/api/chat/route';
import { NextRequest } from 'next/server';

let testCounter = 0;

function createRequest(body: unknown, headers?: Record<string, string>): NextRequest {
  // Use unique IP per request to avoid rate-limit cross-contamination
  testCounter++;
  const req = new NextRequest('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': `test-ip-${testCounter}`,
      ...headers,
    },
    body: JSON.stringify(body),
  });
  return req;
}

describe('/api/chat route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set API key for each test
    vi.stubEnv('GOOGLE_GEMINI_API_KEY', 'test-api-key');
    vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'false');
    vi.stubEnv('OPENAI_API_KEY', '');
    vi.stubEnv('OPENAI_MODEL', 'gpt-4o-mini');
    vi.stubEnv('OPENAI_BASE_URL', 'https://api.openai.com/v1');
    vi.stubEnv('CHAT_PROVIDER_TIMEOUT_MS', '12000');
    vi.stubEnv('CHAT_PROVIDER_MAX_RETRIES', '1');
    vi.stubEnv('CHAT_PROVIDER_RETRY_BASE_MS', '120');
    vi.stubEnv('CHAT_PROVIDER_CIRCUIT_FAILURE_THRESHOLD', '4');
    vi.stubEnv('CHAT_PROVIDER_CIRCUIT_COOLDOWN_MS', '60000');
    mockSendMessage.mockResolvedValue({
      response: { text: () => 'Hello! I can help you learn about Keneth.' },
    });
  });

  // --- Input Validation ---
  
  it('returns 400 when message is missing', async () => {
    const req = createRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Message is required.');
  });

  it('returns 400 when message is not a string', async () => {
    const req = createRequest({ message: 123 });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Message is required.');
  });

  it('returns 400 when message is empty after trimming', async () => {
    const req = createRequest({ message: '   ' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Message cannot be empty.');
  });

  it('returns 400 when message exceeds 500 characters', async () => {
    const longMsg = 'a'.repeat(501);
    const req = createRequest({ message: longMsg });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Message is too long. Maximum 500 characters.');
  });

  it('treats HTML-like input as plain text', async () => {
    const req = createRequest({ message: '<script>alert("xss")</script>Can you explain your decision-making process?' });
    const res = await POST(req);
    // Should succeed and pass plain text through to Gemini for non-preset intent
    expect(res.status).toBe(200);
    expect(mockSendMessage).toHaveBeenCalledWith('<script>alert("xss")</script>Can you explain your decision-making process?');
  });

  it('returns 400 when body is invalid JSON', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  // --- Successful Response ---
  
  it('returns 200 with AI response for valid message', async () => {
    const req = createRequest({ message: 'Can you explain your decision-making process?' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe('Hello! I can help you learn about Keneth.');
    expect(data.fallback).toBe(false);
  });

  it('passes generationConfig to Gemini model', async () => {
    const req = createRequest({ message: 'Please discuss your approach to solving ambiguous problems.' });
    await POST(req);
    expect(mockGetGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({
        generationConfig: expect.objectContaining({
          temperature: 0.6,
          topP: 0.85,
          maxOutputTokens: 1024,
        }),
      })
    );
  });

  it('passes conversation history to Gemini', async () => {
    const req = createRequest({
      message: 'Tell me more',
      history: [
        { role: 'user', content: 'What projects have you built?' },
        { role: 'assistant', content: 'Keneth has 7 projects...' },
      ],
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    // Verify startChat was called with history
    expect(mockStartChat).toHaveBeenCalled();
    const callArgs = mockStartChat.mock.calls.at(0)?.[0];
    if (!callArgs) {
      throw new Error('Expected startChat to be called with history.');
    }
    // Should have 2 history messages (no system prompt pair — uses systemInstruction now)
    expect(callArgs.history.length).toBe(2);
  });

  it('maps assistant history role to model and all other roles to user', async () => {
    const req = createRequest({
      message: 'Can you explain your decision-making process?',
      history: [
        { role: 'assistant', content: 'Prior answer' },
        { role: 'user', content: 'Next question' },
        { role: 'system', content: 'Ignored role should become user' },
      ],
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const callArgs = mockStartChat.mock.calls.at(0)?.[0];
    if (!callArgs) {
      throw new Error('Expected startChat to be called with history roles.');
    }
    expect(callArgs.history[0].role).toBe('model');
    expect(callArgs.history[1].role).toBe('user');
    expect(callArgs.history[2].role).toBe('user');
  });

  it('limits history to last 10 messages', async () => {
    const history = Array.from({ length: 15 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i}`,
    }));
    const req = createRequest({ message: 'Latest question', history });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const callArgs = mockStartChat.mock.calls.at(0)?.[0];
    if (!callArgs) {
      throw new Error('Expected startChat to be called with capped history.');
    }
    // 10 (capped history) — no system prompt pair anymore
    expect(callArgs.history.length).toBe(10);
  });

  // --- API Key ---
  
  it('returns fallback response when API key is not configured', async () => {
    vi.stubEnv('GOOGLE_GEMINI_API_KEY', '');
    const req = createRequest({ message: 'Can you explain your decision-making process?' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.fallback).toBe(true);
    expect(data.message).toContain('portfolio assistant');
    expect(data.message.toLowerCase()).not.toMatch(/backup mode|fallback mode|degraded/);
  });

  // --- Error Handling ---
  
  it('returns fallback response when Gemini API fails with non-quota error', async () => {
    mockSendMessage.mockRejectedValue(new Error('Network connection failed'));
    const req = createRequest({ message: 'Can you explain your decision-making process?' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.fallback).toBe(true);
    expect(data.message).toContain('portfolio assistant');
    expect(data.message.toLowerCase()).not.toMatch(/backup mode|fallback mode|degraded/);
  });

  it('returns fallback response when all models hit quota limit', async () => {
    mockSendMessage.mockRejectedValue(new Error('429 Too Many Requests: Quota exceeded'));
    const req = createRequest({ message: 'Can you explain your decision-making process?' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.fallback).toBe(true);
    expect(data.message).toContain('portfolio assistant');
    expect(data.message.toLowerCase()).not.toMatch(/backup mode|fallback mode|degraded/);
  });

  it('returns fallback response when Gemini returns empty text', async () => {
    mockSendMessage.mockResolvedValue({
      response: { text: () => '   ' },
    });

    const req = createRequest({ message: 'Can you explain your decision-making process?' });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.fallback).toBe(true);
    expect(data.message).toContain('portfolio assistant');
    expect(data.message.toLowerCase()).not.toMatch(/backup mode|fallback mode|degraded/);
  });

  it('returns AI-generated resume response with action tag', async () => {
    const req = createRequest({ message: 'Can I get your resume?' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.fallback).toBe(false);
    expect(mockGetGenerativeModel).toHaveBeenCalled();
  });

  it('returns AI-generated contact response', async () => {
    const req = createRequest({ message: 'How can I contact Keneth?' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.fallback).toBe(false);
    expect(mockGetGenerativeModel).toHaveBeenCalled();
  });

  it('returns AI-generated booking response', async () => {
    const req = createRequest({ message: 'Can we schedule a meeting?' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.fallback).toBe(false);
    expect(mockGetGenerativeModel).toHaveBeenCalled();
  });

  it('returns AI-generated skills response', async () => {
    const req = createRequest({ message: 'What tech stack do you specialize in?' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.fallback).toBe(false);
    expect(mockGetGenerativeModel).toHaveBeenCalled();
  });

  it('returns AI-generated projects response', async () => {
    const req = createRequest({ message: 'What projects have you built?' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.fallback).toBe(false);
    expect(mockGetGenerativeModel).toHaveBeenCalled();
  });

  it('routes all messages through AI provider for intelligent responses', async () => {
    const req = createRequest({ message: 'What are your key achievements?' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.fallback).toBe(false);
    expect(mockGetGenerativeModel).toHaveBeenCalled();
  });

  it('returns AI-generated experience response', async () => {
    const req = createRequest({ message: 'Tell me about your work experience' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.fallback).toBe(false);
    expect(mockGetGenerativeModel).toHaveBeenCalled();
  });

  it('returns AI-generated certification response', async () => {
    const req = createRequest({ message: 'What certifications do you have?' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.fallback).toBe(false);
    expect(mockGetGenerativeModel).toHaveBeenCalled();
  });

  it('returns AI-generated profile intro for "Who is Keneth" intent', async () => {
    const req = createRequest({ message: 'Who is Keneth?' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.fallback).toBe(false);
    expect(mockGetGenerativeModel).toHaveBeenCalled();
  });

  it('returns AI-generated education response with GWA wording', async () => {
    const req = createRequest({ message: 'Tell me about your education' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.fallback).toBe(false);
    expect(mockGetGenerativeModel).toHaveBeenCalled();
  });

  it('falls back to next model when first model quota is exhausted', async () => {
    mockSendMessage
      .mockRejectedValueOnce(new Error('429 quota exceeded'))
      .mockResolvedValueOnce({
        response: { text: () => 'Fallback model response' },
      });
    const req = createRequest({ message: 'Can you explain your decision-making process?' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe('Fallback model response');
  });

  it('returns fallback from outer catch when an unexpected error occurs after sanitization', async () => {
    mockSendMessage.mockRejectedValue(new Error('Provider failure'));
    vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'false');
    vi.stubEnv('OPENAI_API_KEY', '');

    const req = createRequest({ message: 'Can I get your resume?' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.fallback).toBe(true);
    expect(data.message).toContain('Keneth');
  });

  it('returns 500 from outer catch when an unexpected error occurs before fallback message is set', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-real-ip': 'trim-error-test-ip',
      },
      body: JSON.stringify({ message: 'Can you explain your decision-making process?' }),
    });
    const trimSpy = vi.spyOn(String.prototype, 'trim').mockImplementationOnce(() => {
      throw new Error('Unexpected trim failure');
    });

    try {
      const res = await POST(req);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.error).toBe('Something went wrong. Please try again.');
    } finally {
      trimSpy.mockRestore();
    }
  });

  // --- Health & Resilience ---

  it('returns active health status when at least one provider is available', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.status).toBe('active');
    expect(data.providers.gemini.configured).toBe(true);
  });

  it('returns inactive health status when no provider is configured', async () => {
    vi.stubEnv('GOOGLE_GEMINI_API_KEY', '');
    vi.stubEnv('OPENAI_API_KEY', '');
    vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'true');

    const res = await GET();
    expect(res.status).toBe(503);
    const data = await res.json();

    expect(data.status).toBe('inactive');
    expect(data.providers.gemini.configured).toBe(false);
    expect(data.providers.openai.configured).toBe(false);
  });

  it('returns x-request-id response header for traceability', async () => {
    const req = createRequest(
      { message: 'Can you explain your decision-making process?' },
      { 'x-request-id': 'chat-test-request-id' }
    );

    const res = await POST(req);
    expect(res.headers.get('x-request-id')).toBe('chat-test-request-id');
  });

  it('uses secondary provider when primary provider fails and multi-provider is enabled', async () => {
    vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'true');
    vi.stubEnv('OPENAI_API_KEY', 'openai-test-key');
    vi.stubEnv('CHAT_PROVIDER_MAX_RETRIES', '0');

    mockSendMessage.mockRejectedValue(new Error('Primary provider network failure'));

    const openaiFetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: 'Secondary provider response.' } }],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    try {
      const req = createRequest({ message: 'Can you explain your decision-making process?' });
      const res = await POST(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.message).toBe('Secondary provider response.');
      expect(data.fallback).toBe(false);

      expect(openaiFetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/chat/completions'),
        expect.objectContaining({ method: 'POST' })
      );
    } finally {
      openaiFetchSpy.mockRestore();
    }
  });

  it('times out primary provider and succeeds via secondary provider', async () => {
    vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'true');
    vi.stubEnv('OPENAI_API_KEY', 'openai-test-key');
    vi.stubEnv('CHAT_PROVIDER_TIMEOUT_MS', '5');
    vi.stubEnv('CHAT_PROVIDER_MAX_RETRIES', '0');

    mockSendMessage.mockImplementation(() => new Promise(() => {}));

    const openaiFetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: 'Recovered through secondary provider.' } }],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    try {
      const req = createRequest({ message: 'Can you explain your decision-making process?' });
      const res = await POST(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.message).toBe('Recovered through secondary provider.');
      expect(data.fallback).toBe(false);
    } finally {
      openaiFetchSpy.mockRestore();
    }
  });

  it('falls back to curated response when both providers fail', async () => {
    vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'true');
    vi.stubEnv('OPENAI_API_KEY', 'openai-test-key');
    vi.stubEnv('CHAT_PROVIDER_MAX_RETRIES', '0');

    mockSendMessage.mockRejectedValue(new Error('Primary provider down'));

    const openaiFetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ error: { message: 'secondary unavailable' } }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    try {
      const req = createRequest({ message: 'Can you explain your decision-making process?' });
      const res = await POST(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.fallback).toBe(true);
      expect(data.message).toContain('portfolio assistant');
      expect(data.message.toLowerCase()).not.toMatch(/backup mode|fallback mode|degraded/);
    } finally {
      openaiFetchSpy.mockRestore();
    }
  });

  // --- Rate Limiting ---
  
  it('returns 429 after exceeding rate limit', async () => {
    // Use a unique IP for this test to avoid cross-test contamination
    const testIp = `rate-limit-test-${Date.now()}`;
    
    // Send 10 requests (should all succeed)
    for (let i = 0; i < 10; i++) {
      const req = createRequest(
        { message: `Request ${i}` },
        { 'x-forwarded-for': testIp }
      );
      const res = await POST(req);
      expect(res.status).toBe(200);
    }

    // 11th request should be rate-limited
    const req = createRequest(
      { message: 'One more' },
      { 'x-forwarded-for': testIp }
    );
    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toContain('Too many requests');
  });
});
