"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  MapPin,
  Clock
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
} from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useTheme } from "@/context/ThemeContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useThreatLevels } from "@/hooks/useThreatLevels";

interface OverviewTabProps {
  barangayName: string;
}

// Month labels for the activity chart
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Pie chart colors
const PIE_COLORS = [
  "hsl(220, 90%, 56%)",   // Blue
  "hsl(340, 82%, 52%)",   // Rose
  "hsl(142, 72%, 45%)",   // Green
  "hsl(38, 92%, 50%)",    // Amber
  "hsl(262, 83%, 58%)",   // Purple
  "hsl(174, 72%, 40%)",   // Teal
  "hsl(12, 86%, 55%)",    // Red-orange
  "hsl(198, 93%, 60%)",   // Sky
];

export default function OverviewTab({ barangayName }: OverviewTabProps) {
  const { theme } = useTheme();
  const { stats, activity, crimesByType, incidents, loading } = useDashboardData(barangayName);
  const { stats: threatStats, barangayCrimeCounts } = useThreatLevels();

  // Determine if this is general dashboard or specific barangay
  const isGeneralDashboard = !barangayName || barangayName === "General Dashboard";

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-6 animate-pulse">
        {/* Dashboard Title Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className={`h-8 w-64 rounded mb-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
            <div className={`h-4 w-96 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
          </div>
        </div>

        {/* Top Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`p-6 rounded-2xl border-0 shadow-lg ${theme === 'dark' ? 'bg-[#1e293b]' : 'bg-white'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                <div className="flex-1">
                  <div className={`h-4 w-32 rounded mb-3 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
                  <div className={`h-10 w-24 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Crime Trend Chart Skeleton */}
          <div className={`lg:col-span-2 p-6 rounded-2xl border-0 shadow-lg ${theme === 'dark' ? 'bg-[#1e293b]' : 'bg-white'}`}>
            <div className={`h-6 w-32 rounded mb-2 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
            <div className={`h-4 w-48 rounded mb-4 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
            <div className={`h-[280px] w-full rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-200'}`}></div>
          </div>

          {/* Crime Distribution Pie Chart Skeleton */}
          <div className={`p-6 rounded-2xl border-0 shadow-lg ${theme === 'dark' ? 'bg-[#1e293b]' : 'bg-white'}`}>
            <div className={`h-6 w-40 rounded mb-4 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
            <div className={`h-[220px] w-full rounded-full mx-auto mb-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-200'}`} style={{ maxWidth: '220px' }}></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
                    <div className={`h-3 w-24 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
                  </div>
                  <div className={`h-3 w-12 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Crime Activity Table Skeleton */}
        <div className={`rounded-2xl border-0 shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-[#1e293b]' : 'bg-white'}`}>
          <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
            <div className={`h-6 w-48 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-6 gap-4">
                <div className={`h-4 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
                <div className={`h-4 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
                <div className={`h-4 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
                <div className={`h-4 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
                <div className={`h-4 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
                <div className={`h-4 rounded ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-300'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate most frequent crime type
  const totalCrimesCount = crimesByType?.reduce((sum, item) => sum + item.count, 0) || 0;
  const mostFrequentCrime = [...(crimesByType || [])].sort((a, b) => b.count - a.count)[0]?.type || "N/A";

  // Format time to 12-hour with AM/PM
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return 'N/A';
    
    // If timeString is in HH:MM or HH:MM:SS format
    const parts = timeString.split(':');
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

  // Find critical area
  let criticalArea = "N/A";
  if (isGeneralDashboard) {
    criticalArea = Object.entries(barangayCrimeCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  } else {
    criticalArea = barangayName;
  }

  // ─── Activity/Trend Area Chart Data ───
  const activityChartData = activity.map((val, i) => ({
    month: MONTH_LABELS[i] || `M${i + 1}`,
    incidents: val,
  }));

  const activityChartConfig: ChartConfig = {
    incidents: { label: "Incidents", color: "hsl(220, 90%, 56%)" },
  };

  // ─── Crime Distribution Pie Chart Data ───
  const crimeDistribution = (crimesByType || []).map((item) => ({
    type: item.type,
    count: item.count,
    percentage: totalCrimesCount > 0 ? (item.count / totalCrimesCount) * 100 : 0,
  })).sort((a, b) => b.count - a.count);

  const pieChartData = crimeDistribution.slice(0, 8).map((item, index) => ({
    name: item.type,
    value: item.count,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }));

  // Build dynamic chart config for pie
  const pieChartConfig: ChartConfig = pieChartData.reduce((acc, item) => {
    acc[item.name] = { label: item.name, color: item.fill };
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Dashboard Title Indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {isGeneralDashboard ? 'General Dashboard' : barangayName}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isGeneralDashboard
              ? 'Overview of all barangays in Tanza, Cavite'
              : `Detailed statistics for ${barangayName}`
            }
          </p>
        </div>
        {!isGeneralDashboard && (
          <div className={`px-4 py-2 rounded-lg ${
            theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
          }`}>
            <span className="text-sm font-semibold">Barangay View</span>
          </div>
        )}
      </div>

      {/* Top Stats Cards */}
      <div data-tour="overview-stats" className={`grid grid-cols-1 gap-6 ${isGeneralDashboard ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {/* Total Crimes (All Time) */}
        <Card className={`border-0 shadow-lg overflow-hidden ${
          theme === 'dark' ? 'bg-[#1e293b]' : 'bg-white'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'
                }`}>
                  <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Total Crimes (All Time)
                  </p>
                  <div className="flex items-center gap-2">
                    <p className={`text-4xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {stats.totalCrimes}
                    </p>
                    <TrendingUp className="h-5 w-5 text-red-500" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most Frequent Crime Type */}
        <Card className={`border-0 shadow-lg overflow-hidden ${
          theme === 'dark' ? 'bg-[#1e293b]' : 'bg-white'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'
                }`}>
                  <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Most Frequent Crime Type
                  </p>
                  <p className={`text-4xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {mostFrequentCrime}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Area — General Dashboard Only */}
        {isGeneralDashboard && (
          <Card className={`border-0 shadow-lg overflow-hidden ${
            theme === 'dark' ? 'bg-[#1e293b]' : 'bg-white'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'
                  }`}>
                    <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Critical Area
                    </p>
                    <p className={`text-4xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {criticalArea}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ═══════════════════════════════════════════════════ */}
        {/* Crime Trend — Area/Line Chart (2 columns)          */}
        {/* ═══════════════════════════════════════════════════ */}
        <Card data-tour="overview-trend" className={`lg:col-span-2 border-0 shadow-lg ${
          theme === 'dark' ? 'bg-[#1e293b]' : 'bg-white'
        }`}>
          <CardContent className="p-6 pb-2">
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Crime Trend
            </h3>
            <p className="text-sm text-slate-500 mb-4">Monthly incident activity</p>
            <ChartContainer config={activityChartConfig} className="aspect-auto h-[280px] w-full">
              <AreaChart
                data={activityChartData}
                margin={{ left: 0, right: 12, top: 12, bottom: 4 }}
              >
                <defs>
                  <linearGradient id="overviewGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(220, 90%, 56%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(220, 90%, 56%)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 12,
                    fill: theme === 'dark' ? '#64748b' : '#94a3b8',
                    fontWeight: 500,
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 11,
                    fill: theme === 'dark' ? '#64748b' : '#94a3b8',
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
                  fill="url(#overviewGradient)"
                  dot={{
                    r: 4,
                    fill: "hsl(220, 90%, 56%)",
                    stroke: theme === 'dark' ? '#1e293b' : '#ffffff',
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "hsl(220, 90%, 56%)",
                    stroke: theme === 'dark' ? '#1e293b' : '#ffffff',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════════════════ */}
        {/* Crime Distribution — Pie Chart                     */}
        {/* ═══════════════════════════════════════════════════ */}
        <Card data-tour="overview-distribution" className={`border-0 shadow-lg ${
          theme === 'dark' ? 'bg-[#1e293b]' : 'bg-white'
        }`}>
          <CardContent className="p-6 pb-2">
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Crime Distribution
            </h3>
            {pieChartData.length > 0 ? (
              <ChartContainer config={pieChartConfig} className="aspect-auto h-[220px] w-full">
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, name) => (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{name}</span>
                            <span className="ml-auto font-mono font-bold tabular-nums">
                              {(value as number).toLocaleString()}
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    strokeWidth={0}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-slate-500">
                No distribution data
              </div>
            )}

            {/* Legend */}
            <div className="space-y-1.5 mt-2">
              {crimeDistribution.slice(0, 6).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <span className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      {item.type}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold tabular-nums ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Crime Activity - Full Width Table */}
      <Card data-tour="overview-activity-table" className={`border-0 shadow-lg overflow-hidden ${
        theme === 'dark' ? 'bg-[#1e293b]' : 'bg-white'
      }`}>
        <CardContent className="p-0">
          <div className={`p-6 border-b flex justify-between items-center ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Recent Crime Activity
            </h3>
            <Link 
              data-tour="overview-view-cases"
              href={`/dashboard/cases${barangayName && barangayName !== "General Dashboard" ? `?name=${encodeURIComponent(barangayName)}` : ''}`} 
              className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
            >
              View Cases →
            </Link>
          </div>
          <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
            <table className="w-full text-sm text-left">
              <thead className={`text-xs uppercase sticky top-0 z-10 ${
                theme === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-500'
              }`}>
                <tr>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Time Reported</th>
                  <th className="px-6 py-4 font-medium">Date Committed</th>
                  <th className="px-6 py-4 font-medium">Time Committed</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                theme === 'dark' ? 'divide-white/5' : 'divide-slate-100'
              }`}>
                {incidents.map((incident) => (
                  <tr key={incident.id} className={`hover:${
                    theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'
                  } transition-colors`}>
                    <td className="px-6 py-4 font-medium">
                      <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}>
                        {incident.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 opacity-50" />
                        {incident.location}
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 opacity-50" />
                        {formatTime(incident.timeReported)}
                      </div>
                    </td>
                    <td className={`px-6 py-4 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {incident.dateCommitted ? new Date(incident.dateCommitted).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className={`px-6 py-4 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 opacity-50" />
                        {formatTime(incident.timeCommitted)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        incident.status === 'Cleared' ? 'bg-emerald-500/10 text-emerald-500' :
                        incident.status === 'Under Investigation' ? 'bg-blue-500/10 text-blue-500' :
                        incident.status === 'Filed in Court' ? 'bg-purple-500/10 text-purple-500' :
                        incident.status === 'Archived' ? 'bg-slate-500/10 text-slate-500' :
                        'bg-yellow-500/10 text-yellow-600'
                      }`}>
                        {incident.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
