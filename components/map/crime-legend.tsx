"use client";

import React from "react";
import { useCrimeTypes, getCrimeTypeColor, extractCrimeType } from "@/hooks/useCrimeTypes";
import { useMapContext } from "@/context/MapContext";

// Helper function to format numbers in standard notation
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export default function CrimeLegend() {
  const { stats, total, loading } = useCrimeTypes();
  const { selectedCrimeType, setSelectedCrimeType } = useMapContext();

  if (loading) {
    return (
      <div className="flex flex-col gap-1.5 pointer-events-auto">
        <div className="px-2 py-1.5 bg-[#0F172A]/60 border border-white/[0.05] rounded-lg">
          <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-500">
            Crime Types
          </span>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-9 w-[140px] rounded-lg bg-white/[0.04] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="flex flex-col gap-1.5 pointer-events-auto">
        <div className="px-2 py-1.5 bg-[#0F172A]/60 border border-white/[0.05] rounded-lg">
          <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-500">
            Crime Types
          </span>
        </div>
        <div className="px-3 py-2 bg-[#0F172A]/60 border border-white/[0.05] rounded-lg">
          <span className="text-[10px] text-slate-400">No data available</span>
        </div>
      </div>
    );
  }

  const handleToggle = (type: string) => {
    if (selectedCrimeType === type) {
      setSelectedCrimeType(null);
    } else {
      setSelectedCrimeType(type);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 pointer-events-auto">
      {/* Header */}
      <div className="px-2 py-1.5 bg-[#0F172A]/60 border border-white/[0.05] rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-500">
            Crime Types
          </span>
          <span className="text-[10px] font-bold text-slate-400 tabular-nums">
            {formatNumber(total)} total
          </span>
        </div>
      </div>

      {/* Crime Type Items */}
      {stats.map((item) => {
        const isActive = selectedCrimeType === item.type;
        const isDimmed = selectedCrimeType && !isActive;
        const color = getCrimeTypeColor(item.type);
        const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
        const displayName = extractCrimeType(item.type); // Remove prefix for display
        const formattedCount = formatNumber(item.count); // Format count

        return (
          <button
            key={item.type}
            onClick={() => handleToggle(item.type)}
            className={`flex items-center gap-2.5 h-9 pl-2 pr-3 rounded-lg border transition-all duration-300 cursor-pointer group ${
              isActive
                ? "bg-white/[0.08] border-white/[0.1] scale-105"
                : isDimmed
                ? "bg-[#0F172A]/60 border-white/[0.03] opacity-40 scale-95"
                : "bg-[#0F172A]/60 border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.08]"
            }`}
          >
            {/* Count Badge */}
            <div
              className={`min-w-[26px] h-[22px] px-1.5 rounded-md flex items-center justify-center text-[11px] font-bold tabular-nums transition-all ${
                isActive ? "text-white shadow-lg" : "text-white/90"
              }`}
              style={{
                backgroundColor: color,
                boxShadow: isActive ? `0 0 12px ${color}80` : "none",
              }}
            >
              {formattedCount}
            </div>

            {/* Label and Percentage */}
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span
                className={`text-[9px] font-bold uppercase tracking-[0.08em] whitespace-nowrap transition-colors truncate max-w-full ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {displayName}
              </span>
              <span
                className={`text-[8px] font-medium tabular-nums transition-colors ${
                  isActive ? "text-slate-300" : "text-slate-500 group-hover:text-slate-400"
                }`}
              >
                {percentage}%
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
