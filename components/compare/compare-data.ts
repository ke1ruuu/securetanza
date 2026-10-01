import type { TimeRange } from "@/context/MapContext";
import { calculateDynamicThresholds, type ThreatThresholds } from "@/lib/geo-threat";
import { keysToTimeRange, monthKey } from "@/lib/period-grid";

export type Side = "A" | "B";

export type PaneStatus = "loading" | "ready" | "error";

/** What each side of the compare view tells the page, so the ledger and the shared scale can be built. */
export interface PaneReport {
  /** The period as the picker words it: "Jan–Sep 2025", "Q2 2026", "Mar 3, 2026 – Apr 1, 2026". */
  label: string;
  crimeType: string | null;
  /** Incidents per barangay, keyed by `countKey`. */
  counts: Record<string, number>;
  total: number;
  status: PaneStatus;
}

/**
 * One key for a barangay however it's spelled. The register stores names in
 * capitals and marks the poblacion barangays ("BARANGAY I (POB.)"); the map's
 * boundaries use title case without the mark ("Barangay I").
 */
export const countKey = (name: string) =>
  name
    .trim()
    .toUpperCase()
    .replace(/\s*\((POB\.?|POBLACION)\)$/, "")
    .replace(/\s+/g, " ");

/**
 * One ruler for both maps: the bands come from both periods' barangay counts
 * together, so the same colour means the same number of incidents on either side.
 */
export function sharedThresholds(a: Record<string, number>, b: Record<string, number>): ThreatThresholds {
  return calculateDynamicThresholds([...Object.values(a), ...Object.values(b)]);
}

/**
 * The page opens on a like-for-like comparison: the months of the latest year
 * that have fully passed (B) against the same months a year earlier (A). In
 * January, when no month of the new year is complete, it's the last two whole years.
 */
export function openingPeriod(availableYears: number[], side: Side, today = new Date()): TimeRange {
  const latest = Math.max(...availableYears);
  let year = latest;
  let months = latest === today.getFullYear() ? today.getMonth() : 12;
  if (months === 0) {
    year = latest - 1;
    months = 12;
  }
  const target = side === "B" ? year : year - 1;
  const keys = new Set(Array.from({ length: months }, (_, i) => monthKey(target, i + 1)));
  return keysToTimeRange(keys);
}

export interface LedgerRow {
  key: string;
  name: string;
  a: number;
  b: number;
  delta: number;
}

/** "JULUGAN VIII" → "Julugan VIII": title case, with roman numerals left in capitals. */
const titleCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/\b\w+/g, (word) =>
      /^[ivx]+$/.test(word) ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1)
    );

/** Every barangay on the map, plus any the register holds that the map has no boundary for. */
export function buildLedgerRows(
  mapNames: string[],
  a: Record<string, number>,
  b: Record<string, number>
): LedgerRow[] {
  const names = new Map<string, string>();
  mapNames.forEach((name) => names.set(countKey(name), name));
  [...Object.keys(a), ...Object.keys(b)].forEach((key) => {
    if (!names.has(key)) names.set(key, titleCase(key));
  });

  return Array.from(names, ([key, name]) => {
    const countA = a[key] ?? 0;
    const countB = b[key] ?? 0;
    return { key, name, a: countA, b: countB, delta: countB - countA };
  });
}

const MINUS = "−";

/** "+34", "−12" or "0". The sign carries the direction, so colour is never the only cue. */
export function formatDelta(delta: number): string {
  if (delta > 0) return `+${delta.toLocaleString("en-US")}`;
  if (delta < 0) return `${MINUS}${Math.abs(delta).toLocaleString("en-US")}`;
  return "0";
}

/** "+18.9%", "−40%", or "new" when A had nothing to measure from. */
export function formatPercent(a: number, b: number): string | null {
  if (a === 0) return b > 0 ? "new" : null;
  const pct = ((b - a) / a) * 100;
  const rounded = Math.abs(pct) >= 10 ? Math.round(pct) : Math.round(pct * 10) / 10;
  if (rounded === 0) return "0%";
  return `${rounded > 0 ? "+" : MINUS}${Math.abs(rounded)}%`;
}

/** Text colour for a change: a rise in incidents reads red, a fall green, no change quiet. */
export function deltaTone(delta: number): string {
  if (delta > 0) return "text-red-700 dark:text-red-400";
  if (delta < 0) return "text-emerald-700 dark:text-emerald-400";
  return "text-slate-500 dark:text-slate-400";
}
