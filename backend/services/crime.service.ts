/**
 * Crime Application Service (Polysyne Architecture)
 * Encapsulates crime querying, aggregation, and mutation logic behind the CacheService.
 */

import { prisma } from '@/backend/lib/prisma';
import { cacheService, CacheKeys, TTL } from '@/backend/cache';
import { mapGeoJsonToDb } from '@/backend/lib/barangay-mapper';

export interface CrimeStatsResult {
  totalCrimes: number;
  activeCases: number;
  resolvedToday: number;
  recentCrimes: number;
  safetyIndex: string;
  crimesByType: Array<{ type: string; count: number }>;
  crimesByBarangay: Array<{ barangay: string; count: number }>;
  monthlyStats: Array<{ month: number; count: number }>;
  activity: number[];
}

export interface BarangayCountsResult {
  barangayCounts: Record<string, number>;
  totalCrimes: number;
  barangayCount: number;
}

/**
 * One (dateCommitted, hour) pair and how many incidents fall in it.
 * `hour` is null when `timeCommitted` could not be parsed — those incidents
 * still count toward the day total but cannot be placed on the clock.
 */
export interface HourlyTimelineBucket {
  date: string;
  hour: number | null;
  count: number;
}

export interface HourlyTimelineResult {
  buckets: HourlyTimelineBucket[];
  totalCrimes: number;
}

/**
 * Reads the hour out of a stored "HH:MM:SS" (or "H:MM") time string.
 * Returns null when the value is missing or not a usable 0-23 hour.
 */
function parseHourOfDay(timeCommitted: string | null | undefined): number | null {
  if (!timeCommitted) return null;
  const match = /^(\d{1,2}):/.exec(timeCommitted.trim());
  if (!match) return null;
  const hour = parseInt(match[1], 10);
  return hour >= 0 && hour <= 23 ? hour : null;
}

export interface CrimeFilters {
  barangay?: string | null;
  region?: string | null;
  province?: string | null;
  municipal?: string | null;
  incidentType?: string | null;
  startDateReported?: string | null;
  endDateReported?: string | null;
  startDateCommitted?: string | null;
  endDateCommitted?: string | null;
  modeReporting?: string | null;
  stageOfFelony?: string | null;
  caseStatus?: string | null;
  offenseType?: string | null;
  modus?: string | null;
  typeOfPlace?: string | null;
  hour?: string | number | null;
  year?: string | number | null;
  limit?: number | null;
}

