import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @google/generative-ai before importing route
const mockSendMessage = vi.fn();
const mockStartChat = vi.fn(() => ({
  sendMessage: mockSendMessage,
}));
const mockGetGenerativeModel = vi.fn(() => ({
  startChat: mockStartChat,
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(function () {
    return { getGenerativeModel: mockGetGenerativeModel };
  }),
}));

// Mock portfolio JSON data
vi.mock('../../../../portfolio-resources/data/profile.json', () => ({
  default: { name: 'Jhon Keneth Ryan Namias', title: 'Full Stack Engineer & AI Automation Specialist' },
}));
vi.mock('../../../../portfolio-resources/data/experiences.json', () => ({
  default: [{ company: 'Test Co', position: 'Dev' }],
}));
vi.mock('../../../../portfolio-resources/data/projects.json', () => ({
  default: [{ title: 'Test Project' }],
}));
vi.mock('../../../../portfolio-resources/data/technologies.json', () => ({
  default: [{ name: 'TypeScript', category: 'Languages' }],
}));
vi.mock('../../../../portfolio-resources/data/certifications.json', () => ({
  default: [{ title: 'Test Cert', issuer: 'Test Org', issuedAt: '2025' }],
}));
vi.mock('../../../../portfolio-resources/data/memberships.json', () => ({
  default: [{ name: 'PSIA' }],
}));
vi.mock('../../../../portfolio-resources/data/socials.json', () => ({
  default: [{ name: 'GitHub', link: 'https://github.com/PP-Namias' }],
}));

import { POST } from '@/app/api/chat/route';
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

  it('strips HTML tags from message', async () => {
    const req = createRequest({ message: '<script>alert("xss")</script>Hello' });
    const res = await POST(req);
    // Should succeed after stripping - "alert("xss")Hello" is the sanitized text
    expect(res.status).toBe(200);
    expect(mockSendMessage).toHaveBeenCalledWith('alert("xss")Hello');
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
    const req = createRequest({ message: 'What tech stack do you use?' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe('Hello! I can help you learn about Keneth.');
  });

  it('passes generationConfig to Gemini model', async () => {
    const req = createRequest({ message: 'Hello' });
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
    const callArgs = mockStartChat.mock.calls[0][0];
    // Should have 2 history messages (no system prompt pair — uses systemInstruction now)
    expect(callArgs.history.length).toBe(2);
  });

  it('limits history to last 10 messages', async () => {
    const history = Array.from({ length: 15 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i}`,
    }));
    const req = createRequest({ message: 'Latest question', history });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const callArgs = mockStartChat.mock.calls[0][0];
    // 10 (capped history) — no system prompt pair anymore
    expect(callArgs.history.length).toBe(10);
  });

  // --- API Key ---
  
  it('returns 503 when API key is not configured', async () => {
    vi.stubEnv('GOOGLE_GEMINI_API_KEY', '');
    const req = createRequest({ message: 'Hello' });
    const res = await POST(req);
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toBe('Chat service is not configured.');
  });

  // --- Error Handling ---
  
  it('returns 500 with generic error when Gemini API fails with non-quota error', async () => {
    mockSendMessage.mockRejectedValue(new Error('Network connection failed'));
    const req = createRequest({ message: 'Hello' });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('Something went wrong. Please try again.');
  });

  it('returns 429 when all models hit quota limit', async () => {
    mockSendMessage.mockRejectedValue(new Error('429 Too Many Requests: Quota exceeded'));
    const req = createRequest({ message: 'Hello' });
    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toContain('temporarily at capacity');
  });

  it('falls back to next model when first model quota is exhausted', async () => {
    mockSendMessage
      .mockRejectedValueOnce(new Error('429 quota exceeded'))
      .mockResolvedValueOnce({
        response: { text: () => 'Fallback model response' },
      });
    const req = createRequest({ message: 'Hello' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe('Fallback model response');
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
