"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { useMapContext } from "@/context/MapContext";

export default function YearSelector() {
  const { selectedYear, availableYears, setSelectedYear } = useMapContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setIsOpen(false);
  };

  const handleAllYearsSelect = () => {
    setSelectedYear(null);
    setIsOpen(false);
  };

  if (availableYears.length === 0) {
    return null; // Don't show selector if no years available
  }

  // Always use dark theme for map header
  const theme = "dark";

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 h-9 pl-3.5 pr-3 rounded-lg border transition-all duration-200 cursor-pointer ${
          theme === "dark"
            ? "bg-white/[0.04] border-white/[0.08] hover:border-blue-500/30 hover:bg-white/[0.06]"
            : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-sm"
        }`}
      >
        <Calendar className={`h-4 w-4 ${theme === "dark" ? "text-blue-400" : "text-blue-500"}`} />
        <span
          className={`text-sm font-semibold whitespace-nowrap ${
            theme === "dark" ? "text-slate-200" : "text-slate-700"
          }`}
        >
          {selectedYear ? selectedYear : "All Years"}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-all duration-200 ${
            isOpen ? "rotate-180" : ""
          } ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute top-[calc(100%+8px)] right-0 min-w-[160px] rounded-xl border overflow-hidden transition-all duration-200 origin-top-right z-50 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        } ${
          theme === "dark"
            ? "bg-[#0F172A]/95 backdrop-blur-2xl border-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            : "bg-white backdrop-blur-xl border-slate-200 shadow-xl shadow-slate-300/30"
        }`}
      >
        {/* Top glow accent */}
        <div
          className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${
            theme === "dark"
              ? "from-blue-500/40 via-transparent to-transparent"
              : "from-blue-400/50 via-transparent to-transparent"
          }`}
        />

        {/* All Years Option */}
        <div className={`border-b ${theme === "dark" ? "border-white/[0.04]" : "border-slate-100"}`}>
          <button
            onClick={handleAllYearsSelect}
            className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 ${
              selectedYear === null
                ? theme === "dark"
                  ? "text-blue-400 bg-blue-500/[0.08]"
                  : "text-blue-600 bg-blue-50"
                : theme === "dark"
                  ? "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            All Years
          </button>
        </div>

        {/* Year List */}
        <div className="py-1 max-h-[300px] overflow-y-auto custom-scrollbar">
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => handleYearSelect(year)}
              className={`block w-full text-left px-4 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                selectedYear === year
                  ? theme === "dark"
                    ? "text-blue-400 bg-blue-500/[0.08]"
                    : "text-blue-600 bg-blue-50"
                  : theme === "dark"
                    ? "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
