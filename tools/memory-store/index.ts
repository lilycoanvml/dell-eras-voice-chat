/**
 * Memory Store
 *
 * In-process key-value store for conversation memory.
 * Prototype uses in-memory; swap `store` for Redis in production.
 */

const store = new Map<string, unknown>();

export const memoryStore = {
  set<T>(key: string, value: T, ttlMs?: number): void {
    store.set(key, value);
    if (ttlMs) {
      setTimeout(() => store.delete(key), ttlMs);
    }
  },

  get<T>(key: string): T | undefined {
    return store.get(key) as T | undefined;
  },

  has(key: string): boolean {
    return store.has(key);
  },

  delete(key: string): void {
    store.delete(key);
  },

  keys(): string[] {
    return Array.from(store.keys());
  },

  size(): number {
    return store.size;
  },
};
