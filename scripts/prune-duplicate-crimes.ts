/**
 * Standalone Script: Detect and Prune Duplicate Crime Records
 *
 * Usage:
 *   npx tsx scripts/prune-duplicate-crimes.ts           # Dry-run mode (scans and reports duplicates)
 *   npx tsx scripts/prune-duplicate-crimes.ts --execute # Pruning mode (deletes duplicates, preserves originals)
 */

import { prisma, disconnectPrisma } from '../backend/lib/prisma';
import { generateCrimeFingerprint } from '../backend/lib/crime-deduplication';
import { cacheService, CacheKeys } from '../backend/cache';

async function main() {
  const isExecute = process.argv.includes('--execute');

  console.log(`\n======================================================`);
  console.log(`🧹 SecureTanza Crime Register Deduplication Tool`);
  console.log(`Mode: ${isExecute ? '⚠️ EXECUTE (Permanent Deletion)' : '🔍 DRY-RUN (Report Only)'}`);
  console.log(`======================================================\n`);

  console.log('1. Loading all crime incidents from database...');
  const allIncidents = await prisma.crimeIncident.findMany({
    select: {
      id: true,
      blotterNo: true,
      barangay: true,
      dateCommitted: true,
      timeCommitted: true,
      incidentType: true,
      offense: true,
      dateReported: true,
      timeReported: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc', // Earliest records are ranked first (preserved as originals)
    },
  });

  console.log(`Loaded ${allIncidents.length} total records.\n`);

  const seenFingerprints = new Map<string, { id: string; createdAt: Date }>();
  const duplicatesToDelete: Array<{
    id: string;
    originalId: string;
    fingerprint: string;
    blotterNo: string | null;
    barangay: string;
    createdAt: Date;
  }> = [];

  for (const incident of allIncidents) {
    const fingerprint = generateCrimeFingerprint(incident);

    if (seenFingerprints.has(fingerprint)) {
      const original = seenFingerprints.get(fingerprint)!;
      duplicatesToDelete.push({
        id: incident.id,
        originalId: original.id,
        fingerprint,
        blotterNo: incident.blotterNo,
        barangay: incident.barangay,
        createdAt: incident.createdAt,
      });
    } else {
      seenFingerprints.set(fingerprint, { id: incident.id, createdAt: incident.createdAt });
    }
  }

  console.log(`📊 Analysis Findings:`);
  console.log(`- Unique Records: ${seenFingerprints.size}`);
  console.log(`- Duplicate Records Found: ${duplicatesToDelete.length}`);

  if (duplicatesToDelete.length === 0) {
    console.log(`\n✅ Zero duplicate records found in the database. The crime register is completely clean!`);
    await disconnectPrisma();
    return;
  }

  console.log(`\nSample Duplicates Detected (First 5):`);
  duplicatesToDelete.slice(0, 5).forEach((d, i) => {
    console.log(
      `  [${i + 1}] Duplicate ID: ${d.id} (Created: ${d.createdAt.toISOString()}) -> Preserving Original: ${d.originalId} | Barangay: ${d.barangay} | Blotter: ${d.blotterNo || 'N/A'}`
    );
  });

  if (!isExecute) {
    console.log(`\n💡 To permanently remove these ${duplicatesToDelete.length} duplicate records and keep the original entries, run:`);
    console.log(`   npx tsx scripts/prune-duplicate-crimes.ts --execute\n`);
    await disconnectPrisma();
    return;
  }

  // Deletion Phase
  console.log(`\n🗑️ Deleting ${duplicatesToDelete.length} duplicate records from PostgreSQL...`);
  const idsToDelete = duplicatesToDelete.map((d) => d.id);

  // Delete in batches of 100
  const BATCH = 100;
  let deletedCount = 0;
  for (let i = 0; i < idsToDelete.length; i += BATCH) {
    const batch = idsToDelete.slice(i, i + BATCH);
    const res = await prisma.crimeIncident.deleteMany({
      where: {
        id: { in: batch },
      },
    });
    deletedCount += res.count;
  }

  console.log(`✅ Successfully pruned ${deletedCount} duplicate records.`);

  // Invalidate cache
  console.log('🔄 Invalidating crime analytics cache...');
  await cacheService.deleteByPattern(CacheKeys.crimes.pattern());
  console.log('✅ Cache purged. Live dashboard now displays accurate, deduplicated statistics.\n');

  await disconnectPrisma();
}

main().catch(async (err) => {
  console.error('Fatal error during deduplication:', err);
  await disconnectPrisma();
  process.exit(1);
});
