import type { ReportData } from './pdf-generator';
import {
  type BarangayShape,
  type GeoBounds,
  type ThreatLevel,
  THREAT_RGB,
  calculateDynamicThresholds,
  threatLevelOf,
  loadTanzaGeography,
  makeGeoProjector,
} from './geo-threat';
import { INK, INK_MID, INK_SOFT, HAIR, RULE, PAPER, RAMP_LO, RAMP_HI, mix, rampColor, rgbToCss, type RGB } from './report-theme';

/** Renders individual chart/map PNGs for admins to drop into a PPT, sharing
 *  the same colors, thresholds, and drawing logic as the PDF report (see
 *  lib/pdf-generator.ts) so an exported image reads as part of the same
 *  visual system instead of a mismatched screenshot. Pure canvas — no
 *  Leaflet, no MapContext, no DOM screenshotting. */

export interface ExportedImage {
  name: string;
  blob: Blob;
}

const FONT = 'Helvetica, Arial, sans-serif';
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

function hourBand(hour: number): string {
  const next = (hour + 1) % 24;
  return `${formatHour(hour)}–${formatHour(next)}`;
}

function sortDesc<T extends Record<string, unknown>>(rows: T[], key: keyof T): T[] {
  return [...rows].sort((a, b) => Number(b[key] ?? 0) - Number(a[key] ?? 0));
}

/* ── Canvas primitives ────────────────────────────────────────────────────── */

const PAD = 56;

function newCanvas(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('This browser cannot create a 2D canvas context.');
  ctx.fillStyle = rgbToCss(PAPER);
  ctx.fillRect(0, 0, w, h);
  ctx.textBaseline = 'alphabetic';
  return { canvas, ctx };
}

function setFont(ctx: CanvasRenderingContext2D, size: number, weight: 'normal' | 'bold' = 'normal') {
  ctx.font = `${weight === 'bold' ? 'bold ' : ''}${size}px ${FONT}`;
}

function text(
  ctx: CanvasRenderingContext2D,
  str: string,
  x: number,
  y: number,
  opts: { size: number; weight?: 'normal' | 'bold'; color?: RGB; align?: CanvasTextAlign } = { size: 24 }
) {
  setFont(ctx, opts.size, opts.weight ?? 'normal');
  ctx.fillStyle = rgbToCss(opts.color ?? INK_MID);
  ctx.textAlign = opts.align ?? 'left';
  ctx.fillText(str, x, y);
}

function capsLabel(ctx: CanvasRenderingContext2D, str: string, x: number, y: number, color: RGB = INK_SOFT, align: CanvasTextAlign = 'left') {
  setFont(ctx, 20, 'bold');
  ctx.fillStyle = rgbToCss(color);
  ctx.textAlign = align;
  ctx.fillText(str.toUpperCase(), x, y);
}

function rule(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, color: RGB = HAIR, width = 1.5) {
  ctx.strokeStyle = rgbToCss(color);
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.stroke();
}

/** Every exported image gets the same masthead: a caps label, a bold title,
 *  and an optional scope/time-range subtitle, so it's self-identifying once
 *  it's pasted into a slide, detached from the report around it. */
function drawHeader(ctx: CanvasRenderingContext2D, w: number, opts: { kicker: string; title: string; subtitle?: string }): number {
  capsLabel(ctx, opts.kicker, PAD, PAD + 20, INK_SOFT);
  text(ctx, opts.title, PAD, PAD + 62, { size: 40, weight: 'bold', color: INK });
  let y = PAD + 62;
  if (opts.subtitle) {
    y += 34;
    text(ctx, opts.subtitle, PAD, y, { size: 24, color: INK_SOFT });
  }
  y += 22;
  rule(ctx, PAD, y, w - PAD * 2, RULE, 2);
  return y + 44;
}

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Could not encode this image.'));
    }, 'image/png');
  });
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/* ── Chart bodies (each returns the y position just past what it drew) ────── */

