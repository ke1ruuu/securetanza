/**
 * Comprehensive Automated Verification for Server-Side Caching Layer
 */

import { cacheService, CacheKeys, InMemoryCacheProvider, CacheProvider } from '../backend/cache';
import { CrimeService, BarangayService } from '../backend/services';

async function runTests() {
  console.log('🚀 Starting Server-Side Caching Layer Automated Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${msg}`);
      failed++;
    }
  }

  // ==========================================
  // TEST 1: Basic Get, Set, and Delete
  // ==========================================
  console.log('--- TEST 1: Basic Get, Set, and Delete ---');
  await cacheService.clear();
  await cacheService.set('test:key:1', { greeting: 'hello' }, 10);
  const val1 = await cacheService.get<{ greeting: string }>('test:key:1');
  assert(val1 !== null && val1.greeting === 'hello', 'Cache sets and retrieves JSON values');

  await cacheService.delete('test:key:1');
  const valDeleted = await cacheService.get('test:key:1');
  assert(valDeleted === null, 'Cache deletes entry');

  // ==========================================
  // TEST 2: TTL Expiration
  // ==========================================
  console.log('\n--- TEST 2: TTL Expiration ---');
  // Set key with 1-second TTL
  await cacheService.set('test:ttl:key', 'quick-expire', 1);
  const valBeforeExpire = await cacheService.get('test:ttl:key');
  assert(valBeforeExpire === 'quick-expire', 'Value exists before TTL expires');

  console.log('  ⏳ Waiting 1100ms for TTL expiration...');
  await new Promise((r) => setTimeout(r, 1100));
  const valAfterExpire = await cacheService.get('test:ttl:key');
  assert(valAfterExpire === null, 'Value is null after TTL expires');

  // ==========================================
  // TEST 3: Pattern Deletion (Namespace Invalidation)
  // ==========================================
  console.log('\n--- TEST 3: Wildcard Pattern Invalidation ---');
  await cacheService.set('app:crimes:stats:abc', { count: 100 }, 60);
  await cacheService.set('app:crimes:stats:xyz', { count: 200 }, 60);
  await cacheService.set('app:crimes:barangays:counts', { B1: 5 }, 60);
  await cacheService.set('app:geo:barangays:all', [{ name: 'Amaya' }], 3600);

  const purgedCrimes = await cacheService.deleteByPattern('app:crimes:*');
  assert(purgedCrimes === 3, `Pattern delete purged all 3 crimes entries (got: ${purgedCrimes})`);

  const crimesCheck = await cacheService.get('app:crimes:stats:abc');
  const geoCheck = await cacheService.get('app:geo:barangays:all');
  assert(crimesCheck === null, 'Crimes cache key was successfully purged');
  assert(geoCheck !== null, 'Geo cache key in different namespace was preserved');

  // ==========================================
  // TEST 4: Single-Flight Stampede Protection
  // ==========================================
  console.log('\n--- TEST 4: Cache Stampede Protection (Single-Flight) ---');
  await cacheService.clear();
  cacheService.resetStats();

  let loaderInvocationCount = 0;
  const expensiveDatabaseQuery = async (): Promise<{ total: number }> => {
    loaderInvocationCount++;
    // Simulate expensive 60ms PostgreSQL aggregate query
    await new Promise((r) => setTimeout(r, 60));
    return { total: 1937 };
  };

  const stampedeKey = 'app:crimes:stampede-test';
  const concurrency = 10;
  console.log(`  ⚡ Dispatching ${concurrency} simultaneous concurrent requests for uncached key...`);

  const promises = Array.from({ length: concurrency }, () =>
    cacheService.getOrSet(stampedeKey, 60, expensiveDatabaseQuery)
  );

  const results = await Promise.all(promises);

  assert(
    loaderInvocationCount === 1,
    `Database loader executed exactly 1 time across ${concurrency} concurrent requests (got: ${loaderInvocationCount})`
  );
  assert(
    results.every((r) => r.total === 1937),
    'All concurrent callers received the exact resolved value'
  );

  const statsAfterStampede = await cacheService.getStats();
  assert(
    statsAfterStampede.stampedePrevented === concurrency - 1,
    `Recorded ${concurrency - 1} stampedes prevented (got: ${statsAfterStampede.stampedePrevented})`
  );

  // ==========================================
  // TEST 5: Graceful Fallback on Provider Failure
  // ==========================================
  console.log('\n--- TEST 5: Graceful Fallback ---');
  const faultyProvider: CacheProvider = {
    name: 'faulty-mock',
    get: async () => { throw new Error('Simulated Redis network disconnection'); },
    set: async () => { throw new Error('Simulated Redis write timeout'); },
    delete: async () => false,
    deleteByPattern: async () => 0,
    clear: async () => {},
    has: async () => false,
    getKeys: async () => [],
    getActiveKeyCount: async () => 0,
    isHealthy: async () => false,
  };

  const fallbackService = new (cacheService.constructor as any)(faultyProvider);

  let fallbackLoaderCalled = false;
  const fallbackResult = await fallbackService.getOrSet(
    'test:fallback:key',
    60,
    async () => {
      fallbackLoaderCalled = true;
      return { status: 'db-fallback-success' };
    }
  );

  assert(
    fallbackLoaderCalled && fallbackResult.status === 'db-fallback-success',
    'Application continued gracefully by executing DB loader despite cache failure'
  );

  // Restore normal provider
  cacheService.setProvider(new InMemoryCacheProvider());

  // ==========================================
  // TEST 6: Application Services Read-Through & Live Latency
  // ==========================================
  console.log('\n--- TEST 6: Application Services Read-Through Integration ---');
  await cacheService.clear();
  cacheService.resetStats();

  console.log('  🔍 Fetching Crime Stats (Request 1 - Cache Miss)...');
  const t0 = performance.now();
  const stats1 = await CrimeService.getStats({});
  const missLatency = performance.now() - t0;
  console.log(`     Miss Latency: ${missLatency.toFixed(1)}ms | Total Crimes: ${stats1.totalCrimes}`);

  console.log('  🔍 Fetching Crime Stats (Request 2 - Cache Hit)...');
  const t1 = performance.now();
  const stats2 = await CrimeService.getStats({});
  const hitLatency = performance.now() - t1;
  console.log(`     Hit Latency: ${hitLatency.toFixed(2)}ms | Total Crimes: ${stats2.totalCrimes}`);

  assert(stats1.totalCrimes === stats2.totalCrimes, 'Cached stats payload matches original query');
  assert(hitLatency < missLatency, `Cache hit (${hitLatency.toFixed(2)}ms) significantly faster than DB query (${missLatency.toFixed(1)}ms)`);

  console.log('  🔍 Fetching Distinct Years (Cached)...');
  const years = await CrimeService.getDistinctYears();
  assert(Array.isArray(years) && years.length > 0, `Distinct years retrieved: [${years.join(', ')}]`);

  console.log('  🔍 Fetching Barangays (Cached)...');
  const barangays = await BarangayService.getAll();
  assert(Array.isArray(barangays) && barangays.length > 0, `Barangays retrieved: ${barangays.length} records`);

  // Verify Telemetry
  const finalStats = await cacheService.getStats();
  console.log('\n--- Final Telemetry Summary ---');
  console.log(`  • Cache Hits: ${finalStats.hits}`);
  console.log(`  • Cache Misses: ${finalStats.misses}`);
  console.log(`  • Hit Ratio: ${finalStats.hitRatio}%`);
  console.log(`  • Database Queries Saved: ${finalStats.dbQueriesSaved}`);
  console.log(`  • Active Keys in RAM: ${finalStats.activeKeys}`);

  assert(finalStats.hits >= 1, 'Telemetry recorded cache hits');
  assert(finalStats.dbQueriesSaved >= 1, 'Telemetry recorded database queries saved');

  console.log(`\n==========================================`);
  console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log(`==========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Test execution fatal error:', err);
    process.exit(1);
  });
