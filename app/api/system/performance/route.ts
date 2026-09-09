import { NextRequest, NextResponse } from 'next/server';
import { prisma, getPoolStats } from '@/backend/lib/prisma';
import { getSession, invalidateSessionCache } from '@/lib/auth';
import { cacheService, CacheKeys, TTL } from '@/backend/cache';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || (!session.permissions.includes('admin') && !session.permissions.includes('admin_operational_officer'))) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    // 1. Measure live database round-trip ping
    const pingStart = performance.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Math.round((performance.now() - pingStart) * 10) / 10;

    // 2. Memory telemetry
    const mem = process.memoryUsage();
    const heapUsedMB = Math.round((mem.heapUsed / 1024 / 1024) * 10) / 10;
    const heapTotalMB = Math.round((mem.heapTotal / 1024 / 1024) * 10) / 10;
    const rssMB = Math.round((mem.rss / 1024 / 1024) * 10) / 10;
    const externalMB = Math.round((mem.external / 1024 / 1024) * 10) / 10;
    const arrayBuffersMB = Math.round(((mem.arrayBuffers || 0) / 1024 / 1024) * 10) / 10;
    const heapUsagePercent = Math.round((mem.heapUsed / Math.max(mem.heapTotal, 1)) * 100);

    // 3. Process specifications & uptime
    const uptimeSec = Math.floor(process.uptime());
    const uptimeHours = Math.floor(uptimeSec / 3600);
    const uptimeMinutes = Math.floor((uptimeSec % 3600) / 60);
    const uptimeFormatted = `${uptimeHours}h ${uptimeMinutes}m ${uptimeSec % 60}s`;

    // 4. Connection pool telemetry
    const poolStats = getPoolStats();
    const poolSaturationPercent = Math.round(((poolStats.activeCount + poolStats.idleCount) / poolStats.max) * 100);

    // 5. Database table volumes & background schedules
    const [
      crimeCount,
      userCount,
      auditLogCount,
      notificationCount,
      activeSchedules,
      totalSchedules,
      recentImports,
      recentExports,
    ] = await Promise.all([
      prisma.crimeIncident.count(),
      prisma.user.count(),
      prisma.auditLog.count(),
      prisma.notification.count(),
      prisma.exportSchedule.count({ where: { enabled: true } }),
      prisma.exportSchedule.count(),
      prisma.auditLog.findMany({
        where: { action: 'Import' },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
          id: true,
          fileName: true,
          recordsImported: true,
          outcome: true,
          user: true,
          createdAt: true,
          errorMessage: true,
        },
      }),
      prisma.auditLog.findMany({
        where: { action: 'Export' },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
          id: true,
          details: true,
          user: true,
          outcome: true,
          createdAt: true,
        },
      }),
    ]);

    // 6. Exports directory disk usage
    const exportsDir = path.join(process.cwd(), 'exports');
    let exportFileCount = 0;
    let exportStorageBytes = 0;

    if (existsSync(exportsDir)) {
      try {
        const files = await fs.readdir(exportsDir);
        exportFileCount = files.filter(f => f.endsWith('.xlsx')).length;
        for (const f of files) {
          if (f.endsWith('.xlsx')) {
            const stat = await fs.stat(path.join(exportsDir, f));
            exportStorageBytes += stat.size;
          }
        }
      } catch (err) {
        console.error('Error reading exports directory:', err);
      }
    }
    const exportStorageMB = Math.round((exportStorageBytes / 1024 / 1024) * 100) / 100;

    // 7. Comprehensive Server-Side Caching Layer Telemetry
    const cacheStats = await cacheService.getStats();
    const allKeys = await cacheService.getKeys();
    const recentEvents = cacheService.getRecentEvents();

    const authKeysCount = allKeys.filter(k => k.startsWith('app:auth')).length;
    const crimesKeysCount = allKeys.filter(k => k.startsWith('app:crimes')).length;
    const geoKeysCount = allKeys.filter(k => k.startsWith('app:geo')).length;
    const configKeysCount = allKeys.filter(k => k.startsWith('app:config')).length;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      status: {
        backendService: 'HEALTHY',
        databasePool: dbLatencyMs < 100 ? 'OPTIMAL' : dbLatencyMs < 300 ? 'DEGRADED' : 'HIGH_LATENCY',
        cronWorker: 'ACTIVE',
        memoryState: heapUsagePercent < 80 ? 'STABLE' : 'ELEVATED',
        cachingLayer: cacheStats.errors === 0 ? 'OPTIMAL' : 'DEGRADED',
      },
      metrics: {
        dbLatencyMs,
        pool: {
          ...poolStats,
          saturationPercent: poolSaturationPercent,
          configuredMax: poolStats.max,
        },
        memory: {
          heapUsedMB,
          heapTotalMB,
          rssMB,
          externalMB,
          arrayBuffersMB,
          heapUsagePercent,
          heapLimitMB: Math.round((require('v8').getHeapStatistics?.().heap_size_limit || 0) / 1024 / 1024) || 2048,
        },
        process: {
          uptimeFormatted,
          uptimeSeconds: uptimeSec,
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
          pid: process.pid,
        },
        database: {
          tables: {
            crimeIncidents: crimeCount,
            users: userCount,
            auditLogs: auditLogCount,
            notifications: notificationCount,
            exportSchedules: totalSchedules,
          },
          totalRecords: crimeCount + userCount + auditLogCount + notificationCount + totalSchedules,
        },
        background: {
          cronSchedule: '* * * * * (Every minute)',
          activeSchedules,
          totalSchedules,
          exportFilesOnDisk: exportFileCount,
          exportStorageMB,
          retentionPolicyDays: 14,
          recentImports,
          recentExports,
        },
        cache: {
          provider: cacheService.getProviderName(),
          hits: cacheStats.hits,
          misses: cacheStats.misses,
          writes: cacheStats.writes,
          deletions: cacheStats.deletions,
          stampedePrevented: cacheStats.stampedePrevented,
          dbQueriesSaved: cacheStats.dbQueriesSaved,
          hitRatioPercent: cacheStats.hitRatio,
          activeKeysCount: cacheStats.activeKeys,
          memoryEstimateBytes: cacheStats.memoryEstimateBytes,
          memoryEstimateKB: Math.round((cacheStats.memoryEstimateBytes / 1024) * 10) / 10,
          uptimeSeconds: cacheStats.uptimeSeconds,
          namespaces: {
            crimes: crimesKeysCount,
            geo: geoKeysCount,
            auth: authKeysCount,
            config: configKeysCount,
          },
          activeKeys: allKeys.slice(0, 30),
          recentEvents: recentEvents.slice(0, 15),
        },
        sessionCache: {
          activeEntries: authKeysCount,
          maxCapacity: 5000,
          ttlSeconds: TTL.USER_SESSION,
          utilizationPercent: Math.min(100, Math.round((authKeysCount / 5000) * 100)),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching system performance metrics:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || (!session.permissions.includes('admin') && !session.permissions.includes('admin_operational_officer'))) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const action = body.action;
    const scope = body.scope || 'all';

    if (action === 'ping') {
      const pingStart = performance.now();
      await prisma.$queryRaw`SELECT 1`;
      const dbLatencyMs = Math.round((performance.now() - pingStart) * 10) / 10;
      return NextResponse.json({
        success: true,
        action: 'ping',
        dbLatencyMs,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'clear_cache') {
      let message = 'Cache successfully flushed.';

      if (scope === 'crimes') {
        const count = await cacheService.deleteByPattern(CacheKeys.crimes.pattern());
        message = `Flushed ${count} cached crime query entries.`;
      } else if (scope === 'geo') {
        const count = await cacheService.deleteByPattern(CacheKeys.geo.pattern());
        message = `Flushed ${count} cached geospatial/barangay entries.`;
      } else if (scope === 'auth') {
        const count = await cacheService.deleteByPattern(CacheKeys.auth.pattern());
        message = `Flushed ${count} cached authentication & session entries.`;
      } else if (scope === 'config') {
        const count = await cacheService.deleteByPattern(CacheKeys.config.pattern());
        message = `Flushed ${count} cached configuration rules & schedules.`;
      } else {
        await cacheService.clear();
        invalidateSessionCache();
        message = 'Entire server-side cache successfully flushed.';
      }

      return NextResponse.json({
        success: true,
        action: 'clear_cache',
        scope,
        message,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'prune_exports') {
      const exportsDir = path.join(process.cwd(), 'exports');
      let prunedCount = 0;
      if (existsSync(exportsDir)) {
        const files = await fs.readdir(exportsDir);
        const now = Date.now();
        const RETENTION_MS = 14 * 24 * 60 * 60 * 1000;
        for (const file of files) {
          if (file.endsWith('.xlsx')) {
            const filePath = path.join(exportsDir, file);
            try {
              const stat = await fs.stat(filePath);
              if (now - stat.mtimeMs > RETENTION_MS) {
                await fs.unlink(filePath);
                prunedCount++;
              }
            } catch {}
          }
        }
      }
      return NextResponse.json({
        success: true,
        action: 'prune_exports',
        prunedCount,
        message: `Pruned ${prunedCount} expired export files.`,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error executing diagnostic action:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}
