/**
 * Barangay Application Service (Polysyne Architecture)
 * Encapsulates barangay reference data querying and mutations behind CacheService.
 */

import { prisma } from '@/backend/lib/prisma';
import { cacheService, CacheKeys, TTL } from '@/backend/cache';

export class BarangayService {
  /**
   * Fetch all barangays or search by name with 1-hour read-through cache
   */
  public static async getAll(search?: string | null): Promise<any[]> {
    const cacheKey = search
      ? CacheKeys.geo.barangaySearch(search)
      : CacheKeys.geo.barangays();
    const ttl = search ? TTL.BARANGAYS_SEARCH : TTL.BARANGAYS_ALL;

    return cacheService.getOrSet(cacheKey, ttl, async () => {
      const where: any = {};
      if (search) {
        where.name = {
          contains: search,
          mode: 'insensitive',
        };
      }

      return prisma.barangay.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
      });
    });
  }

  /**
   * Create a new barangay and invalidate both geo and crime caches
   */
  public static async create(data: {
    name: string;
    coordinates?: any;
    population?: number;
    area?: number;
  }): Promise<any> {
    const created = await prisma.barangay.create({
      data,
    });

    // Invalidate geo reference cache and crime cache
    await Promise.all([
      cacheService.deleteByPattern(CacheKeys.geo.pattern()),
      cacheService.deleteByPattern(CacheKeys.crimes.pattern()),
    ]);

    return created;
  }

  /**
   * Invalidate all barangay cache keys
   */
  public static async invalidateCache(): Promise<number> {
    return cacheService.deleteByPattern(CacheKeys.geo.pattern());
  }
}
