import { describe, it, expect, vi } from 'vitest'

vi.mock('fs', () => {
  const throwReadOnly = () => {
    throw new Error('EACCES: permission denied, mkdir /var/task/portfolio-v1/.chat-data')
  }
  return {
    existsSync: throwReadOnly,
    readFileSync: throwReadOnly,
    writeFileSync: throwReadOnly,
    mkdirSync: throwReadOnly,
    default: {
      existsSync: throwReadOnly,
      readFileSync: throwReadOnly,
      writeFileSync: throwReadOnly,
      mkdirSync: throwReadOnly,
    },
  }
})

vi.mock('path', () => {
  const mockJoin = (...args: string[]) => args.join('/')
  const mockResolve = (...args: string[]) => args.join('/')
  return {
    join: mockJoin,
    resolve: mockResolve,
    default: { join: mockJoin, resolve: mockResolve },
  }
})

process.env.NODE_ENV = 'production'

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
} from '@/lib/chat/persistence'

describe('Persistence in-memory fallback on read-only filesystem', () => {
  it('should never throw and fall back to memory for thread CRUD', () => {
    const thread = createThread('mem-thread', 'Memory Thread')
    expect(thread.id).toBe('mem-thread')
    expect(thread.messageCount).toBe(0)
    expect(listThreads().some((t) => t.id === 'mem-thread')).toBe(true)
    expect(getThread('mem-thread')?.title).toBe('Memory Thread')
    const updated = updateThread('mem-thread', { title: 'Renamed' })
    expect(updated?.title).toBe('Renamed')
    expect(deleteThread('mem-thread')).toBe(true)
    expect(getThread('mem-thread')).toBeNull()
  })

  it('should fall back to memory for checkpoints', () => {
    const state = { messages: [{ role: 'user', content: 'hi' }], intent: 'greeting' }
    expect(() => saveCheckpoint('mem-cp', state)).not.toThrow()
    expect(loadCheckpoint('mem-cp')).toEqual(state)
    saveCheckpoint('mem-cp', { count: 2 })
    expect(loadCheckpoint('mem-cp')?.count).toBe(2)
    deleteCheckpoint('mem-cp')
    expect(loadCheckpoint('mem-cp')).toBeNull()
  })

  it('should fall back to memory for messages', () => {
    const msg = saveMessage('mem-msg', 'user', 'Hello')
    expect(msg.id).toBeGreaterThan(0)
    saveMessage('mem-msg', 'assistant', 'Hi there')
    const messages = getThreadMessages('mem-msg')
    expect(messages).toHaveLength(2)
    expect(messages[1].content).toBe('Hi there')
    deleteThreadMessages('mem-msg')
    expect(getThreadMessages('mem-msg')).toEqual([])
  })
})
