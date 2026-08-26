import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportConfig {
  includeExecutiveSummary: boolean;
  includeOverview: boolean;
  includeTrends: boolean;
  includeTimePatterns: boolean;
  includeCrimeTypes: boolean;
  includeBarangayComparison: boolean;
  includeCrimeMatrix: boolean;
  includeRecommendations: boolean;
}

interface AnalyticsData {
  crimesByType: Array<{ type: string; count: number }>;
  crimesByMonth: Array<{ month: number; count: number }>;
  crimesByBarangay: Array<{ barangay: string; count: number }>;
  crimeMatrix?: Array<{ crimeType: string; monthlyData: number[] }>;
  timePatterns: {
    hourlyDistribution: number[];
    peakHour: number;
  };
  trends: {
    monthlyChange: number;
    resolutionRate: number;
    safetyIndex: number;
    trendLevel: string;
    trendDirection: string;
    currentThreatLevel: string;
    previousThreatLevel: string;
    currentQuarterCrimes: number;
    previousQuarterCrimes: number;
    currentQuarterLabel: string;
    previousQuarterLabel: string;
  };
}

export interface ReportData {
  barangayName: string;
  timeRange: string;
  analyticsData: AnalyticsData;
  totalCrimes: number;
}

type RGB = readonly [number, number, number];

/* ── Ink ────────────────────────────────────────────────────────────────────
   One ink, one accent. Accent tints carry data; accent-deep carries accent
   text, because #0EA5E9 on paper falls below 3:1 at text sizes.            */
const INK: RGB = [15, 23, 42];
const INK_MID: RGB = [51, 65, 85];
const INK_SOFT: RGB = [100, 116, 139];
const RULE: RGB = [148, 163, 184];
const HAIR: RGB = [214, 222, 232];
const ACCENT: RGB = [14, 165, 233];
const ACCENT_DEEP: RGB = [3, 105, 161];
const PAPER: RGB = [255, 255, 255];

/** Sequential ramp: pale sky → deep sky. Encodes magnitude, prints legibly. */
const RAMP_LO: RGB = [222, 242, 254];
const RAMP_HI: RGB = [7, 89, 133];

/* ── Geometry (mm) ────────────────────────────────────────────────────────── */
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 20;
const CONTENT_TOP = 30;
const CONTENT_BOTTOM = PAGE_H - 24;
const MEASURE = PAGE_W - MARGIN_X * 2; // 170 — tables, charts, rules
const TEXT_COL = 126; // ≈ 74 characters at 9.5pt Helvetica
const RAIL_X = MARGIN_X + TEXT_COL + 10;
const RAIL_W = MEASURE - TEXT_COL - 10;

/* ── Type scale: size in points, leading in millimetres ───────────────────── */
const T = {
  micro: { size: 7, lead: 3.2 },
  small: { size: 8, lead: 3.7 },
  caption: { size: 8.5, lead: 4.0 },
  body: { size: 9.5, lead: 4.7 },
  sub: { size: 10.5, lead: 5.0 },
  lead: { size: 11.5, lead: 5.6 },
  section: { size: 13, lead: 6.0 },
  figure: { size: 19, lead: 8.0 },
  title: { size: 27, lead: 11.5 },
} as const;

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

function mix(a: RGB, b: RGB, t: number): RGB {
  const k = Math.max(0, Math.min(1, t));
  return [
    Math.round(a[0] + (b[0] - a[0]) * k),
    Math.round(a[1] + (b[1] - a[1]) * k),
    Math.round(a[2] + (b[2] - a[2]) * k),
  ];
}

/** Perceptual-ish ease so mid-range values stay distinguishable on paper. */
function rampColor(intensity: number): RGB {
  return mix(RAMP_LO, RAMP_HI, Math.pow(Math.max(0, Math.min(1, intensity)), 0.75));
}

function sortDesc<T extends Record<string, unknown>>(rows: T[], key: keyof T): T[] {
  return [...rows].sort((a, b) => Number(b[key] ?? 0) - Number(a[key] ?? 0));
}

export class PDFReportGenerator {
  private doc: jsPDF;
  private y: number;
  private sectionNo = 0;
  private contents: Array<{ no: number; title: string; page: number }> = [];
  private reference = '';
  private runningHead = '';
  private runningPeriod = '';

  constructor() {
    this.doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    this.y = CONTENT_TOP;
  }

  /* ── Primitives ─────────────────────────────────────────────────────────── */

  private get page(): number {
    return this.doc.getNumberOfPages();
  }

  private ink(color: RGB) {
    this.doc.setTextColor(color[0], color[1], color[2]);
  }

  private fill(color: RGB) {
    this.doc.setFillColor(color[0], color[1], color[2]);
  }

  private stroke(color: RGB, width: number) {
    this.doc.setDrawColor(color[0], color[1], color[2]);
    this.doc.setLineWidth(width);
  }

  private type(scale: { size: number; lead: number }, weight: 'normal' | 'bold' = 'normal') {
    this.doc.setFont('helvetica', weight);
    this.doc.setFontSize(scale.size);
  }

  private rule(y: number, color: RGB = HAIR, width = 0.15, x = MARGIN_X, w = MEASURE) {
    this.stroke(color, width);
    this.doc.line(x, y, x + w, y);
  }

  /** Reserve vertical space, breaking the page when it will not fit. */
  private ensure(space: number) {
    if (this.y + space > CONTENT_BOTTOM) {
      this.doc.addPage();
      this.y = CONTENT_TOP;
    }
  }

  private gap(space: number) {
    this.y += space;
  }

  /* ── Text blocks ────────────────────────────────────────────────────────── */

