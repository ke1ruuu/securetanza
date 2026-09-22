"use client";

import React, { useMemo, useState } from "react";
import { HelpCircle } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useTheme } from "@/context/ThemeContext";
import { rampColorForTheme, rgbToCss } from "@/lib/report-theme";
import {
  type AnalyticsSlice,
  MONTH_LONG,
  MONTH_SHORT,
  cleanLabel,
} from "@/lib/analytics-slice";
import { useChartTooltip } from "./analytics/chart-tooltip";

interface CrimeMatrixData {
  crimeType: string;
  monthlyData: number[]; // 12 months
}

interface CrimeMatrixChartProps {
  data: CrimeMatrixData[];
  title?: string;
  description?: string;
  /** Clicking a populated cell drills into that crime type in that month. */
  onSelect?: (slice: AnalyticsSlice) => void;
}

const MONTH_LABELS = MONTH_SHORT;

// Same sequential ramp system as the PDF report (lib/report-theme.ts) — in
// light mode, exactly. Dark mode uses rampColorForTheme's inverted ramp
// (muted → bright accent instead of pale → deep navy): the paper direction
// has less contrast against a dark card at high intensity than at low,
// which would make the heaviest months read as the dimmest cells. A zero
// month still gets the palest ramp step (not literally transparent) so it
// reads as "an empty box" rather than a gap where a box is missing.
function cellColor(value: number, max: number, theme: "light" | "dark") {
  const intensity = value === 0 ? 0 : max > 0 ? value / max : 0;
  return rgbToCss(rampColorForTheme(intensity, theme));
}


