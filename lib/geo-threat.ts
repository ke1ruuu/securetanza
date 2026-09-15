/** Shared between lib/pdf-generator.ts and lib/image-export.ts so the PDF's
 *  map, the exported map images, and the live dashboard map (hooks/useThreatLevels.ts)
 *  all agree on the same colors and the same barangay boundary data. Kept free
 *  of React so it can be used from either a jsPDF document or a <canvas />. */

export type RGB = readonly [number, number, number];

export type ThreatLevel = 'secure' | 'low' | 'moderate' | 'high' | 'critical';

/** Mirrors hooks/useThreatLevels.ts (THREAT_COLORS). Update both if the
 *  palette or bands ever change. */
export const THREAT_RGB: Record<ThreatLevel, RGB> = {
  secure: [14, 165, 233], // #0ea5e9
  low: [16, 185, 129], // #10b981
  moderate: [234, 179, 8], // #eab308
  high: [249, 115, 22], // #f97316
  critical: [239, 68, 68], // #ef4444
};

export interface ThreatThresholds {
  low: number;
  moderate: number;
  high: number;
  critical: number;
}

/** Mirrors hooks/useThreatLevels.ts (calculateDynamicThresholds). */
export function calculateDynamicThresholds(crimeCounts: number[]): ThreatThresholds {
  const nonZero = crimeCounts.filter((c) => c > 0).sort((a, b) => a - b);
  if (!nonZero.length) return { low: 2, moderate: 5, high: 10, critical: 15 };
  const q1 = nonZero[Math.floor(nonZero.length * 0.25)] || 1;
  const q2 = nonZero[Math.floor(nonZero.length * 0.5)] || 2;
  const q3 = nonZero[Math.floor(nonZero.length * 0.75)] || 5;
  return { low: Math.ceil(q1), moderate: Math.ceil(q2), high: Math.ceil(q3), critical: Math.ceil(q3) + 1 };
}

export function threatLevelOf(count: number, t: ThreatThresholds): ThreatLevel {
  if (count === 0) return 'secure';
  if (count <= t.low) return 'low';
  if (count <= t.moderate) return 'moderate';
  if (count <= t.high) return 'high';
  return 'critical';
}

export interface GeoBounds {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
}

export interface BarangayShape {
  name: string;
  ring: Array<[number, number]>;
}

export interface TanzaGeography {
  features: BarangayShape[];
  bounds: GeoBounds | null;
}

/** Fetches and parses public/tanza_cavite.geojson. Returns empty features (and
 *  a null bounds) on failure so callers can treat "no data" and "fetch
 *  failed" the same way instead of throwing mid-render. */
export async function loadTanzaGeography(): Promise<TanzaGeography> {
  try {
    const res = await fetch('/tanza_cavite.geojson');
    if (!res.ok) throw new Error(`geojson fetch failed: ${res.status}`);
    const gj = await res.json();
    const features: BarangayShape[] = [];
    let minLon = Infinity;
    let maxLon = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    for (const f of gj.features ?? []) {
      const name = f?.properties?.adm4_en;
      const outerRing = f?.geometry?.coordinates?.[0];
      if (!name || !Array.isArray(outerRing)) continue;

      const ring: Array<[number, number]> = outerRing.map(([lon, lat]: [number, number]) => [lon, lat]);
      ring.forEach(([lon, lat]) => {
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      });
      features.push({ name, ring });
    }

    return { features, bounds: features.length ? { minLon, maxLon, minLat, maxLat } : null };
  } catch (error) {
    console.error('Could not load barangay boundaries:', error);
    return { features: [], bounds: null };
  }
}

/** Builds a lon/lat → box-space projector fitted to `box`, preserving aspect
 *  ratio (longitude scaled by cos(latitude) so the shape isn't stretched).
 *  Unit-agnostic — pass mm for a jsPDF page or px for a canvas. */
export function makeGeoProjector(
  bounds: GeoBounds,
  box: { x: number; y: number; w: number; h: number }
): (lon: number, lat: number) => [number, number] {
  const latMean = (bounds.minLat + bounds.maxLat) / 2;
  const lonScale = Math.cos((latMean * Math.PI) / 180);
  const dataW = (bounds.maxLon - bounds.minLon) * lonScale || 1;
  const dataH = bounds.maxLat - bounds.minLat || 1;
  const scale = Math.min(box.w / dataW, box.h / dataH);
  const offsetX = box.x + (box.w - dataW * scale) / 2;
  const offsetY = box.y + (box.h - dataH * scale) / 2;

  return (lon: number, lat: number): [number, number] => [
    offsetX + (lon - bounds.minLon) * lonScale * scale,
    offsetY + (bounds.maxLat - lat) * scale, // north is up
  ];
}
