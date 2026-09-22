"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { MapPin, X, ArrowRight } from "lucide-react";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { useCrimeHoverStats } from "@/hooks/useCrimeHoverStats";
import { useThreatLevels, getThreatLevelFromCount } from "@/hooks/useThreatLevels";
import { useTheme } from "@/context/ThemeContext";
import { getCrimeTypeColor } from "@/hooks/useCrimeTypes";
import { OVERLAY_LABEL } from "@/lib/map-overlay";

interface BarangayDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barangayName: string | null;
  onMoreInfo: (name: string) => void;
}

/**
 * Side drawer for a clicked barangay. Laid out like the Analytics panels: an
 * uppercase label over a bold title, one bordered stat strip with hairline
 * dividers, ranked bars on the shared sky ramp, and hairline info rows.
 */
export default function BarangayDrawer({ open, onOpenChange, barangayName, onMoreInfo }: BarangayDrawerProps) {
  const { stats, loading } = useCrimeHoverStats(barangayName);
  const { barangayCrimeCounts } = useThreatLevels();
  const { theme } = useTheme();
  const dark = theme === "dark";

  // Calculate threat level and risk
  const totalCrimes = stats?.crimesByType.reduce((sum, crime) => sum + crime.count, 0) || 0;
  const normalizedName = barangayName?.toUpperCase() || "";
  const actualCrimeCount = barangayCrimeCounts[normalizedName] || barangayCrimeCounts[barangayName || ""] || totalCrimes;

  const threatLevel = getThreatLevelFromCount(actualCrimeCount, {
    low: 2,
    moderate: 5,
    high: 10,
    critical: 15,
  });

  const riskLevel = threatLevel.charAt(0).toUpperCase() + threatLevel.slice(1);
  const riskColor =
    threatLevel === "critical"
      ? dark ? "text-red-400" : "text-red-600"
      : threatLevel === "high"
        ? dark ? "text-orange-400" : "text-orange-600"
        : threatLevel === "moderate"
          ? dark ? "text-yellow-400" : "text-yellow-600"
          : threatLevel === "low"
            ? dark ? "text-emerald-400" : "text-emerald-600"
            : dark ? "text-sky-400" : "text-sky-600";

  const statusText =
    threatLevel === "critical" || threatLevel === "high" ? "Alert" : threatLevel === "moderate" ? "Nominal" : "Secure";
  const statusColor =
    statusText === "Secure"
      ? dark ? "text-emerald-400" : "text-emerald-600"
      : statusText === "Alert"
        ? dark ? "text-red-400" : "text-red-600"
        : dark ? "text-slate-300" : "text-slate-600";

  const mutedText = dark ? "text-slate-400" : "text-slate-500";
  const hairline = dark ? "border-white/[0.06]" : "border-slate-100";
  const valueClass = `text-[1.15rem] font-bold leading-tight tabular-nums ${dark ? "text-white" : "text-slate-900"}`;

  const distribution = (stats?.crimesByType ?? [])
    .filter((crime) => crime.count > 0)
    .sort((a, b) => b.count - a.count);

  const statCells = [
    { label: "Total Crimes", value: totalCrimes.toLocaleString(), className: "" },
    { label: "Risk Level", value: riskLevel, className: riskColor },
    { label: "Status", value: statusText, className: statusColor },
    { label: "Safety Index", value: stats?.safetyIndex ?? "—", className: dark ? "text-emerald-400" : "text-emerald-600" },
  ];

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent
        className={`h-full w-[400px] border-l sm:max-w-[400px] ${
          dark ? "border-l-white/[0.08] bg-[#1e293b] text-slate-100" : "border-l-slate-200 bg-white text-slate-800"
        }`}
      >
        <div className="flex h-full flex-col">
          {loading ? (
            <>
              <DrawerHeader className={`border-b pb-6 ${hairline}`}>
                <VisuallyHidden>
                  <DrawerTitle>Loading Barangay Data</DrawerTitle>
                </VisuallyHidden>
              </DrawerHeader>
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
                  <p className={`text-sm font-medium ${mutedText}`}>Loading barangay data...</p>
                </div>
              </div>
            </>
          ) : !barangayName || !stats ? (
            <>
              <DrawerHeader className={`border-b pb-6 ${hairline}`}>
                <VisuallyHidden>
                  <DrawerTitle>Select Barangay</DrawerTitle>
                </VisuallyHidden>
              </DrawerHeader>
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <MapPin className={`mx-auto mb-4 h-10 w-10 ${dark ? "text-slate-600" : "text-slate-300"}`} />
                  <p className={`text-sm font-medium ${mutedText}`}>
                    {barangayName ? "No crime data available" : "Select a barangay to view details"}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <DrawerHeader className={`border-b px-6 pb-5 ${hairline}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={OVERLAY_LABEL}>Barangay</p>
                    <DrawerTitle
                      className={`font-heading mt-1 text-2xl font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}
                    >
                      {barangayName}
                    </DrawerTitle>
                    <DrawerDescription className={`mt-1 text-sm ${mutedText}`}>
                      Crime statistics for this area
                    </DrawerDescription>
                  </div>
                  <DrawerClose asChild>
                    <button
                      aria-label="Close"
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        dark ? "text-slate-400 hover:bg-white/10" : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </DrawerClose>
                </div>
              </DrawerHeader>

              <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
                {/* Key figures — one surface, hairline dividers */}
                <div
                  className={`grid grid-cols-2 overflow-hidden rounded-xl border ${
                    dark ? "border-white/[0.06]" : "border-slate-200"
                  }`}
                >
                  {statCells.map((cell, i) => (
                    <div
                      key={cell.label}
                      className={`px-4 py-3.5 ${i % 2 === 1 ? `border-l ${hairline}` : ""} ${i >= 2 ? `border-t ${hairline}` : ""}`}
                    >
                      <p className={`${OVERLAY_LABEL} mb-1.5`}>{cell.label}</p>
                      <p className={`${valueClass} ${cell.className}`}>{cell.value}</p>
                    </div>
                  ))}
                </div>

                {/* Crime distribution */}
                <div>
                  <h4 className={`${OVERLAY_LABEL} mb-3`}>Crime Distribution</h4>
                  <div className="custom-scrollbar max-h-[380px] overflow-y-auto">
                    {distribution.map((crime) => {
                      const share = totalCrimes > 0 ? Math.round((crime.count / totalCrimes) * 100) : 0;
                      return (
                        <div
                          key={crime.type}
                          className={`flex items-center gap-3 border-b py-2.5 last:border-b-0 ${hairline}`}
                        >
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: getCrimeTypeColor(crime.type) }}
                          />
                          <span className={`min-w-0 flex-1 truncate text-[0.82rem] ${dark ? "text-slate-200" : "text-slate-700"}`}>
                            {crime.type}
                          </span>
                          <span className={`shrink-0 text-[0.82rem] font-semibold tabular-nums ${dark ? "text-white" : "text-slate-900"}`}>
                            {crime.count.toLocaleString()}
                          </span>
                          <span className={`w-9 shrink-0 text-right text-[0.75rem] tabular-nums ${mutedText}`}>{share}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Administrative info */}
                <div>
                  <h4 className={`${OVERLAY_LABEL} mb-1`}>Administrative Info</h4>
                  <dl>
                    {[
                      { label: "Municipality", value: "Tanza" },
                      { label: "Province", value: "Cavite" },
                      { label: "Region", value: "IV-A (CALABARZON)" },
                      { label: "Country", value: "Philippines" },
                    ].map((item) => (
                      <div key={item.label} className={`flex items-center justify-between border-b py-2.5 last:border-b-0 ${hairline}`}>
                        <dt className={`text-xs ${mutedText}`}>{item.label}</dt>
                        <dd className={`text-xs font-semibold ${dark ? "text-slate-100" : "text-slate-800"}`}>{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>

              <DrawerFooter className={`border-t px-6 py-4 ${hairline}`}>
                <button
                  onClick={() => onMoreInfo(barangayName)}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
                >
                  View Full Dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
              </DrawerFooter>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
