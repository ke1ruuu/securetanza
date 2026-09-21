"use client";

import React, { useState } from "react";
import { TrendingUp, TrendingDown, BarChart3, Clock, HelpCircle, Shield } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useTheme } from "@/context/ThemeContext";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useCrimeMatrix } from "@/hooks/useCrimeMatrix";
import { useModusAndPlace } from "@/hooks/useModusAndPlace";
import CrimeMatrixChart from "./crime-matrix-chart";
import { SectionHeader, Panel } from "./section-primitives";
import { useChartTooltip } from "./analytics/chart-tooltip";
import IncidentDetailModal from "./analytics/incident-detail-modal";
import { ACCENT, rampColorForTheme, rgbToCss } from "@/lib/report-theme";
import {
  type AnalyticsSlice,
  MONTH_LONG,
  MONTH_SHORT,
  cleanLabel,
  formatHour,
} from "@/lib/analytics-slice";

interface AnalyticsTabProps {
  barangayName: string;
}

const MONTH_LABELS = MONTH_SHORT;

// Same "one ink, one accent" system as the PDF report (lib/report-theme.ts):
// bars run along a single sky-blue sequential ramp whose intensity encodes
// each bar's magnitude — matching lib/pdf-generator.ts's horizontalBars/
// columnChart — rather than a different flat hue per chart or per bar.
const ACCENT_CSS = rgbToCss(ACCENT);

// report-theme's rampColorForTheme picks the paper ramp (pale → deep navy)
// in light mode, matching the PDF exactly, and a muted → bright-accent ramp
// in dark mode — dark navy has less contrast against a dark card than the
// mid-tones do, so the "peak" mark needs the opposite direction there to
// stay the most visually prominent one.
function rampCss(intensity: number, theme: string) {
  return rgbToCss(rampColorForTheme(intensity, theme === "dark" ? "dark" : "light"));
}



/** Shared help-icon + hover popover, used by every panel that needs one —
 *  a single consistent trigger/sizing instead of re-declaring the same
 *  HoverCard boilerplate in each section. */
