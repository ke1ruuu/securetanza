"use client";

import React, { useMemo } from "react";
import { HelpCircle } from "lucide-react";
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
import { useTheme } from "@/context/ThemeContext";

interface CrimeMatrixData {
  crimeType: string;
  monthlyData: number[]; // 12 months
}

interface CrimeMatrixChartProps {
  data: CrimeMatrixData[];
  title?: string;
  description?: string;
}

// Month labels
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Color scale for heatmap (from light to dark)
const getHeatmapColor = (value: number, max: number, theme: "light" | "dark") => {
  if (value === 0) {
    return theme === "dark" ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)";
  }
  
  const intensity = max > 0 ? value / max : 0;
  
  if (theme === "dark") {
    // Dark theme: Blue gradient
    const r = Math.round(14 + intensity * 225); // 14 -> 239
    const g = Math.round(165 + intensity * 68); // 165 -> 233
    const b = Math.round(233); // Keep blue constant
    return `rgba(${r}, ${g}, ${b}, ${0.2 + intensity * 0.8})`;
  } else {
    // Light theme: Blue gradient
    const r = Math.round(239 - intensity * 225);
    const g = Math.round(246 - intensity * 81);
    const b = Math.round(255);
    return `rgba(${r}, ${g}, ${b}, ${0.3 + intensity * 0.7})`;
  }
};