function drawHorizontalBars(
  ctx: CanvasRenderingContext2D,
  items: Array<{ label: string; value: number }>,
  box: { x: number; y: number; w: number }
): number {
  const labelW = box.w * 0.28;
  const valueW = 90;
  const trackW = box.w - labelW - valueW;
  const rowH = 58;
  const barH = 36;
  const max = Math.max(...items.map((d) => d.value), 1);

  items.forEach((item, i) => {
    const rowY = box.y + i * rowH;
    const barW = Math.max((item.value / max) * trackW, item.value > 0 ? 4 : 0);

    text(ctx, item.label, box.x, rowY + barH - 8, { size: 24, color: INK_MID });

    ctx.fillStyle = rgbToCss(mix(RAMP_LO, PAPER, 0.45));
    ctx.fillRect(box.x + labelW, rowY, trackW, barH);

    ctx.fillStyle = rgbToCss(rampColor(item.value / max));
    ctx.fillRect(box.x + labelW, rowY, barW, barH);

    text(ctx, String(item.value), box.x + labelW + trackW + valueW, rowY + barH - 8, {
      size: 24,
      weight: 'bold',
      color: INK,
      align: 'right',
    });
  });

  return box.y + items.length * rowH;
}

function drawColumnChart(
  ctx: CanvasRenderingContext2D,
  items: Array<{ label: string; value: number }>,
  box: { x: number; y: number; w: number; h: number },
  opts: { labelEvery?: number; highlight?: number } = {}
): number {
  const labelEvery = opts.labelEvery ?? 1;
  const max = Math.max(...items.map((d) => d.value), 1);
  const baseline = box.y + box.h;
  const slot = box.w / items.length;
  const barW = Math.min(slot * 0.62, 36);

  items.forEach((item, i) => {
    const barH = (item.value / max) * box.h;
    const x = box.x + i * slot + (slot - barW) / 2;
    const isPeak = opts.highlight === i;
    ctx.fillStyle = rgbToCss(isPeak ? RAMP_HI : rampColor(0.32 + (item.value / max) * 0.45));
    if (barH > 0) ctx.fillRect(x, baseline - barH, barW, barH);

    if (isPeak) {
      text(ctx, String(item.value), x + barW / 2, baseline - barH - 10, { size: 22, weight: 'bold', color: INK, align: 'center' });
    }

    if (i % labelEvery === 0) {
      text(ctx, item.label, x + barW / 2, baseline + 28, {
        size: 20,
        weight: isPeak ? 'bold' : 'normal',
        color: isPeak ? INK : INK_SOFT,
        align: 'center',
      });
    }
  });

  rule(ctx, box.x, baseline, box.w, RULE, 1.5);
  return baseline + 40;
}

function drawMatrixGrid(ctx: CanvasRenderingContext2D, rows: Array<{ crimeType: string; monthlyData: number[] }>, box: { x: number; y: number; w: number }): number {
  const labelW = box.w * 0.24;
  const totalW = 90;
  const cellW = (box.w - labelW - totalW) / 12;
  const cellH = 46;
  const max = Math.max(1, ...rows.flatMap((r) => r.monthlyData));

  const headY = box.y;
  MONTHS_SHORT.forEach((month, i) => {
    capsLabel(ctx, month, box.x + labelW + i * cellW + cellW / 2, headY, INK_SOFT, 'center');
  });
  capsLabel(ctx, 'Total', box.x + box.w, headY, INK, 'right');

  const top = headY + 18;
  rows.forEach((row, r) => {
    const y = top + r * cellH;
    const total = row.monthlyData.reduce((a, b) => a + b, 0);
    const label = row.crimeType.length > 26 ? `${row.crimeType.slice(0, 25)}…` : row.crimeType;
    text(ctx, label, box.x, y + cellH - 14, { size: 22, color: INK_MID });

    row.monthlyData.forEach((value, m) => {
      const x = box.x + labelW + m * cellW;
      if (value > 0) {
        ctx.fillStyle = rgbToCss(rampColor(value / max));
        ctx.fillRect(x + 2, y + 3, cellW - 4, cellH - 8);
        text(ctx, String(value), x + cellW / 2, y + cellH - 16, {
          size: 18,
          weight: 'bold',
          color: value / max > 0.55 ? PAPER : INK,
          align: 'center',
        });
      } else {
        ctx.strokeStyle = rgbToCss(HAIR);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + cellW / 2 - 6, y + cellH / 2);
        ctx.lineTo(x + cellW / 2 + 6, y + cellH / 2);
        ctx.stroke();
      }
    });

    text(ctx, String(total), box.x + box.w, y + cellH - 14, { size: 22, weight: 'bold', color: INK, align: 'right' });
  });

  return top + rows.length * cellH + 20;
}

