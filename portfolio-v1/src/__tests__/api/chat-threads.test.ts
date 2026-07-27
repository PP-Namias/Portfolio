import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/cms-content.server', () => ({
  getCmsContent: vi.fn(async () => ({
    profile: { name: 'Keneth' },
    experiences: [],
    projects: [],
    technologies: [],
    certifications: [],
    memberships: [],
    socialLinks: [],
  })),
}));

const mockGenerateWithGemini = vi.fn();
vi.mock('@/app/api/chat/lib/providers', () => ({
  generateWithGemini: mockGenerateWithGemini,
  generateWithOpenAI: vi.fn(),
  getProviderHealth: vi.fn(() => ({ status: 'active', providers: { gemini: { configured: true, circuitOpen: false } }, multiProviderEnabled: false })),
  isMultiProviderEnabled: vi.fn(() => false),
  classifyProviderError: vi.fn(() => 'error'),
}));

vi.mock('@/lib/chat/persistence', () => ({
  listThreads: vi.fn(() => [
    { id: 't1', title: 'Test Thread', createdAt: '2026-01-01', updatedAt: '2026-01-01', messageCount: 5 },
    { id: 't2', title: 'Another Thread', createdAt: '2026-01-02', updatedAt: '2026-01-02', messageCount: 3 },
  ]),
  createThread: vi.fn((id, title) => ({
    id, title, createdAt: '2026-07-27', updatedAt: '2026-07-27', messageCount: 0,
  })),
  getThread: vi.fn((id) => {
    if (id === 't1') return { id: 't1', title: 'Test Thread', createdAt: '2026-01-01', updatedAt: '2026-01-01', messageCount: 5 };
    return null;
  }),
  updateThread: vi.fn((id, updates) => {
    if (id === 't1') return { id: 't1', title: updates.title || 'Test Thread', createdAt: '2026-01-01', updatedAt: '2026-07-27', messageCount: 5 };
    return null;
  }),
  deleteThread: vi.fn((id) => id === 't1'),
  getThreadMessages: vi.fn(() => [
    { id: 1, threadId: 't1', role: 'user', content: 'Hi', toolCalls: null, createdAt: '2026-01-01' },
  ]),
}));

import { GET, POST } from '@/app/api/chat/threads/route';
import { GET as getThread, PATCH, DELETE } from '@/app/api/chat/threads/[id]/route';

describe('Threads API - GET /api/chat/threads', () => {
  it('should return list of threads', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.threads).toBeDefined();
    expect(Array.isArray(data.threads)).toBe(true);
  });
});

describe('Threads API - POST /api/chat/threads', () => {
  it('should create a new thread', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Thread' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.thread).toBeDefined();
    expect(data.thread.title).toBe('New Thread');
  });

  it('should use default title when not provided', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.thread.title).toBe('New Conversation');
  });
});

describe('Threads API - GET /api/chat/threads/[id]', () => {
  it('should return thread with messages', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat/threads/t1');
    const res = await getThread(req, { params: Promise.resolve({ id: 't1' }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.thread).toBeDefined();
    expect(data.messages).toBeDefined();
  });

  it('should return 404 for non-existent thread', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat/threads/nonexistent');
    const res = await getThread(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(res.status).toBe(404);
  });
});

describe('Threads API - PATCH /api/chat/threads/[id]', () => {
  it('should rename a thread', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat/threads/t1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Renamed' }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 't1' }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.thread.title).toBe('Renamed');
  });

  it('should return 400 when title is empty', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat/threads/t1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 't1' }) });
    expect(res.status).toBe(400);
  });

  it('should return 404 for non-existent thread', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat/threads/nonexistent', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Name' }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(res.status).toBe(404);
  });
});

describe('Threads API - DELETE /api/chat/threads/[id]', () => {
  it('should delete a thread', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat/threads/t1', {
      method: 'DELETE',
    });
    const res = await DELETE(req, { params: Promise.resolve({ id: 't1' }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it('should return 404 for non-existent thread', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat/threads/nonexistent', {
      method: 'DELETE',
    });
    const res = await DELETE(req, { params: Promise.resolve({ id: 'nonexistent' }) });
    expect(res.status).toBe(404);
  });
});