function HelpTip({ theme, children }: { theme: string; children: React.ReactNode }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="cursor-help">
          <HelpCircle className={`h-3.5 w-3.5 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`} />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className={`w-80 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
        {children}
      </HoverCardContent>
    </HoverCard>
  );
}


/** Column chart with no axis furniture and only the peak value labeled —
 *  mirrors lib/pdf-generator.ts's columnChart, used for both Monthly Trend
 *  and Hour of Day so every temporal chart on the page shares one shape. */
function ColumnChart({
  data,
  theme,
  labelEvery = 1,
  height = 150,
  peakIndex,
  onSelect,
}: {
  data: { label: string; value: number; fullLabel?: string }[];
  theme: string;
  labelEvery?: number;
  height?: number;
  /** Index to highlight as the peak. Defaults to the data's own max, but
   *  pass this explicitly when another part of the UI already names an
   *  authoritative peak (e.g. timePatterns.peakHour) so the chart never
   *  visually disagrees with that text. */
  peakIndex?: number;
  onSelect?: (index: number) => void;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const peakIdx =
    peakIndex ?? data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0);
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);
  const { tooltip, bind, hide } = useChartTooltip(theme);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className="flex items-end"
      style={{ height, gap: 3 }}
      onMouseLeave={() => {
        setHovered(null);
        hide();
      }}
    >
      {data.map((d, i) => {
        const isPeak = i === peakIdx && d.value > 0;
        const h = d.value > 0 ? Math.max((d.value / max) * 100, 4) : 2.5;
        const dimmed = hovered !== null && hovered !== i;
        const clickable = Boolean(onSelect) && d.value > 0;
        const share = totalValue > 0 ? Math.round((d.value / totalValue) * 100) : 0;
        return (
          // The whole column is the hover target, not just the bar — at 24
          // columns the bars are only a few pixels wide and would be
          // miserable to hit.
          <div
            key={i}
            className={`flex-1 min-w-0 flex flex-col items-center justify-end h-full transition-opacity ${
              clickable ? "cursor-pointer" : ""
            }`}
            style={{ opacity: dimmed ? 0.45 : 1 }}
            {...bind(
              {
                title: d.fullLabel ?? d.label,
                rows: [
                  { label: "Incidents", value: String(d.value) },
                  { label: "Share", value: `${share}%` },
                  ...(isPeak ? [{ label: "Peak", value: "Yes" }] : []),
                ],
                hint: clickable
                  ? "Click to see these incidents"
                  : d.value === 0
                    ? "No incidents recorded"
                    : undefined,
              },
              () => setHovered(i)
            )}
            onClick={clickable ? () => onSelect?.(i) : undefined}
          >
            <span
              className={`text-[10px] font-extrabold tabular-nums ${
                isPeak || hovered === i ? "" : "opacity-0"
              } ${theme === "dark" ? "text-white" : "text-slate-900"}`}
              style={{ marginBottom: 3 }}
            >
              {d.value}
            </span>
            <div
              className="w-[62%] rounded-t-[2px]"
              style={{
                height: `${h}%`,
                background: isPeak ? rampCss(1, theme) : rampCss(0.3 + (d.value / max) * 0.4, theme),
              }}
            />
            <span
              className={`text-[9px] ${i % labelEvery === 0 || hovered === i ? "" : "opacity-0"} ${
                isPeak || hovered === i ? "font-bold" : "font-normal"
              } ${theme === "dark" ? (isPeak ? "text-white" : "text-slate-500") : isPeak ? "text-slate-900" : "text-slate-400"}`}
              style={{ marginTop: 6 }}
            >
              {d.label}
            </span>
          </div>
        );
      })}
      {tooltip}
    </div>
  );
}

/** Ranked label / track / value rows — mirrors lib/pdf-generator.ts's
 *  horizontalBars, replacing axis-based bar charts everywhere on this page. */
function RankedBars({
  items,
  theme,
  total,
  onSelect,
}: {
  items: { label: string; fullLabel: string; count: number; fill: string }[];
  theme: string;
  /** Denominator for the "share of total" readout. Defaults to the sum of the
   *  rows shown, which is right for panels that list every category and a
   *  close-enough approximation for the top-N ones. */
  total?: number;
  onSelect?: (item: { fullLabel: string; count: number }) => void;
}) {
  const max = Math.max(...items.map((i) => i.count), 1);
  const denominator = total ?? items.reduce((sum, i) => sum + i.count, 0);
  const { tooltip, bind, hide } = useChartTooltip(theme);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    // flex-1 + justify-between: when this list has fewer rows than its
    // sibling panel (whose height it's stretched to match), the rows
    // spread out to fill the space instead of leaving a dead gap above
    // the footer — same panel height, no empty block.
    <div
      className="flex-1 flex flex-col justify-between"
      onMouseLeave={() => {
        setHovered(null);
        hide();
      }}
    >
      {items.map((item, i) => {
        const dimmed = hovered !== null && hovered !== i;
        const share = denominator > 0 ? Math.round((item.count / denominator) * 100) : 0;
        return (
          <div
            key={i}
            className={`flex items-center transition-opacity ${onSelect ? "cursor-pointer" : ""}`}
            style={{ gap: 10, padding: "6px 0", opacity: dimmed ? 0.4 : 1 }}
            {...bind(
              {
                title: item.fullLabel,
                rows: [
                  { label: "Incidents", value: String(item.count), swatch: item.fill },
                  { label: "Share", value: `${share}%` },
                  { label: "Rank", value: `${i + 1} of ${items.length}` },
                ],
                hint: onSelect ? "Click to see these incidents" : undefined,
              },
              () => setHovered(i)
            )}
            onClick={onSelect ? () => onSelect(item) : undefined}
          >
            <div
              className={`w-[42%] shrink-0 text-right truncate ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}
              style={{ fontSize: "0.78rem" }}
            >
              {item.label}
            </div>
            <div
              className={`flex-1 rounded-[3px] overflow-hidden ${theme === "dark" ? "bg-sky-400/10" : "bg-sky-50"}`}
              style={{ height: 15 }}
            >
              <div
                className="h-full rounded-[3px]"
                style={{ width: `${item.count > 0 ? Math.max((item.count / max) * 100, 4) : 0}%`, background: item.fill }}
              />
            </div>
            <div
              className={`text-right font-bold tabular-nums ${theme === "dark" ? "text-white" : "text-slate-900"}`}
              style={{ width: 24, fontSize: "0.78rem" }}
            >
              {item.count}
            </div>
          </div>
        );
      })}
      {tooltip}
    </div>
  );
}

/**
 * Loading state that mirrors the finished page — same header, numbered
 * sections, panel shells and grid — so nothing jumps when the data lands.
 * Everything that doesn't depend on the data (section names, panel titles,
 * stat labels) is real text; only the values and charts are placeholders.
 */