  private capsLabel(
    text: string,
    x: number,
    y: number,
    color: RGB = INK_SOFT,
    align: 'left' | 'center' | 'right' = 'left'
  ) {
    const upper = text.toUpperCase();
    const tracking = 0.28;
    this.type(T.micro, 'bold');
    this.ink(color);
    this.doc.setCharSpace(tracking);
    let drawX = x;
    if (align !== 'left') {
      // getTextWidth ignores charSpace, so add the tracking back in by hand.
      const width = this.doc.getTextWidth(upper) + tracking * Math.max(0, upper.length - 1);
      drawX = align === 'right' ? x - width : x - width / 2;
    }
    this.doc.text(upper, drawX, y);
    this.doc.setCharSpace(0);
  }

  private paragraph(
    text: string,
    opts: { scale?: { size: number; lead: number }; weight?: 'normal' | 'bold'; color?: RGB; width?: number; x?: number } = {}
  ) {
    const scale = opts.scale ?? T.body;
    const width = opts.width ?? TEXT_COL;
    const x = opts.x ?? MARGIN_X;
    this.type(scale, opts.weight ?? 'normal');
    this.ink(opts.color ?? INK_MID);
    const lines = this.doc.splitTextToSize(text, width) as string[];
    lines.forEach((line) => {
      this.ensure(scale.lead);
      this.type(scale, opts.weight ?? 'normal');
      this.ink(opts.color ?? INK_MID);
      this.doc.text(line, x, this.y);
      this.y += scale.lead;
    });
  }

  private subhead(text: string) {
    this.ensure(T.sub.lead + 8);
    this.gap(4);
    this.type(T.sub, 'bold');
    this.ink(INK);
    this.doc.text(text, MARGIN_X, this.y);
    this.y += T.sub.lead + 1.5;
  }

  /** Hanging-indent list item with a drawn accent dash for a marker. */
  private listItem(text: string, indent = 6) {
    const lines = this.doc.splitTextToSize(text, TEXT_COL - indent) as string[];
    lines.forEach((line, i) => {
      this.ensure(T.body.lead);
      if (i === 0) {
        this.fill(ACCENT);
        this.doc.rect(MARGIN_X, this.y - 1.4, 2.4, 0.5, 'F');
      }
      this.type(T.body);
      this.ink(INK_MID);
      this.doc.text(line, MARGIN_X + indent, this.y);
      this.y += T.body.lead;
    });
    this.y += 0.8;
  }

  private section(title: string, keepWith = 52) {
    const lead = this.y > CONTENT_TOP + 1 ? 12 : 0;
    // Keep the heading with enough of its first block that it never sits alone.
    if (this.y + lead + 22 + keepWith > CONTENT_BOTTOM) {
      this.doc.addPage();
      this.y = CONTENT_TOP;
    } else {
      this.y += lead;
    }
    this.sectionNo += 1;
    this.contents.push({ no: this.sectionNo, title, page: this.page });

    const label = String(this.sectionNo).padStart(2, '0');
    this.type(T.section, 'bold');
    this.ink(ACCENT_DEEP);
    this.doc.text(label, MARGIN_X, this.y);
    const labelWidth = this.doc.getTextWidth(label);
    this.ink(INK);
    this.doc.text(title, MARGIN_X + labelWidth + 4, this.y);

    this.y += 3.4;
    this.rule(this.y, RULE, 0.4);
    this.y += 7;
  }

  private note(text: string) {
    this.ensure(T.caption.lead * 2);
    this.type(T.caption, 'normal');
    this.ink(INK_SOFT);
    const lines = this.doc.splitTextToSize(text, TEXT_COL) as string[];
    lines.forEach((line) => {
      this.ensure(T.caption.lead);
      this.doc.text(line, MARGIN_X, this.y);
      this.y += T.caption.lead;
    });
    this.y += 2;
  }

  private emptyNotice(what: string) {
    this.ensure(10);
    this.gap(1);
    this.type(T.caption);
    this.ink(INK_SOFT);
    this.doc.text(`No ${what} was recorded for the selected period.`, MARGIN_X, this.y);
    this.y += T.caption.lead + 3;
  }

  /* ── Figure band: three key numbers, hairline-delimited, no boxes ───────── */

  private figureBand(figures: Array<{ label: string; value: string; caption?: string }>) {
    const count = figures.length;
    if (!count) return;
    const colW = MEASURE / count;
    const bandH = 26;
    this.ensure(bandH + 6);

    const top = this.y;

    figures.forEach((figure, i) => {
      const x = MARGIN_X + i * colW;
      this.capsLabel(figure.label, x, top + 4);

      this.type(T.figure, 'bold');
      this.ink(INK);
      this.doc.text(figure.value, x, top + 14);

      if (figure.caption) {
        this.type(T.micro);
        this.ink(INK_SOFT);
        this.doc.text(figure.caption, x, top + 19.5);
      }

      if (i > 0) {
        this.stroke(HAIR, 0.15);
        this.doc.line(x - 5, top - 1, x - 5, top + bandH - 5);
      }
    });

    this.rule(top + bandH - 3, HAIR, 0.15);
    this.y = top + bandH + 3;
  }

  /* ── Charts, drawn as vectors so they stay sharp at any zoom ─────────────── */

