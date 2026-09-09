/**
 * Throwaway probe for the hourly-timeline aggregate.
 * Usage: npx tsx scripts/debug-hourly-timeline.ts [year]
 *
 * Safe to delete once /api/crimes/hourly-timeline is confirmed working.
 */

import { CrimeService } from '../backend/services/crime.service';
import { disconnectPrisma } from '../backend/lib/prisma';

async function main() {
  const year = process.argv[2] ?? String(new Date().getFullYear());

  try {
    const result = await CrimeService.getHourlyTimeline({ year });
    console.log(`year=${year} totalCrimes=${result.totalCrimes} buckets=${result.buckets.length}`);
    console.log('first 10 buckets:', result.buckets.slice(0, 10));

    const unknownHour = result.buckets.filter(b => b.hour === null);
    if (unknownHour.length > 0) {
      console.warn(`${unknownHour.length} bucket(s) had an unparseable timeCommitted`);
    }
  } catch (err) {
    console.error('getHourlyTimeline FAILED');
    console.error(err);
    process.exitCode = 1;
  }

  await disconnectPrisma();
}

main();