/* ── Map bodies ─────────────────────────────────────────────────────────── */

function fillRing(
  ctx: CanvasRenderingContext2D,
  ring: Array<[number, number]>,
  project: (lon: number, lat: number) => [number, number],
  fill: RGB,
  stroke: RGB,
  strokeWidth: number
) {
  const pts = ring.map(([lon, lat]) => project(lon, lat));
  if (pts.length < 3) return;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fillStyle = rgbToCss(fill);
  ctx.fill();
  ctx.strokeStyle = rgbToCss(stroke);
  ctx.lineWidth = strokeWidth;
  ctx.stroke();
}

function drawThreatLegend(ctx: CanvasRenderingContext2D, x: number, y: number): number {
  capsLabel(ctx, 'Barangay risk band', x, y);
  let ly = y + 40;
  const items: Array<[ThreatLevel, string]> = [
    ['secure', 'Secure'],
    ['low', 'Low'],
    ['moderate', 'Moderate'],
    ['high', 'High'],
    ['critical', 'Critical'],
  ];
  items.forEach(([level, label]) => {
    ctx.fillStyle = rgbToCss(THREAT_RGB[level]);
    ctx.fillRect(x, ly - 20, 22, 22);
    text(ctx, label, x + 34, ly - 2, { size: 22, color: INK_MID });
    ly += 34;
  });
  return ly;
}

function drawChoropleth(
  ctx: CanvasRenderingContext2D,
  features: BarangayShape[],
  bounds: GeoBounds,
  counts: Record<string, number>,
  box: { x: number; y: number; w: number; h: number },
  opts: { highlight?: string } = {}
) {
  const thresholds = calculateDynamicThresholds(features.map((f) => counts[f.name.toUpperCase()] ?? 0));
  const highlightUpper = opts.highlight?.toUpperCase();
  const project = makeGeoProjector(bounds, box);

  features.forEach((feature) => {
    const count = counts[feature.name.toUpperCase()] ?? 0;
    const level = threatLevelOf(count, thresholds);
    const isHighlighted = !!highlightUpper && feature.name.toUpperCase() === highlightUpper;
    const isDimmed = !!highlightUpper && !isHighlighted;
    const fill = isDimmed ? mix(THREAT_RGB[level], PAPER, 0.7) : THREAT_RGB[level];
    fillRing(ctx, feature.ring, project, fill, isHighlighted ? INK : PAPER, isHighlighted ? 5 : 2);
  });
}

function boundsOfRing(ring: Array<[number, number]>): GeoBounds {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  ring.forEach(([lon, lat]) => {
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  });
  const padLon = (maxLon - minLon) * 0.18 || 0.0005;
  const padLat = (maxLat - minLat) * 0.18 || 0.0005;
  return { minLon: minLon - padLon, maxLon: maxLon + padLon, minLat: minLat - padLat, maxLat: maxLat + padLat };
}

function drawBarangayMap(ctx: CanvasRenderingContext2D, feature: BarangayShape, level: ThreatLevel, count: number, box: { x: number; y: number; w: number; h: number }) {
  const bounds = boundsOfRing(feature.ring);
  const project = makeGeoProjector(bounds, box);
  fillRing(ctx, feature.ring, project, THREAT_RGB[level], INK, 3);
}

/* ── The exporter ───────────────────────────────────────────────────────── */

export class ImageExporter {
  private geoFeatures: BarangayShape[] | null = null;
  private geoBounds: GeoBounds | null = null;

  async loadGeography(): Promise<void> {
    if (this.geoFeatures) return;
    const { features, bounds } = await loadTanzaGeography();
    this.geoFeatures = features;
    this.geoBounds = bounds;
  }

  /** All barangay names available for the per-barangay map picker. */
  async listBarangayNames(): Promise<string[]> {
    await this.loadGeography();
    return (this.geoFeatures ?? []).map((f) => f.name).sort((a, b) => a.localeCompare(b));
  }

