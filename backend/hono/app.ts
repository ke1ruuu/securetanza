/**
 * Hono API Router (Polysyne Architecture)
 * Request → Hono API → Application Service → Cache → Database
 */

import { Hono } from 'hono';
import { CrimeService, BarangayService, PermissionService } from '@/backend/services';
import { cacheService } from '@/backend/cache';

export const honoApp = new Hono();

// Global request logger and timing middleware
honoApp.use('*', async (c, next) => {
  const start = performance.now();
  await next();
  const elapsed = Math.round((performance.now() - start) * 100) / 100;
  c.header('X-Response-Time', `${elapsed}ms`);
});

// Error handling middleware
honoApp.onError((err, c) => {
  console.error('[Hono API Error]:', err);
  return c.json(
    {
      success: false,
      error: err.message || 'Internal Server Error',
    },
    500
  );
});

// ==========================================
// CRIMES RESOURCE ROUTES
// ==========================================

honoApp.get('/crimes/stats', async (c) => {
  const barangay = c.req.query('barangay');
  const startDate = c.req.query('startDate');
  const endDate = c.req.query('endDate');
  const year = c.req.query('year');

  const stats = await CrimeService.getStats({
    barangay,
    startDate,
    endDate,
    year,
  });

  return c.json({
    success: true,
    data: stats,
  });
});

honoApp.get('/crimes/barangay-counts', async (c) => {
  const startDateCommitted = c.req.query('startDateCommitted');
  const endDateCommitted = c.req.query('endDateCommitted');
  const hour = c.req.query('hour');
  const year = c.req.query('year');
  const incidentType = c.req.query('incidentType');
  const barangay = c.req.query('barangay');

  const result = await CrimeService.getBarangayCounts({
    startDateCommitted,
    endDateCommitted,
    hour,
    year,
    incidentType,
    barangay,
  });

  return c.json({
    success: true,
    data: result,
  });
});

honoApp.get('/crimes/hourly-timeline', async (c) => {
  const result = await CrimeService.getHourlyTimeline({
    year: c.req.query('year'),
    incidentType: c.req.query('incidentType'),
    barangay: c.req.query('barangay'),
  });

  return c.json({
    success: true,
    data: result,
  });
});

honoApp.get('/crimes/years', async (c) => {
  const years = await CrimeService.getDistinctYears();
  return c.json({
    success: true,
    years,
  });
});

honoApp.get('/crimes/latest', async (c) => {
  const barangay = c.req.query('barangay');
  const latest = await CrimeService.getLatest(barangay);
  return c.json({
    success: true,
    data: latest,
  });
});

honoApp.get('/crimes', async (c) => {
  const query = c.req.query();
  const limit = query.limit ? parseInt(query.limit, 10) : 500;

  const crimes = await CrimeService.getCrimes({
    ...query,
    limit,
  });

  return c.json({
    success: true,
    data: crimes,
    count: crimes.length,
  });
});

// ==========================================
// BARANGAY RESOURCE ROUTES
// ==========================================

honoApp.get('/barangays', async (c) => {
  const search = c.req.query('search');
  const barangays = await BarangayService.getAll(search);
  return c.json({
    success: true,
    data: barangays,
    count: barangays.length,
  });
});

// ==========================================
// PERMISSION RESOURCE ROUTES
// ==========================================

honoApp.get('/permissions', async (c) => {
  const permissions = await PermissionService.getAllPermissions();
  return c.json({
    success: true,
    data: permissions,
  });
});

// ==========================================
// CACHE OBSERVABILITY ROUTES
// ==========================================

honoApp.get('/cache/telemetry', async (c) => {
  const stats = await cacheService.getStats();
  const recentEvents = cacheService.getRecentEvents();
  const activeKeys = await cacheService.getKeys();

  return c.json({
    success: true,
    provider: cacheService.getProviderName(),
    stats,
    activeKeys: activeKeys.slice(0, 50),
    recentEvents: recentEvents.slice(0, 20),
  });
});

honoApp.post('/cache/flush', async (c) => {
  const pattern = c.req.query('pattern');
  if (pattern) {
    const purged = await cacheService.deleteByPattern(pattern);
    return c.json({
      success: true,
      message: `Purged ${purged} keys matching pattern: ${pattern}`,
    });
  }

  await cacheService.clear();
  return c.json({
    success: true,
    message: 'Cache completely cleared',
  });
});

export default honoApp;
