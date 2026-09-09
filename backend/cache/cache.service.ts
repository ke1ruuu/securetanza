/**
 * Enterprise CacheService for Polysyne Architecture
 * Features Single-Flight Cache Stampede Protection, Graceful Fallback, and Observability Telemetry.
 */

import { CacheProvider, CacheStats, CacheEvent, GetOrSetOptions } from './cache.types';
import { InMemoryCacheProvider } from './memory-cache.provider';

interface InternalStats {
  hits: number;
  misses: number;
  writes: number;
  deletions: number;
  expirations: number;
  stampedePrevented: number;
  dbQueriesSaved: number;
  errors: number;
  startTime: number;
}

export class CacheService {
  private provider: CacheProvider;
  private inFlight = new Map<string, Promise<unknown>>();
  private stats: InternalStats = {
    hits: 0,
    misses: 0,
    writes: 0,
    deletions: 0,
    expirations: 0,
    stampedePrevented: 0,
    dbQueriesSaved: 0,
    errors: 0,
    startTime: Date.now(),
  };

  private readonly maxEvents = 40;
  private recentEvents: CacheEvent[] = [];

  constructor(provider?: CacheProvider) {
    this.provider = provider || new InMemoryCacheProvider();
  }

  public setProvider(provider: CacheProvider): void {
    this.provider = provider;
  }

  public getProviderName(): string {
    return this.provider.name;
  }

  /**
   * Retrieves an item from cache with graceful error fallback
   */
  public async get<T>(key: string): Promise<T | null> {
    const start = performance.now();
    try {
      const val = await this.provider.get<T>(key);
      const latencyMs = Math.round((performance.now() - start) * 100) / 100;

      if (val !== null && val !== undefined) {
        this.stats.hits++;
        this.stats.dbQueriesSaved++;
        this.recordEvent('HIT', key, latencyMs);
        return val;
      }

      this.stats.misses++;
      this.recordEvent('MISS', key, latencyMs);
      return null;
    } catch (err) {
      this.stats.errors++;
      const latencyMs = Math.round((performance.now() - start) * 100) / 100;
      this.recordEvent('FALLBACK', key, latencyMs, `Get error: ${err instanceof Error ? err.message : String(err)}`);
      console.warn(`[CacheService] Fallback on get for key ${key}:`, err);
      return null;
    }
  }

  /**
   * Sets an item in cache with a TTL (seconds)
   */
  public async set<T>(key: string, value: T, ttlSeconds: number = 60): Promise<void> {
    const start = performance.now();
    try {
      await this.provider.set(key, value, ttlSeconds);
      this.stats.writes++;
      const latencyMs = Math.round((performance.now() - start) * 100) / 100;
      this.recordEvent('SET', key, latencyMs, `TTL: ${ttlSeconds}s`);
    } catch (err) {
      this.stats.errors++;
      console.warn(`[CacheService] Error setting cache for key ${key}:`, err);
    }
  }

  /**
   * Deletes a specific key
   */
  public async delete(key: string): Promise<boolean> {
    try {
      const deleted = await this.provider.delete(key);
      if (deleted) {
        this.stats.deletions++;
        this.recordEvent('DELETE', key);
      }
      return deleted;
    } catch (err) {
      this.stats.errors++;
      console.warn(`[CacheService] Error deleting key ${key}:`, err);
      return false;
    }
  }

  /**
   * Deletes all keys matching a wildcard pattern (e.g., 'app:crimes:*')
   */
  public async deleteByPattern(pattern: string): Promise<number> {
    try {
      const count = await this.provider.deleteByPattern(pattern);
      if (count > 0) {
        this.stats.deletions += count;
        this.recordEvent('DELETE', pattern, undefined, `Purged ${count} entries matching pattern`);
      }
      return count;
    } catch (err) {
      this.stats.errors++;
      console.warn(`[CacheService] Error deleting pattern ${pattern}:`, err);
      return 0;
    }
  }