  private countsByBarangay(data: ReportData): Record<string, number> {
    const counts: Record<string, number> = {};
    data.analyticsData.crimesByBarangay.forEach((b) => {
      counts[b.barangay.toUpperCase()] = b.count;
    });
    return counts;
  }

  private scopeSubtitle(data: ReportData): string {
    const scope =
      data.barangayName === 'All Barangays' || data.barangayName === 'General Dashboard'
        ? 'Tanza, Cavite — all barangays'
        : `Barangay ${data.barangayName}, Tanza, Cavite`;
    return `${scope} · ${data.timeRange}`;
  }

  async exportTrendChart(data: ReportData): Promise<ExportedImage> {
    const W = 1600;
    const H = 900;
    const { canvas, ctx } = newCanvas(W, H);
    const bodyY = drawHeader(ctx, W, { kicker: 'Trend Analysis', title: 'Incidents by Month', subtitle: this.scopeSubtitle(data) });

    const monthly = data.analyticsData.crimesByMonth.filter((m) => m.month >= 1 && m.month <= 12);
    if (!monthly.length || monthly.every((m) => m.count === 0)) {
      text(ctx, 'No monthly activity was recorded for this period.', PAD, bodyY + 40, { size: 24, color: INK_SOFT });
    } else {
      const peakMonth = monthly.reduce((best, m, i) => (m.count > monthly[best].count ? i : best), 0);
      drawColumnChart(
        ctx,
        monthly.map((m) => ({ label: MONTHS_SHORT[m.month - 1] ?? `M${m.month}`, value: m.count })),
        { x: PAD, y: bodyY, w: W - PAD * 2, h: H - bodyY - 100 },
        { highlight: peakMonth }
      );
    }

    return { name: 'trend-chart', blob: await canvasToBlob(canvas) };
  }

  async exportTimeOfDayChart(data: ReportData): Promise<ExportedImage> {
    const W = 1600;
    const H = 900;
    const { canvas, ctx } = newCanvas(W, H);
    const bodyY = drawHeader(ctx, W, { kicker: 'Temporal Analysis', title: 'Incidents by Hour of Day', subtitle: this.scopeSubtitle(data) });

    const { hourlyDistribution, peakHour } = data.analyticsData.timePatterns;
    const hours = hourlyDistribution ?? [];
    if (!hours.reduce((a, b) => a + b, 0)) {
      text(ctx, 'No time-of-day data was recorded for this period.', PAD, bodyY + 40, { size: 24, color: INK_SOFT });
    } else {
      drawColumnChart(
        ctx,
        hours.map((count, hour) => ({ label: String(hour).padStart(2, '0'), value: count })),
        { x: PAD, y: bodyY, w: W - PAD * 2, h: H - bodyY - 100 },
        { labelEvery: 3, highlight: peakHour }
      );
      text(ctx, `Peak activity: ${hourBand(peakHour)} (${hours[peakHour] ?? 0} incidents)`, PAD, H - 30, { size: 22, color: INK_SOFT });
    }

    return { name: 'time-of-day-chart', blob: await canvasToBlob(canvas) };
  }

  async exportCrimeTypeChart(data: ReportData): Promise<ExportedImage> {
    const byType = sortDesc(data.analyticsData.crimesByType, 'count');
    const W = 1600;
    const H = Math.max(600, 220 + Math.min(byType.length, 8) * 58 + 60);
    const { canvas, ctx } = newCanvas(W, H);
    const bodyY = drawHeader(ctx, W, { kicker: 'Incident Classification', title: 'Leading Incident Types', subtitle: this.scopeSubtitle(data) });

    if (!byType.length) {
      text(ctx, 'No incident data was recorded for this period.', PAD, bodyY + 40, { size: 24, color: INK_SOFT });
    } else {
      drawHorizontalBars(
        ctx,
        byType.slice(0, 8).map((c) => ({ label: c.type.length > 30 ? `${c.type.slice(0, 29)}…` : c.type, value: c.count })),
        { x: PAD, y: bodyY, w: W - PAD * 2 }
      );
    }

    return { name: 'crime-type-chart', blob: await canvasToBlob(canvas) };
  }

