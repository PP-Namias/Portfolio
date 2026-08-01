import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockRunChatGraph = vi.hoisted(() => vi.fn());
const mockSaveMessage = vi.hoisted(() => vi.fn());

vi.mock('@/lib/features', () => ({
  IS_BLOG_VISIBLE: true,
  IS_MAGIC_CURSOR_VISIBLE: true,
  IS_PROJECTS_REVAMP_ENABLED: true,
  IS_STREAMING_SSR_ENABLED: true,
  IS_LANGGRAPH_ENABLED: true,
  IS_CHAT_STREAMING_ENABLED: true,
  IS_CHAT_THREADING_ENABLED: true,
}));

vi.mock('@/lib/cms-content.server', () => ({
  getCmsContent: vi.fn(async () => ({
    profile: { name: 'Jhon Keneth Ryan Namias', title: 'Full Stack Engineer', email: 'pp.namias@gmail.com' },
    experiences: [],
    projects: [],
    technologies: [],
    certifications: [],
    memberships: [],
    socialLinks: [],
  })),
}));

vi.mock('@/lib/chat/graph', () => ({
  runChatGraph: mockRunChatGraph,
}));

vi.mock('@/lib/chat/persistence', () => ({
  saveMessage: mockSaveMessage,
}));

vi.mock('@/lib/rag/retriever', () => ({
  retrieve: vi.fn(async () => []),
  formatContext: vi.fn(() => ''),
  isRagConfigured: vi.fn(() => false),
}));

import { GET, POST } from '@/app/api/chat/route';

let testCounter = 0;

function createRequest(body: unknown, headers?: Record<string, string>): NextRequest {
  testCounter++;
  return new NextRequest('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': `sse-test-ip-${testCounter}`,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function parseSSE(raw: string): Array<{ event: string; data: string }> {
  const events: Array<{ event: string; data: string }> = [];
  let currentEvent = '';
  for (const line of raw.split('\n')) {
    if (line.startsWith('event: ')) {
      currentEvent = line.slice(7).trim();
    } else if (line.startsWith('data: ')) {
      events.push({ event: currentEvent, data: line.slice(6).trim() });
    }
  }
  return events;
}

describe('/api/chat SSE streaming route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GOOGLE_GEMINI_API_KEY', 'test-api-key');
    vi.stubEnv('CHAT_MULTI_PROVIDER_ENABLED', 'false');

    mockRunChatGraph.mockImplementation(async ({
      message,
      onToken,
      onStatus,
    }: {
      message: string;
      onToken?: (token: string) => void;
      onStatus?: (step: string) => void;
    }) => {
      onStatus?.('classifying');
      onToken?.(`Hi! You asked: ${message} `);
      onToken?.('from the graph');
      onStatus?.('done');
      return { response: 'streamed response', threadId: 'thread-stream-1', toolCalls: [] };
    });
  });

  it('streams ordered SSE events with progressive tokens when streaming is accepted', async () => {
    const req = createRequest({ message: 'Tell me about your projects' }, { Accept: 'text/event-stream' });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/event-stream');

    const events = parseSSE(await res.text());
    const eventTypes = events.map((e) => e.event);

    expect(eventTypes[0]).toBe('status');
    expect(JSON.parse(events[0].data).step).toBe('start');

    const tokenEvents = events.filter((e) => e.event === 'token');
    expect(tokenEvents.length).toBe(2);
    expect(JSON.parse(tokenEvents[0].data).content).toBe('Hi! You asked: Tell me about your projects ');
    expect(JSON.parse(tokenEvents[1].data).content).toBe('from the graph');

    expect(eventTypes).toContain('done');
    expect(eventTypes).not.toContain('error');
    expect(mockRunChatGraph).toHaveBeenCalledTimes(1);
    expect(mockRunChatGraph.mock.calls[0][0].threadId).toBeDefined();
  });

  it('persists the user and assistant messages after a successful stream', async () => {
    const req = createRequest(
      { message: 'Hello there', threadId: 'thread-abc' },
      { Accept: 'text/event-stream' }
    );
    const res = await POST(req);
    expect(res.status).toBe(200);

    const events = parseSSE(await res.text());
    const doneEvent = events.find((e) => e.event === 'done');
    expect(JSON.parse(doneEvent!.data).threadId).toBe('thread-abc');

    expect(mockSaveMessage).toHaveBeenCalledWith('thread-abc', 'user', 'Hello there');
    expect(mockSaveMessage).toHaveBeenCalledWith('thread-abc', 'assistant', 'streamed response');
  });

  it('emits an error event when the graph fails', async () => {
    mockRunChatGraph.mockRejectedValueOnce(new Error('graph exploded'));

    const req = createRequest({ message: 'Hi' }, { Accept: 'text/event-stream' });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const events = parseSSE(await res.text());
    const errorEvent = events.find((e) => e.event === 'error');
    expect(errorEvent).toBeDefined();
    expect(JSON.parse(errorEvent!.data).error).toBe('graph exploded');
  });

  it('returns JSON (not SSE) when streaming is not accepted', async () => {
    mockRunChatGraph.mockImplementationOnce(async ({ message }: { message: string }) => ({
      response: `answer for ${message}`,
      threadId: 'thread-json-1',
      toolCalls: [],
    }));

    const req = createRequest({ message: 'Hello' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).not.toContain('text/event-stream');

    const data = await res.json();
    expect(data.message).toBe('answer for Hello');
    expect(data.threadId).toBe('thread-json-1');
  });

  it('returns provider health from GET', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('active');
    expect(data.providers.gemini.configured).toBe(true);
  });
});
