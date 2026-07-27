import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('fs', () => {
  const store: Record<string, string> = {};
  (globalThis as unknown as Record<string, unknown>).__mockFileStore = store;
  const mockExistsSync = (path: string) => path in store;
  const mockReadFileSync = (path: string, _enc?: string) => {
    if (!(path in store)) throw new Error('ENOENT');
    return store[path];
  };
  const mockWriteFileSync = (path: string, data: string) => {
    store[path] = data;
  };
  const mockMkdirSync = vi.fn();
  return {
    existsSync: mockExistsSync,
    readFileSync: mockReadFileSync,
    writeFileSync: mockWriteFileSync,
    mkdirSync: mockMkdirSync,
    default: {
      existsSync: mockExistsSync,
      readFileSync: mockReadFileSync,
      writeFileSync: mockWriteFileSync,
      mkdirSync: mockMkdirSync,
    },
  };
});

vi.mock('path', () => {
  const mockJoin = (...args: string[]) => args.join('/');
  const mockResolve = (...args: string[]) => args.join('/');
  return {
    join: mockJoin,
    resolve: mockResolve,
    default: { join: mockJoin, resolve: mockResolve },
  };
});

process.cwd = vi.fn(() => '/test');

import {
  saveCheckpoint,
  loadCheckpoint,
  deleteCheckpoint,
  listThreads,
  createThread,
  getThread,
  updateThread,
  deleteThread,
  saveMessage,
  getThreadMessages,
  deleteThreadMessages,
} from '@/lib/chat/persistence';

function clearFileStore() {
  const store = (globalThis as unknown as Record<string, unknown>).__mockFileStore as Record<string, string> | undefined;
  if (store) {
    Object.keys(store).forEach((k) => delete store[k]);
  }
}

describe('Persistence', () => {
  beforeEach(() => {
    clearFileStore();
  });

  describe('Thread CRUD', () => {
    it('should create a thread with metadata', () => {
      const thread = createThread('thread-1', 'Test Thread');
      expect(thread.id).toBe('thread-1');
      expect(thread.title).toBe('Test Thread');
      expect(thread.messageCount).toBe(0);
      expect(thread.createdAt).toBeDefined();
      expect(thread.updatedAt).toBeDefined();
    });

    it('should list all threads', () => {
      createThread('t1', 'Thread 1');
      createThread('t2', 'Thread 2');
      const threads = listThreads();
      expect(threads.length).toBeGreaterThanOrEqual(2);
    });

    it('should get a thread by id', () => {
      createThread('get-test', 'Get Test');
      const thread = getThread('get-test');
      expect(thread).not.toBeNull();
      expect(thread!.title).toBe('Get Test');
    });

    it('should return null for non-existent thread', () => {
      const thread = getThread('non-existent');
      expect(thread).toBeNull();
    });

    it('should update a thread', () => {
      createThread('update-test', 'Original');
      const updated = updateThread('update-test', { title: 'Updated Title' });
      expect(updated).not.toBeNull();
      expect(updated!.title).toBe('Updated Title');
    });

    it('should return null when updating non-existent thread', () => {
      const result = updateThread('non-existent', { title: 'Nope' });
      expect(result).toBeNull();
    });

    it('should delete a thread', () => {
      createThread('delete-test', 'Delete Me');
      const deleted = deleteThread('delete-test');
      expect(deleted).toBe(true);
      expect(getThread('delete-test')).toBeNull();
    });

    it('should return false when deleting non-existent thread', () => {
      const result = deleteThread('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('Checkpoints', () => {
    it('should save and load a checkpoint', () => {
      const state = { messages: [{ role: 'user', content: 'hi' }], intent: 'greeting' };
      saveCheckpoint('cp-thread', state);
      const loaded = loadCheckpoint('cp-thread');
      expect(loaded).not.toBeNull();
      expect(loaded!.intent).toBe('greeting');
    });

    it('should return null for non-existent checkpoint', () => {
      const loaded = loadCheckpoint('non-existent');
      expect(loaded).toBeNull();
    });

    it('should overwrite existing checkpoint', () => {
      saveCheckpoint('overwrite-test', { count: 1 });
      saveCheckpoint('overwrite-test', { count: 2 });
      const loaded = loadCheckpoint('overwrite-test');
      expect(loaded!.count).toBe(2);
    });

    it('should delete checkpoint', () => {
      saveCheckpoint('del-cp', { data: 'test' });
      deleteCheckpoint('del-cp');
      expect(loadCheckpoint('del-cp')).toBeNull();
    });
  });

  describe('Messages', () => {
    it('should save a message', () => {
      const msg = saveMessage('msg-thread', 'user', 'Hello');
      expect(msg.threadId).toBe('msg-thread');
      expect(msg.role).toBe('user');
      expect(msg.content).toBe('Hello');
      expect(msg.id).toBeGreaterThan(0);
    });

    it('should retrieve thread messages', () => {
      saveMessage('list-thread', 'user', 'Q1');
      saveMessage('list-thread', 'assistant', 'A1');
      const messages = getThreadMessages('list-thread');
      expect(messages.length).toBe(2);
    });

    it('should return empty array for thread with no messages', () => {
      const messages = getThreadMessages('empty-thread');
      expect(messages).toEqual([]);
    });

    it('should delete thread messages', () => {
      saveMessage('del-msg', 'user', 'test');
      deleteThreadMessages('del-msg');
      expect(getThreadMessages('del-msg')).toEqual([]);
    });
  });
});
