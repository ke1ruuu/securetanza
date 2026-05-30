"use client";

import React, { useState } from "react";
import { TrendingUp, TrendingDown, BarChart3, Clock, HelpCircle, Shield } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Line,
  LineChart,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useTheme } from "@/context/ThemeContext";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useCrimeMatrix } from "@/hooks/useCrimeMatrix";
import { useModusAndPlace } from "@/hooks/useModusAndPlace";
import CrimeMatrixChart from "./crime-matrix-chart";

interface AnalyticsTabProps {
  barangayName: string;
}

// Month labels
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Chart color palette - vibrant, distinguishable colors
const BAR_COLORS = [
  "hsl(220, 90%, 56%)", // Blue
  "hsl(340, 82%, 52%)", // Rose
  "hsl(142, 72%, 45%)", // Green
  "hsl(38, 92%, 50%)", // Amber
  "hsl(262, 83%, 58%)", // Purple
  "hsl(174, 72%, 40%)", // Teal
  "hsl(12, 86%, 55%)", // Red-orange
  "hsl(198, 93%, 60%)", // Sky
];

export default function AnalyticsTab({ barangayName }: AnalyticsTabProps) {
  const { theme } = useTheme();
  
  const {
    crimesByType,
    crimesByMonth,
    crimesByBarangay,
    timePatterns,
    trends,
    loading,
  } = useAnalyticsData(barangayName);
  
  const { matrixData, loading: matrixLoading } = useCrimeMatrix(barangayName);
  const { modusList, placesList, loading: modusPlaceLoading } = useModusAndPlace(barangayName);

  const isGeneralDashboard =
    !barangayName || barangayName === "General Dashboard";

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl h-64 ${theme === "dark" ? "bg-white/5" : "bg-white"}`}
            >
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Crime Types Bar Chart Data ───
  const crimeTypeBarData = crimesByType.slice(0, 8).map((crime, index) => ({
    type: crime.type.length > 18 ? crime.type.slice(0, 16) + "…" : crime.type,
    fullType: crime.type,
    count: crime.count,
    fill: BAR_COLORS[index % BAR_COLORS.length],
  }));

  const crimeTypeChartConfig: ChartConfig = {
    count: { label: "Incidents", color: "hsl(220, 90%, 56%)" },
  };

  // ─── Monthly Line Chart Data ───
  const monthlyLineData = crimesByMonth.map((m) => ({
    month: MONTH_LABELS[m.month - 1] || `M${m.month}`,
    incidents: m.count,
  }));

  const monthlyChartConfig: ChartConfig = {
    incidents: { label: "Incidents", color: "hsl(220, 90%, 56%)" },
  };

  // ─── Barangay Comparison Bar Data ───
  const barangayBarData = crimesByBarangay.slice(0, 10).map((b, index) => ({
    barangay:
      b.barangay.length > 14 ? b.barangay.slice(0, 12) + "…" : b.barangay,
    fullBarangay: b.barangay,
    count: b.count,
    fill: BAR_COLORS[index % BAR_COLORS.length],
  }));

  const barangayChartConfig: ChartConfig = {
    count: { label: "Crimes", color: "hsl(12, 86%, 55%)" },
  };

  // ─── Modus Bar Chart Data ───
  const modusBarData = modusList.map((item, index) => ({
    modus: item.modus.length > 20 ? item.modus.slice(0, 18) + "…" : item.modus,
    fullModus: item.modus,
    count: item.count,
    fill: BAR_COLORS[index % BAR_COLORS.length],
  }));

  const modusChartConfig: ChartConfig = {
    count: { label: "Incidents", color: "hsl(174, 72%, 40%)" },
  };

  // ─── Type of Place Bar Chart Data ───
  const placeBarData = placesList.map((item, index) => ({
    place: item.place.length > 20 ? item.place.slice(0, 18) + "…" : item.place,
    fullPlace: item.place,
    count: item.count,
    fill: BAR_COLORS[index % BAR_COLORS.length],
  }));

  const placeChartConfig: ChartConfig = {
    count: { label: "Incidents", color: "hsl(38, 92%, 50%)" },
  };

  // Format hour to 12-hour with AM/PM
  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };

  // ─── Hourly Heatmap Data ───
  const hourlyData = timePatterns.hourlyDistribution.map((count, hour) => ({
    hour: formatHour(hour),
    incidents: count,
  }));

  console.log('📊 Hourly Data for Chart:', {
    hourlyDistribution: timePatterns.hourlyDistribution,
    hourlyData,
    totalIncidents: hourlyData.reduce((sum, d) => sum + d.incidents, 0)
  });

  const hourlyChartConfig: ChartConfig = {
    incidents: { label: "Incidents", color: "hsl(262, 83%, 58%)" },
  };

  // ─── Total incidents for footer stats ───
  const totalIncidents = crimesByType.reduce((sum, c) => sum + c.count, 0);
  const topCrimeType = crimesByType[0]?.type || "N/A";
  const topCrimePercent =
    totalIncidents > 0
      ? Math.round((crimesByType[0]?.count / totalIncidents) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Header */}
      <div
        className={`border-b pb-6 ${theme === "dark" ? "border-white/5" : "border-slate-200"}`}
      >
        <div>
          <h2
            className={`text-2xl font-black uppercase tracking-wider ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            Crime Analytics
          </h2>
          <p className="text-slate-500 text-base mt-2 font-medium">
            Comprehensive analysis and insights for{" "}
            {isGeneralDashboard ? "all barangays in Tanza" : barangayName}
          </p>
        </div>
      </div>
      {/* Trend Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Overall Trend Card */}
        <Card
          className={`border-0 shadow-lg ${theme === "dark" ? "bg-gradient-to-br from-blue-500/10 to-blue-600/5" : "bg-gradient-to-br from-blue-50 to-blue-100"}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-bold uppercase tracking-wider ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
                  >
                    Crime Trend
                  </p>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="cursor-help">
                        <HelpCircle className={`h-3.5 w-3.5 ${theme === "dark" ? "text-blue-400/60" : "text-blue-600/60"}`} />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className={`w-80 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
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
                            trends.trendDirection === 'improved' 
                              ? "text-emerald-500"
                              : trends.trendDirection === 'worsened'
                                ? "text-red-500"
                                : "text-slate-500"
                          }`}>
                            Result: {trends.trendDirection === 'improved' 
                              ? `Decreased by ${Math.abs(trends.monthlyChange)}%`
                              : trends.trendDirection === 'worsened'
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
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <p
                  className={`text-2xl font-black ${
                    trends.trendDirection === 'improved' 
                      ? theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                      : trends.trendDirection === 'worsened'
                        ? theme === "dark" ? "text-red-400" : "text-red-600"
                        : theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  {trends.trendDirection === 'improved' 
                    ? "Decreased"
                    : trends.trendDirection === 'worsened'
                      ? "Increased"
                      : "Stable"}
                </p>
                <p className={`text-xs mt-1 font-medium ${
                  trends.trendDirection === 'improved' 
                    ? "text-emerald-500"
                    : trends.trendDirection === 'worsened'
                      ? "text-red-500"
                      : "text-slate-500"
                }`}>
                  {trends.trendDirection === 'improved' 
                    ? `↓ ${Math.abs(trends.monthlyChange)}% less crimes`
                    : trends.trendDirection === 'worsened'
                      ? `↑ ${Math.abs(trends.monthlyChange)}% more crimes`
                      : "No change in last 30 days"}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl ${
                  trends.trendDirection === 'improved'
                    ? theme === "dark" ? "bg-emerald-500/20" : "bg-emerald-100"
                    : trends.trendDirection === 'worsened'
                      ? theme === "dark" ? "bg-red-500/20" : "bg-red-100"
                      : theme === "dark" ? "bg-slate-500/20" : "bg-slate-100"
                }`}
              >
                {trends.trendDirection === 'worsened' ? (
                  <TrendingUp
                    className={`h-6 w-6 ${theme === "dark" ? "text-red-400" : "text-red-600"}`}
                  />
                ) : trends.trendDirection === 'improved' ? (
                  <TrendingDown
                    className={`h-6 w-6 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}
                  />
                ) : (
                  <Shield
                    className={`h-6 w-6 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours Card */}
        <Card
          className={`border-0 shadow-lg ${theme === "dark" ? "bg-gradient-to-br from-purple-500/10 to-purple-600/5" : "bg-gradient-to-br from-purple-50 to-purple-100"}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-bold uppercase tracking-wider ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}
                  >
                    Peak Hours
                  </p>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="cursor-help">
                        <HelpCircle className={`h-3.5 w-3.5 ${theme === "dark" ? "text-purple-400/60" : "text-purple-600/60"}`} />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className={`w-80 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
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
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <p
                  className={`text-2xl font-black ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  {formatHour(timePatterns.peakHour)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Most incidents</p>
              </div>
              <div
                className={`p-3 rounded-xl ${theme === "dark" ? "bg-purple-500/20" : "bg-purple-100"}`}
              >
                <Clock
                  className={`h-6 w-6 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resolution Rate Card */}
        <Card
          className={`border-0 shadow-lg ${theme === "dark" ? "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5" : "bg-gradient-to-br from-emerald-50 to-emerald-100"}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-bold uppercase tracking-wider ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}
                  >
                    Resolution Rate
                  </p>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="cursor-help">
                        <HelpCircle className={`h-3.5 w-3.5 ${theme === "dark" ? "text-emerald-400/60" : "text-emerald-600/60"}`} />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className={`w-80 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
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
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <p
                  className={`text-2xl font-black ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  {trends.resolutionRate}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Cases cleared</p>
              </div>
              <div
                className={`p-3 rounded-xl ${theme === "dark" ? "bg-emerald-500/20" : "bg-emerald-100"}`}
              >
                <BarChart3
                  className={`h-6 w-6 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Index Card */}
        <Card
          className={`border-0 shadow-lg ${theme === "dark" ? "bg-gradient-to-br from-amber-500/10 to-amber-600/5" : "bg-gradient-to-br from-amber-50 to-amber-100"}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-bold uppercase tracking-wider ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`}
                  >
                    Safety Index
                  </p>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="cursor-help">
                        <HelpCircle className={`h-3.5 w-3.5 ${theme === "dark" ? "text-amber-400/60" : "text-amber-600/60"}`} />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className={`w-80 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
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
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <p
                  className={`text-2xl font-black ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  {trends.safetyIndex}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Overall safety</p>
              </div>
              <div
                className={`p-3 rounded-xl ${theme === "dark" ? "bg-amber-500/20" : "bg-amber-100"}`}
              >
                <svg className={`h-6 w-6 ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Grid */}
      <div className={`grid gap-6 sm:gap-8 ${isGeneralDashboard ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1 xl:grid-cols-[1fr_1fr]'}`}>
        {/* ═══════════════════════════════════════════════════ */}
        {/* LEFT COLUMN: Time Patterns (Full height for specific barangay) */}
        {/* ═══════════════════════════════════════════════════ */}
        <Card
          className={`border-0 shadow-lg ${theme === "dark" ? "bg-[#1e293b]" : "bg-white"} ${!isGeneralDashboard ? 'lg:row-span-2' : ''} flex flex-col`}
        >
          <CardHeader className="items-center">
            <CardTitle
              className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            >
              Time Patterns
            </CardTitle>
            <p className="text-sm text-slate-500">
              Incident frequency by hour of day
            </p>
          </CardHeader>
          <CardContent className="flex justify-center flex-1">
            <div id="chart-hourly-distribution" className="w-full">
              <ChartContainer
                config={hourlyChartConfig}
                className={`mx-auto aspect-square w-full pb-4 ${!isGeneralDashboard ? 'max-h-[680px]' : 'max-h-[320px]'}`}
              >
              <RadarChart 
                data={hourlyData}
                width={500}
                height={500}
                margin={{ top: 24, right: 24, bottom: 24, left: 24 }}
              >
                <PolarGrid
                  stroke={theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}
                />
                <PolarAngleAxis
                  dataKey="hour"
                  tick={{
                    fontSize: 11,
                    fill: theme === "dark" ? "#64748b" : "#94a3b8",
                    fontWeight: 500,
                  }}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  tick={false}
                  axisLine={false}
                />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Radar
                  name="Incidents"
                  dataKey="incidents"
                  stroke="hsl(262, 83%, 58%)"
                  strokeWidth={2}
                  fill="hsl(262, 83%, 58%)"
                  fillOpacity={0.5}
                  dot={{
                    r: 3.5,
                    fill: "hsl(262, 83%, 58%)",
                    stroke: theme === "dark" ? "#1e293b" : "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </RadarChart>
            </ChartContainer>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 text-sm px-6 pb-6">
            <div className="flex items-center gap-2 font-semibold leading-none">
              Peak activity at {formatHour(timePatterns.peakHour)}
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
            <div className="text-muted-foreground leading-none">
              24-hour incident distribution
            </div>
          </CardFooter>
        </Card>

        {/* ═══════════════════════════════════════════════════ */}
        {/* RIGHT COLUMN: Crime Types Distribution             */}
        {/* ═══════════════════════════════════════════════════ */}
        <Card
          className={`border-0 shadow-lg ${theme === "dark" ? "bg-[#1e293b]" : "bg-white"} flex flex-col`}
        >
          <CardHeader>
            <CardTitle
              className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            >
              Crime Types Distribution
            </CardTitle>
            <p className="text-sm text-slate-500">
              Most common incident categories
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            {crimeTypeBarData.length > 0 ? (
              <ChartContainer
                config={crimeTypeChartConfig}
                className="aspect-auto h-[320px] w-full"
              >
                <BarChart
                  data={crimeTypeBarData}
                  layout="vertical"
                  margin={{ left: 8, right: 40, top: 4, bottom: 4 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke={
                      theme === "dark"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.06)"
                    }
                  />
                  <YAxis
                    dataKey="type"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={110}
                    tick={{
                      fontSize: 12,
                      fill: theme === "dark" ? "#94a3b8" : "#64748b",
                      fontWeight: 500,
                    }}
                  />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 11,
                      fill: theme === "dark" ? "#64748b" : "#94a3b8",
                    }}
                  />
                  <ChartTooltip
                    cursor={{
                      fill:
                        theme === "dark"
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.04)",
                    }}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, name, item) => (
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 rounded-[2px]"
                              style={{ backgroundColor: item.payload?.fill }}
                            />
                            <span className="text-muted-foreground">
                              {item.payload?.fullType}
                            </span>
                            <span className="ml-auto font-mono font-bold tabular-nums">
                              {(value as number).toLocaleString()}
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-slate-500">
                No crime type data available
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 text-sm px-6 pb-6">
            <div className="flex items-center gap-2 font-semibold leading-none">
              {topCrimeType} accounts for {topCrimePercent}% of all incidents
            </div>
            <div className="text-muted-foreground leading-none">
              {totalIncidents.toLocaleString()} total incidents recorded
            </div>
          </CardFooter>
        </Card>

        {/* ═══════════════════════════════════════════════════ */}
        {/* Monthly Crime Trends — Line Chart with Area        */}
        {/* ═══════════════════════════════════════════════════ */}
        <Card
          className={`border-0 shadow-lg ${theme === "dark" ? "bg-[#1e293b]" : "bg-white"} flex flex-col`}
        >
          <CardHeader>
            <CardTitle
              className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
            >
              Monthly Crime Trends
            </CardTitle>
            <p className="text-sm text-slate-500">
              Incident patterns over time
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={monthlyChartConfig}
              className="aspect-auto h-[320px] w-full"
            >
              <AreaChart
                data={monthlyLineData}
                margin={{ left: 4, right: 12, top: 12, bottom: 4 }}
              >
                <defs>
                  <linearGradient
                    id="monthlyGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="hsl(220, 90%, 56%)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(220, 90%, 56%)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={
                    theme === "dark"
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.06)"
                  }
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 12,
                    fill: theme === "dark" ? "#64748b" : "#94a3b8",
                    fontWeight: 500,
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 11,
                    fill: theme === "dark" ? "#64748b" : "#94a3b8",
                  }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  type="natural"
                  dataKey="incidents"
                  stroke="hsl(220, 90%, 56%)"
                  strokeWidth={2.5}
                  fill="url(#monthlyGradient)"
                  dot={{
                    r: 4,
                    fill: "hsl(220, 90%, 56%)",
                    stroke: theme === "dark" ? "#1e293b" : "#ffffff",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "hsl(220, 90%, 56%)",
                    stroke: theme === "dark" ? "#1e293b" : "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 text-sm px-6 pb-6">
            <div className="flex items-center gap-2 font-semibold leading-none">
              {trends.trendDirection === 'worsened' ? (
                <>
                  Crime increased by {Math.abs(trends.monthlyChange)}% vs previous quarter{" "}
                  <TrendingUp className="h-4 w-4 text-red-500" />
                </>
              ) : trends.trendDirection === 'improved' ? (
                <>
                  Crime decreased by {Math.abs(trends.monthlyChange)}% vs previous quarter{" "}
                  <TrendingDown className="h-4 w-4 text-emerald-500" />
                </>
              ) : (
                <>No change vs previous quarter</>
              )}
            </div>
            <div className="text-muted-foreground leading-none">
              {isGeneralDashboard ? "All barangays" : barangayName} — {trends.currentQuarterLabel}
            </div>
          </CardFooter>
        </Card>

        {/* ═══════════════════════════════════════════════════ */}
        {/* Barangay Comparison — Only for General Dashboard   */}
        {/* ═══════════════════════════════════════════════════ */}
        {isGeneralDashboard && (
          <Card
            className={`border-0 shadow-lg ${theme === "dark" ? "bg-[#1e293b]" : "bg-white"} flex flex-col`}
          >
            <CardHeader>
              <CardTitle
                className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
              >
                Barangay Comparison
              </CardTitle>
              <p className="text-sm text-slate-500">
                Crime distribution across areas
              </p>
            </CardHeader>
            <CardContent className="flex-1">
              {barangayBarData.length > 0 ? (
                <ChartContainer
                  config={barangayChartConfig}
                  className="aspect-auto h-[320px] w-full"
                >
                  <BarChart
                    data={barangayBarData}
                    layout="vertical"
                    margin={{ left: 8, right: 40, top: 4, bottom: 4 }}
                  >
                    <CartesianGrid
                      horizontal={false}
                      stroke={
                        theme === "dark"
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.06)"
                      }
                    />
                    <YAxis
                      dataKey="barangay"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      width={100}
                      tick={{
                        fontSize: 12,
                        fill: theme === "dark" ? "#94a3b8" : "#64748b",
                        fontWeight: 500,
                      }}
                    />
                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fontSize: 11,
                        fill: theme === "dark" ? "#64748b" : "#94a3b8",
                      }}
                    />
                    <ChartTooltip
                      cursor={{
                        fill:
                          theme === "dark"
                            ? "rgba(255,255,255,0.04)"
                            : "rgba(0,0,0,0.04)",
                      }}
                      content={
                        <ChartTooltipContent
                          hideLabel
                          formatter={(value, name, item) => (
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2.5 w-2.5 rounded-[2px]"
                                style={{ backgroundColor: item.payload?.fill }}
                              />
                              <span className="text-muted-foreground">
                                {item.payload?.fullBarangay}
                              </span>
                              <span className="ml-auto font-mono font-bold tabular-nums">
                                {(value as number).toLocaleString()}
                              </span>
                            </div>
                          )}
                        />
                      }
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={22} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="h-[320px] flex items-center justify-center text-slate-500">
                  No barangay comparison data available
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-1 text-sm px-6 pb-6">
              <div className="flex items-center gap-2 font-semibold leading-none">
                {barangayBarData[0]?.fullBarangay || "N/A"} has the highest crime
                count
              </div>
              <div className="text-muted-foreground leading-none">
                Top {barangayBarData.length} barangays shown
              </div>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* Modus and Type of Place Charts                     */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="grid gap-6 sm:gap-8 grid-cols-1 xl:grid-cols-2">
        {/* ═══════════════════════════════════════════════════ */}
        {/* Crime Modus (Method of Operation)                  */}
        {/* ═══════════════════════════════════════════════════ */}
        <Card
          className={`border-0 shadow-lg ${theme === "dark" ? "bg-[#1e293b]" : "bg-white"} flex flex-col`}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle
                className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
              >
                Crime Modus Operandi
              </CardTitle>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="cursor-help">
                    <HelpCircle className={`h-3.5 w-3.5 ${theme === "dark" ? "text-slate-400/60" : "text-slate-500/60"}`} />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className={`w-80 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
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
                </HoverCardContent>
              </HoverCard>
            </div>
            <p className="text-sm text-slate-500">
              Most common methods used in crimes
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            {modusPlaceLoading ? (
              <div className="h-[320px] flex items-center justify-center">
                <div className="animate-pulse text-slate-500">Loading...</div>
              </div>
            ) : modusBarData.length > 0 ? (
              <ChartContainer
                config={modusChartConfig}
                className="aspect-auto h-[320px] w-full"
              >
                <BarChart
                  data={modusBarData}
                  margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={
                      theme === "dark"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.06)"
                    }
                  />
                  <XAxis
                    dataKey="modus"
                    tickLine={false}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{
                      fontSize: 11,
                      fill: theme === "dark" ? "#94a3b8" : "#64748b",
                      fontWeight: 500,
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 11,
                      fill: theme === "dark" ? "#64748b" : "#94a3b8",
                    }}
                  />
                  <ChartTooltip
                    cursor={{
                      fill:
                        theme === "dark"
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.04)",
                    }}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, name, item) => (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2.5 w-2.5 rounded-[2px]"
                                style={{ backgroundColor: item.payload?.fill }}
                              />
                              <span className="text-muted-foreground text-xs">
                                {item.payload?.fullModus}
                              </span>
                            </div>
                            <span className="ml-auto font-mono font-bold tabular-nums">
                              {(value as number).toLocaleString()} incidents
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-slate-500">
                No modus data available
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 text-sm px-6 pb-6">
            <div className="flex items-center gap-2 font-semibold leading-none">
              {modusBarData[0]?.fullModus || "N/A"} is the most common method
            </div>
            <div className="text-muted-foreground leading-none">
              Top {modusBarData.length} modus operandi shown
            </div>
          </CardFooter>
        </Card>

        {/* ═══════════════════════════════════════════════════ */}
        {/* Type of Place                                       */}
        {/* ═══════════════════════════════════════════════════ */}
        <Card
          className={`border-0 shadow-lg ${theme === "dark" ? "bg-[#1e293b]" : "bg-white"} flex flex-col`}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle
                className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
              >
                Crime Location Types
              </CardTitle>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button className="cursor-help">
                    <HelpCircle className={`h-3.5 w-3.5 ${theme === "dark" ? "text-slate-400/60" : "text-slate-500/60"}`} />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className={`w-80 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
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
                </HoverCardContent>
              </HoverCard>
            </div>
            <p className="text-sm text-slate-500">
              Where crimes most frequently occur
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            {modusPlaceLoading ? (
              <div className="h-[320px] flex items-center justify-center">
                <div className="animate-pulse text-slate-500">Loading...</div>
              </div>
            ) : placeBarData.length > 0 ? (
              <ChartContainer
                config={placeChartConfig}
                className="aspect-auto h-[320px] w-full"
              >
                <BarChart
                  data={placeBarData}
                  margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={
                      theme === "dark"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.06)"
                    }
                  />
                  <XAxis
                    dataKey="place"
                    tickLine={false}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{
                      fontSize: 11,
                      fill: theme === "dark" ? "#94a3b8" : "#64748b",
                      fontWeight: 500,
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 11,
                      fill: theme === "dark" ? "#64748b" : "#94a3b8",
                    }}
                  />
                  <ChartTooltip
                    cursor={{
                      fill:
                        theme === "dark"
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.04)",
                    }}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, name, item) => (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2.5 w-2.5 rounded-[2px]"
                                style={{ backgroundColor: item.payload?.fill }}
                              />
                              <span className="text-muted-foreground text-xs">
                                {item.payload?.fullPlace}
                              </span>
                            </div>
                            <span className="ml-auto font-mono font-bold tabular-nums">
                              {(value as number).toLocaleString()} incidents
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-slate-500">
                No location type data available
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-1 text-sm px-6 pb-6">
            <div className="flex items-center gap-2 font-semibold leading-none">
              {placeBarData[0]?.fullPlace || "N/A"} is the most common location
            </div>
            <div className="text-muted-foreground leading-none">
              Top {placeBarData.length} location types shown
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* Crime Matrix Heatmap — Full Width                  */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="w-full">
        {matrixLoading ? (
          <Card
            className={`border-0 shadow-lg ${theme === "dark" ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <CardHeader>
              <CardTitle
                className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
              >
                Crime Type Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <div className="animate-pulse text-slate-500">Loading matrix data...</div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <CrimeMatrixChart
            data={matrixData}
            title="Crime Type Matrix"
            description={`Monthly distribution of top crime types ${isGeneralDashboard ? "across all barangays" : `in ${barangayName}`}`}
          />
        )}
      </div>
    </div>
  );
}