  async exportBarangayComparisonChart(data: ReportData): Promise<ExportedImage> {
    const byBarangay = sortDesc(data.analyticsData.crimesByBarangay, 'count');
    const W = 1600;
    const H = Math.max(600, 220 + Math.min(byBarangay.length, 8) * 58 + 60);
    const { canvas, ctx } = newCanvas(W, H);
    const bodyY = drawHeader(ctx, W, { kicker: 'Comparative Analysis', title: 'Highest-Volume Barangays', subtitle: this.scopeSubtitle(data) });

    if (!byBarangay.length) {
      text(ctx, 'No barangay-level data was recorded for this period.', PAD, bodyY + 40, { size: 24, color: INK_SOFT });
    } else {
      drawHorizontalBars(
        ctx,
        byBarangay.slice(0, 8).map((b) => ({ label: b.barangay.length > 30 ? `${b.barangay.slice(0, 29)}…` : b.barangay, value: b.count })),
        { x: PAD, y: bodyY, w: W - PAD * 2 }
      );
    }

    return { name: 'barangay-comparison-chart', blob: await canvasToBlob(canvas) };
  }

  async exportMatrixHeatmap(data: ReportData): Promise<ExportedImage> {
    const matrix = (data.analyticsData.crimeMatrix ?? []).slice(0, 12);
    const W = 1800;
    const H = Math.max(600, 220 + matrix.length * 46 + 60);
    const { canvas, ctx } = newCanvas(W, H);
    const bodyY = drawHeader(ctx, W, { kicker: 'Incidence Matrix', title: 'Monthly Incidence by Offence Category', subtitle: this.scopeSubtitle(data) });

    if (!matrix.length) {
      text(ctx, 'No matrix data was recorded for this period.', PAD, bodyY + 40, { size: 24, color: INK_SOFT });
    } else {
      drawMatrixGrid(ctx, matrix, { x: PAD, y: bodyY, w: W - PAD * 2 });
    }

    return { name: 'monthly-matrix-heatmap', blob: await canvasToBlob(canvas) };
  }

  async exportTanzaMap(data: ReportData, opts: { highlight?: string } = {}): Promise<ExportedImage> {
    await this.loadGeography();
    const W = 1400;
    const H = 1300;
    const { canvas, ctx } = newCanvas(W, H);
    const bodyY = drawHeader(ctx, W, {
      kicker: 'Comparative Analysis',
      title: opts.highlight ? `Barangay Risk Map — ${opts.highlight} Highlighted` : 'Barangay Risk Map — Tanza, Cavite',
      subtitle: this.scopeSubtitle(data),
    });

    if (!this.geoFeatures?.length || !this.geoBounds) {
      text(ctx, 'Barangay boundary data could not be loaded.', PAD, bodyY + 40, { size: 24, color: INK_SOFT });
    } else {
      const counts = this.countsByBarangay(data);
      const legendW = 340;
      const mapW = W - PAD * 2 - legendW;
      const mapH = H - bodyY - PAD;
      drawChoropleth(ctx, this.geoFeatures, this.geoBounds, counts, { x: PAD, y: bodyY, w: mapW, h: mapH }, opts);
      drawThreatLegend(ctx, PAD + mapW + 40, bodyY + 30);
    }

    const suffix = opts.highlight ? `-${slugify(opts.highlight)}-highlighted` : '';
    return { name: `tanza-risk-map${suffix}`, blob: await canvasToBlob(canvas) };
  }

