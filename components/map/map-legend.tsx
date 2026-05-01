"use client";

import React from "react";
import { useMapContext } from "@/context/MapContext";
import { useThreatLevels, THREAT_COLORS } from "@/hooks/useThreatLevels";

export default function MapLegend() {
  const { hoveredThreatLevel, setHoveredThreatLevel } = useMapContext();
  const { stats, loading } = useThreatLevels();

  const LEGEND_ITEMS = [
    { label: "CRITICAL", key: "critical", color: THREAT_COLORS.critical, count: stats.critical },
    { label: "HIGH", key: "high", color: THREAT_COLORS.high, count: stats.high },
    { label: "MODERATE", key: "moderate", color: THREAT_COLORS.moderate, count: stats.moderate },
    { label: "LOW", key: "low", color: THREAT_COLORS.low, count: stats.low },
    { label: "SECURE", key: "secure", color: THREAT_COLORS.secure, count: stats.secure },
  ];

  const handleToggle = (level: string) => {
    if (hoveredThreatLevel === level) {
      setHoveredThreatLevel(null);
    } else {
      setHoveredThreatLevel(level);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-1.5 pointer-events-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-9 w-[100px] rounded-lg bg-white/[0.04] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 pointer-events-auto">
      {LEGEND_ITEMS.map((item) => {
        const isActive = hoveredThreatLevel === item.key;
        const isDimmed = hoveredThreatLevel && !isActive;

        return (
          <button
            key={item.label}
            onClick={() => handleToggle(item.key)}
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
              className={`min-w-[26px] h-[22px] rounded-md flex items-center justify-center text-[11px] font-bold tabular-nums transition-all ${
                isActive ? "text-white shadow-lg" : "text-white/90"
              }`}
              style={{
                backgroundColor: item.color,
                boxShadow: isActive ? `0 0 12px ${item.color}80` : "none",
              }}
            >
              {item.count}
            </div>
            {/* Label */}
            <span
              className={`text-[8px] font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-colors ${
                isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
