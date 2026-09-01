"use client";

import { useState, useRef, useEffect } from "react";
import { Clock, ChevronDown, Check, X } from "lucide-react";
import { useMapContext, FilterMode } from "@/context/MapContext";

export default function TimeSelector() {
  const { selectedYear, availableYears, setSelectedYear, timeRange, setTimeRange } = useMapContext();
  const [isOpen, setIsOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>(timeRange.mode);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Sync filter mode with timeRange from context
  useEffect(() => {
    setFilterMode(timeRange.mode);
  }, [timeRange.mode]);

  // Set current year from selections
  useEffect(() => {
    if (timeRange.selections.length > 0) {
      setCurrentYear(timeRange.selections[0].year);
    }
  }, [timeRange.selections]);

  const isQuarterSelected = (year: number, quarter: number) => {
    return timeRange.mode === 'quarter' && 
           timeRange.selections.some(s => s.year === year && s.quarter === quarter);
  };

  const isHalfYearSelected = (year: number, halfYear: number) => {
    return timeRange.mode === 'half-year' && 
           timeRange.selections.some(s => s.year === year && s.halfYear === halfYear);
  };

  const isMonthSelected = (year: number, month: number) => {
    return timeRange.mode === 'month' && 
           timeRange.selections.some(s => s.year === year && s.month === month);
  };

  const isDaySelected = (date: Date) => {
    return timeRange.mode === 'day' && 
           timeRange.selections.some(s => 
             s.day && s.day.toDateString() === date.toDateString()
           );
  };

  const selectYear = (year: number) => {
    setCurrentYear(year);
    setSelectedYear(year);
    // Clear previous selections when changing year
    const newTimeRange = { mode: filterMode, selections: [] };
    setTimeRange(newTimeRange);
  };

  const toggleQuarterSelect = (quarter: number) => {
    if (!currentYear) return;
    
    const isSelected = isQuarterSelected(currentYear, quarter);
    const currentYearSelections = timeRange.selections.filter(s => s.year === currentYear);
    
    const newSelections = isSelected
      ? currentYearSelections.filter(s => s.quarter !== quarter)
      : [...currentYearSelections, { year: currentYear, quarter }];
    
    const newTimeRange = { mode: 'quarter' as FilterMode, selections: newSelections };
    setTimeRange(newTimeRange);
  };

  const toggleHalfYearSelect = (halfYear: number) => {
    if (!currentYear) return;
    
    const isSelected = isHalfYearSelected(currentYear, halfYear);
    const currentYearSelections = timeRange.selections.filter(s => s.year === currentYear);
    
    const newSelections = isSelected
      ? currentYearSelections.filter(s => s.halfYear !== halfYear)
      : [...currentYearSelections, { year: currentYear, halfYear }];
    
    const newTimeRange = { mode: 'half-year' as FilterMode, selections: newSelections };
    setTimeRange(newTimeRange);
  };

  const toggleMonthSelect = (month: number) => {
    if (!currentYear) return;
    
    const isSelected = isMonthSelected(currentYear, month);
    const currentYearSelections = timeRange.selections.filter(s => s.year === currentYear);
    
    const newSelections = isSelected
      ? currentYearSelections.filter(s => s.month !== month)
      : [...currentYearSelections, { year: currentYear, month }];
    
    const newTimeRange = { mode: 'month' as FilterMode, selections: newSelections };
    setTimeRange(newTimeRange);
  };

  const toggleDaySelect = (date: Date) => {
    const isSelected = isDaySelected(date);
    const newSelections = isSelected
      ? timeRange.selections.filter(s => 
          !(s.day && s.day.toDateString() === date.toDateString())
        )
      : [...timeRange.selections, { year: date.getFullYear(), day: date }];
    
    const newTimeRange = { mode: 'day' as FilterMode, selections: newSelections };
    setTimeRange(newTimeRange);
  };

  const clearAllSelections = () => {
    const newTimeRange = { ...timeRange, selections: [] };
    setTimeRange(newTimeRange);
    setSelectedYear(null);
  };

  const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getDisplayText = () => {
    if (!currentYear) {
      return 'Time Range';
    }

    const count = timeRange.selections.length;
    
    if (count === 0) {
      return `${currentYear}`;
    }

    switch (timeRange.mode) {
      case 'quarter':
        if (count === 1) {
          const s = timeRange.selections[0];
          return `Q${s.quarter} ${s.year}`;
        }
        return `${count} Quarters (${currentYear})`;
      case 'half-year':
        if (count === 1) {
          const s = timeRange.selections[0];
          return `H${s.halfYear} ${s.year}`;
        }
        return `${count} Halves (${currentYear})`;
      case 'month':
        if (count === 1) {
          const s = timeRange.selections[0];
          return `${monthAbbr[s.month! - 1]} ${s.year}`;
        }
        return `${count} Months (${currentYear})`;
      case 'day':
        if (count === 1) {
          return timeRange.selections[0].day?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || '';
        }
        return `${count} Days`;
      default:
        return `${currentYear}`;
    }
  };

  if (availableYears.length === 0) {
    return null;
  }

  if (!mounted) {
    return (
      <div className="pointer-events-auto relative">
        <div className="h-12 w-12 rounded-xl bg-white/90 dark:bg-[#0F172A]/70 border border-slate-200 dark:border-white/[0.08]" />
      </div>
    );
  }

  const hasActiveSelection = selectedYear !== null || timeRange.selections.length > 0;

  return (
    <div ref={dropdownRef} data-tour="time-selector" className="pointer-events-auto relative">
      {/* ── Trigger Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 h-12 pl-4 pr-5 rounded-xl bg-white/90 dark:bg-[#0F172A]/70 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-[#0EA5E9]/20 hover:bg-white dark:hover:bg-[#0F172A]/90 transition-all duration-300 cursor-pointer group shadow-sm dark:shadow-none ${
          hasActiveSelection ? "border-[#0EA5E9]/40 dark:border-[#0EA5E9]/30" : ""
        }`}
        title={mounted ? getDisplayText() : "Select Time Range"}
      >
        <Clock className="h-4 w-4 text-[#0EA5E9] group-hover:scale-110 transition-transform" />
        <span
          className="text-[14px] font-medium text-slate-700 dark:text-white/80 whitespace-nowrap"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {hasActiveSelection ? getDisplayText() : "Select Time Range"}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-500 group-hover:text-[#0EA5E9] transition-all duration-300 ${isOpen ? "rotate-180" : ""}`}
        />

        {/* Clear button when selected */}
        {hasActiveSelection && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              clearAllSelections();
            }}
            className="ml-1 w-5 h-5 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
            title="Clear time filter"
          >
            <X className="h-3 w-3" />
          </div>
        )}
      </button>

      {/* ── Dropdown ── */}
      <div
        className={`absolute top-[calc(100%+8px)] left-0 w-[360px] sm:w-[420px] max-w-[calc(100vw-24px)] rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 origin-top-left z-50 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#0EA5E9]/40 via-transparent to-transparent" />

        <div className="p-5">
          {/* Step 1: Select Year */}
          {!currentYear ? (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 mb-3">
                Select Year
              </div>
              <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => selectYear(year)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white dark:border-slate-700"
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
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-white/[0.04]">
                <button
                  onClick={() => {
                    setCurrentYear(null);
                    clearAllSelections();
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
                    onClick={clearAllSelections}
                    className="text-xs font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    Clear
                  </button>
                ) : (
                  <div className="w-8" />
                )}
              </div>

              {/* Step 2: Filter Mode Tabs */}
              <div className="mb-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 mb-2">
                  Select Period
                </div>
                <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/[0.04]">
                  {(['half-year', 'quarter', 'month', 'day'] as FilterMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setFilterMode(mode);
                        const newTimeRange = { mode, selections: [] };
                        setTimeRange(newTimeRange);
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                        filterMode === mode
                          ? "bg-white text-[#0EA5E9] shadow-sm dark:bg-[#0F172A] dark:text-[#0EA5E9]"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      {mode === 'half-year' ? 'Half' : mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content based on filter mode */}
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {/* Quarter Mode */}
                {filterMode === 'quarter' && (
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((quarter) => (
                      <button
                        key={`q${quarter}`}
                        onClick={() => toggleQuarterSelect(quarter)}
                        className={`relative px-3 py-3 rounded-xl text-center transition-all ${
                          isQuarterSelected(currentYear, quarter)
                            ? "bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/40 dark:bg-[#0EA5E9]/20 dark:text-[#0EA5E9] dark:border-[#0EA5E9]/50"
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
                {filterMode === 'half-year' && (
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2].map((half) => (
                      <button
                        key={`h${half}`}
                        onClick={() => toggleHalfYearSelect(half)}
                        className={`relative px-4 py-3 rounded-xl text-center transition-all ${
                          isHalfYearSelected(currentYear, half)
                            ? "bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/40 dark:bg-[#0EA5E9]/20 dark:text-[#0EA5E9] dark:border-[#0EA5E9]/50"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-slate-700"
                        }`}
                      >
                        {isHalfYearSelected(currentYear, half) && (
                          <div className="absolute top-1.5 right-1.5">
                            <Check className="h-3 w-3 text-[#0EA5E9]" />
                          </div>
                        )}
                        <div className="text-sm font-semibold">H{half}</div>
                        <div className="text-xs mt-0.5 text-slate-400 dark:text-slate-500">
                          {half === 1 ? 'Jan – Jun' : 'Jul – Dec'}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Month Mode */}
                {filterMode === 'month' && (
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <button
                        key={`m${month}`}
                        onClick={() => toggleMonthSelect(month)}
                        className={`relative px-3 py-2.5 rounded-xl text-center transition-all ${
                          isMonthSelected(currentYear, month)
                            ? "bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/40 dark:bg-[#0EA5E9]/20 dark:text-[#0EA5E9] dark:border-[#0EA5E9]/50"
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

                {/* Day Mode - Calendar Picker */}
                {filterMode === 'day' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold mb-2 text-slate-600 dark:text-slate-400">
                        Select Date
                      </label>
                      <input
                        type="date"
                        onChange={(e) => {
                          if (e.target.value) {
                            toggleDaySelect(new Date(e.target.value));
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-xl text-sm border transition-all bg-white border-slate-200 text-slate-700 focus:border-[#0EA5E9]/40 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-200 dark:focus:border-[#0EA5E9]/30 dark:focus:bg-slate-800"
                      />
                    </div>
                    
                    {/* Quick date shortcuts */}
                    <div>
                      <label className="block text-xs font-semibold mb-2 text-slate-600 dark:text-slate-400">
                        Quick Select
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => toggleDaySelect(new Date())}
                          className="px-3 py-2 rounded-lg text-xs font-medium transition-all bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-slate-700"
                        >
                          Today
                        </button>
                        <button
                          onClick={() => {
                            const yesterday = new Date();
                            yesterday.setDate(yesterday.getDate() - 1);
                            toggleDaySelect(yesterday);
                          }}
                          className="px-3 py-2 rounded-lg text-xs font-medium transition-all bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-slate-700"
                        >
                          Yesterday
                        </button>
                      </div>
                    </div>

                    {/* Selected days list */}
                    {timeRange.selections.length > 0 && (
                      <div>
                        <label className="block text-xs font-semibold mb-2 text-slate-600 dark:text-slate-400">
                          Selected Days ({timeRange.selections.length})
                        </label>
                        <div className="space-y-1 max-h-28 overflow-y-auto custom-scrollbar">
                          {timeRange.selections.map((selection, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs bg-[#0EA5E9]/10 text-[#0EA5E9] dark:bg-[#0EA5E9]/20"
                            >
                              <span>{selection.day?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              <button
                                onClick={() => selection.day && toggleDaySelect(selection.day)}
                                className="hover:text-red-500 font-bold ml-2"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
