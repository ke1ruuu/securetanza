// Percentile-based color levels for heatmap-style grids. Shared by the live crime
// matrix (components/dashboard/crime-matrix-chart.tsx) and the PDF / image exports so
// all three color a cell the same way.

export const HEAT_LEVEL_COUNT = 5;

export interface HeatLevel {
  min: number;
  max: number;
  /** Position on the color ramp (0–1), spread evenly across the levels actually in use. */
  intensity: number;
}

export interface HeatLevels {
  levels: HeatLevel[];
  /** Index into `levels` for a cell value, or -1 for zero / no data. */
  levelOf: (value: number) => number;
}

/**
 * Buckets the non-zero cells into up to five levels by percentile of the data on
 * screen, instead of scaling every cell against the single largest one. One dominant
 * row (e.g. a type with 12–16 a month beside others at 1–6) would otherwise set the
 * scale and wash everything else out to the palest step; with percentiles the colors
 * spread over whatever the filtered data looks like, and the top level is always
 * "the busiest ~fifth of cells", never a fixed count.
 */
export function buildHeatLevels(rows: Array<{ monthlyData: number[] }>): HeatLevels {
  const values = rows
    .flatMap((row) => row.monthlyData)
    .filter((v) => v > 0)
    .sort((a, b) => a - b);
  if (values.length === 0) return { levels: [], levelOf: () => -1 };

  const at = (p: number) => values[Math.min(values.length - 1, Math.max(0, Math.ceil(p * values.length) - 1))];
  const cutoffs = Array.from({ length: HEAT_LEVEL_COUNT - 1 }, (_, i) => at((i + 1) / HEAT_LEVEL_COUNT));
  const rawLevel = (v: number) => {
    const i = cutoffs.findIndex((c) => v <= c);
    return i === -1 ? HEAT_LEVEL_COUNT - 1 : i;
  };

  // Ties (lots of 1s) can leave some buckets empty — keep only the ones with cells
  const used = Array.from(new Set(values.map(rawLevel))).sort((a, b) => a - b);
  const levels: HeatLevel[] = used.map((raw, j) => {
    const inLevel = values.filter((v) => rawLevel(v) === raw);
    return {
      min: inLevel[0],
      max: inLevel[inLevel.length - 1],
      intensity: used.length === 1 ? 0.7 : 0.2 + 0.8 * (j / (used.length - 1)),
    };
  });
  const indexByRaw = new Map(used.map((raw, j) => [raw, j]));
  return { levels, levelOf: (v) => (v > 0 ? indexByRaw.get(rawLevel(v)) ?? -1 : -1) };
}

export function levelRangeLabel(level: HeatLevel): string {
  return level.min === level.max ? String(level.min) : `${level.min}–${level.max}`;
}