export default function CrimeMatrixChart({
  data,
  description = "Monthly distribution by crime type",
  onSelect,
}: CrimeMatrixChartProps) {
  const { theme } = useTheme();
  const { tooltip, bind, hide } = useChartTooltip(theme);
  // Which cell the cursor is on, so the rest of the grid can recede and the
  // hovered cell's row + column can stay lit (a crosshair, not a spotlight —
  // on a matrix you almost always want to compare along one axis or the other).
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const maxValue = useMemo(() => {
    let max = 0;
    data.forEach((row) => row.monthlyData.forEach((v) => { if (v > max) max = v; }));
    return max;
  }, [data]);

  const monthlyTotals = useMemo(() => {
    const totals = Array(12).fill(0);
    data.forEach((row) => row.monthlyData.forEach((v, i) => { totals[i] += v; }));
    return totals;
  }, [data]);

  const crimeTypeTotals = useMemo(
    () => data.map((row) => ({ type: row.crimeType, total: row.monthlyData.reduce((s, v) => s + v, 0) })),
    [data]
  );

  const grandTotal = crimeTypeTotals.reduce((sum, item) => sum + item.total, 0);
  const topCrimeType = [...crimeTypeTotals].sort((a, b) => b.total - a.total)[0];

  // Trim trailing months nobody has any incidents in — a 12-wide grid where
  // 8 columns are always empty just pushes the columns that matter into a
  // sliver. A month with zero for one row but data elsewhere still shows;
  // only wholesale-empty months at the tail get dropped.
  const lastActiveMonth = monthlyTotals.reduce((last, t, i) => (t > 0 ? i : last), 0);
  const visibleMonths = lastActiveMonth + 1;

  // rounded-xl border, 22px padding — matches lib/report-theme's ".panel"
  // treatment used by every other chart on this page.
  const cardClass = `rounded-xl border ${theme === "dark" ? "border-white/[0.06] bg-[#1e293b]" : "border-slate-200 bg-white"}`;

  if (data.length === 0) {
    return (
      <div className={cardClass} style={{ padding: 22 }}>
        <div className="h-[300px] flex items-center justify-center text-slate-500">
          No crime matrix data available
        </div>
      </div>
    );
  }

  const ruleColor = theme === "dark" ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const faintText = theme === "dark" ? "#64748b" : "#94a3b8";
  const midText = theme === "dark" ? "#cbd5e1" : "#334155";
  const inkText = theme === "dark" ? "#f1f5f9" : "#0f172a";

  return (
    <div className={cardClass} style={{ padding: 22 }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: "0.78rem", color: faintText }}>{description}</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="cursor-help">
              <HelpCircle className="h-3.5 w-3.5" style={{ color: faintText }} />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className={`w-80 ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
            <div className="space-y-2">
              <h4 className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                Crime Matrix Heatmap
              </h4>
              <p className={`text-xs ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                This matrix shows the distribution of different crime types across months.
              </p>
              <div className={`text-xs p-2 rounded ${theme === "dark" ? "bg-slate-900" : "bg-slate-100"}`}>
                <p className="font-semibold mb-1">How to read:</p>
                <ul className="space-y-1">
                  <li>• Each row = crime type</li>
                  <li>• Each column = month</li>
                  <li>• Brighter cell = more incidents</li>
                </ul>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div
        className="overflow-x-auto"
        onMouseLeave={() => {
          setHoveredCell(null);
          hide();
        }}
      >
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "0.76rem" }}>
          <thead>
            <tr>
              <th style={{ padding: "0 6px 8px", textAlign: "left" }} />
              {MONTH_LABELS.slice(0, visibleMonths).map((month) => (
                <th
                  key={month}
                  style={{
                    padding: "0 6px 8px",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: "0.68rem",
                    color: faintText,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {month}
                </th>
              ))}
              <th
                style={{
                  padding: "0 6px 8px",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  color: faintText,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => {
              const label = cleanLabel(row.crimeType);
              const rowTotal = row.monthlyData.reduce((s, v) => s + v, 0);
              return (
                <tr key={rowIdx}>
                  <td style={{ textAlign: "left", fontWeight: 600, color: midText, paddingRight: 10, whiteSpace: "nowrap", padding: "3px 10px 3px 0" }}>
                    {label}
                  </td>
                  {row.monthlyData.slice(0, visibleMonths).map((value, colIdx) => {
                    const onCross =
                      hoveredCell !== null &&
                      (hoveredCell.row === rowIdx || hoveredCell.col === colIdx);
                    const dimmed = hoveredCell !== null && !onCross;
                    const clickable = Boolean(onSelect) && value > 0;
                    return (
                      <td key={colIdx} style={{ textAlign: "center", padding: 3 }}>
                        <div
                          className="transition-opacity"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 30,
                            borderRadius: 4,
                            fontWeight: 700,
                            fontVariantNumeric: "tabular-nums",
                            background: cellColor(value, maxValue, theme),
                            color: value === 0 ? "transparent" : value > maxValue * 0.5 ? "#ffffff" : inkText,
                            opacity: dimmed ? 0.35 : 1,
                            cursor: clickable ? "pointer" : "default",
                          }}
                          {...bind(
                            {
                              title: label,
                              subtitle: MONTH_LONG[colIdx],
                              rows: [
                                { label: "Incidents", value: String(value) },
                                { label: `All ${label}`, value: String(rowTotal) },
                                { label: MONTH_LABELS[colIdx], value: String(monthlyTotals[colIdx]) },
                              ],
                              hint: clickable
                                ? "Click to see these incidents"
                                : "No incidents recorded",
                            },
                            () => setHoveredCell({ row: rowIdx, col: colIdx })
                          )}
                          onClick={
                            clickable
                              ? () =>
                                  onSelect?.({
                                    kind: "matrixCell",
                                    crimeType: row.crimeType,
                                    month: colIdx,
                                  })
                              : undefined
                          }
                        >
                          {value > 0 ? value : ""}
                        </div>
                      </td>
                    );
                  })}
                  <td style={{ textAlign: "center", fontWeight: 800, color: inkText, padding: 3 }}>{rowTotal}</td>
                </tr>
              );
            })}
            <tr>
              <td
                style={{
                  textAlign: "left",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontSize: "0.68rem",
                  color: faintText,
                  paddingTop: 8,
                  borderTop: `1px solid ${ruleColor}`,
                }}
              >
                Total
              </td>
              {monthlyTotals.slice(0, visibleMonths).map((total, idx) => (
                <td
                  key={idx}
                  style={{ textAlign: "center", fontWeight: 700, color: inkText, paddingTop: 8, borderTop: `1px solid ${ruleColor}` }}
                >
                  {total}
                </td>
              ))}
              <td
                className="text-sky-600 dark:text-sky-400"
                style={{ textAlign: "center", fontWeight: 800, paddingTop: 8, borderTop: `1px solid ${ruleColor}` }}
              >
                {grandTotal}
              </td>
            </tr>
          </tbody>
        </table>
        {tooltip}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-1.5" style={{ marginTop: 14, fontSize: "0.76rem", color: faintText }}>
        <span>Less</span>
        {[0.15, 0.4, 0.6, 0.8, 1].map((intensity, idx) => (
          <span
            key={idx}
            style={{ width: 22, height: 11, borderRadius: 2, background: rgbToCss(rampColorForTheme(intensity, theme)) }}
          />
        ))}
        <span>More</span>
      </div>

      {/* Footnote */}
      <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${ruleColor}`, fontSize: "0.8rem" }}>
        <div style={{ fontWeight: 700, color: inkText }}>
          {topCrimeType?.type ? cleanLabel(topCrimeType.type) : "N/A"} is the most frequent crime type
        </div>
        <div style={{ color: faintText, marginTop: 2 }}>
          {grandTotal.toLocaleString()} total incidents across all months
        </div>
      </div>
    </div>
  );
}
