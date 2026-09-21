"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, ChevronRight, Clock, MapPin, ShieldAlert } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useTheme } from "@/context/ThemeContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useThreatLevels } from "@/hooks/useThreatLevels";
import { ACCENT, ACCENT_DEEP, rampColorForTheme, rgbToCss } from "@/lib/report-theme";
import { SectionHeader, Panel } from "./section-primitives";
import { useChartTooltip } from "./analytics/chart-tooltip";

interface OverviewTabProps {
  barangayName: string;
}

// Month labels for the activity chart
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ACCENT_CSS = rgbToCss(ACCENT);
const ACCENT_DEEP_CSS = rgbToCss(ACCENT_DEEP);

// Same "one ink, one accent" system as the Analytics page and the PDF report:
// everything runs along the sky-blue ramp instead of a different hue per slice.
function rampCss(intensity: number, theme: string) {
  return rgbToCss(rampColorForTheme(intensity, theme === "dark" ? "dark" : "light"));
}

/**
 * Loading state that mirrors the finished page — same header, numbered
 * sections and panel shells — so nothing jumps when the data lands. Labels
 * that don't depend on the data are real text; only values and charts are
 * placeholders.
 */
function OverviewSkeleton({
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

  const areaHeights = [38, 46, 42, 58, 52, 66, 60, 72, 64, 56, 68, 62];
  const rankWidths = [92, 74, 58, 44, 34, 26];

  const Bone = ({ className, style }: { className: string; style?: React.CSSProperties }) => (
    <div className={`rounded ${bone} ${className}`} style={style} />
  );

  const footer = (
    <>
      <Bone className="h-3.5 w-3/5" />
      <Bone className="h-3 w-2/5" />
    </>
  );

  const stats = [
    { label: "Total Crimes (All Time)", Icon: ShieldAlert },
    { label: "Most Frequent Crime Type", Icon: BarChart3 },
    ...(isGeneralDashboard ? [{ label: "Critical Area", Icon: MapPin }] : []),
  ];

  return (
    <div
      className="max-w-[1180px] mx-auto space-y-10 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Loading overview"
    >
      <header className={`flex flex-wrap items-end justify-between gap-4 border-b pb-[22px] ${dark ? "border-white/5" : "border-slate-200"}`}>
        <div className="max-w-lg">
          <h2 className={`text-3xl font-bold tracking-tight mb-1.5 ${dark ? "text-white" : "text-slate-900"}`}>
            {isGeneralDashboard ? "General Dashboard" : barangayName}
          </h2>
          <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
            {isGeneralDashboard ? "Overview of all barangays in Tanza, Cavite" : `Detailed statistics for ${barangayName}`}
          </p>
        </div>
      </header>

      <section>
        <SectionHeader no="01" title="Overview" theme={theme} />
        <div className={`rounded-xl border ${dark ? "border-white/[0.06] bg-[#1e293b]" : "border-slate-200 bg-white"}`}>
          <div className={`flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x ${dark ? "divide-white/[0.06]" : "divide-slate-200"}`}>
            {stats.map(({ label, Icon }) => (
              <div key={label} className="flex-1 min-w-0" style={{ padding: "16px 22px" }}>
                <p className={`flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.11em] ${muted}`} style={{ marginBottom: 8 }}>
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </p>
                <Bone className="h-[1.3rem] w-28" />
                <Bone className="h-3 w-36" style={{ marginTop: 9 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionHeader no="02" title="Trends & Composition" theme={theme} />
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-[18px]">
          <Panel theme={theme} title="Crime Trend" subtitle="Monthly incident activity" bodyClassName="justify-center" footer={footer}>
            <div className="flex items-end" style={{ height: 240, gap: 3 }}>
              {areaHeights.map((h, i) => (
                <div key={i} className={`flex-1 rounded-t-[3px] ${bone}`} style={{ height: `${h}%`, opacity: 0.7 }} />
              ))}
            </div>
          </Panel>
          <Panel theme={theme} title="Crime Distribution" subtitle="Share of incidents by type" footer={footer}>
            <div className="flex-1 flex flex-col justify-between">
              {rankWidths.map((w, i) => (
                <div key={i} className="flex items-center" style={{ gap: 10, padding: "6px 0" }}>
                  <div className="w-[38%] shrink-0 flex justify-end">
                    <Bone className="h-3" style={{ width: `${60 + ((i * 17) % 35)}%` }} />
                  </div>
                  <div className={`flex-1 h-[18px] rounded-[3px] overflow-hidden ${track}`}>
                    <div className={`h-full rounded-[3px] ${bone}`} style={{ width: `${w}%` }} />
                  </div>
                  <Bone className="h-3 w-8" />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <section>
        <SectionHeader no="03" title="Recent Activity" theme={theme} />
        <div className={`rounded-xl border overflow-hidden ${dark ? "border-white/[0.06] bg-[#1e293b]" : "border-slate-200 bg-white"}`}>
          <div className={`flex items-center justify-between border-b ${dark ? "border-white/[0.06]" : "border-slate-100"}`} style={{ padding: "16px 22px" }}>
            <Bone className="h-3.5 w-48" />
            <Bone className="h-3.5 w-20" />
          </div>
          <div style={{ padding: "6px 22px 14px" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-6 gap-4 items-center" style={{ padding: "13px 0" }}>
                {[1, 2, 3, 4, 5, 6].map((j) => (
                  <Bone key={j} className="h-3.5" style={{ width: `${55 + ((i * j * 13) % 40)}%` }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function OverviewTab({ barangayName }: OverviewTabProps) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { stats, activity, crimesByType, incidents, loading } = useDashboardData(barangayName);
  const { barangayCrimeCounts } = useThreatLevels();
  const router = useRouter();
  const { tooltip, bind, hide } = useChartTooltip(theme);
  // Hover focus: the hovered bar / row stays sharp while the rest recede.
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Determine if this is general dashboard or specific barangay
  const isGeneralDashboard = !barangayName || barangayName === "General Dashboard";

  if (loading) {
    return <OverviewSkeleton theme={theme} isGeneralDashboard={isGeneralDashboard} barangayName={barangayName} />;
  }

  // Jump to this case in the Cases view (it selects the case and opens its details).
  // Carries the barangay along so a barangay-scoped overview lands on the same scope.
  const openCase = (id: string, newTab: boolean) => {
    const params = new URLSearchParams({ case: id });
    if (!isGeneralDashboard) params.set("name", barangayName);
    const href = `/dashboard/cases?${params}`;
    if (newTab) window.open(href, "_blank");
    else router.push(href);
  };

  // Most frequent crime type
  const sortedTypes = [...(crimesByType || [])].sort((a, b) => b.count - a.count);
  const totalCrimesCount = sortedTypes.reduce((sum, item) => sum + item.count, 0);
  const topType = sortedTypes[0];
  const mostFrequentCrime = topType?.type || "N/A";
  const topTypePercent = totalCrimesCount > 0 && topType ? Math.round((topType.count / totalCrimesCount) * 100) : 0;

  // Format time to 12-hour with AM/PM
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return "N/A";

    // If timeString is in HH:MM or HH:MM:SS format
    const parts = timeString.split(":");
    if (parts.length >= 2) {
      const hour = parseInt(parts[0]);
      const minute = parts[1];

      if (hour === 0) return `12:${minute} AM`;
      if (hour < 12) return `${hour}:${minute} AM`;
      if (hour === 12) return `12:${minute} PM`;
      return `${hour - 12}:${minute} PM`;
    }

    return timeString;
  };

  // Critical area: the barangay with the most incidents (or the one being viewed)
  const criticalArea = isGeneralDashboard
    ? Object.entries(barangayCrimeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
    : barangayName;
  const criticalCount = isGeneralDashboard ? (barangayCrimeCounts[criticalArea] ?? 0) : 0;

  // ─── Activity/Trend Area Chart Data ───
  const activityChartData = activity.map((val, i) => ({
    month: MONTH_LABELS[i] || `M${i + 1}`,
    incidents: val,
  }));
  const peakMonthIndex = activity.reduce((best, v, i) => (v > activity[best] ? i : best), 0);
  const peakMonthCount = activity[peakMonthIndex] ?? 0;

  const chartColor = dark ? ACCENT_CSS : ACCENT_DEEP_CSS;
  const activityChartConfig: ChartConfig = {
    incidents: { label: "Incidents", color: chartColor },
  };

  // ─── Crime Distribution (top types, ranked) ───
  const distribution = sortedTypes.slice(0, 6);
  const distributionMax = Math.max(...distribution.map((d) => d.count), 1);

  const mutedText = dark ? "text-slate-400" : "text-slate-500";
  const labelClass = `flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.11em] ${mutedText}`;
  const valueClass = `text-[1.3rem] font-bold leading-[1.15] break-words ${dark ? "text-white" : "text-slate-900"}`;

  return (
    <div className="max-w-[1180px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header
        className={`flex flex-wrap items-end justify-between gap-4 border-b pb-[22px] ${dark ? "border-white/5" : "border-slate-200"}`}
      >
        <div className="max-w-lg">
          <h2 className={`text-3xl font-bold tracking-tight mb-1.5 ${dark ? "text-white" : "text-slate-900"}`}>
            {isGeneralDashboard ? "General Dashboard" : barangayName}
          </h2>
          <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
            {isGeneralDashboard
              ? "Overview of all barangays in Tanza, Cavite"
              : `Detailed statistics for ${barangayName}`}
          </p>
        </div>
        {!isGeneralDashboard && (
          <span
            className={`rounded-md px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.11em] ${
              dark ? "bg-sky-400/10 text-sky-300" : "bg-sky-50 text-sky-700"
            }`}
          >
            Barangay view
          </span>
        )}
      </header>

      {/* ═══ 01 Overview ═══ */}
      <section data-tour="overview-stats">
        <SectionHeader no="01" title="Overview" theme={theme} />
        {/* One bordered surface with hairline dividers, like Analytics, instead of
            separate shadowed cards. */}
        <div className={`rounded-xl border ${dark ? "border-white/[0.06] bg-[#1e293b]" : "border-slate-200 bg-white"}`}>
          <div
            className={`flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x ${dark ? "divide-white/[0.06]" : "divide-slate-200"}`}
          >
            <div className="flex-1 min-w-0" style={{ padding: "16px 22px" }}>
              <p className={labelClass} style={{ marginBottom: 8 }}>
                <ShieldAlert className="h-3.5 w-3.5" />
                Total Crimes (All Time)
              </p>
              <p className={valueClass}>{stats.totalCrimes.toLocaleString()}</p>
              <p className={`text-[0.78rem] ${mutedText}`} style={{ marginTop: 5 }}>
                Recorded incidents
              </p>
            </div>

            <div className="flex-1 min-w-0" style={{ padding: "16px 22px" }}>
              <p className={labelClass} style={{ marginBottom: 8 }}>
                <BarChart3 className="h-3.5 w-3.5" />
                Most Frequent Crime Type
              </p>
              <p className={valueClass}>{mostFrequentCrime}</p>
              <p className={`text-[0.78rem] ${mutedText}`} style={{ marginTop: 5 }}>
                {topType ? `${topType.count.toLocaleString()} incidents · ${topTypePercent}% of total` : "No data"}
              </p>
            </div>

            {/* Critical Area — General Dashboard Only */}
            {isGeneralDashboard && (
              <div className="flex-1 min-w-0" style={{ padding: "16px 22px" }}>
                <p className={labelClass} style={{ marginBottom: 8 }}>
                  <MapPin className="h-3.5 w-3.5" />
                  Critical Area
                </p>
                <p className={valueClass}>{criticalArea}</p>
                <p className={`text-[0.78rem] ${mutedText}`} style={{ marginTop: 5 }}>
                  {criticalCount > 0 ? `${criticalCount.toLocaleString()} incidents · most in Tanza` : "Most incidents in Tanza"}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ 02 Trends & Composition ═══ */}
      <section data-tour="overview-charts">
        <SectionHeader no="02" title="Trends & Composition" theme={theme} />
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-[18px]">
          <div data-tour="overview-trend" className="flex flex-col">
            <Panel
              theme={theme}
              title="Crime Trend"
              subtitle="Monthly incident activity"
              className="flex-1"
              footer={
                <>
                  <div className="flex items-center gap-2 font-semibold leading-none">
                    {peakMonthCount > 0
                      ? `Peaked in ${MONTH_LABELS[peakMonthIndex]} with ${peakMonthCount.toLocaleString()} incidents`
                      : "No incidents recorded in this period"}
                  </div>
                  <div className={mutedText}>{isGeneralDashboard ? "All barangays" : barangayName}</div>
                </>
              }
            >
              <ChartContainer config={activityChartConfig} className="aspect-auto h-[240px] w-full">
                <AreaChart data={activityChartData} margin={{ left: 0, right: 12, top: 12, bottom: 4 }}>
                  <defs>
                    <linearGradient id="overviewGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={chartColor} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: dark ? "#64748b" : "#94a3b8", fontWeight: 500 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: dark ? "#64748b" : "#94a3b8" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                  <Area
                    type="natural"
                    dataKey="incidents"
                    stroke={chartColor}
                    strokeWidth={2.5}
                    fill="url(#overviewGradient)"
                    dot={{ r: 3.5, fill: chartColor, stroke: dark ? "#1e293b" : "#ffffff", strokeWidth: 2 }}
                    activeDot={{ r: 5.5, fill: chartColor, stroke: dark ? "#1e293b" : "#ffffff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ChartContainer>
            </Panel>
          </div>

          <div data-tour="overview-distribution" className="flex flex-col">
            <Panel
              theme={theme}
              title="Crime Distribution"
              subtitle="Share of incidents by type"
              className="flex-1"
              footer={
                <>
                  <div className="flex items-center gap-2 font-semibold leading-none">
                    {topType ? `${mostFrequentCrime} accounts for ${topTypePercent}% of incidents` : "No incidents recorded"}
                  </div>
                  <div className={mutedText}>{totalCrimesCount.toLocaleString()} total incidents recorded</div>
                </>
              }
            >
              {distribution.length > 0 ? (
                <div
                  className="flex-1 flex flex-col justify-between"
                  onMouseLeave={() => {
                    setHoveredBar(null);
                    hide();
                  }}
                >
                  {distribution.map((item, i) => {
                    const share = totalCrimesCount > 0 ? Math.round((item.count / totalCrimesCount) * 100) : 0;
                    const fill = rampCss(item.count / distributionMax, theme);
                    const dimmed = hoveredBar !== null && hoveredBar !== i;
                    return (
                      <div
                        key={item.type}
                        className="flex items-center transition-opacity"
                        style={{ gap: 10, padding: "6px 0", opacity: dimmed ? 0.4 : 1 }}
                        {...bind(
                          {
                            title: item.type,
                            rows: [
                              { label: "Incidents", value: item.count.toLocaleString(), swatch: fill },
                              { label: "Share", value: `${share}%` },
                              { label: "Rank", value: `${i + 1} of ${distribution.length}` },
                            ],
                          },
                          () => setHoveredBar(i)
                        )}
                      >
                        <div
                          className={`w-[38%] shrink-0 text-right truncate ${dark ? "text-slate-300" : "text-slate-600"}`}
                          style={{ fontSize: "0.78rem" }}
                        >
                          {item.type}
                        </div>
                        <div className={`flex-1 h-[18px] rounded-[3px] overflow-hidden ${dark ? "bg-sky-400/10" : "bg-sky-50"}`}>
                          <div
                            className="h-full rounded-[3px]"
                            style={{
                              width: `${Math.max((item.count / distributionMax) * 100, 2)}%`,
                              background: fill,
                            }}
                          />
                        </div>
                        <div
                          className={`w-9 shrink-0 text-right text-[0.78rem] font-semibold tabular-nums ${dark ? "text-slate-300" : "text-slate-600"}`}
                        >
                          {share}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-[160px] flex items-center justify-center text-slate-500">No distribution data</div>
              )}
            </Panel>
          </div>
        </div>
      </section>

      {/* ═══ 03 Recent Activity ═══ */}
      <section data-tour="overview-activity-table">
        <SectionHeader no="03" title="Recent Activity" theme={theme} />
        <div className={`rounded-xl border overflow-hidden ${dark ? "border-white/[0.06] bg-[#1e293b]" : "border-slate-200 bg-white"}`}>
          <div
            className={`flex items-center justify-between border-b ${dark ? "border-white/[0.06]" : "border-slate-100"}`}
            style={{ padding: "16px 22px" }}
          >
            <p className={`text-[0.78rem] ${mutedText}`}>Most recently committed incidents</p>
            <Link
              data-tour="overview-view-cases"
              href={`/dashboard/cases${barangayName && barangayName !== "General Dashboard" ? `?name=${encodeURIComponent(barangayName)}` : ""}`}
              className="text-[0.8rem] font-semibold text-sky-600 transition-colors hover:text-sky-500 dark:text-sky-400"
            >
              View Cases →
            </Link>
          </div>
          <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
            <table className="w-full text-[0.8rem] text-left">
              <thead
                className={`sticky top-0 z-10 text-[0.68rem] font-bold uppercase tracking-[0.11em] ${
                  dark ? "bg-[#1e293b] text-slate-400" : "bg-white text-slate-500"
                }`}
              >
                <tr className={`border-b ${dark ? "border-white/[0.06]" : "border-slate-100"}`}>
                  <th className="px-[22px] py-3">Type</th>
                  <th className="px-[22px] py-3">Location</th>
                  <th className="px-[22px] py-3">Time Reported</th>
                  <th className="px-[22px] py-3">Date Committed</th>
                  <th className="px-[22px] py-3">Time Committed</th>
                  <th className="px-[22px] py-3">Status</th>
                  <th className="w-10 px-3 py-3" aria-hidden />
                </tr>
              </thead>
              <tbody
                className={`divide-y ${dark ? "divide-white/[0.06]" : "divide-slate-100"}`}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {incidents.length === 0 && (
                  <tr>
                    <td colSpan={7} className={`px-[22px] py-10 text-center ${mutedText}`}>
                      No incidents recorded
                    </td>
                  </tr>
                )}
                {incidents.map((incident) => (
                  <tr
                    key={incident.id}
                    role="link"
                    tabIndex={0}
                    title="Open in Cases"
                    onMouseEnter={() => setHoveredRow(incident.id)}
                    onFocus={() => setHoveredRow(incident.id)}
                    onBlur={() => setHoveredRow(null)}
                    onClick={(e) => openCase(incident.id, e.ctrlKey || e.metaKey)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openCase(incident.id, e.ctrlKey || e.metaKey);
                      }
                    }}
                    className={`cursor-pointer outline-none transition-[opacity,background-color] ${
                      hoveredRow === incident.id ? (dark ? "bg-sky-400/[0.07]" : "bg-sky-50") : ""
                    } ${hoveredRow !== null && hoveredRow !== incident.id ? "opacity-50" : ""}`}
                  >
                    <td className={`px-[22px] py-3 font-semibold ${dark ? "text-slate-100" : "text-slate-900"}`}>
                      {incident.type}
                    </td>
                    <td className={`px-[22px] py-3 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 opacity-50" />
                        {incident.location}
                      </div>
                    </td>
                    <td className={`px-[22px] py-3 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 opacity-50" />
                        {formatTime(incident.timeReported)}
                      </div>
                    </td>
                    <td className={`px-[22px] py-3 tabular-nums ${dark ? "text-slate-400" : "text-slate-600"}`}>
                      {incident.dateCommitted ? new Date(incident.dateCommitted).toLocaleDateString() : "N/A"}
                    </td>
                    <td className={`px-[22px] py-3 ${dark ? "text-slate-400" : "text-slate-600"}`}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 opacity-50" />
                        {formatTime(incident.timeCommitted)}
                      </div>
                    </td>
                    <td className="px-[22px] py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          incident.status === "Cleared"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : incident.status === "Under Investigation"
                              ? "bg-blue-500/10 text-blue-500"
                              : incident.status === "Filed in Court"
                                ? "bg-purple-500/10 text-purple-500"
                                : incident.status === "Archived"
                                  ? "bg-slate-500/10 text-slate-500"
                                  : "bg-yellow-500/10 text-yellow-600"
                        }`}
                      >
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <ChevronRight
                        className={`ml-auto h-4 w-4 transition-all ${
                          hoveredRow === incident.id
                            ? "translate-x-0 text-sky-500 opacity-100"
                            : "-translate-x-1 opacity-0"
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {tooltip}
    </div>
  );
}
