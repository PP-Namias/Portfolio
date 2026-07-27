'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Pencil, Check, X, MessageSquare, Sparkles } from 'lucide-react';

export interface ThreadInfo {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

interface ThreadSidebarProps {
  isOpen: boolean;
  currentThreadId: string | null;
  onSelectThread: (id: string) => void;
  onNewThread: () => void;
  onDeleteThread: (id: string) => void;
  onRenameThread: (id: string, title: string) => void;
  onClose: () => void;
}

export function ThreadSidebar({
  isOpen,
  currentThreadId,
  onSelectThread,
  onNewThread,
  onDeleteThread,
  onRenameThread,
  onClose,
}: Readonly<ThreadSidebarProps>) {
  const [threads, setThreads] = useState<ThreadInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadThreads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/chat/threads');
      if (res.ok) {
        const data = await res.json() as { threads: ThreadInfo[] };
        setThreads(data.threads);
      } else {
        setError('Failed to load conversations');
      }
    } catch {
      setError('Network error loading conversations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadThreads();
    }
  }, [isOpen, loadThreads]);

  const handleNewThread = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch('/api/chat/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      });
      if (res.ok) {
        const data = await res.json() as { thread: ThreadInfo };
        setThreads((prev) => [data.thread, ...prev]);
        onNewThread();
        onSelectThread(data.thread.id);
      } else {
        setError('Failed to create conversation');
      }
    } catch {
      setError('Network error creating conversation');
    }
  }, [onNewThread, onSelectThread]);

  const handleDelete = useCallback(async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/chat/threads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setThreads((prev) => prev.filter((t) => t.id !== id));
        onDeleteThread(id);
      } else {
        setError('Failed to delete conversation');
      }
    } catch {
      setError('Network error deleting conversation');
    }
    setConfirmDeleteId(null);
  }, [onDeleteThread]);

  const handleRename = useCallback(async (id: string) => {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/chat/threads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle.trim() }),
      });
      if (res.ok) {
        const data = await res.json() as { thread: ThreadInfo };
        setThreads((prev) => prev.map((t) => t.id === id ? data.thread : t));
        onRenameThread(id, editTitle.trim());
      } else {
        setError('Failed to rename conversation');
      }
    } catch {
      setError('Network error renaming conversation');
    }
    setEditingId(null);
  }, [editTitle, onRenameThread]);

  const startEditing = useCallback((id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 260, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="border-r border-border-light/60 dark:border-border-dark/60 bg-white dark:bg-card-bg-dark overflow-hidden flex flex-col flex-shrink-0"
        >
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-border-light/60 dark:border-border-dark/60">
            <span className="text-[11px] font-semibold text-text-primary-light dark:text-text-primary-dark tracking-tight">
              Conversations
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleNewThread}
                className="h-6 w-6 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                aria-label="New conversation"
              >
                <Plus className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-6 w-6 rounded-full flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-surface-dark transition-colors"
                aria-label="Close sidebar"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-accent-pink/60"
                      style={{ animation: `pulse 0.5s ease-in-out ${i * 0.12}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="mx-3 my-2 px-2 py-1.5 rounded bg-red-500/10 border border-red-500/20">
                <p className="text-[10px] text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {!isLoading && threads.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-8 px-3 text-center">
                <Sparkles className="h-5 w-5 text-text-muted-light dark:text-text-muted-dark mb-2" />
                <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark">
                  No conversations yet. Start a new one!
                </p>
              </div>
            )}

            {threads.map((thread) => (
              <div
                key={thread.id}
                className={`group flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                  thread.id === currentThreadId
                    ? 'bg-accent-pink/8 border-l-2 border-accent-pink'
                    : 'hover:bg-surface-light dark:hover:bg-surface-dark border-l-2 border-transparent'
                }`}
                onClick={() => onSelectThread(thread.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onSelectThread(thread.id); }}
                aria-label={`Thread: ${thread.title}`}
                aria-current={thread.id === currentThreadId ? 'true' : undefined}
              >
                <MessageSquare className="h-3 w-3 flex-shrink-0 text-text-muted-light dark:text-text-muted-dark" />
                <div className="flex-1 min-w-0">
                  {editingId === thread.id ? (
                    <form
                      onSubmit={(e) => { e.preventDefault(); handleRename(thread.id); }}
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 bg-surface-light dark:bg-surface-dark text-[11px] px-1.5 py-0.5 rounded border border-border-light/60 dark:border-border-dark/60 text-text-primary-light dark:text-text-primary-dark focus-visible:outline-none focus-visible:border-accent-pink/40"
                        autoFocus
                        maxLength={50}
                        aria-label="Thread title"
                      />
                      <button type="submit" className="h-5 w-5 flex items-center justify-center text-emerald-500" aria-label="Save">
                        <Check className="h-3 w-3" />
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="h-5 w-5 flex items-center justify-center text-text-muted-light" aria-label="Cancel">
                        <X className="h-3 w-3" />
                      </button>
                    </form>
                  ) : (
                    <p className="text-[11px] text-text-primary-light dark:text-text-primary-dark truncate leading-tight">
                      {thread.title}
                    </p>
                  )}
                  <p className="text-[9px] text-text-muted-light dark:text-text-muted-dark mt-0.5">
                    {thread.messageCount} messages
                  </p>
                </div>

                {editingId !== thread.id && (
                  <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); startEditing(thread.id, thread.title); }}
                      className="h-5 w-5 rounded flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
                      aria-label="Rename thread"
                    >
                      <Pencil className="h-2.5 w-2.5" />
                    </button>
                    {confirmDeleteId === thread.id ? (
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleDelete(thread.id); }}
                          className="h-5 w-5 rounded flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
                          aria-label="Confirm delete"
                        >
                          <Check className="h-2.5 w-2.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                          className="h-5 w-5 rounded flex items-center justify-center text-text-muted-light transition-colors"
                          aria-label="Cancel delete"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(thread.id); }}
                        className="h-5 w-5 rounded flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:text-red-500 transition-colors"
                        aria-label="Delete thread"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
