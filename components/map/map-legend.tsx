"use client";

import React from "react";
import { useMapContext } from "@/context/MapContext";
import { useThreatLevels, THREAT_COLORS } from "@/hooks/useThreatLevels";

export default function MapLegend() {
  const { hoveredThreatLevel, setHoveredThreatLevel } = useMapContext();
  const { stats, loading } = useThreatLevels();

  const LEGEND_ITEMS = [
    { label: "SEC", full: "Secure", color: THREAT_COLORS.secure, count: stats.secure },
    { label: "LOW", full: "Low", color: THREAT_COLORS.low, count: stats.low },
    { label: "MOD", full: "Moderate", color: THREAT_COLORS.moderate, count: stats.moderate },
    { label: "HIGH", full: "High", color: THREAT_COLORS.high, count: stats.high },
    { label: "CRT", full: "Critical", color: THREAT_COLORS.critical, count: stats.critical },
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
      <div className="glass p-1.5 px-3 rounded-xl border border-white/5 pointer-events-auto flex items-center gap-6">
        <div className="animate-pulse flex items-center gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="w-4 h-3 bg-white/20 rounded"></div>
              <div className="w-8 h-1 bg-white/20 rounded-full"></div>
              <div className="w-6 h-2 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-1.5 px-3 rounded-xl border border-white/5 pointer-events-auto flex items-center gap-6">
      {LEGEND_ITEMS.map((item) => {
        const isActive = hoveredThreatLevel === item.full;
        const isDimmed = hoveredThreatLevel && !isActive;

        return (
          <div 
            key={item.label} 
            className={`flex flex-col items-center gap-0.5 group cursor-pointer transition-all duration-300 ${
              isDimmed ? "opacity-30 scale-90" : "opacity-100 scale-100"
            }`}
            onClick={() => handleToggle(item.full)}
          >
            <span className={`text-[10px] font-black leading-none mb-1 tabular-nums transition-colors ${
              isActive ? "text-white" : "text-white/60"
            }`}>
              {item.count}
            </span>
            <div 
              className={`w-8 rounded-full transition-all ${
                isActive ? "h-2 w-10" : "h-1 group-hover:h-1.5 group-hover:scale-x-110"
              }`} 
              style={{ 
                backgroundColor: item.color,
                boxShadow: isActive ? `0 0 15px ${item.color}` : `0 0 10px ${item.color}40`,
              }} 
            />
            <span className={`text-[6px] font-black uppercase tracking-widest mt-1 transition-colors ${
              isActive ? "text-white" : "text-slate-500"
            }`}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