  async exportBarangayMap(data: ReportData, barangayName: string): Promise<ExportedImage> {
    await this.loadGeography();
    const W = 1200;
    const H = 1200;
    const { canvas, ctx } = newCanvas(W, H);
    const bodyY = drawHeader(ctx, W, { kicker: 'Geographic Highlights', title: `Barangay ${barangayName}`, subtitle: data.timeRange });

    const feature = this.geoFeatures?.find((f) => f.name.toUpperCase() === barangayName.toUpperCase());
    if (!feature) {
      text(ctx, 'This barangay was not found in the boundary file.', PAD, bodyY + 40, { size: 24, color: INK_SOFT });
      return { name: `barangay-map-${slugify(barangayName)}`, blob: await canvasToBlob(canvas) };
    }

    const counts = this.countsByBarangay(data);
    const allCounts = (this.geoFeatures ?? []).map((f) => counts[f.name.toUpperCase()] ?? 0);
    const thresholds = calculateDynamicThresholds(allCounts);
    const count = counts[feature.name.toUpperCase()] ?? 0;
    const level = threatLevelOf(count, thresholds);

    const mapSize = Math.min(W - PAD * 2, H - bodyY - 140);
    const mapX = PAD + (W - PAD * 2 - mapSize) / 2;
    drawBarangayMap(ctx, feature, level, count, { x: mapX, y: bodyY, w: mapSize, h: mapSize });

    const capY = bodyY + mapSize + 50;
    rule(ctx, PAD, capY, W - PAD * 2, HAIR, 1.5);
    text(ctx, `${count.toLocaleString()} incident${count === 1 ? '' : 's'} recorded`, PAD, capY + 40, { size: 26, weight: 'bold', color: INK });
    ctx.fillStyle = rgbToCss(THREAT_RGB[level]);
    ctx.fillRect(W - PAD - 160, capY + 16, 20, 20);
    text(ctx, level.charAt(0).toUpperCase() + level.slice(1) + ' risk band', W - PAD - 130, capY + 33, { size: 24, color: INK_MID });

    return { name: `barangay-map-${slugify(barangayName)}`, blob: await canvasToBlob(canvas) };
  }

  async exportHotspotsMap(data: ReportData): Promise<ExportedImage> {
    await this.loadGeography();
    const W = 1600;

    const counts = this.countsByBarangay(data);
    const features = this.geoFeatures ?? [];
    const thresholds = calculateDynamicThresholds(features.map((f) => counts[f.name.toUpperCase()] ?? 0));
    const hotspots = features
      .map((feature) => ({ feature, count: counts[feature.name.toUpperCase()] ?? 0 }))
      .filter(({ count }) => {
        const level = threatLevelOf(count, thresholds);
        return level === 'high' || level === 'critical';
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const cols = Math.min(Math.max(hotspots.length, 1), 3);
    const rows = Math.max(1, Math.ceil(hotspots.length / cols));
    const cardSize = 420;
    const gap = 40;
    const H = 220 + rows * (cardSize + 90);
    const { canvas, ctx } = newCanvas(W, H);
    const bodyY = drawHeader(ctx, W, {
      kicker: 'Geographic Highlights',
      title: 'Barangays Flagged High or Critical Risk',
      subtitle: this.scopeSubtitle(data),
    });

    if (!hotspots.length) {
      text(ctx, "No barangay falls in this report's high or critical risk band.", PAD, bodyY + 40, { size: 24, color: INK_SOFT });
    } else {
      const gridW = cols * cardSize + (cols - 1) * gap;
      const startX = PAD + (W - PAD * 2 - gridW) / 2;

      hotspots.forEach((hotspot, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (cardSize + gap);
        const y = bodyY + row * (cardSize + 90);
        const level = threatLevelOf(hotspot.count, thresholds);
        drawBarangayMap(ctx, hotspot.feature, level, hotspot.count, { x, y, w: cardSize, h: cardSize - 60 });
        rule(ctx, x, y + cardSize - 50, cardSize, HAIR, 1.5);
        text(ctx, hotspot.feature.name, x, y + cardSize - 18, { size: 24, weight: 'bold', color: INK });
        text(ctx, `${hotspot.count.toLocaleString()} incidents · ${level.charAt(0).toUpperCase() + level.slice(1)}`, x, y + cardSize + 12, {
          size: 20,
          color: INK_SOFT,
        });
      });
    }

    return { name: 'hotspots-map', blob: await canvasToBlob(canvas) };
  }

  /* ── Downloads ────────────────────────────────────────────────────────── */

  downloadSingle(image: ExportedImage) {
    const url = URL.createObjectURL(image.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${image.name}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async downloadAsZip(images: ExportedImage[], zipName = 'secure-tanza-images.zip') {
    if (!images.length) return;
    if (images.length === 1) {
      this.downloadSingle(images[0]);
      return;
    }
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const usedNames = new Set<string>();
    images.forEach((image) => {
      let filename = `${image.name}.png`;
      let n = 2;
      while (usedNames.has(filename)) {
        filename = `${image.name}-${n}.png`;
        n += 1;
      }
      usedNames.add(filename);
      zip.file(filename, image.blob);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = zipName;
    a.click();
    URL.revokeObjectURL(url);
  }
}