  /**
   * Clears the entire cache
   */
  public async clear(): Promise<void> {
    try {
      await this.provider.clear();
      this.recordEvent('DELETE', '*', undefined, 'Cache completely cleared');
    } catch (err) {
      this.stats.errors++;
      console.warn(`[CacheService] Error clearing cache:`, err);
    }
  }

  /**
   * Core Read-Through Caching with Single-Flight Stampede Protection
   * 
   * When multiple concurrent requests query the same missing or expired key,
   * only ONE loader execution takes place. All other requests await the ongoing loader.
   */
  public async getOrSet<T>(
    key: string,
    ttlSeconds: number,
    loader: () => Promise<T>,
    options?: GetOrSetOptions
  ): Promise<T> {
    // 1. Force refresh bypass if requested
    if (options?.forceRefresh) {
      return this.executeAndCacheLoader(key, ttlSeconds, loader);
    }

    // 2. Check cache first
    const cached = await this.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }

    // 3. Stampede Protection: check if a loader is currently in-flight for this key
    const inFlightPromise = this.inFlight.get(key);
    if (inFlightPromise) {
      this.stats.stampedePrevented++;
      this.stats.dbQueriesSaved++;
      this.recordEvent('STAMPEDE_PREVENTED', key, undefined, 'Reused in-flight loader promise');
      return inFlightPromise as Promise<T>;
    }

    // 4. Dispatch single-flight loader
    return this.executeAndCacheLoader(key, ttlSeconds, loader);
  }

  private async executeAndCacheLoader<T>(
    key: string,
    ttlSeconds: number,
    loader: () => Promise<T>
  ): Promise<T> {
    const promise = (async () => {
      try {
        const result = await loader();
        // Asynchronously set cache without blocking return
        await this.set(key, result, ttlSeconds);
        return result;
      } catch (err) {
        // Do not cache errors
        throw err;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }

  /**
   * Telemetry and Observability
   */
  public async getStats(): Promise<CacheStats> {
    const totalOps = this.stats.hits + this.stats.misses;
    const hitRatio = totalOps > 0 ? Math.round((this.stats.hits / totalOps) * 1000) / 10 : 0;
    const activeKeys = await this.provider.getActiveKeyCount();

    let memoryEstimateBytes = 0;
    if (this.provider instanceof InMemoryCacheProvider) {
      memoryEstimateBytes = this.provider.getMemoryEstimateBytes();
    }

    const uptimeSeconds = Math.floor((Date.now() - this.stats.startTime) / 1000);

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      writes: this.stats.writes,
      deletions: this.stats.deletions,
      expirations: this.stats.expirations,
      stampedePrevented: this.stats.stampedePrevented,
      dbQueriesSaved: this.stats.dbQueriesSaved,
      errors: this.stats.errors,
      hitRatio,
      activeKeys,
      memoryEstimateBytes,
      uptimeSeconds,
    };
  }

  public async getKeys(pattern?: string): Promise<string[]> {
    return this.provider.getKeys(pattern);
  }

  public getRecentEvents(): CacheEvent[] {
    return [...this.recentEvents];
  }

  public resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      writes: 0,
      deletions: 0,
      expirations: 0,
      stampedePrevented: 0,
      dbQueriesSaved: 0,
      errors: 0,
      startTime: Date.now(),
    };
    this.recentEvents = [];
  }

  private recordEvent(
    type: CacheEvent['type'],
    key: string,
    latencyMs?: number,
    details?: string
  ): void {
    const event: CacheEvent = {
      timestamp: new Date().toISOString(),
      type,
      key,
      latencyMs,
      details,
    };

    this.recentEvents.unshift(event);
    if (this.recentEvents.length > this.maxEvents) {
      this.recentEvents.pop();
    }
  }
}

// Global singleton instance attachment for hot-reload resilience in Next.js
const globalForCache = globalThis as unknown as {
  cacheServiceInstance?: CacheService;
};

export const cacheService = globalForCache.cacheServiceInstance || new CacheService();

if (process.env.NODE_ENV !== 'production') {
  globalForCache.cacheServiceInstance = cacheService;
}
