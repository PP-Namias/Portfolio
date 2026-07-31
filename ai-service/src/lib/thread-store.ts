import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

import type { Citation } from '../graph/types';

export interface ThreadMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  createdAt: string;
}

export interface Thread {
  id: string;
  title: string;
  messages: ThreadMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ThreadSummary {
  id: string;
  title: string;
  messageCount: number;
  updatedAt: string;
}

export interface ThreadStoreOptions {
  filePath?: string;
}

const DEFAULT_FILE_PATH = '.ai-service-data/threads.json';

let threads = new Map<string, Thread>();
let loadedPath: string | null = null;

async function load(filePath: string): Promise<void> {
  if (loadedPath === filePath) {
    return;
  }
  try {
    const raw = await readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as Thread[];
    threads = new Map(parsed.map((thread) => [thread.id, thread]));
  } catch {
    threads = new Map();
  }
  loadedPath = filePath;
}

async function persist(filePath: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify([...threads.values()], null, 2), 'utf8');
}

export function createThreadStore(options: ThreadStoreOptions = {}) {
  const filePath = options.filePath ?? process.env.AI_SERVICE_THREADS_FILE ?? DEFAULT_FILE_PATH;

  return {
    async list(): Promise<ThreadSummary[]> {
      await load(filePath);
      return [...threads.values()]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .map((thread) => ({
          id: thread.id,
          title: thread.title,
          messageCount: thread.messages.length,
          updatedAt: thread.updatedAt,
        }));
    },

    async get(id: string): Promise<Thread | null> {
      await load(filePath);
      return threads.get(id) ?? null;
    },

    async create(title = 'New conversation'): Promise<Thread> {
      await load(filePath);
      const now = new Date().toISOString();
      const thread: Thread = { id: randomUUID(), title, messages: [], createdAt: now, updatedAt: now };
      threads.set(thread.id, thread);
      await persist(filePath);
      return thread;
    },

    async update(id: string, patch: { title?: string }): Promise<Thread | null> {
      await load(filePath);
      const thread = threads.get(id);
      if (!thread) {
        return null;
      }
      if (patch.title !== undefined) {
        thread.title = patch.title.trim() || thread.title;
      }
      thread.updatedAt = new Date().toISOString();
      await persist(filePath);
      return thread;
    },

    async remove(id: string): Promise<boolean> {
      await load(filePath);
      const existed = threads.delete(id);
      if (existed) {
        await persist(filePath);
      }
      return existed;
    },

    async appendMessage(id: string, message: Omit<ThreadMessage, 'createdAt'>): Promise<Thread | null> {
      await load(filePath);
      const thread = threads.get(id);
      if (!thread) {
        return null;
      }
      thread.messages.push({ ...message, createdAt: new Date().toISOString() });
      thread.updatedAt = new Date().toISOString();
      await persist(filePath);
      return thread;
    },
  };
}
