import type { FilterMode, TimeRange, TimeSelection } from "@/context/MapContext";

/**
 * The period picker's grid works on individual months — one cell per month —
 * while the rest of the app (map, reports, data hooks) stores a period as a
 * mode (year / half / quarter / month) plus selections. These helpers convert
 * between the two so any set of cells can be saved in the shape everything
 * else already understands, and read back into cells.
 *
 * A month is keyed as `year * 12 + (month - 1)` so keys sort chronologically
 * and adjacent months differ by exactly 1.
 */

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const monthKey = (year: number, month: number) => year * 12 + (month - 1);
export const keyYear = (key: number) => Math.floor(key / 12);
export const keyMonth = (key: number) => (key % 12) + 1;

const monthsOf = (year: number, from: number, to: number) => {
  const keys: number[] = [];
  for (let m = from; m <= to; m++) keys.push(monthKey(year, m));
  return keys;
};

export const yearKeys = (year: number) => monthsOf(year, 1, 12);

/** The months a saved period covers. `fallbackYear` stands in for a period that
 *  has a mode but nothing picked yet, which the data hooks treat as that whole year. */
export function timeRangeToKeys(timeRange: TimeRange, fallbackYear: number): Set<number> {
  const keys = new Set<number>();
  if (timeRange.mode === "day") {
    // Individual days aren't representable on a month grid.
    return keys;
  }
  if (timeRange.selections.length === 0) {
    yearKeys(fallbackYear).forEach((k) => keys.add(k));
    return keys;
  }
  timeRange.selections.forEach((s: TimeSelection) => {
    if (s.quarter) monthsOf(s.year, (s.quarter - 1) * 3 + 1, s.quarter * 3).forEach((k) => keys.add(k));
    else if (s.halfYear) monthsOf(s.year, s.halfYear === 1 ? 1 : 7, s.halfYear === 1 ? 6 : 12).forEach((k) => keys.add(k));
    else if (s.month) keys.add(monthKey(s.year, s.month));
    else yearKeys(s.year).forEach((k) => keys.add(k));
  });
  return keys;
}

/** Does every one of `parts` (each a list of keys) sit entirely inside or entirely outside `keys`? */
function decomposes(keys: Set<number>, size: 3 | 6): { year: number; index: number }[] | null {
  const out: { year: number; index: number }[] = [];
  const years = Array.from(new Set(Array.from(keys).sort((a, b) => a - b).map(keyYear)));
  for (const year of years) {
    for (let start = 1; start <= 12; start += size) {
      const block = monthsOf(year, start, start + size - 1);
      const inside = block.filter((k) => keys.has(k)).length;
      if (inside === block.length) out.push({ year, index: Math.floor((start - 1) / size) + 1 });
      else if (inside !== 0) return null;
    }
  }
  return out;
}

/** Save a set of months in the most specific shape the rest of the app understands,
 *  so a plain "Q2 2025" stays a quarter rather than turning into three months. */
export function keysToTimeRange(keys: Set<number>): TimeRange {
  const sorted = Array.from(keys).sort((a, b) => a - b);
  const years = Array.from(new Set(sorted.map(keyYear)));

  if (years.every((y) => yearKeys(y).every((k) => keys.has(k)))) {
    return { mode: "year", selections: years.map((year) => ({ year })) };
  }
  const halves = decomposes(keys, 6);
  if (halves) {
    return { mode: "half-year", selections: halves.map(({ year, index }) => ({ year, halfYear: index })) };
  }
  const quarters = decomposes(keys, 3);
  if (quarters) {
    return { mode: "quarter", selections: quarters.map(({ year, index }) => ({ year, quarter: index })) };
  }
  return {
    mode: "month" as FilterMode,
    selections: sorted.map((k) => ({ year: keyYear(k), month: keyMonth(k) })),
  };
}

/** Human label for a set of months: "2025", "Q2 2025", "H1 2024", "Mar 2025",
 *  "Mar–Aug 2025", joined with commas across years. */
export function describeKeys(keys: Set<number>): string {
  const sorted = Array.from(keys).sort((a, b) => a - b);
  if (sorted.length === 0) return "";

  // Split into runs of consecutive months within one year.
  const runs: number[][] = [];
  sorted.forEach((k) => {
    const last = runs[runs.length - 1];
    if (last && k === last[last.length - 1] + 1 && keyYear(k) === keyYear(last[0])) last.push(k);
    else runs.push([k]);
  });

  const parts = runs.map((run) => {
    const year = keyYear(run[0]);
    const from = keyMonth(run[0]);
    const to = keyMonth(run[run.length - 1]);
    const len = run.length;
    if (len === 12) return `${year}`;
    if (len === 6 && (from === 1 || from === 7)) return `H${from === 1 ? 1 : 2} ${year}`;
    if (len === 3 && (from - 1) % 3 === 0) return `Q${(from - 1) / 3 + 1} ${year}`;
    if (len === 1) return `${MONTH_ABBR[from - 1]} ${year}`;
    return `${MONTH_ABBR[from - 1]}–${MONTH_ABBR[to - 1]} ${year}`;
  });

  return parts.length > 2 ? `${parts.length} periods` : parts.join(", ");
}