export class CrimeService {
  /**
   * Get aggregated crime statistics with read-through caching and stampede protection
   */
  public static async getStats(filters: {
    barangay?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    year?: string | null;
  }): Promise<CrimeStatsResult> {
    const cacheKey = CacheKeys.crimes.stats({
      barangay: filters.barangay,
      startDate: filters.startDate,
      endDate: filters.endDate,
      year: filters.year,
    });

    return cacheService.getOrSet(cacheKey, TTL.CRIME_STATS, async () => {
      const where: any = {};
      let dbBarangayName: string | undefined;

      if (filters.barangay) {
        dbBarangayName = mapGeoJsonToDb(filters.barangay);
        where.barangay = {
          equals: dbBarangayName,
          mode: 'insensitive',
        };
      }

      if (filters.startDate && filters.endDate) {
        where.dateCommitted = {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate),
        };
      } else if (filters.year) {
        const yearNum = parseInt(filters.year, 10);
        where.dateCommitted = {
          gte: new Date(yearNum, 0, 1),
          lte: new Date(yearNum, 11, 31, 23, 59, 59, 999),
        };
      }

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const resolvedStatusFilter = {
        OR: [
          { caseStatus: { equals: 'Cleared', mode: 'insensitive' as const } },
          { caseStatus: { equals: 'Solved', mode: 'insensitive' as const } },
          { caseStatus: { equals: 'Archived', mode: 'insensitive' as const } },
          { caseStatus: { equals: 'Closed', mode: 'insensitive' as const } },
        ],
      };

      const resolvedTodayWhere: any = Object.keys(where).length > 0
        ? {
            AND: [where, resolvedStatusFilter, { updatedAt: { gte: today, lt: tomorrow } }],
          }
        : {
            ...resolvedStatusFilter,
            updatedAt: { gte: today, lt: tomorrow },
          };

      const clearedCasesWhere: any = Object.keys(where).length > 0
        ? {
            AND: [where, resolvedStatusFilter],
          }
        : resolvedStatusFilter;

      const targetYear = filters.year ? parseInt(filters.year, 10) : new Date().getFullYear();
      const startDateCommitted = filters.startDate
        ? new Date(filters.startDate)
        : new Date(`${targetYear}-01-01T00:00:00.000Z`);
      const endDateCommitted = filters.endDate
        ? new Date(filters.endDate)
        : new Date(`${targetYear + 1}-01-01T00:00:00.000Z`);

      const monthlyQuery = dbBarangayName
        ? prisma.$queryRaw<Array<{ month: number; count: number | bigint }>>`
            SELECT 
              EXTRACT(MONTH FROM date_committed)::integer AS month,
              COUNT(*)::integer AS count
            FROM crime_incidents
            WHERE date_committed >= ${startDateCommitted}
              AND date_committed < ${endDateCommitted}
              AND LOWER(barangay) = LOWER(${dbBarangayName})
            GROUP BY month
            ORDER BY month ASC
          `
        : prisma.$queryRaw<Array<{ month: number; count: number | bigint }>>`
            SELECT 
              EXTRACT(MONTH FROM date_committed)::integer AS month,
              COUNT(*)::integer AS count
            FROM crime_incidents
            WHERE date_committed >= ${startDateCommitted}
              AND date_committed < ${endDateCommitted}
            GROUP BY month
            ORDER BY month ASC
          `;

      const [
        totalCrimes,
        crimesByType,
        crimesByBarangay,
        recentCrimes,
        resolvedToday,
        clearedCases,
        monthlyCountsRaw,
      ] = await Promise.all([
        prisma.crimeIncident.count({ where }),
        prisma.crimeIncident.groupBy({
          by: ['incidentType'],
          where,
          _count: { incidentType: true },
          orderBy: { _count: { incidentType: 'desc' } },
        }),
        prisma.crimeIncident.groupBy({
          by: ['barangay'],
          where,
          _count: { barangay: true },
          orderBy: { _count: { barangay: 'desc' } },
        }),
        prisma.crimeIncident.count({
          where: {
            ...where,
            dateCommitted: { gte: sevenDaysAgo },
          },
        }),
        prisma.crimeIncident.count({ where: resolvedTodayWhere }),
        prisma.crimeIncident.count({ where: clearedCasesWhere }),
        monthlyQuery,
      ]);

      const activeCases = Math.max(0, totalCrimes - clearedCases);
      const monthlyStats = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const found = monthlyCountsRaw.find(m => Number(m.month) === month);
        return {
          month,
          count: found ? Number(found.count) : 0,
        };
      });

      const safetyIndex = totalCrimes > 0
        ? `${Math.round((clearedCases / totalCrimes) * 100)}%`
        : '100%';

