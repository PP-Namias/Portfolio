import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import type { ThreadMetadata } from './types'

const isServerless =
  process.env.VERCEL === '1' ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
  process.env.NODE_ENV === 'production'

const DATA_DIR = join(isServerless ? tmpdir() : process.cwd(), '.chat-data')
const CHECKPOINTS_FILE = join(DATA_DIR, 'checkpoints.json')
const THREADS_FILE = join(DATA_DIR, 'threads.json')
const MESSAGES_FILE = join(DATA_DIR, 'messages.json')

const memoryStore = new Map<string, string>()
let fsAvailable = true

function readJson<T>(filePath: string, fallback: T): T {
  if (fsAvailable) {
    try {
      if (!existsSync(filePath)) return fallback
      return JSON.parse(readFileSync(filePath, 'utf-8')) as T
    } catch {
      fsAvailable = false
    }
  }
  const raw = memoryStore.get(filePath)
  if (raw === undefined) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(filePath: string, data: T): void {
  const serialized = JSON.stringify(data, null, 2)
  if (fsAvailable) {
    try {
      if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true })
      }
      writeFileSync(filePath, serialized, 'utf-8')
      return
    } catch {
      fsAvailable = false
    }
  }
  memoryStore.set(filePath, serialized)
}

interface CheckpointRecord {
  threadId: string
  checkpointId: string
  state: Record<string, unknown>
  createdAt: string
}

interface PersistedMessageRecord {
  id: number
  threadId: string
  role: string
  content: string
  toolCalls: string | null
  createdAt: string
}

export function saveCheckpoint(threadId: string, state: Record<string, unknown>): void {
  const checkpoints = readJson<CheckpointRecord[]>(CHECKPOINTS_FILE, [])
  const existing = checkpoints.findIndex((c) => c.threadId === threadId)
  const record: CheckpointRecord = {
    threadId,
    checkpointId: `cp_${Date.now()}`,
    state,
    createdAt: new Date().toISOString(),
  }
  if (existing >= 0) {
    checkpoints[existing] = record
  } else {
    checkpoints.push(record)
  }
  writeJson(CHECKPOINTS_FILE, checkpoints)
}

export function loadCheckpoint(threadId: string): Record<string, unknown> | null {
  const checkpoints = readJson<CheckpointRecord[]>(CHECKPOINTS_FILE, [])
  const record = checkpoints.find((c) => c.threadId === threadId)
  return record ? record.state : null
}

export function deleteCheckpoint(threadId: string): void {
  let checkpoints = readJson<CheckpointRecord[]>(CHECKPOINTS_FILE, [])
  checkpoints = checkpoints.filter((c) => c.threadId !== threadId)
  writeJson(CHECKPOINTS_FILE, checkpoints)
}

export function listThreads(): ThreadMetadata[] {
  return readJson<ThreadMetadata[]>(THREADS_FILE, [])
}

export function getThread(id: string): ThreadMetadata | null {
  const threads = listThreads()
  return threads.find((t) => t.id === id) || null
}

export function createThread(id: string, title: string): ThreadMetadata {
  const threads = listThreads()
  const now = new Date().toISOString()
  const thread: ThreadMetadata = {
    id,
    title,
    createdAt: now,
    updatedAt: now,
    messageCount: 0,
  }
  threads.push(thread)
  if (threads.length > 50) {
    threads.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))
    const removed = threads.shift()
    if (removed) {
      deleteCheckpoint(removed.id)
      deleteThreadMessages(removed.id)
    }
  }
  writeJson(THREADS_FILE, threads)
  return thread
}

export function updateThread(id: string, updates: Partial<ThreadMetadata>): ThreadMetadata | null {
  const threads = listThreads()
  const index = threads.findIndex((t) => t.id === id)
  if (index < 0) return null
  threads[index] = { ...threads[index], ...updates, updatedAt: new Date().toISOString() }
  writeJson(THREADS_FILE, threads)
  return threads[index]
}

export function deleteThread(id: string): boolean {
  const threads = listThreads()
  const index = threads.findIndex((t) => t.id === id)
  if (index < 0) return false
  threads.splice(index, 1)
  writeJson(THREADS_FILE, threads)
  deleteCheckpoint(id)
  deleteThreadMessages(id)
  return true
}

export function saveMessage(
  threadId: string,
  role: string,
  content: string,
  toolCalls: string | null = null
): PersistedMessageRecord {
  const messages = readJson<PersistedMessageRecord[]>(MESSAGES_FILE, [])
  const id = messages.length > 0 ? Math.max(...messages.map((m) => m.id)) + 1 : 1
  const record: PersistedMessageRecord = {
    id,
    threadId,
    role,
    content,
    toolCalls,
    createdAt: new Date().toISOString(),
  }
  messages.push(record)
  writeJson(MESSAGES_FILE, messages)
  updateThread(threadId, { messageCount: getThreadMessages(threadId).length + 1 })
  return record
}

export function getThreadMessages(threadId: string): PersistedMessageRecord[] {
  const messages = readJson<PersistedMessageRecord[]>(MESSAGES_FILE, [])
  return messages.filter((m) => m.threadId === threadId)
}

export function deleteThreadMessages(threadId: string): void {
  const messages = readJson<PersistedMessageRecord[]>(MESSAGES_FILE, [])
  const filtered = messages.filter((m) => m.threadId !== threadId)
  writeJson(MESSAGES_FILE, filtered)
}
