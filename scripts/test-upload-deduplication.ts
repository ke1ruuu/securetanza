/**
 * Automated Verification Script: Crime Upload Deduplication Engine
 */

import { prisma, disconnectPrisma } from '../backend/lib/prisma';
import { generateCrimeFingerprint, findExistingCrimeFingerprints } from '../backend/lib/crime-deduplication';
import { CrimeService } from '../backend/services/crime.service';

async function runTests() {
  console.log(`\n======================================================`);
  console.log(`🧪 Testing Crime Upload Deduplication Engine`);
  console.log(`======================================================\n`);

  // Test 1: Fingerprint determinism
  console.log('Test 1: Testing fingerprint determinism...');
  const sample1 = {
    blotterNo: 'BLT-2026-0099',
    barangay: 'Daang Amaya I',
    dateCommitted: new Date('2026-03-15T00:00:00Z'),
    timeCommitted: '14:30:00',
    incidentType: '(Incident) Theft',
    offense: 'Theft - RPC Art. 308',
    dateReported: new Date('2026-03-15T00:00:00Z'),
    timeReported: '15:00:00',
  };
  const sample2 = {
    blotterNo: '  blt-2026-0099  ', // Different casing and spaces
    barangay: 'DAANG AMAYA I',
    dateCommitted: '2026-03-15',
    timeCommitted: '14:30:00',
    incidentType: '(INCIDENT) THEFT',
    offense: 'theft - rpc art. 308',
    dateReported: '2026-03-15',
    timeReported: '15:00:00',
  };

  const fp1 = generateCrimeFingerprint(sample1);
  const fp2 = generateCrimeFingerprint(sample2);

  if (fp1 !== fp2) {
    throw new Error(`Fingerprint determinism failed: "${fp1}" !== "${fp2}"`);
  }
  console.log(`✅ Fingerprints match across casing and formatting: ${fp1}`);

  // Test 2: Composite fingerprint without blotter
  console.log('\nTest 2: Testing composite fingerprint without blotter...');
  const sampleNoBlotter1 = {
    blotterNo: null,
    barangay: 'Bagtas',
    dateCommitted: new Date('2026-02-10T00:00:00Z'),
    timeCommitted: '08:00:00',
    incidentType: '(Incident) Robbery',
    offense: 'Robbery',
    dateReported: new Date('2026-02-10T00:00:00Z'),
    timeReported: '09:00:00',
  };
  const sampleNoBlotter2 = {
    blotterNo: '',
    barangay: 'bagtas',
    dateCommitted: '2026-02-10',
    timeCommitted: '8:00',
    incidentType: '(incident) robbery',
    offense: 'robbery',
    dateReported: '2026-02-10',
    timeReported: '9:00',
  };
  const compFp1 = generateCrimeFingerprint(sampleNoBlotter1);
  const compFp2 = generateCrimeFingerprint(sampleNoBlotter2);

  if (compFp1 !== compFp2) {
    throw new Error(`Composite fingerprint failed: "${compFp1}" !== "${compFp2}"`);
  }
  console.log(`✅ Composite fingerprints match: ${compFp1}`);

  // Test 3: In-Database duplicate detection against live PostgreSQL
  console.log('\nTest 3: Testing database duplicate pre-query against existing records...');
  const existingRecord = await prisma.crimeIncident.findFirst();
  if (existingRecord) {
    console.log(`Found live existing DB record ID: ${existingRecord.id} (Barangay: ${existingRecord.barangay})`);
    const dbFingerprints = await findExistingCrimeFingerprints([existingRecord], prisma);

    const recordFp = generateCrimeFingerprint(existingRecord);
    if (!dbFingerprints.has(recordFp)) {
      throw new Error(`Database duplicate pre-query failed to identify existing record: ${recordFp}`);
    }
    console.log(`✅ Successfully detected live DB record as duplicate: ${recordFp}`);
  } else {
    console.log('ℹ️ No records in DB to test against live records.');
  }

  // Test 4: CrimeService.createIncident duplicate rejection
  console.log('\nTest 4: Testing CrimeService.createIncident duplicate rejection...');
  if (existingRecord) {
    try {
      await CrimeService.createIncident({
        blotterNo: existingRecord.blotterNo,
        barangay: existingRecord.barangay,
        dateCommitted: existingRecord.dateCommitted,
        timeCommitted: existingRecord.timeCommitted,
        incidentType: existingRecord.incidentType,
        offense: existingRecord.offense,
        dateReported: existingRecord.dateReported,
        timeReported: existingRecord.timeReported,
      });
      throw new Error('FAILED: CrimeService.createIncident allowed duplicate record creation!');
    } catch (err: any) {
      if (err.message.includes('already exists in the crime register')) {
        console.log(`✅ CrimeService correctly blocked duplicate creation: "${err.message}"`);
      } else {
        throw err;
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`🎉 ALL DEDUPLICATION TESTS PASSED SUCCESSFULLY!`);
  console.log(`======================================================\n`);

  await disconnectPrisma();
}

runTests().catch(async (err) => {
  console.error('❌ Test failed:', err);
  await disconnectPrisma();
  process.exit(1);
});
