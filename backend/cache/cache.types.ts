/**
 * Core Cache Interfaces and Types for Polysyne Architecture
 */

export interface CacheStats {
  hits: number;
  misses: number;
  writes: number;
  deletions: number;
  expirations: number;
  stampedePrevented: number;
  dbQueriesSaved: number;
  errors: number;
  hitRatio: number; // percentage (0 - 100)
  activeKeys: number;
  memoryEstimateBytes: number;
  uptimeSeconds: number;
}

export interface CacheEvent {
  timestamp: string;
  type: 'HIT' | 'MISS' | 'SET' | 'DELETE' | 'EXPIRE' | 'STAMPEDE_PREVENTED' | 'FALLBACK';
  key: string;
  latencyMs?: number;
  details?: string;
}

export interface CacheEntry<T = unknown> {
  value: T;
  expiresAt: number; // unix timestamp in ms
  createdAt: number;
  hits: number;
}

export interface GetOrSetOptions {
  ttlSeconds?: number;
  tags?: string[];
  forceRefresh?: boolean;
}

export interface CacheProvider {
  name: string;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<boolean>;
  deleteByPattern(pattern: string): Promise<number>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  getKeys(pattern?: string): Promise<string[]>;
  getActiveKeyCount(): Promise<number>;
  isHealthy(): Promise<boolean>;
}
