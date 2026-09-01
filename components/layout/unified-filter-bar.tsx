"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  MapPin, 
  Filter, 
  Clock, 
  Search, 
  X, 
  ChevronDown, 
  Check, 
  RotateCcw,
  Sparkles
} from "lucide-react";
import { useMapContext, FilterMode } from "@/context/MapContext";
import { useCrimeTypes, getCrimeTypeColor } from "@/hooks/useCrimeTypes";

type ActiveDropdown = "barangay" | "crime" | "time" | null;

const monthAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function UnifiedFilterBar() {
  const {
    selectedBarangay,
    setSelectedBarangay,
    searchQuery,
    setSearchQuery,
    filteredBarangays,
    selectedCrimeType,
    setSelectedCrimeType,
    selectedYear,
    setSelectedYear,
    availableYears,
    timeRange,
    setTimeRange,
  } = useMapContext();

  const { stats: crimeStats, loading: crimeLoading } = useCrimeTypes();
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>(timeRange.mode);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdowns on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Sync filter mode with timeRange
  useEffect(() => {
    setFilterMode(timeRange.mode);
  }, [timeRange.mode]);

  // Sync current year from selections or selectedYear
  useEffect(() => {
    if (timeRange.selections.length > 0) {
      setCurrentYear(timeRange.selections[0].year);
    } else if (selectedYear) {
      setCurrentYear(selectedYear);
    }
  }, [timeRange.selections, selectedYear]);

  // Helper functions for time range selection
  const isQuarterSelected = (year: number, quarter: number) => {
    return (
      timeRange.mode === "quarter" &&
      timeRange.selections.some((s) => s.year === year && s.quarter === quarter)
    );
  };

  const isHalfYearSelected = (year: number, halfYear: number) => {
    return (
      timeRange.mode === "half-year" &&
      timeRange.selections.some((s) => s.year === year && s.halfYear === halfYear)
    );
  };

  const isMonthSelected = (year: number, month: number) => {
    return (
      timeRange.mode === "month" &&
      timeRange.selections.some((s) => s.year === year && s.month === month)
    );
  };

  const isDaySelected = (date: Date) => {
    return (
      timeRange.mode === "day" &&
      timeRange.selections.some((s) => s.day && s.day.toDateString() === date.toDateString())
    );
  };

  const selectYear = (year: number) => {
    setCurrentYear(year);
    setSelectedYear(year);
    const newTimeRange = { mode: filterMode, selections: [] };
    setTimeRange(newTimeRange);
  };

  const toggleQuarterSelect = (quarter: number) => {
    if (!currentYear) return;
    const isSelected = isQuarterSelected(currentYear, quarter);
    const currentYearSelections = timeRange.selections.filter((s) => s.year === currentYear);

    const newSelections = isSelected
      ? currentYearSelections.filter((s) => s.quarter !== quarter)
      : [...currentYearSelections, { year: currentYear, quarter }];

    setTimeRange({ mode: "quarter", selections: newSelections });
  };

  const toggleHalfYearSelect = (halfYear: number) => {
    if (!currentYear) return;
    const isSelected = isHalfYearSelected(currentYear, halfYear);
    const currentYearSelections = timeRange.selections.filter((s) => s.year === currentYear);

    const newSelections = isSelected
      ? currentYearSelections.filter((s) => s.halfYear !== halfYear)
      : [...currentYearSelections, { year: currentYear, halfYear }];

    setTimeRange({ mode: "half-year", selections: newSelections });
  };

  const toggleMonthSelect = (month: number) => {
    if (!currentYear) return;
    const isSelected = isMonthSelected(currentYear, month);
    const currentYearSelections = timeRange.selections.filter((s) => s.year === currentYear);

    const newSelections = isSelected
      ? currentYearSelections.filter((s) => s.month !== month)
      : [...currentYearSelections, { year: currentYear, month }];

    setTimeRange({ mode: "month", selections: newSelections });
  };

  const toggleDaySelect = (date: Date) => {
    const isSelected = isDaySelected(date);
    const newSelections = isSelected
      ? timeRange.selections.filter(
          (s) => !(s.day && s.day.toDateString() === date.toDateString())
        )
      : [...timeRange.selections, { year: date.getFullYear(), day: date }];

    setTimeRange({ mode: "day", selections: newSelections });
  };

  const clearTimeSelections = () => {
    setTimeRange({ ...timeRange, selections: [] });
    setSelectedYear(null);
  };

  const getTimeDisplayText = () => {
    if (!currentYear) return "All Time";

    const count = timeRange.selections.length;
    if (count === 0) return `${currentYear}`;

    switch (timeRange.mode) {
      case "quarter":
        if (count === 1) return `Q${timeRange.selections[0].quarter} ${timeRange.selections[0].year}`;
        return `${count} Quarters (${currentYear})`;
      case "half-year":
        if (count === 1) return `H${timeRange.selections[0].halfYear} ${timeRange.selections[0].year}`;
        return `${count} Halves (${currentYear})`;
      case "month":
        if (count === 1) return `${monthAbbr[timeRange.selections[0].month! - 1]} ${timeRange.selections[0].year}`;
        return `${count} Months (${currentYear})`;
      case "day":
        if (count === 1) {
          return timeRange.selections[0].day?.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }) || "";
        }
        return `${count} Days`;
      default:
        return `${currentYear}`;
    }
  };

  const isBarangayActive = Boolean(selectedBarangay);
  const isCrimeActive = Boolean(selectedCrimeType);
  const isTimeActive = Boolean(selectedYear !== null || timeRange.selections.length > 0);

  const activeFiltersCount = (isBarangayActive ? 1 : 0) + (isCrimeActive ? 1 : 0) + (isTimeActive ? 1 : 0);

  const clearAllFilters = useCallback(() => {
    setSelectedBarangay(null);
    setSelectedCrimeType(null);
    clearTimeSelections();
    setActiveDropdown(null);
  }, [setSelectedBarangay, setSelectedCrimeType]);

  const toggleDropdown = (section: ActiveDropdown) => {
    setActiveDropdown((prev) => (prev === section ? null : section));
  };

  if (!mounted) {
    return (
      <div className="h-12 w-80 rounded-2xl bg-white/90 dark:bg-[#0F172A]/80 border border-slate-200 dark:border-white/[0.08] animate-pulse" />
    );
  }

  return (
    <div
      ref={containerRef}
      data-tour="map-filters"
      className="pointer-events-auto relative flex flex-wrap items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-white/95 dark:bg-[#0F172A]/85 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.09] shadow-lg dark:shadow-[0_12px_36px_rgba(0,0,0,0.45)] transition-all duration-300 max-w-[calc(100vw-24px)]"
    >
      {/* ── 1. BARANGAY FILTER SEGMENT ── */}
      <div className="relative" data-tour="barangay-filter">
        <button
          onClick={() => toggleDropdown("barangay")}
          className={`flex items-center gap-2 sm:gap-2.5 h-10 sm:h-11 px-3 sm:px-3.5 rounded-xl transition-all duration-200 cursor-pointer text-[13px] sm:text-[14px] font-medium ${
            isBarangayActive
              ? "bg-[#0EA5E9]/12 text-[#0284C7] dark:text-[#38BDF8] border border-[#0EA5E9]/30"
              : activeDropdown === "barangay"
              ? "bg-slate-100 dark:bg-white/[0.08] text-slate-900 dark:text-white"
              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white"
          }`}
          title={selectedBarangay || "Filter by Barangay"}
        >
          <MapPin className={`h-4 w-4 shrink-0 transition-transform ${isBarangayActive ? "text-[#0EA5E9]" : "text-slate-400 dark:text-slate-400"}`} />
          <span className="truncate max-w-[110px] sm:max-w-[140px]" style={{ fontFamily: "var(--font-inter)" }}>
            {selectedBarangay || "Barangay"}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${
              activeDropdown === "barangay" ? "rotate-180 text-[#0EA5E9]" : ""
            }`}
          />

          {/* Clear button if active */}
          {isBarangayActive && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBarangay(null);
              }}
              className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center bg-[#0EA5E9]/20 hover:bg-red-500 hover:text-white text-[#0EA5E9] dark:text-[#38BDF8] transition-colors"
              title="Clear barangay filter"
            >
              <X className="h-2.5 w-2.5" />
            </div>
          )}
        </button>

        {/* Barangay Dropdown */}
        {activeDropdown === "barangay" && (
          <div className="absolute top-[calc(100%+8px)] left-0 min-w-[280px] sm:min-w-[300px] rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-left">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#0EA5E9] via-[#06B6D4] to-transparent" />
            
            {/* Search header */}
            <div className="p-3 border-b border-slate-100 dark:border-white/[0.06]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search barangay…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.06] rounded-xl py-2 pl-9 pr-3 text-[13px] text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0EA5E9]/50 transition-colors"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[260px] py-1 custom-scrollbar">
              {/* Option to clear / All */}
              <button
                onClick={() => {
                  setSelectedBarangay(null);
                  setActiveDropdown(null);
                  setSearchQuery("");
                }}
                className={`flex items-center justify-between w-full text-left px-4 py-2 text-[13px] font-medium transition-colors ${
                  !selectedBarangay
                    ? "text-[#0EA5E9] bg-[#0EA5E9]/10 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>All Barangays (Municipality Wide)</span>
                {!selectedBarangay && <Check className="h-3.5 w-3.5 text-[#0EA5E9]" />}
              </button>

              {filteredBarangays.length === 0 ? (
                <div className="p-4 text-[13px] text-slate-400 text-center">No barangays found</div>
              ) : (
                filteredBarangays.map((name) => (
                  <button
                    key={name}
                    onClick={() => {
                      setSelectedBarangay(name);
                      setActiveDropdown(null);
                      setSearchQuery("");
                    }}
                    className={`flex items-center justify-between w-full text-left px-4 py-2 text-[13px] font-medium transition-colors ${
                      selectedBarangay === name
                        ? "text-[#0EA5E9] bg-[#0EA5E9]/10 font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <span>{name}</span>
                    {selectedBarangay === name && <Check className="h-3.5 w-3.5 text-[#0EA5E9]" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-slate-200 dark:bg-white/[0.08] hidden sm:block my-auto" />

      {/* ── 2. CRIME TYPE FILTER SEGMENT ── */}
      <div className="relative" data-tour="crime-type-filter">
        <button
          onClick={() => toggleDropdown("crime")}
          className={`flex items-center gap-2 sm:gap-2.5 h-10 sm:h-11 px-3 sm:px-3.5 rounded-xl transition-all duration-200 cursor-pointer text-[13px] sm:text-[14px] font-medium ${
            isCrimeActive
              ? "bg-[#0EA5E9]/12 text-[#0284C7] dark:text-[#38BDF8] border border-[#0EA5E9]/30"
              : activeDropdown === "crime"
              ? "bg-slate-100 dark:bg-white/[0.08] text-slate-900 dark:text-white"
              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white"
          }`}
          title={selectedCrimeType || "Filter by Crime Type"}
        >
          {isCrimeActive ? (
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: getCrimeTypeColor(selectedCrimeType || "") }}
            />
          ) : (
            <Filter className="h-4 w-4 shrink-0 text-slate-400" />
          )}
          <span className="truncate max-w-[110px] sm:max-w-[140px]" style={{ fontFamily: "var(--font-inter)" }}>
            {selectedCrimeType || "Crime Type"}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${
              activeDropdown === "crime" ? "rotate-180 text-[#0EA5E9]" : ""
            }`}
          />

          {/* Clear button if active */}
          {isCrimeActive && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCrimeType(null);
              }}
              className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center bg-[#0EA5E9]/20 hover:bg-red-500 hover:text-white text-[#0EA5E9] dark:text-[#38BDF8] transition-colors"
              title="Clear crime type filter"
            >
              <X className="h-2.5 w-2.5" />
            </div>
          )}
        </button>

        {/* Crime Type Dropdown */}
        {activeDropdown === "crime" && (
          <div className="absolute top-[calc(100%+8px)] left-0 sm:left-auto sm:right-0 sm:origin-top-right min-w-[280px] sm:min-w-[300px] rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-left">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#0EA5E9] via-[#06B6D4] to-transparent" />
            
            <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-white/[0.06]">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Incident Classification
              </span>
              {selectedCrimeType && (
                <button
                  onClick={() => setSelectedCrimeType(null)}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[300px] py-1 custom-scrollbar">
              {/* All Crime Types option */}
              <button
                onClick={() => {
                  setSelectedCrimeType(null);
                  setActiveDropdown(null);
                }}
                className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors ${
                  !selectedCrimeType
                    ? "text-[#0EA5E9] bg-[#0EA5E9]/10 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400/50" />
                  <span>All Crime Types</span>
                </div>
                {!selectedCrimeType && <Check className="h-3.5 w-3.5 text-[#0EA5E9]" />}
              </button>

              {crimeLoading ? (
                <div className="p-4 text-[13px] text-slate-400 text-center">Loading crime types...</div>
              ) : crimeStats.length === 0 ? (
                <div className="p-4 text-[13px] text-slate-400 text-center">No crime types recorded</div>
              ) : (
                crimeStats.map((item) => {
                  const color = getCrimeTypeColor(item.type);
                  const isSelected = selectedCrimeType === item.type;

                  return (
                    <button
                      key={item.type}
                      onClick={() => {
                        setSelectedCrimeType(item.type);
                        setActiveDropdown(null);
                      }}
                      className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-[13px] transition-colors ${
                        isSelected
                          ? "bg-[#0EA5E9]/10 text-[#0EA5E9] font-semibold"
                          : "hover:bg-slate-50 dark:hover:bg-white/[0.04] text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="truncate">{item.type}</span>
                      </div>
                      <div
                        className="min-w-[28px] h-5 px-1.5 rounded-md flex items-center justify-center text-[11px] font-bold tabular-nums text-white shrink-0"
                        style={{ backgroundColor: color, opacity: isSelected ? 1 : 0.85 }}
                      >
                        {item.count}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-slate-200 dark:bg-white/[0.08] hidden sm:block my-auto" />

      {/* ── 3. TIME SELECTOR FILTER SEGMENT ── */}
      <div className="relative" data-tour="time-selector">
        <button
          onClick={() => toggleDropdown("time")}
          className={`flex items-center gap-2 sm:gap-2.5 h-10 sm:h-11 px-3 sm:px-3.5 rounded-xl transition-all duration-200 cursor-pointer text-[13px] sm:text-[14px] font-medium ${
            isTimeActive
              ? "bg-[#0EA5E9]/12 text-[#0284C7] dark:text-[#38BDF8] border border-[#0EA5E9]/30"
              : activeDropdown === "time"
              ? "bg-slate-100 dark:bg-white/[0.08] text-slate-900 dark:text-white"
              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white"
          }`}
          title={getTimeDisplayText()}
        >
          <Clock className={`h-4 w-4 shrink-0 transition-transform ${isTimeActive ? "text-[#0EA5E9]" : "text-slate-400"}`} />
          <span className="truncate max-w-[110px] sm:max-w-[140px]" style={{ fontFamily: "var(--font-inter)" }}>
            {getTimeDisplayText()}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${
              activeDropdown === "time" ? "rotate-180 text-[#0EA5E9]" : ""
            }`}
          />

          {/* Clear button if active */}
          {isTimeActive && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                clearTimeSelections();
              }}
              className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center bg-[#0EA5E9]/20 hover:bg-red-500 hover:text-white text-[#0EA5E9] dark:text-[#38BDF8] transition-colors"
              title="Clear time filter"
            >
              <X className="h-2.5 w-2.5" />
            </div>
          )}
        </button>

        {/* Time Selector Dropdown */}
        {activeDropdown === "time" && (
          <div className="absolute top-[calc(100%+8px)] left-0 sm:left-auto sm:right-0 sm:origin-top-right w-[340px] sm:w-[400px] max-w-[calc(100vw-24px)] rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-left">
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#0EA5E9] via-[#06B6D4] to-transparent" />

            <div className="p-4 sm:p-5">
              {/* Step 1: Select Year */}
              {!currentYear ? (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-3">
                    Select Target Year
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {availableYears.map((year) => (
                      <button
                        key={year}
                        onClick={() => selectYear(year)}
                        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800 dark:border-slate-700"
                      >
                        <span className="text-[14px] font-semibold">{year}</span>
                        <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Year Header with Back Button */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                    <button
                      onClick={() => {
                        setCurrentYear(null);
                        clearTimeSelections();
                      }}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                      <ChevronDown className="h-3.5 w-3.5 rotate-90" />
                      <span>Change Year</span>
                    </button>
                    <div className="text-base font-bold text-slate-900 dark:text-white">
                      {currentYear}
                    </div>
                    {timeRange.selections.length > 0 ? (
                      <button
                        onClick={clearTimeSelections}
                        className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                      >
                        Clear
                      </button>
                    ) : (
                      <div className="w-8" />
                    )}
                  </div>

                  {/* Period Mode Tabs */}
                  <div className="mb-4">
                    <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">
                      Filter Period
                    </div>
                    <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/[0.04]">
                      {(["half-year", "quarter", "month", "day"] as FilterMode[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => {
                            setFilterMode(mode);
                            setTimeRange({ mode, selections: [] });
                          }}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                            filterMode === mode
                              ? "bg-white text-[#0EA5E9] shadow-sm dark:bg-[#0F172A] dark:text-[#0EA5E9]"
                              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                          }`}
                        >
                          {mode === "half-year" ? "Half" : mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Period selection contents */}
                  <div className="max-h-[260px] overflow-y-auto custom-scrollbar">
                    {/* Quarter Mode */}
                    {filterMode === "quarter" && (
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map((quarter) => (
                          <button
                            key={`q${quarter}`}
                            onClick={() => toggleQuarterSelect(quarter)}
                            className={`relative px-3 py-3 rounded-xl text-center transition-all ${
                              isQuarterSelected(currentYear, quarter)
                                ? "bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/40 dark:bg-[#0EA5E9]/20"
                                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-slate-700"
                            }`}
                          >
                            {isQuarterSelected(currentYear, quarter) && (
                              <div className="absolute top-1.5 right-1.5">
                                <Check className="h-3 w-3 text-[#0EA5E9]" />
                              </div>
                            )}
                            <div className="text-sm font-semibold">Q{quarter}</div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Half-Year Mode */}
                    {filterMode === "half-year" && (
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2].map((half) => (
                          <button
                            key={`h${half}`}
                            onClick={() => toggleHalfYearSelect(half)}
                            className={`relative px-4 py-3 rounded-xl text-center transition-all ${
                              isHalfYearSelected(currentYear, half)
                                ? "bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/40 dark:bg-[#0EA5E9]/20"
                                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-slate-700"
                            }`}
                          >
                            {isHalfYearSelected(currentYear, half) && (
                              <div className="absolute top-1.5 right-1.5">
                                <Check className="h-3 w-3 text-[#0EA5E9]" />
                              </div>
                            )}
                            <div className="text-sm font-semibold">H{half}</div>
                            <div className="text-xs mt-0.5 text-slate-400">
                              {half === 1 ? "Jan – Jun" : "Jul – Dec"}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Month Mode */}
                    {filterMode === "month" && (
                      <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <button
                            key={`m${month}`}
                            onClick={() => toggleMonthSelect(month)}
                            className={`relative px-3 py-2.5 rounded-xl text-center transition-all ${
                              isMonthSelected(currentYear, month)
                                ? "bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/40 dark:bg-[#0EA5E9]/20"
                                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-slate-700"
                            }`}
                          >
                            {isMonthSelected(currentYear, month) && (
                              <div className="absolute top-1.5 right-1.5">
                                <Check className="h-3 w-3 text-[#0EA5E9]" />
                              </div>
                            )}
                            <div className="text-xs font-semibold">{monthAbbr[month - 1]}</div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Day Mode */}
                    {filterMode === "day" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold mb-2 text-slate-600 dark:text-slate-400">
                            Custom Date
                          </label>
                          <input
                            type="date"
                            onChange={(e) => {
                              if (e.target.value) {
                                toggleDaySelect(new Date(e.target.value));
                              }
                            }}
                            className="w-full px-3.5 py-2 rounded-xl text-sm border bg-white border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-200 outline-none focus:border-[#0EA5E9]/50"
                          />
                        </div>

                        {/* Quick date shortcuts */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => toggleDaySelect(new Date())}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-slate-700 transition-colors"
                          >
                            Today
                          </button>
                          <button
                            onClick={() => {
                              const y = new Date();
                              y.setDate(y.getDate() - 1);
                              toggleDaySelect(y);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-slate-700 transition-colors"
                          >
                            Yesterday
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── 4. GLOBAL RESET / ACTIVE COUNT BUTTON ── */}
      {activeFiltersCount > 0 && (
        <>
          <div className="h-5 w-px bg-slate-200 dark:bg-white/[0.08] hidden sm:block my-auto" />
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 h-10 sm:h-11 px-2.5 sm:px-3 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white dark:bg-red-500/15 dark:hover:bg-red-500 dark:text-red-400 dark:hover:text-white transition-all duration-200 text-xs font-semibold cursor-pointer shrink-0"
            title="Clear all applied filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Reset</span>
            <span className="w-4 h-4 rounded-full bg-red-500/20 group-hover:bg-white/20 text-[10px] flex items-center justify-center">
              {activeFiltersCount}
            </span>
          </button>
        </>
      )}
    </div>
  );
}
