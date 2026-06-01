/**
 * Session memory — thin wrapper around the memory-store tool.
 * Prototype uses in-process memory. Production would use Redis.
 */

import { memoryStore } from '@/tools/memory-store';

export interface SessionData {
  sessionId: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  eraAssigned?: string;
  startedAt: number;
}

const SESSION_TTL = 60 * 60 * 1000; // 1 hour

export const sessionMemory = {
  create(sessionId: string): SessionData {
    const data: SessionData = {
      sessionId,
      messages: [],
      startedAt: Date.now(),
    };
    memoryStore.set(`session:${sessionId}`, data, SESSION_TTL);
    return data;
  },

  get(sessionId: string): SessionData | undefined {
    return memoryStore.get<SessionData>(`session:${sessionId}`);
  },

  update(sessionId: string, updates: Partial<SessionData>): void {
    const existing = this.get(sessionId);
    if (existing) {
      memoryStore.set(`session:${sessionId}`, { ...existing, ...updates }, SESSION_TTL);
    }
  },

  delete(sessionId: string): void {
    memoryStore.delete(`session:${sessionId}`);
  },
};