function AnalyticsSkeleton({
  theme,
  isGeneralDashboard,
  barangayName,
}: {
  theme: string;
  isGeneralDashboard: boolean;
  barangayName: string;
}) {
  const dark = theme === "dark";
  const bone = dark ? "bg-white/10" : "bg-slate-200";
  const track = dark ? "bg-sky-400/10" : "bg-sky-50";
  const muted = dark ? "text-slate-400" : "text-slate-500";

  // Fixed shapes rather than random ones, so the skeleton doesn't reshuffle on re-render.
  const monthHeights = [55, 70, 48, 82, 64, 90, 58, 74, 66, 52, 80, 60];
  const hourHeights = [20, 14, 10, 8, 8, 12, 22, 34, 46, 52, 58, 62, 66, 70, 76, 82, 90, 84, 72, 60, 48, 40, 32, 26];
  const rankWidths = [92, 78, 66, 54, 44, 36, 28, 22];

  const Bone = ({ className, style }: { className: string; style?: React.CSSProperties }) => (
    <div className={`rounded ${bone} ${className}`} style={style} />
  );

  const Columns = ({ heights }: { heights: number[] }) => (
    <div className="flex items-end" style={{ height: 150, gap: 3 }}>
      {heights.map((h, i) => (
        <div key={i} className={`flex-1 rounded-t-[3px] ${bone}`} style={{ height: `${h}%` }} />
      ))}
    </div>
  );

  const Ranked = ({ rows }: { rows: number }) => (
    <div className="flex-1 flex flex-col justify-between">
      {rankWidths.slice(0, rows).map((w, i) => (
        <div key={i} className="flex items-center" style={{ gap: 10, padding: "6px 0" }}>
          <div className="w-[42%] shrink-0 flex justify-end">
            <Bone className="h-3" style={{ width: `${60 + ((i * 17) % 35)}%` }} />
          </div>
          <div className={`flex-1 h-[18px] rounded-[3px] overflow-hidden ${track}`}>
            <div className={`h-full rounded-[3px] ${bone}`} style={{ width: `${w}%` }} />
          </div>
        </div>
      ))}
    </div>
  );

  const footer = (
    <>
      <Bone className="h-3.5 w-3/5" />
      <Bone className="h-3 w-2/5" />
    </>
  );

  const stats = [
    { label: "Crime Trend", Icon: Shield },
    { label: "Peak Hours", Icon: Clock },
    { label: "Resolution Rate", Icon: BarChart3 },
    { label: "Safety Index", Icon: Shield },
  ];

  return (
    <div
      className="max-w-[1180px] mx-auto space-y-10 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Loading analytics"
    >
      {/* Header */}
      <header
        className={`flex flex-wrap items-end justify-between gap-4 border-b pb-[22px] ${dark ? "border-white/5" : "border-slate-200"}`}
      >
        <div className="max-w-lg">
          <h2 className={`text-3xl font-bold tracking-tight mb-1.5 ${dark ? "text-white" : "text-slate-900"}`}>
            Crime Analytics
          </h2>
          <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
            Comprehensive analysis and insights for {isGeneralDashboard ? "all barangays in Tanza" : barangayName}
          </p>
        </div>
        <dl className="text-right">
          <dt className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${dark ? "text-slate-500" : "text-slate-400"}`}>
            Total Incidents
          </dt>
          <dd className="mt-1.5 flex justify-end">
            <Bone className="h-6 w-16" />
          </dd>
        </dl>
      </header>

      {/* 01 Overview — one surface, four stats */}
      <section>
        <SectionHeader no="01" title="Overview" theme={theme} />
        <div className={`rounded-xl border ${dark ? "border-white/[0.06] bg-[#1e293b]" : "border-slate-200 bg-white"}`}>
          <div
            className={`flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x ${dark ? "divide-white/[0.06]" : "divide-slate-200"}`}
          >
            {stats.map(({ label, Icon }) => (
              <div key={label} className="flex-1 min-w-0" style={{ padding: "16px 22px" }}>
                <p className={`flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.11em] ${muted}`} style={{ marginBottom: 8 }}>
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </p>
                <Bone className="h-[1.3rem] w-24" />
                <Bone className="h-3 w-32" style={{ marginTop: 9 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 Temporal Patterns */}
      <section>
        <SectionHeader no="02" title="Temporal Patterns" theme={theme} />
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-[18px]">
          <Panel
            theme={theme}
            title="Monthly Trend"
            subtitle={`Incidents per month, ${isGeneralDashboard ? "all barangays" : barangayName}`}
            bodyClassName="justify-center"
            footer={footer}
          >
            <Columns heights={monthHeights} />
          </Panel>
          <Panel
            theme={theme}
            title="Hour of Day"
            subtitle="24-hour incident distribution"
            bodyClassName="justify-center"
            footer={footer}
          >
            <Columns heights={hourHeights} />
          </Panel>
        </div>
      </section>

      {/* 03 Crime Composition */}
      <section>
        <SectionHeader no="03" title="Crime Composition" theme={theme} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-[18px]">
          <Panel theme={theme} title="Crime Types Distribution" subtitle="Most common incident categories" footer={footer}>
            <Ranked rows={8} />
          </Panel>
          <Panel theme={theme} title="Crime Modus Operandi" subtitle="Most common methods used in crimes" footer={footer}>
            <Ranked rows={8} />
          </Panel>
        </div>
      </section>

      {/* 04 Where It Happens */}
      <section>
        <SectionHeader no="04" title="Where It Happens" theme={theme} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-[18px]">
          <Panel theme={theme} title="Crime Location Types" subtitle="Where crimes most frequently occur" footer={footer}>
            <Ranked rows={8} />
          </Panel>
          {/* Only exists on the all-barangays view */}
          {isGeneralDashboard && (
            <Panel theme={theme} title="Barangay Comparison" subtitle="Crime distribution across areas" footer={footer}>
              <Ranked rows={8} />
            </Panel>
          )}
        </div>
      </section>

      {/* 05 Matrix — has its own loading state further down once the rest has landed */}
      <section>
        <SectionHeader no="05" title="Crime Type Matrix" theme={theme} />
        <Panel theme={theme} title="Crime Type Matrix">
          <div className="grid grid-cols-6 gap-1.5" style={{ height: 280 }}>
            {Array.from({ length: 36 }, (_, i) => (
              <div key={i} className={`rounded ${bone}`} style={{ opacity: 0.35 + ((i * 37) % 60) / 100 }} />
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}

export default function AnalyticsTab({ barangayName }: AnalyticsTabProps) {
  const { theme } = useTheme();

  const {
    crimesByType,
    crimesByMonth,
    crimesByBarangay,
    timePatterns,
    trends,
    allCrimes,
    loading,
  } = useAnalyticsData(barangayName);

  const { matrixData, loading: matrixLoading } = useCrimeMatrix(barangayName);
  const { modusList, placesList, loading: modusPlaceLoading } = useModusAndPlace(barangayName);

  /** What the user clicked into. Null = no detail view open. */
  const [activeSlice, setActiveSlice] = useState<AnalyticsSlice | null>(null);

  const isGeneralDashboard =
    !barangayName || barangayName === "General Dashboard";

  if (loading) {
    return (
      <AnalyticsSkeleton
        theme={theme}
        isGeneralDashboard={isGeneralDashboard}
        barangayName={barangayName}
      />
    );
  }

  // ─── Crime Types ───
  const crimeTypeMax = Math.max(...crimesByType.slice(0, 8).map((c) => c.count), 1);
  const crimeTypeBarData = crimesByType.slice(0, 8).map((crime) => {
    const clean = cleanLabel(crime.type);
    return {
      label: clean.length > 18 ? clean.slice(0, 16) + "…" : clean,
      fullLabel: clean,
      count: crime.count,
      fill: rampCss(crime.count / crimeTypeMax, theme),
    };
  });

  // ─── Monthly Trend ───
  const monthlyLineData = crimesByMonth.map((m) => ({
    label: MONTH_LABELS[m.month - 1] || `M${m.month}`,
    fullLabel: MONTH_LONG[m.month - 1] || `Month ${m.month}`,
    value: m.count,
  }));

  // ─── Hour of Day ───
  const hourlyData = timePatterns.hourlyDistribution.map((count, hour) => ({
    label: formatHour(hour).replace(" ", "").toLowerCase(),
    fullLabel: formatHour(hour),
    value: count,
  }));

  // ─── Barangay Comparison ───
  const barangayMax = Math.max(...crimesByBarangay.slice(0, 10).map((b) => b.count), 1);
  const barangayBarData = crimesByBarangay.slice(0, 10).map((b) => ({
    label: b.barangay.length > 16 ? b.barangay.slice(0, 14) + "…" : b.barangay,
    fullLabel: b.barangay,
    count: b.count,
    fill: rampCss(b.count / barangayMax, theme),
  }));

  // ─── Modus Operandi ───
  const modusMax = Math.max(...modusList.map((item) => item.count), 1);
  const modusBarData = modusList.map((item) => ({
    label: item.modus.length > 22 ? item.modus.slice(0, 20) + "…" : item.modus,
    fullLabel: item.modus,
    count: item.count,
    fill: rampCss(item.count / modusMax, theme),
  }));

  // ─── Type of Place ───
  const placeMax = Math.max(...placesList.map((item) => item.count), 1);
  const placeBarData = placesList.map((item) => ({
    label: item.place.length > 22 ? item.place.slice(0, 20) + "…" : item.place,
    fullLabel: item.place,
    count: item.count,
    fill: rampCss(item.count / placeMax, theme),
  }));

  // ─── Total incidents for footer stats ───
  const totalIncidents = crimesByType.reduce((sum, c) => sum + c.count, 0);
  const topCrimeType = crimesByType[0]?.type ? cleanLabel(crimesByType[0].type) : "N/A";
  const topCrimePercent =
    totalIncidents > 0
      ? Math.round((crimesByType[0]?.count / totalIncidents) * 100)
      : 0;

  const trendColor =
    trends.trendDirection === "improved"
      ? theme === "dark" ? "text-emerald-400" : "text-emerald-600"
      : trends.trendDirection === "worsened"
        ? theme === "dark" ? "text-red-400" : "text-red-600"
        : theme === "dark" ? "text-slate-400" : "text-slate-500";

  return (
    <div className="max-w-[1180px] mx-auto space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Header */}
      <header
        className={`flex flex-wrap items-end justify-between gap-4 border-b pb-[22px] ${theme === "dark" ? "border-white/5" : "border-slate-200"}`}
      >
        <div className="max-w-lg">
          <h2
            className={`text-3xl font-bold tracking-tight mb-1.5 ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            Crime Analytics
          </h2>
          <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
            Comprehensive analysis and insights for{" "}
            {isGeneralDashboard ? "all barangays in Tanza" : barangayName}
          </p>
        </div>

        <dl className="text-right">
          <dt
            className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}
          >
            Total Incidents
          </dt>
          <dd className={`mt-1.5 text-lg font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
            {totalIncidents.toLocaleString()}
          </dd>
        </dl>
      </header>

      {/* ═══ 01 Overview ═══ */}
      <section data-tour="analytics-metrics">
        <SectionHeader no="01" title="Overview" theme={theme} />
        {/* One bordered surface, hairline dividers between stats instead of
            four separate cards. Color is reserved for Crime Trend, the one
            value that's actually good/bad news — the rest stay neutral. */}
        <div
          className={`rounded-xl border ${theme === "dark" ? "border-white/[0.06] bg-[#1e293b]" : "border-slate-200 bg-white"}`}
        >
          <div
            className={`flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x ${theme === "dark" ? "divide-white/[0.06]" : "divide-slate-200"}`}
          >
            {/* Crime Trend */}
            <div className="flex-1 min-w-0" style={{ padding: "16px 22px" }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                <p className={`flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.11em] ${trendColor}`}>
                  {trends.trendDirection === "worsened" ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : trends.trendDirection === "improved" ? (
                    <TrendingDown className="h-3.5 w-3.5" />
                  ) : (
                    <Shield className="h-3.5 w-3.5" />
                  )}
                  Crime Trend
                </p>
                <HelpTip theme={theme}>
                  <div className="space-y-2">
                    <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                      Quarterly Crime Trend
                    </h4>
                    <p className={`text-xs ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                      Compares current quarter to previous quarter:
                    </p>
                    <div className={`text-xs font-mono p-2 rounded ${theme === "dark" ? "bg-slate-900 text-blue-400" : "bg-slate-100 text-blue-600"}`}>
                      ((Current Q - Previous Q) / Previous Q) × 100
                    </div>
                    <div className={`text-xs p-2 rounded ${theme === "dark" ? "bg-slate-900/50 border border-slate-700" : "bg-slate-50 border border-slate-200"}`}>
                      <p className={`font-semibold mb-1 ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                        Your Data:
                      </p>
                      <p className={theme === "dark" ? "text-slate-300" : "text-slate-600"}>
                        {trends.currentQuarterLabel}: <strong className={theme === "dark" ? "text-white" : "text-slate-900"}>{trends.currentQuarterCrimes ?? 0} crimes</strong>
                      </p>
                      <p className={theme === "dark" ? "text-slate-300" : "text-slate-600"}>
                        {trends.previousQuarterLabel}: <strong className={theme === "dark" ? "text-white" : "text-slate-900"}>{trends.previousQuarterCrimes ?? 0} crimes</strong>
                      </p>
                      <p className={`mt-1 font-semibold ${
                        trends.trendDirection === "improved"
                          ? "text-emerald-500"
                          : trends.trendDirection === "worsened"
                            ? "text-red-500"
                            : "text-slate-500"
                      }`}>
                        Result: {trends.trendDirection === "improved"
                          ? `Decreased by ${Math.abs(trends.monthlyChange)}%`
                          : trends.trendDirection === "worsened"
                            ? `Increased by ${Math.abs(trends.monthlyChange)}%`
                            : "No change"}
                      </p>
                    </div>
                    <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      <strong>Why Quarterly?</strong> Quarterly trends provide more stable and accurate insights by comparing 3-month periods, reducing the impact of short-term fluctuations.
                    </p>
                    <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      <strong>Note:</strong> Percentage is capped at ±90% to avoid extreme values.
                    </p>
                    <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      <strong>Interpretation:</strong>
                    </p>
                    <ul className={`text-xs space-y-1 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      <li>• <strong className="text-emerald-500">Decreased</strong>: Crime went down (good)</li>
                      <li>• <strong className="text-red-500">Increased</strong>: Crime went up (concerning)</li>
                      <li>• <strong className="text-slate-500">Stable</strong>: No change</li>
                    </ul>
                  </div>
                </HelpTip>
              </div>
              <p className={`text-[1.3rem] font-bold leading-[1.15] ${trendColor}`}>
                {trends.trendDirection === "improved"
                  ? "Decreased"
                  : trends.trendDirection === "worsened"
                    ? "Increased"
                    : "Stable"}
              </p>
              <p
                className={`text-[0.78rem] ${
                  trends.trendDirection === "improved"
                    ? "text-emerald-500"
                    : trends.trendDirection === "worsened"
                      ? "text-red-500"
                      : "text-slate-500"
                }`}
                style={{ marginTop: 5 }}
              >
                {trends.trendDirection === "improved"
                  ? `↓ ${Math.abs(trends.monthlyChange)}% less crimes`
                  : trends.trendDirection === "worsened"
                    ? `↑ ${Math.abs(trends.monthlyChange)}% more crimes`
                    : "No change in last 30 days"}
              </p>
            </div>

            {/* Peak Hours */}
            <div className="flex-1 min-w-0" style={{ padding: "16px 22px" }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                <p className={`flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.11em] ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  <Clock className="h-3.5 w-3.5" />
                  Peak Hours
                </p>
                <HelpTip theme={theme}>
                  <div className="space-y-2">
                    <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                      Peak Hours Calculation
                    </h4>
                    <p className={`text-xs ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                      Analyzes all crime incidents by hour of day (0-23):
                    </p>
                    <div className={`text-xs font-mono p-2 rounded ${theme === "dark" ? "bg-slate-900 text-purple-400" : "bg-slate-100 text-purple-600"}`}>
                      Hour with MAX(incident count)
                    </div>
                    <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      <strong>Example:</strong> If 15 crimes occurred at 2 PM and that's the highest, peak hour = 2 PM
                    </p>
                  </div>
                </HelpTip>
              </div>
              <p className={`text-[1.3rem] font-bold leading-[1.15] ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                {formatHour(timePatterns.peakHour)}
              </p>
              <p className="text-[0.78rem] text-slate-500" style={{ marginTop: 5 }}>Most incidents</p>
            </div>

            {/* Resolution Rate */}
            <div className="flex-1 min-w-0" style={{ padding: "16px 22px" }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                <p className={`flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.11em] ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  <BarChart3 className="h-3.5 w-3.5" />
                  Resolution Rate
                </p>
                <HelpTip theme={theme}>
                  <div className="space-y-2">
                    <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                      Resolution Rate Calculation
                    </h4>
                    <p className={`text-xs ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                      Percentage of cases that have been cleared:
                    </p>
                    <div className={`text-xs font-mono p-2 rounded ${theme === "dark" ? "bg-slate-900 text-emerald-400" : "bg-slate-100 text-emerald-600"}`}>
                      (Cleared Cases / Total Cases) × 100
                    </div>
                    <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      <strong>Cleared status:</strong> Cases marked as "Cleared" only
                    </p>
                    <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      <strong>Example:</strong> 20 cleared out of 38 total = 53%
                    </p>
                  </div>
                </HelpTip>
              </div>
              <p className={`text-[1.3rem] font-bold leading-[1.15] ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                {trends.resolutionRate}%
              </p>
              <p className="text-[0.78rem] text-slate-500" style={{ marginTop: 5 }}>Cases cleared</p>
            </div>

            {/* Safety Index */}
            <div className="flex-1 min-w-0" style={{ padding: "16px 22px" }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                <p className={`flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.11em] ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Safety Index
                </p>
                <HelpTip theme={theme}>
                  <div className="space-y-2">
                    <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                      Safety Index Calculation
                    </h4>
                    <p className={`text-xs ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                      Overall safety score based on cleared and solved cases:
                    </p>
                    <div className={`text-xs font-mono p-2 rounded ${theme === "dark" ? "bg-slate-900 text-amber-400" : "bg-slate-100 text-amber-600"}`}>
                      (Cleared + Solved Cases / Total Cases) × 100
                    </div>
                    <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      <strong>Interpretation:</strong>
                    </p>
                    <ul className={`text-xs space-y-1 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      <li>• 90-100%: Excellent safety</li>
                      <li>• 70-89%: Good safety</li>
                      <li>• 50-69%: Moderate safety</li>
                      <li>• Below 50%: Needs improvement</li>
                    </ul>
                  </div>
                </HelpTip>
              </div>
              <p className={`text-[1.3rem] font-bold leading-[1.15] ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                {trends.safetyIndex}%
              </p>
              <p className="text-[0.78rem] text-slate-500" style={{ marginTop: 5 }}>Overall safety</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 02 Temporal Patterns ═══ */}
      <section data-tour="analytics-temporal-trends">
        <SectionHeader no="02" title="Temporal Patterns" theme={theme} />
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-[18px]">
          <Panel
            theme={theme}
            title="Monthly Trend"
            subtitle={`Incidents per month, ${isGeneralDashboard ? "all barangays" : barangayName}`}
            bodyClassName="justify-center"
            footer={
              <>
                <div className="flex items-center gap-2 font-semibold leading-none">
                  {trends.trendDirection === "worsened" ? (
                    <>Crime increased by {Math.abs(trends.monthlyChange)}% vs previous quarter <TrendingUp className="h-4 w-4 text-red-500" /></>
                  ) : trends.trendDirection === "improved" ? (
                    <>Crime decreased by {Math.abs(trends.monthlyChange)}% vs previous quarter <TrendingDown className="h-4 w-4 text-emerald-500" /></>
                  ) : (
                    <>No change vs previous quarter</>
                  )}
                </div>
                <div className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>
                  {isGeneralDashboard ? "All barangays" : barangayName} — {trends.currentQuarterLabel}
                </div>
              </>
            }
          >
            <ColumnChart
              data={monthlyLineData}
              theme={theme}
              onSelect={(i) =>
                setActiveSlice({ kind: "month", value: (crimesByMonth[i]?.month ?? i + 1) - 1 })
              }
            />
          </Panel>

          <Panel
            theme={theme}
            title="Hour of Day"
            subtitle="24-hour incident distribution"
            bodyClassName="justify-center"
            footer={
              <>
                <div className="flex items-center gap-2 font-semibold leading-none">
                  Peak activity at {formatHour(timePatterns.peakHour)}
                  <Clock className="h-4 w-4" style={{ color: ACCENT_CSS }} />
                </div>
                <div className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>
                  24-hour incident distribution
                </div>
              </>
            }
          >
            <ColumnChart
              data={hourlyData}
              theme={theme}
              labelEvery={3}
              peakIndex={timePatterns.peakHour}
              onSelect={(hour) => setActiveSlice({ kind: "hour", value: hour })}
            />
          </Panel>
        </div>
      </section>

      {/* ═══ 03 Crime Composition ═══ */}
      <section data-tour="analytics-crime-types">
        <SectionHeader no="03" title="Crime Composition" theme={theme} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-[18px]">
          <Panel
            theme={theme}
            title="Crime Types Distribution"
            subtitle="Most common incident categories"
            footer={
              <>
                <div className="flex items-center gap-2 font-semibold leading-none">
                  {topCrimeType} accounts for {topCrimePercent}% of all incidents
                </div>
                <div className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>
                  {totalIncidents.toLocaleString()} total incidents recorded
                </div>
              </>
            }
          >
            {crimeTypeBarData.length > 0 ? (
              <RankedBars
                items={crimeTypeBarData}
                theme={theme}
                total={totalIncidents}
                onSelect={(item) => setActiveSlice({ kind: "crimeType", value: item.fullLabel })}
              />
            ) : (
              <div className="h-[160px] flex items-center justify-center text-slate-500">No crime type data available</div>
            )}
          </Panel>

          <Panel
            theme={theme}
            title="Crime Modus Operandi"
            subtitle="Most common methods used in crimes"
            help={
              <HelpTip theme={theme}>
                <div className="space-y-2">
                  <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                    Modus Operandi
                  </h4>
                  <p className={`text-xs ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                    The method or pattern of operation used by criminals to commit crimes.
                  </p>
                  <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                    Understanding common modus helps in:
                  </p>
                  <ul className={`text-xs space-y-1 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                    <li>• Identifying crime patterns</li>
                    <li>• Preventing similar incidents</li>
                    <li>• Training law enforcement</li>
                    <li>• Public awareness campaigns</li>
                  </ul>
                </div>
              </HelpTip>
            }
            footer={
              <>
                <div className="flex items-center gap-2 font-semibold leading-none">
                  {modusBarData[0]?.fullLabel || "N/A"} is the most common method
                </div>
                <div className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>
                  Top {modusBarData.length} modus operandi shown
                </div>
              </>
            }
          >
            {modusPlaceLoading ? (
              <div className="h-[160px] flex items-center justify-center">
                <div className="animate-pulse text-slate-500">Loading...</div>
              </div>
            ) : modusBarData.length > 0 ? (
              <RankedBars
                items={modusBarData}
                theme={theme}
                onSelect={(item) => setActiveSlice({ kind: "modus", value: item.fullLabel })}
              />
            ) : (
              <div className="h-[160px] flex items-center justify-center text-slate-500">No modus data available</div>
            )}
          </Panel>
        </div>
      </section>

      {/* ═══ 04 Where It Happens ═══ */}
      <section data-tour="analytics-modus-locations">
        <SectionHeader no="04" title="Where It Happens" theme={theme} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-[18px]">
          <Panel
            theme={theme}
            title="Crime Location Types"
            subtitle="Where crimes most frequently occur"
            help={
              <HelpTip theme={theme}>
                <div className="space-y-2">
                  <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                    Type of Place
                  </h4>
                  <p className={`text-xs ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                    The category of location where crimes occur (e.g., residential, commercial, public spaces).
                  </p>
                  <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                    This data helps in:
                  </p>
                  <ul className={`text-xs space-y-1 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                    <li>• Targeted security measures</li>
                    <li>• Resource allocation</li>
                    <li>• Community safety planning</li>
                    <li>• Risk assessment by location type</li>
                  </ul>
                </div>
              </HelpTip>
            }
            footer={
              <>
                <div className="flex items-center gap-2 font-semibold leading-none">
                  {placeBarData[0]?.fullLabel || "N/A"} is the most common location
                </div>
                <div className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>
                  Top {placeBarData.length} location types shown
                </div>
              </>
            }
          >
            {modusPlaceLoading ? (
              <div className="h-[160px] flex items-center justify-center">
                <div className="animate-pulse text-slate-500">Loading...</div>
              </div>
            ) : placeBarData.length > 0 ? (
              <RankedBars
                items={placeBarData}
                theme={theme}
                onSelect={(item) => setActiveSlice({ kind: "place", value: item.fullLabel })}
              />
            ) : (
              <div className="h-[160px] flex items-center justify-center text-slate-500">No location type data available</div>
            )}
          </Panel>

          {isGeneralDashboard && (
            <Panel
              theme={theme}
              title="Barangay Comparison"
              subtitle="Crime distribution across areas"
              footer={
                <>
                  <div className="flex items-center gap-2 font-semibold leading-none">
                    {barangayBarData[0]?.fullLabel || "N/A"} has the highest crime count
                  </div>
                  <div className={theme === "dark" ? "text-slate-400" : "text-slate-500"}>
                    Top {barangayBarData.length} barangays shown
                  </div>
                </>
              }
            >
              {barangayBarData.length > 0 ? (
                <RankedBars
                  items={barangayBarData}
                  theme={theme}
                  onSelect={(item) => setActiveSlice({ kind: "barangay", value: item.fullLabel })}
                />
              ) : (
                <div className="h-[160px] flex items-center justify-center text-slate-500">No barangay comparison data available</div>
              )}
            </Panel>
          )}
        </div>
      </section>

      {/* ═══ 05 Crime Type Matrix ═══ */}
      <section data-tour="analytics-matrix">
        <SectionHeader no="05" title="Crime Type Matrix" theme={theme} />
        {matrixLoading ? (
          <Panel theme={theme} title="Crime Type Matrix">
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-pulse text-slate-500">Loading matrix data...</div>
            </div>
          </Panel>
        ) : (
          <CrimeMatrixChart
            data={matrixData}
            title="Crime Type Matrix"
            description={`Monthly distribution of top crime types ${isGeneralDashboard ? "across all barangays" : `in ${barangayName}`}`}
            onSelect={setActiveSlice}
          />
        )}
      </section>

      <IncidentDetailModal
        slice={activeSlice}
        allCrimes={allCrimes}
        totalIncidents={totalIncidents}
        theme={theme}
        onClose={() => setActiveSlice(null)}
      />
    </div>
  );
}