  private horizontalBars(
    items: Array<{ label: string; value: number }>,
    opts: { caption?: string; labelW?: number } = {}
  ) {
    if (!items.length) return;
    const labelW = opts.labelW ?? 44;
    const valueW = 14;
    const trackW = MEASURE - labelW - valueW - 6;
    const rowH = 7.2;
    const barH = 4.2;
    const max = Math.max(...items.map((d) => d.value), 1);

    this.ensure(items.length * rowH + 10);
    if (opts.caption) {
      this.capsLabel(opts.caption, MARGIN_X, this.y);
      this.y += 5.5;
    }

    const top = this.y;
    items.forEach((item, i) => {
      const y = top + i * rowH;
      const w = Math.max((item.value / max) * trackW, item.value > 0 ? 0.6 : 0);

      this.type(T.small);
      this.ink(INK_MID);
      this.doc.text(item.label, MARGIN_X, y + barH - 0.7);

      this.fill(mix(RAMP_LO, PAPER, 0.45));
      this.doc.rect(MARGIN_X + labelW, y, trackW, barH, 'F');

      this.fill(rampColor(item.value / max));
      this.doc.rect(MARGIN_X + labelW, y, w, barH, 'F');

      this.type(T.small, 'bold');
      this.ink(INK);
      this.doc.text(String(item.value), MARGIN_X + MEASURE, y + barH - 0.7, { align: 'right' });
    });

    this.y = top + items.length * rowH + 2;
    this.rule(this.y, HAIR, 0.15);
    this.y += 6;
  }

  private columnChart(
    items: Array<{ label: string; value: number }>,
    opts: { caption?: string; height?: number; labelEvery?: number; highlight?: number } = {}
  ) {
    if (!items.length) return;
    const h = opts.height ?? 34;
    const labelEvery = opts.labelEvery ?? 1;
    const max = Math.max(...items.map((d) => d.value), 1);

    this.ensure(h + 26);
    if (opts.caption) {
      this.capsLabel(opts.caption, MARGIN_X, this.y);
      this.y += 6.5;
    }

    const top = this.y;
    const baseline = top + h;
    const slot = MEASURE / items.length;
    const barW = Math.min(slot * 0.62, 9);

    items.forEach((item, i) => {
      const barH = (item.value / max) * h;
      const x = MARGIN_X + i * slot + (slot - barW) / 2;
      const isPeak = opts.highlight === i;
      this.fill(isPeak ? RAMP_HI : rampColor(0.32 + (item.value / max) * 0.45));
      if (barH > 0) this.doc.rect(x, baseline - barH, barW, barH, 'F');

      // Only the peak carries a value, so the chart needs no axis furniture.
      if (isPeak) {
        this.type(T.micro, 'bold');
        this.ink(INK);
        this.doc.text(String(item.value), x + barW / 2, baseline - barH - 1.8, { align: 'center' });
      }

      if (i % labelEvery === 0) {
        this.type(T.micro, isPeak ? 'bold' : 'normal');
        this.ink(isPeak ? INK : INK_SOFT);
        this.doc.text(item.label, x + barW / 2, baseline + 4, { align: 'center' });
      }
    });

    this.rule(baseline, RULE, 0.3);
    this.y = baseline + 9;
  }

  private matrixGrid(rows: Array<{ crimeType: string; monthlyData: number[] }>) {
    if (!rows.length) return;
    const labelW = 52;
    const totalW = 14;
    const cellW = (MEASURE - labelW - totalW) / 12;
    const cellH = 6.4;
    const max = Math.max(1, ...rows.flatMap((r) => r.monthlyData));

    this.ensure(rows.length * cellH + 24);

    const headY = this.y;
    MONTHS_SHORT.forEach((month, i) => {
      this.capsLabel(month, MARGIN_X + labelW + i * cellW + cellW / 2, headY, INK_SOFT, 'center');
    });
    this.capsLabel('Total', MARGIN_X + MEASURE, headY, INK, 'right');

    this.y = headY + 2.6;
    this.rule(this.y, RULE, 0.3);
    this.y += 1.4;

    const top = this.y;
    rows.forEach((row, r) => {
      const y = top + r * cellH;
      const total = row.monthlyData.reduce((a, b) => a + b, 0);

      this.type(T.small);
      this.ink(INK_MID);
      const label = row.crimeType.length > 30 ? `${row.crimeType.slice(0, 29)}…` : row.crimeType;
      this.doc.text(label, MARGIN_X, y + cellH - 2.2);

      row.monthlyData.forEach((value, m) => {
        const x = MARGIN_X + labelW + m * cellW;
        if (value > 0) {
          this.fill(rampColor(value / max));
          this.doc.rect(x + 0.35, y + 0.5, cellW - 0.7, cellH - 1.2, 'F');
          this.type(T.micro, 'bold');
          this.ink(value / max > 0.55 ? PAPER : INK);
          this.doc.text(String(value), x + cellW / 2, y + cellH - 2.4, { align: 'center' });
        } else {
          this.stroke(HAIR, 0.12);
          this.doc.line(x + cellW / 2 - 0.7, y + cellH / 2 - 0.3, x + cellW / 2 + 0.7, y + cellH / 2 - 0.3);
        }
      });

      this.type(T.small, 'bold');
      this.ink(INK);
      this.doc.text(String(total), MARGIN_X + MEASURE, y + cellH - 2.2, { align: 'right' });
    });

    this.y = top + rows.length * cellH + 1.5;
    this.rule(this.y, HAIR, 0.15);
    this.y += 5;

    // Ramp legend
    const legendW = 34;
    const steps = 6;
    this.capsLabel('Fewer', MARGIN_X, this.y + 1.8);
    const legendX = MARGIN_X + 14;
    for (let i = 0; i < steps; i += 1) {
      this.fill(rampColor((i + 1) / steps));
      this.doc.rect(legendX + (i * legendW) / steps, this.y - 1.2, legendW / steps - 0.4, 3, 'F');
    }
    this.capsLabel('More', legendX + legendW + 2, this.y + 1.8);
    this.y += 7;
  }

  /* ── Tables ─────────────────────────────────────────────────────────────── */

