"use client";

import React, { useState, useEffect } from "react";
import { Clock, Filter } from "lucide-react";

interface RealTimeClockProps {
  onFilterToggle: (isActive: boolean) => void;
  isFilterActive: boolean;
}

export default function RealTimeClock({ onFilterToggle, isFilterActive }: RealTimeClockProps) {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="pointer-events-auto opacity-0">
        <div className="h-[56px] w-[180px] rounded-xl bg-[#0F172A]/70" />
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="pointer-events-auto flex items-center gap-3">
      {/* Time Display - Only show when filter is NOT active */}
      {!isFilterActive && (
        <div className="flex items-center gap-3 h-[56px] pl-4 pr-5 rounded-xl bg-[#0F172A]/70 backdrop-blur-xl border border-white/[0.08] animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.06] flex items-center justify-center">
            <Clock className="h-4 w-4 text-[#0EA5E9]" />
          </div>
          <div className="flex flex-col">
            <span
              className="text-[14px] font-bold text-white leading-tight tabular-nums"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {formatTime(time)}
            </span>
            <span
              className="text-[10px] font-medium text-slate-500 leading-tight"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {formatDay(time)}, {formatDate(time)}
            </span>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => onFilterToggle(!isFilterActive)}
        className={`h-[56px] w-[56px] rounded-xl backdrop-blur-xl border transition-all duration-300 flex items-center justify-center ${
          isFilterActive
            ? "bg-[#0EA5E9] border-[#0EA5E9] shadow-[0_0_20px_rgba(14,165,233,0.4)]"
            : "bg-[#0F172A]/70 border-white/[0.08] hover:bg-[#0F172A]/90"
        }`}
        aria-label="Temporal Filter"
        aria-pressed={isFilterActive}
        title="Temporal Filter"
      >
        <Clock className={`h-6 w-6 transition-colors ${
          isFilterActive ? "text-white" : "text-[#0EA5E9]"
        }`} />
      </button>
    </div>
  );
}
