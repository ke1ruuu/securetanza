/**
 * In-Memory LRU Cache Provider with Precise TTL and Glob Pattern Matching
 */

import { CacheProvider, CacheEntry } from './cache.types';

export interface MemoryCacheOptions {
  maxEntries?: number;
  sweepIntervalMs?: number;
}

export class InMemoryCacheProvider implements CacheProvider {
  public readonly name = 'in-memory';
  private entries = new Map<string, CacheEntry>();
  private readonly maxEntries: number;
  private sweepTimer: NodeJS.Timeout | null = null;

  constructor(options: MemoryCacheOptions = {}) {
    this.maxEntries = options.maxEntries || 5000;
    const sweepIntervalMs = options.sweepIntervalMs || 60000; // Sweep every 60s

    // Periodic lazy sweep of expired entries to prevent memory retention
    if (typeof setInterval !== 'undefined') {
      this.sweepTimer = setInterval(() => {
        this.sweepExpired();
      }, sweepIntervalMs);

      // Unref timer so it doesn't block Node.js process termination
      if (this.sweepTimer && typeof this.sweepTimer.unref === 'function') {
        this.sweepTimer.unref();
      }
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    const entry = this.entries.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (entry.expiresAt > 0 && now >= entry.expiresAt) {
      this.entries.delete(key);
      return null;
    }

    // Refresh LRU order by re-inserting
    this.entries.delete(key);
    entry.hits++;
    this.entries.set(key, entry);

    return entry.value as T;
  }

  public async set<T>(key: string, value: T, ttlSeconds: number = 60): Promise<void> {
    const now = Date.now();
    const expiresAt = ttlSeconds > 0 ? now + ttlSeconds * 1000 : 0;

    // Enforce LRU capacity limit
    if (this.entries.size >= this.maxEntries && !this.entries.has(key)) {
      this.evictOldest();
    }

    // If key existed, delete first to push to back of Map iteration order
    this.entries.delete(key);

    this.entries.set(key, {
      value,
      expiresAt,
      createdAt: now,
      hits: 0,
    });
  }

  public async delete(key: string): Promise<boolean> {
    return this.entries.delete(key);
  }

  public async deleteByPattern(pattern: string): Promise<number> {
    const regex = this.globToRegex(pattern);
    let deletedCount = 0;

    for (const key of Array.from(this.entries.keys())) {
      if (regex.test(key)) {
        this.entries.delete(key);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  public async clear(): Promise<void> {
    this.entries.clear();
  }

  public async has(key: string): Promise<boolean> {
    const entry = this.entries.get(key);
    if (!entry) return false;
    if (entry.expiresAt > 0 && Date.now() >= entry.expiresAt) {
      this.entries.delete(key);
      return false;
    }
    return true;
  }

  public async getKeys(pattern?: string): Promise<string[]> {
    const now = Date.now();
    const validKeys: string[] = [];
    const regex = pattern ? this.globToRegex(pattern) : null;

    for (const [key, entry] of Array.from(this.entries.entries())) {
      if (entry.expiresAt > 0 && now >= entry.expiresAt) {
        this.entries.delete(key);
        continue;
      }
      if (!regex || regex.test(key)) {
        validKeys.push(key);
      }
    }

    return validKeys;
  }

  public async getActiveKeyCount(): Promise<number> {
    this.sweepExpired();
    return this.entries.size;
  }

  public async isHealthy(): Promise<boolean> {
    return true;
  }

  public getRawEntry(key: string): CacheEntry | undefined {
    return this.entries.get(key);
  }

  public getMemoryEstimateBytes(): number {
    let size = 0;
    this.entries.forEach((v, k) => {
      size += k.length * 2;
      try {
        size += JSON.stringify(v.value).length * 2;
      } catch {
        size += 128;
      }
    });
    return size;
  }

  private evictOldest(): void {
    // In JavaScript Map, keys() order reflects insertion/update order.
    // The first item is the least recently accessed.
    const oldestKey = this.entries.keys().next().value;
    if (oldestKey !== undefined) {
      this.entries.delete(oldestKey);
    }
  }

  private sweepExpired(): void {
    const now = Date.now();
    for (const [key, entry] of Array.from(this.entries.entries())) {
      if (entry.expiresAt > 0 && now >= entry.expiresAt) {
        this.entries.delete(key);
      }
    }
  }

  private globToRegex(pattern: string): RegExp {
    const escaped = pattern
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    return new RegExp(`^${escaped}$`);
  }

  public destroy(): void {
    if (this.sweepTimer) {
      clearInterval(this.sweepTimer);
      this.sweepTimer = null;
    }
    this.entries.clear();
  }
}