  private table(opts: {
    head: string[];
    body: Array<Array<string | number>>;
    columnStyles?: Record<number, Record<string, unknown>>;
    shareColumn?: { index: number; values: number[] };
  }) {
    const shareColumn = opts.shareColumn;
    autoTable(this.doc, {
      startY: this.y,
      head: [opts.head.map((h) => h.toUpperCase())],
      body: opts.body,
      theme: 'plain',
      margin: { top: CONTENT_TOP, left: MARGIN_X, right: MARGIN_X, bottom: PAGE_H - CONTENT_BOTTOM },
      styles: {
        font: 'helvetica',
        fontSize: T.caption.size,
        textColor: [INK[0], INK[1], INK[2]],
        cellPadding: { top: 2, right: 2.5, bottom: 2, left: 0 },
        valign: 'middle',
        lineWidth: 0,
        overflow: 'linebreak',
      },
      headStyles: {
        fontStyle: 'bold',
        fontSize: T.micro.size,
        textColor: [INK_SOFT[0], INK_SOFT[1], INK_SOFT[2]],
        cellPadding: { top: 0, right: 2.5, bottom: 2, left: 0 },
        lineWidth: { bottom: 0.4 },
        lineColor: [RULE[0], RULE[1], RULE[2]],
      },
      bodyStyles: {
        lineWidth: { bottom: 0.12 },
        lineColor: [HAIR[0], HAIR[1], HAIR[2]],
      },
      columnStyles: opts.columnStyles,
      willDrawCell: (data) => {
        if (data.section === 'body' && shareColumn && data.column.index === shareColumn.index) {
          // Cell text is drawn as a bar instead of a string.
          data.cell.text = [];
        }
      },
      didDrawCell: (data) => {
        if (data.section !== 'body' || !shareColumn || data.column.index !== shareColumn.index) return;
        const value = shareColumn.values[data.row.index] ?? 0;
        const trackW = data.cell.width - 2.5;
        const barH = 2.6;
        const y = data.cell.y + (data.cell.height - barH) / 2;
        this.fill(mix(RAMP_LO, PAPER, 0.45));
        this.doc.rect(data.cell.x, y, trackW, barH, 'F');
        if (value > 0) {
          this.fill(rampColor(value));
          this.doc.rect(data.cell.x, y, Math.max(trackW * value, 0.6), barH, 'F');
        }
      },
    });

    const finalY = (this.doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY;
    this.y = (finalY ?? this.y) + 6;
  }

  /* ── Cover ──────────────────────────────────────────────────────────────── */

  private coverPage(data: ReportData, sectionCount: number) {
    const scope =
      data.barangayName === 'All Barangays' || data.barangayName === 'General Dashboard'
        ? 'Tanza, Cavite — all barangays'
        : `Barangay ${data.barangayName}, Tanza, Cavite`;

    this.fill(INK);
    this.doc.rect(0, 0, PAGE_W, 6, 'F');

    this.capsLabel('Crime analytics case study', MARGIN_X, 52, ACCENT_DEEP);

    this.type(T.title, 'bold');
    this.ink(INK);
    const titleLines = this.doc.splitTextToSize('Incident Pattern and Trend Report', 150) as string[];
    let ty = 68;
    titleLines.forEach((line) => {
      this.doc.text(line, MARGIN_X, ty);
      ty += T.title.lead;
    });

    ty += 4;
    this.type(T.lead);
    this.ink(INK_MID);
    this.doc.text(scope, MARGIN_X, ty);
    ty += T.lead.lead;
    this.doc.text(`Reporting period: ${data.timeRange}`, MARGIN_X, ty);

    this.stroke(ACCENT, 1.4);
    this.doc.line(MARGIN_X, ty + 12, MARGIN_X + 42, ty + 12);

    // Metadata ledger, foot of the cover
    const metaTop = PAGE_H - 74;
    this.rule(metaTop, RULE, 0.4);

    const meta: Array<[string, string]> = [
      ['Reference', this.reference],
      ['Total incidents', data.totalCrimes.toLocaleString()],
      ['Sections included', String(sectionCount)],
      ['Generated', new Date().toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'short' })],
    ];

    let my = metaTop + 8;
    meta.forEach(([label, value]) => {
      this.capsLabel(label, MARGIN_X, my);
      this.type(T.caption, 'bold');
      this.ink(INK);
      this.doc.text(value, MARGIN_X + 46, my);
      my += 5.4;
      this.rule(my - 2.2, HAIR, 0.12);
    });