      return {
        totalCrimes,
        activeCases,
        resolvedToday,
        recentCrimes,
        safetyIndex,
        crimesByType: crimesByType.map(item => ({
          type: item.incidentType,
          count: item._count.incidentType,
        })),
        crimesByBarangay: crimesByBarangay.map(item => ({
          barangay: item.barangay,
          count: item._count.barangay,
        })),
        monthlyStats,
        activity: monthlyStats.map(stat => stat.count),
      };
    });
  }

  /**
   * Get crime counts grouped by barangay for threat calculations
   */
  public static async getBarangayCounts(filters: {
    startDateCommitted?: string | null;
    endDateCommitted?: string | null;
    hour?: string | null;
    year?: string | null;
    incidentType?: string | null;
    barangay?: string | null;
  }): Promise<BarangayCountsResult> {
    const cacheKey = CacheKeys.crimes.barangayCounts(filters as Record<string, unknown>);

    return cacheService.getOrSet(cacheKey, TTL.BARANGAY_COUNTS, async () => {
      const where: any = {};

      if (filters.incidentType) {
        where.incidentType = {
          contains: filters.incidentType,
          mode: 'insensitive',
        };
      }

      if (filters.barangay) {
        where.barangay = {
          equals: filters.barangay,
          mode: 'insensitive',
        };
      }

      if (filters.startDateCommitted && filters.endDateCommitted) {
        where.dateCommitted = {
          gte: new Date(filters.startDateCommitted),
          lte: new Date(filters.endDateCommitted),
        };
      } else if (filters.year) {
        const yearNum = parseInt(filters.year, 10);
        where.dateCommitted = {
          gte: new Date(yearNum, 0, 1),
          lte: new Date(yearNum, 11, 31, 23, 59, 59, 999),
        };
      }

      if (filters.hour !== null && filters.hour !== undefined && filters.hour !== '') {
        const targetHour = parseInt(String(filters.hour), 10);
        if (!isNaN(targetHour)) {
          const padded = targetHour.toString().padStart(2, '0');
          const unpadded = targetHour.toString();
          where.OR = [
            { timeCommitted: { startsWith: `${padded}:` } },
            { timeCommitted: { startsWith: `${unpadded}:` } },
          ];
        }
      }

      const [barangayCounts, totalCrimes] = await Promise.all([
        prisma.crimeIncident.groupBy({
          by: ['barangay'],
          where,
          _count: { barangay: true },
          orderBy: { _count: { barangay: 'desc' } },
        }),
        prisma.crimeIncident.count({ where }),
      ]);

      const counts: Record<string, number> = {};
      barangayCounts.forEach(item => {
        counts[item.barangay] = item._count.barangay;
      });

      return {
        barangayCounts: counts,
        totalCrimes,
        barangayCount: barangayCounts.length,
      };
    });
  }

  /**
   * Build the complete date × hour incident histogram in a single grouped query.
   *
   * Returns raw (dateCommitted, hour, count) buckets rather than pre-grouped days so
   * that callers bucket by *their own* calendar day. Ingest writes `dateCommitted` as a
   * local-midnight timestamp and the client renders in local time, so collapsing days
   * server-side (where the DB session is UTC) would shift dates by one.
   */
  public static async getHourlyTimeline(filters: {
    year?: string | null;
    incidentType?: string | null;
    barangay?: string | null;
  }): Promise<HourlyTimelineResult> {
    const cacheKey = CacheKeys.crimes.hourlyTimeline(filters as Record<string, unknown>);

    return cacheService.getOrSet(cacheKey, TTL.CRIME_HOURLY_TIMELINE, async () => {
      const where: any = {};

      if (filters.year) {
        const yearNum = parseInt(String(filters.year), 10);
        if (!isNaN(yearNum)) {
          where.dateCommitted = {
            gte: new Date(yearNum, 0, 1),
            lte: new Date(yearNum, 11, 31, 23, 59, 59, 999),
          };
        }
      }

      if (filters.incidentType) {
        where.incidentType = {
          contains: filters.incidentType,
          mode: 'insensitive',
        };
      }

      if (filters.barangay) {
        where.barangay = {
          equals: mapGeoJsonToDb(filters.barangay),
          mode: 'insensitive',
        };
      }

      // The database collapses rows down to distinct (date, exact time) pairs; the hour
      // is parsed here so it matches how `timeCommitted` is interpreted elsewhere.
      const groups = await prisma.crimeIncident.groupBy({
        by: ['dateCommitted', 'timeCommitted'],
        where,
        _count: { _all: true },
      });

      const byBucket = new Map<string, HourlyTimelineBucket>();
      let totalCrimes = 0;

      for (const group of groups) {
        const count = group._count._all;
        totalCrimes += count;

        const date = new Date(group.dateCommitted).toISOString();
        const hour = parseHourOfDay(group.timeCommitted);

        const bucketKey = `${date}|${hour ?? 'unknown'}`;
        const existing = byBucket.get(bucketKey);
        if (existing) {
          existing.count += count;
        } else {
          byBucket.set(bucketKey, { date, hour, count });
        }
      }

      const buckets = Array.from(byBucket.values()).sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? 1 : -1;
        return (a.hour ?? 24) - (b.hour ?? 24);
      });

      return { buckets, totalCrimes };
    });
  }

  /**
   * Fetch filtered crimes with safe limit bounds
   */
  public static async getCrimes(filters: CrimeFilters): Promise<any[]> {
    const cacheKey = CacheKeys.crimes.list(filters as Record<string, unknown>);

    return cacheService.getOrSet(cacheKey, TTL.CRIME_LIST, async () => {
      const where: any = {};

      if (filters.barangay) {
        const dbBarangayName = mapGeoJsonToDb(filters.barangay);
        where.barangay = {
          equals: dbBarangayName,
          mode: 'insensitive',
        };
      }

      if (filters.region) where.region = { contains: filters.region, mode: 'insensitive' };
      if (filters.province) where.province = { contains: filters.province, mode: 'insensitive' };
      if (filters.municipal) where.municipal = { contains: filters.municipal, mode: 'insensitive' };
      if (filters.incidentType) where.incidentType = { contains: filters.incidentType, mode: 'insensitive' };

      if (filters.startDateReported && filters.endDateReported) {
        where.dateReported = {
          gte: new Date(filters.startDateReported),
          lte: new Date(filters.endDateReported),
        };
      }

      if (filters.startDateCommitted && filters.endDateCommitted) {
        where.dateCommitted = {
          gte: new Date(filters.startDateCommitted),
          lte: new Date(filters.endDateCommitted),
        };
      }

      if (filters.modeReporting) where.modeReporting = { contains: filters.modeReporting, mode: 'insensitive' };
      if (filters.stageOfFelony) where.stageOfFelony = { contains: filters.stageOfFelony, mode: 'insensitive' };
      if (filters.caseStatus) where.caseStatus = { contains: filters.caseStatus, mode: 'insensitive' };
      if (filters.offenseType) where.offenseType = { contains: filters.offenseType, mode: 'insensitive' };
      if (filters.modus) where.modus = { contains: filters.modus, mode: 'insensitive' };
      if (filters.typeOfPlace) where.typeOfPlace = { contains: filters.typeOfPlace, mode: 'insensitive' };

      if (filters.year) {
        const yearNum = parseInt(String(filters.year), 10);
        where.dateCommitted = {
          ...where.dateCommitted,
          gte: new Date(yearNum, 0, 1),
          lte: new Date(yearNum, 11, 31, 23, 59, 59, 999),
        };
      }

      if (filters.hour !== null && filters.hour !== undefined && filters.hour !== '') {
        const targetHour = parseInt(String(filters.hour), 10);
        if (!isNaN(targetHour)) {
          const padded = targetHour.toString().padStart(2, '0');
          const unpadded = targetHour.toString();
          where.OR = [
            { timeCommitted: { startsWith: `${padded}:` } },
            { timeCommitted: { startsWith: `${unpadded}:` } },
          ];
        }
      }

      const take = filters.limit ? Math.min(Math.max(1, filters.limit), 2000) : 500;

      return prisma.crimeIncident.findMany({
        where,
        orderBy: {
          dateCommitted: 'desc',
        },
        take,
      });
    });
  }

  /**
   * Fetch distinct years for filter dropdowns (rarely changes, 10-min cache)
   */
  public static async getDistinctYears(): Promise<number[]> {
    const cacheKey = CacheKeys.crimes.years();

    return cacheService.getOrSet(cacheKey, TTL.DISTINCT_YEARS, async () => {
      const result = await prisma.$queryRaw<Array<{ year: number }>>`
        SELECT DISTINCT EXTRACT(YEAR FROM date_committed)::integer as year
        FROM crime_incidents
        ORDER BY year DESC
      `;
      return result.map(r => r.year);
    });
  }

  /**
   * Fetch latest crime incident and database telemetry
   */
  public static async getLatest(barangay?: string | null): Promise<any> {
    const cacheKey = CacheKeys.crimes.latest(barangay);

    return cacheService.getOrSet(cacheKey, TTL.CRIME_LATEST, async () => {
      const where: any = {};
      if (barangay && barangay !== 'General Dashboard') {
        const dbBarangayName = mapGeoJsonToDb(barangay);
        where.barangay = {
          equals: dbBarangayName,
          mode: 'insensitive',
        };
      }

      const [latestIncident, totalCount, lastUpload] = await Promise.all([
        prisma.crimeIncident.findFirst({
          where,
          orderBy: [
            { dateCommitted: 'desc' },
            { createdAt: 'desc' },
          ],
        }),
        prisma.crimeIncident.count({ where }),
        prisma.auditLog.findFirst({
          where: {
            action: 'Import',
            outcome: 'success',
          },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return {
        latestIncident,
        totalCount,
        lastUpload: lastUpload
          ? {
              fileName: lastUpload.fileName,
              recordsImported: lastUpload.recordsImported,
              createdAt: lastUpload.createdAt,
            }
          : null,
        serverTime: new Date().toISOString(),
      };
    });
  }

  /**
   * Fetch a single crime incident by ID
   */
  public static async getById(id: string): Promise<any> {
    const cacheKey = CacheKeys.crimes.detail(id);

    return cacheService.getOrSet(cacheKey, TTL.CRIME_DETAIL, async () => {
      return prisma.crimeIncident.findUnique({
        where: { id },
      });
    });
  }

  /**
   * Create a new crime incident with duplicate prevention and invalidate all crime query caches
   */
  public static async createIncident(data: any): Promise<any> {
    // 1. Check for duplicate by blotter number (if provided)
    if (data.blotterNo && typeof data.blotterNo === 'string' && data.blotterNo.trim().length > 0) {
      const existingBlotter = await prisma.crimeIncident.findFirst({
        where: {
          blotterNo: { equals: data.blotterNo.trim(), mode: 'insensitive' },
        },
        select: { id: true, blotterNo: true },
      });
      if (existingBlotter) {
        throw new Error(`A crime record with blotter number "${data.blotterNo.trim()}" already exists in the crime register.`);
      }
    }

    // 2. Check for duplicate by composite incident signature
    const existingComposite = await prisma.crimeIncident.findFirst({
      where: {
        barangay: { equals: data.barangay, mode: 'insensitive' },
        dateCommitted: data.dateCommitted,
        timeCommitted: data.timeCommitted,
        incidentType: { equals: data.incidentType, mode: 'insensitive' },
        offense: data.offense ? { equals: data.offense, mode: 'insensitive' } : undefined,
        dateReported: data.dateReported,
        timeReported: data.timeReported,
      },
      select: { id: true },
    });

    if (existingComposite) {
      throw new Error(`An identical crime incident reported at this time and location already exists in the crime register.`);
    }

    const incident = await prisma.crimeIncident.create({
      data,
    });

    // Invalidate cached query results
    await cacheService.deleteByPattern(CacheKeys.crimes.pattern());

    return incident;
  }

  /**
   * Update a crime incident and invalidate affected caches
   */
  public static async updateIncident(id: string, data: any): Promise<any> {
    const updated = await prisma.crimeIncident.update({
      where: { id },
      data,
    });

    // Invalidate both the item detail and all aggregate list/stat caches
    await Promise.all([
      cacheService.delete(CacheKeys.crimes.detail(id)),
      cacheService.deleteByPattern(CacheKeys.crimes.pattern()),
    ]);

    return updated;
  }

  /**
   * Delete a crime incident and invalidate affected caches
   */
  public static async deleteIncident(id: string): Promise<any> {
    const deleted = await prisma.crimeIncident.delete({
      where: { id },
    });

    await Promise.all([
      cacheService.delete(CacheKeys.crimes.detail(id)),
      cacheService.deleteByPattern(CacheKeys.crimes.pattern()),
    ]);

    return deleted;
  }

  /**
   * Invalidate all crime-related cache keys
   */
  public static async invalidateCache(): Promise<number> {
    return cacheService.deleteByPattern(CacheKeys.crimes.pattern());
  }
}