export default function CrimeMatrixChart({
  data,
  title = "Crime Type Matrix",
  description = "Monthly distribution by crime type",
}: CrimeMatrixChartProps) {
  const { theme } = useTheme();

  // Calculate max value for color scaling
  const maxValue = useMemo(() => {
    let max = 0;
    data.forEach((row) => {
      row.monthlyData.forEach((val) => {
        if (val > max) max = val;
      });
    });
    return max;
  }, [data]);

  // Calculate totals
  const monthlyTotals = useMemo(() => {
    const totals = Array(12).fill(0);
    data.forEach((row) => {
      row.monthlyData.forEach((val, idx) => {
        totals[idx] += val;
      });
    });
    return totals;
  }, [data]);

  const crimeTypeTotals = useMemo(() => {
    return data.map((row) => ({
      type: row.crimeType,
      total: row.monthlyData.reduce((sum, val) => sum + val, 0),
    }));
  }, [data]);

  const grandTotal = crimeTypeTotals.reduce((sum, item) => sum + item.total, 0);
  const topCrimeType = crimeTypeTotals.sort((a, b) => b.total - a.total)[0];

  if (data.length === 0) {
    return (
      <Card
        className={`border-0 shadow-lg ${theme === "dark" ? "bg-[#1e293b]" : "bg-white"}`}
      >
        <CardHeader>
          <CardTitle
            className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            {title}
          </CardTitle>
          <p className="text-sm text-slate-500">{description}</p>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-slate-500">
            No crime matrix data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`border-0 shadow-lg ${theme === "dark" ? "bg-[#1e293b]" : "bg-white"}`}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle
            className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
          >
            {title}
          </CardTitle>
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="cursor-help">
                <HelpCircle
                  className={`h-4 w-4 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}
                />
              </button>
            </HoverCardTrigger>
            <HoverCardContent
              className={`w-80 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"}`}
            >
              <div className="space-y-2">
                <h4
                  className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}
                >
                  Crime Matrix Heatmap
                </h4>
                <p
                  className={`text-xs ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}
                >
                  This matrix shows the distribution of different crime types across months.
                </p>
                <div
                  className={`text-xs p-2 rounded ${theme === "dark" ? "bg-slate-900" : "bg-slate-100"}`}
                >
                  <p className="font-semibold mb-1">How to read:</p>
                  <ul className="space-y-1">
                    <li>• Each row = Crime type</li>
                    <li>• Each column = Month</li>
                    <li>• Darker color = More incidents</li>
                    <li>• Hover over cells for exact counts</li>
                  </ul>
                </div>
                <p
                  className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}
                >
                  Use this to identify seasonal patterns and high-risk periods for specific crime types.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <p className="text-sm text-slate-500">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row - Months */}
            <div className="flex items-center mb-2">
              <div className="w-32 flex-shrink-0"></div>
              <div className="flex-1 grid grid-cols-12 gap-1">
                {MONTH_LABELS.map((month) => (
                  <div
                    key={month}
                    className={`text-center text-xs font-bold uppercase tracking-wider ${
                      theme === "dark" ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {month}
                  </div>
                ))}
              </div>
              <div className="w-16 flex-shrink-0 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Total
              </div>
            </div>

            {/* Data Rows */}
            {data.map((row, rowIdx) => {
              const rowTotal = row.monthlyData.reduce((sum, val) => sum + val, 0);
              
              return (
                <div key={rowIdx} className="flex items-center mb-1">
                  {/* Crime Type Label */}
                  <div
                    className={`w-32 flex-shrink-0 pr-3 text-xs font-semibold truncate ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}
                    title={row.crimeType}
                  >
                    {row.crimeType}
                  </div>

                  {/* Heatmap Cells */}
                  <div className="flex-1 grid grid-cols-12 gap-1">
                    {row.monthlyData.map((value, colIdx) => (
                      <div
                        key={colIdx}
                        className="relative group aspect-square rounded transition-all duration-200 hover:scale-110 hover:z-10 cursor-pointer"
                        style={{
                          backgroundColor: getHeatmapColor(value, maxValue, theme),
                          border: `1px solid ${
                            theme === "dark"
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(0, 0, 0, 0.05)"
                          }`,
                        }}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                          <div className="font-semibold">{row.crimeType}</div>
                          <div className="text-slate-300">
                            {MONTH_LABELS[colIdx]}: {value} incidents
                          </div>
                          <div
                            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                            style={{
                              borderLeft: "4px solid transparent",
                              borderRight: "4px solid transparent",
                              borderTop: "4px solid #0f172a",
                            }}
                          />
                        </div>

                        {/* Value text (only show if > 0) */}
                        {value > 0 && (
                          <div
                            className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${
                              value > maxValue * 0.5
                                ? "text-white"
                                : theme === "dark"
                                ? "text-slate-300"
                                : "text-slate-700"
                            }`}
                          >
                            {value}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Row Total */}
                  <div className="w-16 flex-shrink-0 text-center">
                    <span
                      className={`text-xs font-bold ${
                        theme === "dark" ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      {rowTotal}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Footer Row - Monthly Totals */}
            <div className="flex items-center mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="w-32 flex-shrink-0 pr-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                Total
              </div>
              <div className="flex-1 grid grid-cols-12 gap-1">
                {monthlyTotals.map((total, idx) => (
                  <div
                    key={idx}
                    className={`text-center text-xs font-bold ${
                      theme === "dark" ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    {total}
                  </div>
                ))}
              </div>
              <div className="w-16 flex-shrink-0 text-center">
                <span
                  className={`text-xs font-bold ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {grandTotal}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-xs text-slate-500">Less</span>
          <div className="flex gap-1">
            {[0, 0.25, 0.5, 0.75, 1].map((intensity, idx) => (
              <div
                key={idx}
                className="w-8 h-4 rounded"
                style={{
                  backgroundColor: getHeatmapColor(
                    Math.round(intensity * maxValue),
                    maxValue,
                    theme
                  ),
                  border: `1px solid ${
                    theme === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)"
                  }`,
                }}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">More</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm px-6 pb-6">
        <div className="flex items-center gap-2 font-semibold leading-none">
          {topCrimeType?.type || "N/A"} is the most frequent crime type
        </div>
        <div className="text-muted-foreground leading-none">
          {grandTotal.toLocaleString()} total incidents across all months
        </div>
      </CardFooter>
    </Card>
  );
}
