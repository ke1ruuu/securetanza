/**
 * Crime Incident Deduplication Engine
 * Provides deterministic fingerprinting and batch deduplication checks
 * for Excel/CSV uploads and incident creation.
 */

import { PrismaClient } from './generated/prisma';

export interface CrimeRecordForFingerprint {
  blotterNo?: string | null;
  barangay: string;
  dateCommitted: Date | string;
  timeCommitted: string;
  incidentType: string;
  offense?: string | null;
  dateReported: Date | string;
  timeReported: string;
}

/**
 * Normalizes text strings by trimming, lowercasing, and collapsing whitespace.
 */
export function normalizeCrimeText(val: string | null | undefined): string {
  if (!val) return '';
  return val
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/**
 * Normalizes a date into a standard YYYY-MM-DD string representation.
 */
export function normalizeCrimeDate(val: Date | string | null | undefined): string {
  if (!val) return '';
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return '';
    return val.toISOString().split('T')[0];
  }
  const str = String(val).trim();
  if (str.includes('T')) {
    return str.split('T')[0];
  }
  // Try parsing date if in different format
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return str.toLowerCase();
}

/**
 * Normalizes a time into standard HH:MM:SS format.
 */
export function normalizeCrimeTime(val: string | null | undefined): string {
  if (!val) return '00:00:00';
  const clean = val.toString().trim();
  const parts = clean.split(':');
  if (parts.length >= 2) {
    const hh = parts[0].padStart(2, '0');
    const mm = parts[1].padStart(2, '0');
    const ss = parts[2] ? parts[2].padStart(2, '0') : '00';
    return `${hh}:${mm}:${ss}`;
  }
  return clean.toLowerCase();
}

/**
 * Generates a unique, deterministic fingerprint for a crime incident.
 * - If blotterNo is present, returns a blotter-keyed fingerprint.
 * - If blotterNo is absent, returns a composite key of the incident's core attributes.
 */
export function generateCrimeFingerprint(record: CrimeRecordForFingerprint): string {
  const blotter = normalizeCrimeText(record.blotterNo);
  if (blotter && blotter !== '-' && blotter !== 'n/a' && blotter !== 'none' && blotter !== 'null') {
    return `blotter:${blotter}`;
  }

  const barangay = normalizeCrimeText(record.barangay);
  const dateCommitted = normalizeCrimeDate(record.dateCommitted);
  const timeCommitted = normalizeCrimeTime(record.timeCommitted);
  const incidentType = normalizeCrimeText(record.incidentType);
  const offense = normalizeCrimeText(record.offense);
  const dateReported = normalizeCrimeDate(record.dateReported);
  const timeReported = normalizeCrimeTime(record.timeReported);

  return `comp:${barangay}|${dateCommitted}|${timeCommitted}|${incidentType}|${offense}|${dateReported}|${timeReported}`;
}

/**
 * Batch-queries PostgreSQL to retrieve all existing fingerprints for incoming records.
 * Uses indexed blotter numbers and date committed ranges to execute in a single fast round-trip.
 */
export async function findExistingCrimeFingerprints(
  records: CrimeRecordForFingerprint[],
  prisma: PrismaClient
): Promise<Set<string>> {
  const existingFingerprints = new Set<string>();
  if (!records || records.length === 0) {
    return existingFingerprints;
  }

  const blotterNos: string[] = [];
  let minDateCommitted: Date | null = null;
  let maxDateCommitted: Date | null = null;

  for (const rec of records) {
    const blotter = normalizeCrimeText(rec.blotterNo);
    if (blotter && blotter !== '-' && blotter !== 'n/a' && blotter !== 'none' && blotter !== 'null') {
      blotterNos.push(rec.blotterNo!.trim());
    }

    const d = rec.dateCommitted instanceof Date ? rec.dateCommitted : new Date(rec.dateCommitted);
    if (!isNaN(d.getTime())) {
      if (!minDateCommitted || d < minDateCommitted) minDateCommitted = d;
      if (!maxDateCommitted || d > maxDateCommitted) maxDateCommitted = d;
    }
  }

  const orConditions: any[] = [];

  if (blotterNos.length > 0) {
    orConditions.push({
      blotterNo: {
        in: blotterNos,
        mode: 'insensitive' as const,
      },
    });
  }

  if (minDateCommitted && maxDateCommitted) {
    // Expand boundaries by 1 day to account for timezone shifts
    const startBoundary = new Date(minDateCommitted);
    startBoundary.setDate(startBoundary.getDate() - 1);
    const endBoundary = new Date(maxDateCommitted);
    endBoundary.setDate(endBoundary.getDate() + 2);

    orConditions.push({
      dateCommitted: {
        gte: startBoundary,
        lte: endBoundary,
      },
    });
  }

  if (orConditions.length === 0) {
    return existingFingerprints;
  }

  const existingInDb = await prisma.crimeIncident.findMany({
    where: {
      OR: orConditions,
    },
    select: {
      blotterNo: true,
      barangay: true,
      dateCommitted: true,
      timeCommitted: true,
      incidentType: true,
      offense: true,
      dateReported: true,
      timeReported: true,
    },
  });

  for (const existing of existingInDb) {
    const fp = generateCrimeFingerprint(existing);
    existingFingerprints.add(fp);
    // If blotter is present, also add composite fingerprint to catch matches where blotter was omitted in one record
    if (existing.blotterNo) {
      const compositeFp = generateCrimeFingerprint({
        ...existing,
        blotterNo: null,
      });
      existingFingerprints.add(compositeFp);
    }
  }

  return existingFingerprints;
}
