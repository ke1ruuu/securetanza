/**
 * Consistent Cache Key Builder & Default TTL Configuration
 * Follows convention: app:<namespace>:<resource>:<scope>:<hashOrId>
 */

function normalizeParamValue(val: unknown): string {
  if (val === null || val === undefined || val === '') return '';
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val).trim().toLowerCase();
}

/**
 * Creates a fast 32-bit deterministic FNV-1a hash of arbitrary object keys
 */
export function hashQuery(params: Record<string, unknown>): string {
  const sortedKeys = Object.keys(params).sort();
  const serialized = sortedKeys
    .filter(k => params[k] !== undefined && params[k] !== null && params[k] !== '')
    .map(k => `${k}=${normalizeParamValue(params[k])}`)
    .join('&');

  if (!serialized) return 'all';

  let hash = 0x811c9dc5;
  for (let i = 0; i < serialized.length; i++) {
    hash ^= serialized.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16);
}

export const TTL = {
  // Frequently changing analytical data
  CRIME_STATS: 60, // 1 minute
  BARANGAY_COUNTS: 60, // 1 minute
  CRIME_LIST: 45, // 45 seconds
  CRIME_LATEST: 30, // 30 seconds
  CRIME_DETAIL: 120, // 2 minutes
  CRIME_HOURLY_TIMELINE: 300, // 5 minutes

  // Slowly changing reference data
  DISTINCT_YEARS: 600, // 10 minutes
  BARANGAYS_ALL: 3600, // 1 hour
  BARANGAYS_SEARCH: 600, // 10 minutes
  PERMISSIONS_ALL: 600, // 10 minutes

  // Configuration and security
  CONFIG_RULES: 600, // 10 minutes
  EXPORT_SCHEDULE: 300, // 5 minutes
  USER_SESSION: 30, // 30 seconds
} as const;

export const CacheKeys = {
  crimes: {
    stats: (params: Record<string, unknown> = {}) => `app:crimes:stats:${hashQuery(params)}`,
    barangayCounts: (params: Record<string, unknown> = {}) => `app:crimes:barangay-counts:${hashQuery(params)}`,
    list: (params: Record<string, unknown> = {}) => `app:crimes:list:${hashQuery(params)}`,
    hourlyTimeline: (params: Record<string, unknown> = {}) => `app:crimes:hourly-timeline:${hashQuery(params)}`,
    detail: (id: string) => `app:crimes:detail:${id}`,
    latest: (barangay?: string | null) => `app:crimes:latest:${barangay ? normalizeParamValue(barangay) : 'all'}`,
    years: () => `app:crimes:years:distinct`,
    pattern: () => `app:crimes:*`,
  },
  geo: {
    barangays: () => `app:geo:barangays:all`,
    barangaySearch: (term: string) => `app:geo:barangays:search:${normalizeParamValue(term)}`,
    barangayDetail: (idOrName: string) => `app:geo:barangays:item:${normalizeParamValue(idOrName)}`,
    pattern: () => `app:geo:*`,
  },
  auth: {
    permissions: () => `app:auth:permissions:all`,
    userSession: (userId: number | string) => `app:auth:user:${userId}:session`,
    userPattern: (userId: number | string) => `app:auth:user:${userId}:*`,
    pattern: () => `app:auth:*`,
  },
  config: {
    notificationRules: () => `app:config:notification-rules:all`,
    exportSchedule: (userId: number | string) => `app:config:export-schedule:${userId}`,
    pattern: () => `app:config:*`,
  },
  system: {
    metadata: () => `app:system:metadata`,
    pattern: () => `app:system:*`,
  }
};
