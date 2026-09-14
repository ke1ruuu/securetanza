/**
 * Permission Application Service (Polysyne Architecture)
 * Encapsulates permission reference lookups with read-through caching.
 */

import { prisma } from '@/backend/lib/prisma';
import { cacheService, CacheKeys, TTL } from '@/backend/cache';

export class PermissionService {
  /**
   * Fetch all permissions with read-through cache (10 minutes)
   */
  public static async getAllPermissions(): Promise<any[]> {
    const cacheKey = CacheKeys.auth.permissions();

    return cacheService.getOrSet(cacheKey, TTL.PERMISSIONS_ALL, async () => {
      return prisma.permission.findMany({
        orderBy: {
          permissionName: 'asc',
        },
      });
    });
  }

  /**
   * Invalidate permissions cache
   */
  public static async invalidateCache(): Promise<boolean> {
    return cacheService.delete(CacheKeys.auth.permissions());
  }
}