    this.type(T.micro);
    this.ink(INK_SOFT);
    this.doc.text(
      'Produced by the Secure Tanza crime analytics system. For official use in planning and deployment review.',
      MARGIN_X,
      PAGE_H - 18
    );
  }

  /* ── Contents ───────────────────────────────────────────────────────────── */

  private contentsPage() {
    this.doc.insertPage(2);
    this.doc.setPage(2);

    let y = CONTENT_TOP + 6;
    this.type(T.section, 'bold');
    this.ink(INK);
    this.doc.text('Contents', MARGIN_X, y);
    y += 3.6;
    this.rule(y, RULE, 0.4);
    y += 9;

    this.contents.forEach((entry) => {
      const label = String(entry.no).padStart(2, '0');
      this.type(T.caption, 'bold');
      this.ink(ACCENT_DEEP);
      this.doc.text(label, MARGIN_X, y);

      this.type(T.body);
      this.ink(INK);
      this.doc.text(entry.title, MARGIN_X + 10, y);
      const titleW = this.doc.getTextWidth(entry.title);

      const pageLabel = String(entry.page + 1);
      this.type(T.caption, 'bold');
      this.ink(INK_MID);
      this.doc.text(pageLabel, MARGIN_X + MEASURE, y, { align: 'right' });
      const pageW = this.doc.getTextWidth(pageLabel);

      const leaderStart = MARGIN_X + 10 + titleW + 3;
      const leaderEnd = MARGIN_X + MEASURE - pageW - 3;
      if (leaderEnd > leaderStart) {
        this.stroke(HAIR, 0.15);
        this.doc.setLineDashPattern([0.4, 1.4], 0);
        this.doc.line(leaderStart, y - 1, leaderEnd, y - 1);
        this.doc.setLineDashPattern([], 0);
      }

      y += 8.4;
    });
  }

  /* ── Sections ───────────────────────────────────────────────────────────── */

  private executiveSummary(data: ReportData) {
    this.section('Executive Summary');

    const { trends } = data.analyticsData;
    const byType = sortDesc(data.analyticsData.crimesByType, 'count');
    const scope =
      data.barangayName === 'All Barangays' || data.barangayName === 'General Dashboard'
        ? 'all barangays of Tanza, Cavite'
        : `Barangay ${data.barangayName}`;

    const railTop = this.y;

    this.paragraph(
      `${data.totalCrimes.toLocaleString()} incidents were recorded across ${scope} during ${data.timeRange}. ` +
        `The current threat assessment is ${trends.currentThreatLevel.toLowerCase()}, ` +
        `${
          trends.trendDirection === 'improved'
            ? 'down from'
            : trends.trendDirection === 'worsened'
            ? 'up from'
            : 'unchanged against'
        } ${trends.previousThreatLevel.toLowerCase()} in the preceding quarter.`,
      { scale: T.lead, color: INK }
    );

    this.gap(3);

    // Key figures in the side rail, aligned to the lead paragraph.
    const railFigures: Array<[string, string]> = [
      ['Incidents', data.totalCrimes.toLocaleString()],
      ['Cleared', `${trends.resolutionRate}%`],
      ['Safety index', `${trends.safetyIndex}%`],
    ];
    let ry = railTop - 1;
    this.rule(ry - 4, RULE, 0.4, RAIL_X, RAIL_W);
    railFigures.forEach(([label, value]) => {
      this.capsLabel(label, RAIL_X, ry);
      this.type(T.sub, 'bold');
      this.ink(INK);
      this.doc.text(value, RAIL_X, ry + 5.4);
      ry += 10.5;
      this.rule(ry - 4.6, HAIR, 0.12, RAIL_X, RAIL_W);
    });

    this.y = Math.max(this.y, railTop + 28);
    this.subhead('Findings');

    const topType = byType[0];
    const currentLabel = trends.currentQuarterLabel || 'the current quarter';
    const previousLabel = trends.previousQuarterLabel || 'the previous quarter';
    const findings: string[] = [
      `Incident volume moved ${trends.monthlyChange > 0 ? 'up' : trends.monthlyChange < 0 ? 'down' : 'sideways'} by ${Math.abs(
        trends.monthlyChange
      )}% between ${previousLabel} (${trends.previousQuarterCrimes}) and ${currentLabel} (${
        trends.currentQuarterCrimes
      }).`,
      topType
        ? `${topType.type} is the leading incident type at ${topType.count} ${
            topType.count === 1 ? 'case' : 'cases'
          }${data.totalCrimes ? ` (${((topType.count / data.totalCrimes) * 100).toFixed(1)}% of the total)` : ''}.`
        : 'No incident types were recorded in this period, so no leading category can be identified.',
      `Peak activity falls in the ${hourBand(data.analyticsData.timePatterns.peakHour)} band, with ${
        data.analyticsData.timePatterns.hourlyDistribution[data.analyticsData.timePatterns.peakHour] ?? 0
      } incidents.`,
      `${trends.resolutionRate}% of cases are cleared; ${trends.safetyIndex}% are cleared or solved.`,
    ];

    findings.forEach((finding) => this.listItem(finding));
  }

  private situationalOverview(data: ReportData) {
    this.section('Situational Overview');

    const byType = sortDesc(data.analyticsData.crimesByType, 'count');
    const { trends } = data.analyticsData;

    this.figureBand([
      { label: 'Total incidents', value: data.totalCrimes.toLocaleString(), caption: data.timeRange },
      { label: 'Cleared', value: `${trends.resolutionRate}%`, caption: 'Cases marked cleared' },
      { label: 'Safety index', value: `${trends.safetyIndex}%`, caption: 'Cleared or solved' },
    ]);

    if (!byType.length) {
      this.emptyNotice('incident data');
      return;
    }

    this.horizontalBars(
      byType.slice(0, 8).map((crime) => ({
        label: crime.type.length > 24 ? `${crime.type.slice(0, 23)}…` : crime.type,
        value: crime.count,
      })),
      { caption: 'Leading incident types' }
    );

    const top = byType.slice(0, 10);
    this.table({
      head: ['Incident type', 'Cases', 'Share', ''],
      body: top.map((crime) => [
        crime.type,
        crime.count.toLocaleString(),
        this.share(crime.count, data.totalCrimes),
        '',
      ]),
      columnStyles: {
        1: { halign: 'right', cellWidth: 20 },
        2: { halign: 'right', cellWidth: 20 },
        3: { cellWidth: 40, cellPadding: { top: 2, right: 0, bottom: 2, left: 4 } },
      },
      shareColumn: {
        index: 3,
        values: top.map((crime) => (data.totalCrimes ? crime.count / data.totalCrimes : 0)),
      },
    });
  }

  private trendAnalysis(data: ReportData) {
    this.section('Trend Analysis');

    const { trends, crimesByMonth } = data.analyticsData;
    const direction =
      trends.trendDirection === 'improved'
        ? 'Improving — incidents decreased'
        : trends.trendDirection === 'worsened'
        ? 'Deteriorating — incidents increased'
        : 'Stable — no material change';

    this.paragraph(
      `Quarter-on-quarter comparison of recorded incidents and the resulting threat classification. ` +
        `Change is capped at ±90% so that low-count quarters do not distort the reading.`
    );
    this.gap(4);

    this.table({
      head: ['Period', 'Incidents', 'Threat level'],
      body: [
        [trends.currentQuarterLabel || 'Current quarter', trends.currentQuarterCrimes.toLocaleString(), this.titleCase(trends.currentThreatLevel)],
        [trends.previousQuarterLabel || 'Previous quarter', trends.previousQuarterCrimes.toLocaleString(), this.titleCase(trends.previousThreatLevel)],
        [
          'Change',
          `${trends.monthlyChange > 0 ? '+' : ''}${trends.monthlyChange}%`,
          direction,
        ],
      ],
      columnStyles: {
        1: { halign: 'right', cellWidth: 30 },
        2: { cellWidth: 70, cellPadding: { top: 2, right: 0, bottom: 2, left: 6 } },
      },
    });

    const monthly = crimesByMonth.filter((m) => m.month >= 1 && m.month <= 12);
    if (!monthly.length || monthly.every((m) => m.count === 0)) {
      this.emptyNotice('monthly activity');
      return;
    }

    const peakMonth = monthly.reduce((best, m, i) => (m.count > monthly[best].count ? i : best), 0);
    this.columnChart(
      monthly.map((m) => ({ label: MONTHS_SHORT[m.month - 1] ?? `M${m.month}`, value: m.count })),
      { caption: 'Incidents by month', height: 38, highlight: peakMonth }
    );

    this.note(
      `Highest monthly volume: ${MONTHS_SHORT[monthly[peakMonth].month - 1] ?? '—'} with ${monthly[peakMonth].count} incidents.`
    );
  }

  private temporalAnalysis(data: ReportData) {
    this.section('Temporal Analysis');

    const { timePatterns } = data.analyticsData;
    const hours = timePatterns.hourlyDistribution ?? [];
    const total = hours.reduce((a, b) => a + b, 0);

    if (!total) {
      this.paragraph('Distribution of incidents across the 24-hour cycle, derived from the recorded time of commission.');
      this.emptyNotice('time-of-day data');
      return;
    }

    this.paragraph(
      `Distribution of incidents across the 24-hour cycle, derived from the recorded time of commission. ` +
        `Peak activity falls in the ${hourBand(timePatterns.peakHour)} band with ${hours[timePatterns.peakHour]} incidents.`
    );
    this.gap(5);

    this.columnChart(
      hours.map((count, hour) => ({ label: String(hour).padStart(2, '0'), value: count })),
      { caption: 'Incidents by hour of day', height: 34, labelEvery: 3, highlight: timePatterns.peakHour }
    );

    const bands: Array<[string, string, number]> = [
      ['Late night', '12 AM – 6 AM', hours.slice(0, 6).reduce((a, b) => a + b, 0)],
      ['Morning', '6 AM – 12 PM', hours.slice(6, 12).reduce((a, b) => a + b, 0)],
      ['Afternoon', '12 PM – 6 PM', hours.slice(12, 18).reduce((a, b) => a + b, 0)],
      ['Evening', '6 PM – 12 AM', hours.slice(18, 24).reduce((a, b) => a + b, 0)],
    ];

    this.table({
      head: ['Day part', 'Window', 'Incidents', 'Share', ''],
      body: bands.map(([name, window, count]) => [name, window, count.toLocaleString(), this.share(count, total), '']),
      columnStyles: {
        1: { cellWidth: 34, textColor: [INK_SOFT[0], INK_SOFT[1], INK_SOFT[2]] },
        2: { halign: 'right', cellWidth: 24 },
        3: { halign: 'right', cellWidth: 20 },
        4: { cellWidth: 40, cellPadding: { top: 2, right: 0, bottom: 2, left: 4 } },
      },
      shareColumn: { index: 4, values: bands.map(([, , count]) => (total ? count / total : 0)) },
    });
  }

  private crimeClassification(data: ReportData) {
    this.section('Incident Classification');

    const byType = sortDesc(data.analyticsData.crimesByType, 'count');
    this.paragraph(
      'Complete breakdown of recorded incidents by offence category, ordered by volume.'
    );
    this.gap(4);

    if (!byType.length) {
      this.emptyNotice('incident data');
      return;
    }

    this.table({
      head: ['#', 'Incident type', 'Cases', 'Share', ''],
      body: byType.map((crime, i) => [
        String(i + 1).padStart(2, '0'),
        crime.type,
        crime.count.toLocaleString(),
        this.share(crime.count, data.totalCrimes),
        '',
      ]),
      columnStyles: {
        0: { cellWidth: 11, textColor: [INK_SOFT[0], INK_SOFT[1], INK_SOFT[2]] },
        2: { halign: 'right', cellWidth: 20 },
        3: { halign: 'right', cellWidth: 20 },
        4: { cellWidth: 36, cellPadding: { top: 2, right: 0, bottom: 2, left: 4 } },
      },
      shareColumn: {
        index: 4,
        values: byType.map((crime) => (data.totalCrimes ? crime.count / data.totalCrimes : 0)),
      },
    });
  }

  private comparativeAnalysis(data: ReportData) {
    this.section('Comparative Analysis');

    const byBarangay = sortDesc(data.analyticsData.crimesByBarangay, 'count');
    const scoped = data.barangayName !== 'All Barangays' && data.barangayName !== 'General Dashboard';
    const universe = byBarangay.reduce((sum, b) => sum + b.count, 0);

    this.paragraph(
      scoped
        ? `Incident volume for Barangay ${data.barangayName} set against the other barangays of Tanza, Cavite.`
        : 'Incident volume across the barangays of Tanza, Cavite, ranked by recorded cases.'
    );
    this.gap(4);

    if (!byBarangay.length) {
      this.emptyNotice('barangay-level data');
      return;
    }

    this.table({
      head: ['Rank', 'Barangay', 'Cases', 'Share', ''],
      body: byBarangay.map((item, i) => [
        String(i + 1).padStart(2, '0'),
        item.barangay,
        item.count.toLocaleString(),
        this.share(item.count, universe),
        '',
      ]),
      columnStyles: {
        0: { cellWidth: 16, textColor: [INK_SOFT[0], INK_SOFT[1], INK_SOFT[2]] },
        2: { halign: 'right', cellWidth: 20 },
        3: { halign: 'right', cellWidth: 20 },
        4: { cellWidth: 36, cellPadding: { top: 2, right: 0, bottom: 2, left: 4 } },
      },
      shareColumn: {
        index: 4,
        values: byBarangay.map((item) => (universe ? item.count / universe : 0)),
      },
    });
  }

  private incidenceMatrix(data: ReportData) {
    this.section('Incidence Matrix', 108);

    const matrix = data.analyticsData.crimeMatrix ?? [];
    this.paragraph(
      'Monthly incidence by offence category. Cell shading encodes volume relative to the busiest cell in the matrix; a dash marks a month with no recorded cases.'
    );
    this.gap(5);

    if (!matrix.length) {
      this.emptyNotice('matrix data');
      return;
    }

    this.matrixGrid(matrix.slice(0, 12));
  }

  private strategicRecommendations(data: ReportData) {
    this.section('Strategic Recommendations');

    const { trends, timePatterns } = data.analyticsData;
    const byType = sortDesc(data.analyticsData.crimesByType, 'count');
    const topType = byType[0];

    this.paragraph(
      'The following actions follow directly from the findings above. Each is tied to the measurement that prompted it.'
    );

    this.subhead('1 · Respond to the trend');
    if (trends.trendDirection === 'worsened') {
      this.paragraph(
        `Incidents rose ${Math.abs(trends.monthlyChange)}% against ${trends.previousQuarterLabel}. Treat this as an active escalation.`
      );
      this.listItem('Raise patrol frequency and visibility in the highest-volume barangays identified in the comparative analysis.');
      this.listItem('Stand up community watch coordination with barangay officials in those areas.');
      this.listItem('Run a prevention awareness campaign targeted at the leading offence category.');
    } else if (trends.trendDirection === 'improved') {
      this.paragraph(
        `Incidents fell ${Math.abs(trends.monthlyChange)}% against ${trends.previousQuarterLabel}. Protect what is working.`
      );
      this.listItem('Hold current patrol schedules and community engagement cadence rather than reallocating away from them.');
      this.listItem('Document the interventions in force this quarter so they can be replicated in lagging barangays.');
      this.listItem('Watch neighbouring areas for displacement rather than genuine reduction.');
    } else {
      this.paragraph(`Volume is flat against ${trends.previousQuarterLabel}. Shift the emphasis from response to prevention.`);
      this.listItem('Maintain patrol coverage and reinvest the margin into prevention programmes.');
      this.listItem('Review whether flat volume reflects stable conditions or under-reporting.');
    }

    this.subhead('2 · Target the leading offence');
    if (topType) {
      this.paragraph(`${topType.type} accounts for ${topType.count} of ${data.totalCrimes.toLocaleString()} recorded cases.`);
      this.listItem('Assign officers with specific experience in this offence category to the affected areas.');
      this.listItem('Direct awareness messaging at the population most exposed to it.');
      this.listItem('Confirm that reporting and response channels for this offence are published and staffed.');
    } else {
      this.paragraph('No offence category was recorded in this period, so no targeted strategy can be derived.');
    }

    this.subhead('3 · Match deployment to the clock');
    this.paragraph(
      `Peak activity sits in the ${hourBand(timePatterns.peakHour)} band with ${
        timePatterns.hourlyDistribution[timePatterns.peakHour] ?? 0
      } incidents.`
    );
    this.listItem('Weight shift strength toward the peak band instead of distributing it evenly across the day.');
    this.listItem('Keep mobile units on standby through the peak band for rapid response.');
    this.listItem('Align barangay tanod schedules to the same window.');

    this.subhead('4 · Close more cases');
    this.paragraph(`The clearance rate stands at ${trends.resolutionRate}%, with a combined safety index of ${trends.safetyIndex}%.`);
    if (trends.resolutionRate < 50) {
      this.listItem('Audit where cases stall between filing and clearance, and staff that step first.');
      this.listItem('Tighten evidence collection and documentation standards at the point of first response.');
      this.listItem('Raise the cadence of coordination with the prosecution service on open cases.');
    } else {
      this.listItem('Hold the current investigative standard and record the practices behind it.');
      this.listItem('Circulate those practices to units with lower clearance rates.');
    }

    this.subhead('5 · Sustain community partnership');
    this.listItem('Hold a standing barangay forum on incident trends using this report as the shared reference.');
    this.listItem('Run youth engagement programmes in the barangays carrying the largest share of cases.');
    this.listItem('Bring local businesses into area security arrangements where commercial premises are affected.');
  }

  private closingNotes(data: ReportData) {
    this.ensure(60);
    this.gap(12);
    this.rule(this.y, INK, 0.5);
    this.y += 7;

    this.type(T.sub, 'bold');
    this.ink(INK);
    this.doc.text('Method and definitions', MARGIN_X, this.y);
    this.y += T.sub.lead + 1;

    this.note(
      `Figures are drawn from incident records held in the Secure Tanza system for ${data.timeRange}, filtered to the reporting scope stated on the cover. Counts reflect records present at the time of generation and will move as cases are updated.`
    );

    const definitions: Array<[string, string]> = [
      ['Cleared rate', 'Cases whose status contains "cleared", as a share of all cases in scope.'],
      ['Safety index', 'Cases whose status contains "cleared" or "solved", as a share of all cases in scope.'],
      ['Threat level', 'Quarterly case count banded as secure (0), low (1-2), moderate (3-5), high (6-10), critical (11 or more).'],
      ['Change', 'Quarter-on-quarter movement in case count, capped at plus or minus 90%.'],
      ['Time of day', 'Taken from the recorded time of commission; records without a time are excluded from temporal analysis.'],
    ];

    definitions.forEach(([term, meaning]) => {
      this.ensure(T.caption.lead * 2 + 1);
      this.type(T.caption, 'bold');
      this.ink(INK);
      this.doc.text(term, MARGIN_X, this.y);
      const lines = this.doc.splitTextToSize(meaning, TEXT_COL - 32) as string[];
      lines.forEach((line, i) => {
        this.type(T.caption);
        this.ink(INK_SOFT);
        this.doc.text(line, MARGIN_X + 32, this.y);
        if (i < lines.length - 1) this.y += T.caption.lead;
      });
      this.y += T.caption.lead + 1.6;
    });

    this.gap(10);
    this.ensure(26);
    const colW = (MEASURE - 10) / 2;
    [
      ['Prepared by', 'Name and designation'],
      ['Reviewed by', 'Name and designation'],
    ].forEach(([label, hint], i) => {
      const x = MARGIN_X + i * (colW + 10);
      this.rule(this.y + 10, RULE, 0.3, x, colW);
      this.capsLabel(label, x, this.y + 14.5);
      this.type(T.micro);
      this.ink(INK_SOFT);
      this.doc.text(hint, x, this.y + 18.6);
    });
    this.y += 26;
  }

  /* ── Chrome: running head + footer, stamped once at the end ─────────────── */

  private stampChrome(totalPages: number, contentsInserted: boolean) {
    for (let page = 1; page <= totalPages; page += 1) {
      if (page === 1) continue; // cover carries its own furniture
      this.doc.setPage(page);

      this.type(T.micro);
      this.ink(INK_SOFT);
      this.doc.setCharSpace(0.2);
      this.doc.text(this.runningHead.toUpperCase(), MARGIN_X, 15.2);
      this.doc.text(this.runningPeriod.toUpperCase(), MARGIN_X + MEASURE, 15.2, { align: 'right' });
      this.doc.setCharSpace(0);
      this.rule(18, HAIR, 0.15);

      this.rule(PAGE_H - 16, HAIR, 0.15);
      this.type(T.micro);
      this.ink(INK_SOFT);
      this.doc.text(this.reference, MARGIN_X, PAGE_H - 11.5);
      const label = contentsInserted && page === 2 ? 'Contents' : `Page ${page} of ${totalPages}`;
      this.type(T.micro, contentsInserted && page === 2 ? 'normal' : 'bold');
      this.ink(contentsInserted && page === 2 ? INK_SOFT : INK_MID);
      this.doc.text(label, MARGIN_X + MEASURE, PAGE_H - 11.5, { align: 'right' });
    }
  }

  /* ── Helpers ────────────────────────────────────────────────────────────── */

  private share(value: number, total: number): string {
    if (!total) return '—';
    return `${((value / total) * 100).toFixed(1)}%`;
  }

  private titleCase(value: string): string {
    if (!value) return '—';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  /* ── Entry point ────────────────────────────────────────────────────────── */

  async generateReport(config: ReportConfig, data: ReportData): Promise<Blob> {
    const sectionCount = Object.values(config).filter(Boolean).length;
    const stamp = new Date();
    const slug =
      data.barangayName === 'All Barangays' || data.barangayName === 'General Dashboard'
        ? 'TNZ'
        : data.barangayName.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'BRG';
    this.reference = `ST-${slug}-${stamp.getFullYear()}${String(stamp.getMonth() + 1).padStart(2, '0')}${String(
      stamp.getDate()
    ).padStart(2, '0')}-${String(stamp.getHours()).padStart(2, '0')}${String(stamp.getMinutes()).padStart(2, '0')}`;
    this.runningHead =
      data.barangayName === 'All Barangays' || data.barangayName === 'General Dashboard'
        ? 'Crime analytics · Tanza, Cavite'
        : `Crime analytics · Brgy. ${data.barangayName}`;
    this.runningPeriod = data.timeRange;

    this.doc.setProperties({
      title: `Incident Pattern and Trend Report — ${data.barangayName}`,
      subject: `Crime analytics case study · ${data.timeRange}`,
      author: 'Secure Tanza',
      creator: 'Secure Tanza crime analytics system',
      keywords: ['crime analytics', 'Tanza', 'Cavite', data.barangayName].join(', '),
    });

    this.coverPage(data, sectionCount);

    this.doc.addPage();
    this.y = CONTENT_TOP;

    if (config.includeExecutiveSummary) this.executiveSummary(data);
    if (config.includeOverview) this.situationalOverview(data);
    if (config.includeTrends) this.trendAnalysis(data);
    if (config.includeTimePatterns) this.temporalAnalysis(data);
    if (config.includeCrimeTypes) this.crimeClassification(data);
    if (config.includeBarangayComparison) this.comparativeAnalysis(data);
    if (config.includeCrimeMatrix) this.incidenceMatrix(data);
    if (config.includeRecommendations) this.strategicRecommendations(data);

    this.closingNotes(data);

    const contentsInserted = this.contents.length >= 3;
    if (contentsInserted) this.contentsPage();

    this.stampChrome(this.doc.getNumberOfPages(), contentsInserted);

    return this.doc.output('blob');
  }
}
