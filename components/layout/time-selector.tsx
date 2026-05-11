"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
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
    console.log('📅 Year selected:', year);
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
    
    console.log('📅 Quarters selected:', newSelections.map(s => `Q${s.quarter} ${s.year}`));
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
    
    console.log('📅 Half-years selected:', newSelections.map(s => `H${s.halfYear} ${s.year}`));
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
    
    console.log('📅 Months selected:', newSelections.map(s => `${monthAbbr[s.month! - 1]} ${s.year}`));
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
    
    console.log('📅 Days selected:', newSelections.map(s => s.day?.toLocaleDateString()));
  };

  const clearAllSelections = () => {
    const newTimeRange = { ...timeRange, selections: [] };
    setTimeRange(newTimeRange);
    setSelectedYear(null);
  };

  const getDisplayText = () => {
    if (!currentYear) {
      return 'Select Year';
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
        return `${count} Half-years (${currentYear})`;
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

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (availableYears.length === 0) {
    return null;
  }

  const theme = "dark";

  if (!mounted) {
    return (
      <div className="relative">
        <div className="w-10 h-10 rounded-lg border bg-white/[0.04] border-white/[0.08]" />
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button - Icon Only */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-200 cursor-pointer ${
          theme === "dark"
            ? "bg-white/[0.04] border-white/[0.08] hover:border-blue-500/30 hover:bg-white/[0.06] text-blue-400"
            : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-sm text-blue-500"
        }`}
        title={mounted ? getDisplayText() : "Select Time Range"}
      >
        <Calendar className="h-4 w-4" />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute top-[calc(100%+8px)] right-0 w-[420px] rounded-xl border overflow-hidden transition-all duration-200 origin-top-right z-50 ${
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

        <div className="p-5">
          {/* Step 1: Select Year */}
          {!currentYear ? (
            <div>
              <label className={`block text-xs font-semibold mb-3 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                Select Year
              </label>
              <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => selectYear(year)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      theme === "dark"
                        ? "bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <span className="text-base">{year}</span>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Year Header with Back Button */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {
                    setCurrentYear(null);
                    clearAllSelections();
                  }}
                  className={`flex items-center gap-2 text-sm font-medium transition-all ${
                    theme === "dark" ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                  <span>Back</span>
                </button>
                <div className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                  {currentYear}
                </div>
                {timeRange.selections.length > 0 && (
                  <button
                    onClick={clearAllSelections}
                    className={`text-xs font-semibold transition-all ${
                      theme === "dark" ? "text-slate-400 hover:text-slate-300" : "text-slate-600 hover:text-slate-700"
                    }`}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Step 2: Filter Mode Tabs */}
              <div className="mb-5">
                <label className={`block text-xs font-semibold mb-3 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                  Select Period
                </label>
                <div className="flex gap-2 border-b border-slate-700 pb-2">
                  {(['half-year', 'quarter', 'month', 'day'] as FilterMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setFilterMode(mode);
                        const newTimeRange = { mode, selections: [] };
                        setTimeRange(newTimeRange);
                      }}
                      className={`px-3 py-2 rounded-t-lg text-sm font-medium transition-all capitalize ${
                        filterMode === mode
                          ? theme === "dark"
                            ? "bg-slate-800 text-white border-b-2 border-blue-400"
                            : "bg-slate-100 text-slate-900 border-b-2 border-blue-600"
                          : theme === "dark"
                            ? "text-slate-400 hover:text-slate-300"
                            : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {mode === 'half-year' ? 'Half' : mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content based on filter mode */}
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {/* Quarter Mode */}
                {filterMode === 'quarter' && (
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((quarter) => (
                      <button
                        key={`q${quarter}`}
                        onClick={() => toggleQuarterSelect(quarter)}
                        className={`relative px-4 py-3 rounded-lg text-center transition-all ${
                          isQuarterSelected(currentYear, quarter)
                            ? theme === "dark"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                              : "bg-blue-50 text-blue-600 border border-blue-300"
                            : theme === "dark"
                              ? "bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                        }`}
                      >
                        {isQuarterSelected(currentYear, quarter) && (
                          <div className="absolute top-1 right-1">
                            <Check className="h-3 w-3 text-blue-400" />
                          </div>
                        )}
                        <div className="text-base font-semibold">Q{quarter}</div>
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
                        className={`relative px-4 py-3 rounded-lg text-center transition-all ${
                          isHalfYearSelected(currentYear, half)
                            ? theme === "dark"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                              : "bg-blue-50 text-blue-600 border border-blue-300"
                            : theme === "dark"
                              ? "bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                        }`}
                      >
                        {isHalfYearSelected(currentYear, half) && (
                          <div className="absolute top-1 right-1">
                            <Check className="h-3 w-3 text-blue-400" />
                          </div>
                        )}
                        <div className="text-base font-semibold">H{half}</div>
                        <div className={`text-xs mt-1 ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
                          {half === 1 ? 'Jan-Jun' : 'Jul-Dec'}
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
                        className={`relative px-3 py-2.5 rounded-lg text-center transition-all ${
                          isMonthSelected(currentYear, month)
                            ? theme === "dark"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                              : "bg-blue-50 text-blue-600 border border-blue-300"
                            : theme === "dark"
                              ? "bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                        }`}
                      >
                        {isMonthSelected(currentYear, month) && (
                          <div className="absolute top-1 right-1">
                            <Check className="h-3 w-3 text-blue-400" />
                          </div>
                        )}
                        <div className="text-sm font-semibold">{monthAbbr[month - 1]}</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Day Mode - Calendar Picker */}
                {filterMode === 'day' && (
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-xs font-semibold mb-2 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                        Select Date
                      </label>
                      <input
                        type="date"
                        onChange={(e) => {
                          if (e.target.value) {
                            toggleDaySelect(new Date(e.target.value));
                          }
                        }}
                        className={`w-full px-4 py-3 rounded-lg text-sm border transition-all ${
                          theme === "dark"
                            ? "bg-slate-800/50 border-slate-700 text-slate-200 focus:border-blue-500/50 focus:bg-slate-800"
                            : "bg-white border-slate-200 text-slate-700 focus:border-blue-400"
                        }`}
                      />
                    </div>
                    
                    {/* Quick date shortcuts */}
                    <div>
                      <label className={`block text-xs font-semibold mb-2 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                        Quick Select
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => toggleDaySelect(new Date())}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            theme === "dark"
                              ? "bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                          }`}
                        >
                          Today
                        </button>
                        <button
                          onClick={() => {
                            const yesterday = new Date();
                            yesterday.setDate(yesterday.getDate() - 1);
                            toggleDaySelect(yesterday);
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            theme === "dark"
                              ? "bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                          }`}
                        >
                          Yesterday
                        </button>
                        <button
                          onClick={() => {
                            const lastWeek = new Date();
                            lastWeek.setDate(lastWeek.getDate() - 7);
                            toggleDaySelect(lastWeek);
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            theme === "dark"
                              ? "bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                          }`}
                        >
                          Last Week
                        </button>
                        <button
                          onClick={() => {
                            const lastMonth = new Date();
                            lastMonth.setMonth(lastMonth.getMonth() - 1);
                            toggleDaySelect(lastMonth);
                          }}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            theme === "dark"
                              ? "bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                          }`}
                        >
                          Last Month
                        </button>
                      </div>
                    </div>

                    {/* Selected days list */}
                    {timeRange.selections.length > 0 && (
                      <div>
                        <label className={`block text-xs font-semibold mb-2 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                          Selected Days ({timeRange.selections.length})
                        </label>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {timeRange.selections.map((selection, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                                theme === "dark"
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "bg-blue-50 text-blue-600"
                              }`}
                            >
                              <span>{selection.day?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              <button
                                onClick={() => selection.day && toggleDaySelect(selection.day)}
                                className="hover:text-red-400"
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
