"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Clock, ChevronDown, X } from "lucide-react";
import { useMapContext } from "@/context/MapContext";
import { useTimeRangeData } from "@/hooks/useTimeRangeData";
import { toInputDate, fromInputDate } from "@/lib/date-input";
import {
  monthKey,
  yearKeys,
  timeRangeToKeys,
  keysToTimeRange,
  describeKeys,
  keyYear,
} from "@/lib/period-grid";

interface TimeSelectorProps {
  /** Adds a "Custom range" tab for picking exact start/end dates. Only pages
   *  whose data respects `customDateRange` should turn this on. Without it the
   *  dropdown offers "Specific days" instead. */
  allowCustomRange?: boolean;
}

type Panel = "period" | "days" | "range";

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const QUARTERS = [1, 2, 3, 4];

const shortDate = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const labelClass = "text-[12px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500";
const chipBase = "rounded-xl text-center transition-all border";
const chipOn =
  "bg-[#0EA5E9]/15 text-[#0EA5E9] border-[#0EA5E9]/40 dark:bg-[#0EA5E9]/20 dark:border-[#0EA5E9]/50";
const chipOff =
  "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:border-slate-700";
const dateInputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition-all [color-scheme:light] focus:border-[#0EA5E9]/40 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:[color-scheme:dark]";

/**
 * Period control for the dashboard pages.
 *
 * The page opens on the latest year, and that's the state most people leave it
 * in — so the trigger stays quiet ("Latest year") rather than repeating a year
 * everyone already knows, and lights up only once you've moved off it.
 *
 * Backing up is a single grid: a row per year, a cell per month. Click a cell
 * for a month, a year label for the whole year, a Q header for that quarter
 * (across every year), or drag along a row for a span. A plain click replaces
 * the selection; turn on Multi-select (or hold Ctrl/Cmd/Shift) to add to it.
 */
export default function TimeSelector({ allowCustomRange = false }: TimeSelectorProps) {
  const {
    selectedYear,
    availableYears,
    setSelectedYear,
    timeRange,
    setTimeRange: setPeriod,
    customDateRange,
    setCustomDateRange,
  } = useMapContext();
  const effectiveRanges = useTimeRangeData();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [multi, setMulti] = useState(false);
  const [drag, setDrag] = useState<{ year: number; a: number; b: number; additive: boolean } | null>(null);
  const [panel, setPanel] = useState<Panel>(
    customDateRange
      ? "range"
      : timeRange.mode === "day" && timeRange.selections.length > 0 && !allowCustomRange
        ? "days"
        : "period"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Picking any period replaces an exact date window, so the two never fight
  // over which one the page is actually using.
  const setTimeRange: typeof setPeriod = (next) => {
    setCustomDateRange(null);
    setPeriod(next);
  };

  // Same rule the context uses for its initial pick: this year if there's data
  // for it, otherwise the most recent year that has any.
  const now = new Date();
  const thisYear = now.getFullYear();
  const nowKey = monthKey(thisYear, now.getMonth() + 1);
  const defaultYear = availableYears.includes(thisYear)
    ? thisYear
    : availableYears.length > 0
      ? Math.max(...availableYears)
      : thisYear;

  const keys = useMemo(
    () => timeRangeToKeys(timeRange, selectedYear ?? defaultYear),
    [timeRange, selectedYear, defaultYear]
  );
  const daysMode = timeRange.mode === "day" && timeRange.selections.length > 0;

  // Which year the month grid is showing. Follows the selection until you
  // click a year chip; the chips are how you move between years.
  const [viewYear, setViewYear] = useState<number | null>(null);
  const focusYear =
    viewYear ?? (keys.size > 0 ? Math.max(...Array.from(keys, keyYear)) : defaultYear);

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

  const save = (next: Set<number>) => {
    setSelectedYear(Math.max(...Array.from(next, keyYear)));
    setTimeRange(keysToTimeRange(next));
  };

  const resetToDefault = () => {
    setCustomDateRange(null);
    setPanel("period");
    setViewYear(null);
    setSelectedYear(defaultYear);
    setPeriod({ mode: "year", selections: [{ year: defaultYear }] });
  };

  /** Replace the selection with `cells`, or with `additive` add/remove them. */
  const applyCells = (cells: number[], additive: boolean) => {
    if (cells.length === 0) return;
    let next: Set<number>;
    if (additive) {
      const allIn = cells.every((k) => keys.has(k));
      next = new Set(keys);
      cells.forEach((k) => (allIn ? next.delete(k) : next.add(k)));
    } else {
      next = new Set(cells);
    }
    if (next.size === 0) resetToDefault();
    else save(next);
  };

  // A drag is committed on release, wherever the pointer ends up.
  useEffect(() => {
    if (!drag) return;
    const release = () => {
      const [lo, hi] = drag.a <= drag.b ? [drag.a, drag.b] : [drag.b, drag.a];
      const cells: number[] = [];
      for (let m = lo; m <= hi; m++) cells.push(monthKey(drag.year, m));
      applyCells(cells.filter((k) => k <= nowKey), drag.additive);
      setDrag(null);
    };
    window.addEventListener("pointerup", release);
    return () => window.removeEventListener("pointerup", release);
    // applyCells closes over the latest selection; re-subscribing on every drag
    // change is cheap and keeps it current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag, keys, nowKey]);

  const inDrag = (year: number, month: number) => {
    if (!drag || drag.year !== year) return false;
    const [lo, hi] = drag.a <= drag.b ? [drag.a, drag.b] : [drag.b, drag.a];
    return month >= lo && month <= hi;
  };

  /** Multi-select on, or Ctrl/Cmd/Shift held: add to the selection instead of replacing it. */
  const additiveFrom = (e: { ctrlKey: boolean; metaKey: boolean; shiftKey: boolean }) =>
    multi || e.ctrlKey || e.metaKey || e.shiftKey;

  // ── Specific days (used where there's no custom range tab) ──
  const isDaySelected = (date: Date) =>
    timeRange.mode === "day" &&
    timeRange.selections.some((s) => s.day && s.day.toDateString() === date.toDateString());

  const toggleDaySelect = (date: Date) => {
    const next = isDaySelected(date)
      ? timeRange.selections.filter((s) => !(s.day && s.day.toDateString() === date.toDateString()))
      : [...(timeRange.mode === "day" ? timeRange.selections : []), { year: date.getFullYear(), day: date }];
    setTimeRange({ mode: "day", selections: next });
  };

  // ── Custom range ──
  const rangeStart = customDateRange
    ? customDateRange.start
    : effectiveRanges.length > 0
      ? new Date(Math.min(...effectiveRanges.map((r) => r.start.getTime())))
      : new Date();
  const rangeEnd = customDateRange
    ? customDateRange.end
    : effectiveRanges.length > 0
      ? new Date(Math.max(...effectiveRanges.map((r) => r.end.getTime())))
      : new Date();

  const applyRange = (startValue: string, endValue: string) => {
    const start = fromInputDate(startValue, false);
    const end = fromInputDate(endValue, true);
    if (!start || !end) return;
    // The inputs' min/max stop the picker from making an end before the
    // start, but a typed date can — collapse that to a single day.
    setCustomDateRange({ start, end: end < start ? fromInputDate(startValue, true)! : end });
  };

  const applyLastDays = (days: number, endOffset = 0) => {
    const end = new Date();
    end.setDate(end.getDate() - endOffset);
    const start = new Date(end);
    start.setDate(start.getDate() - (days - 1));
    applyRange(toInputDate(start), toInputDate(end));
  };

  // Default state = the latest year, whole. Anything else is a deliberate change.
  const isDefault =
    !customDateRange &&
    !daysMode &&
    keys.size === 12 &&
    Array.from(keys).every((k) => keyYear(k) === defaultYear);

  const displayText = customDateRange
    ? `${shortDate(customDateRange.start)} – ${shortDate(customDateRange.end)}`
    : daysMode
      ? timeRange.selections.length === 1
        ? timeRange.selections[0].day
          ? shortDate(timeRange.selections[0].day)
          : ""
        : `${timeRange.selections.length} Days`
      : describeKeys(keys);

  if (availableYears.length === 0) {
    return null;
  }

  if (!mounted) {
    return (
      <div className="pointer-events-auto relative">
        <div className="h-11 w-[168px] rounded-xl bg-white border border-slate-200 dark:bg-white/[0.04] dark:border-white/[0.08]" />
      </div>
    );
  }

  const tabs: [Panel, string][] = [
    ["period", "Period"],
    allowCustomRange ? ["range", "Custom range"] : ["days", "Specific days"],
  ];

  return (
    <div ref={dropdownRef} data-tour="time-selector" className="pointer-events-auto relative">
      {/* ── Trigger Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 h-11 pl-4 pr-3 rounded-xl border transition-all duration-300 cursor-pointer group bg-white hover:border-blue-400 hover:shadow-sm dark:bg-white/[0.04] dark:hover:bg-white/[0.06] dark:hover:border-[#0EA5E9]/30 ${
          isDefault
            ? "border-slate-200 dark:border-white/[0.08]"
            : "border-[#0EA5E9]/40 dark:border-[#0EA5E9]/30"
        }`}
        title={isDefault ? "Showing the latest year — click to change the time range" : displayText}
      >
        <Clock className="h-4 w-4 text-[#0EA5E9] group-hover:scale-110 transition-transform" />
        <span
          className="text-[14px] font-medium text-slate-700 dark:text-white/80 whitespace-nowrap"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {isDefault ? "Latest year" : displayText}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-500 group-hover:text-[#0EA5E9] transition-all duration-300 ${isOpen ? "rotate-180" : ""}`}
        />

        {/* Back to the latest year — only offered once you've moved off it */}
        {!isDefault && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              resetToDefault();
            }}
            className="ml-1 w-5 h-5 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
            title="Back to the latest year"
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

        <div className="p-5 space-y-4">
          <div className="flex gap-1.5 rounded-xl border border-slate-200/50 bg-slate-100 p-1 dark:border-white/[0.04] dark:bg-slate-800/60">
            {tabs.map(([id, label]) => (
              <button
                key={id}
                onClick={() => setPanel(id)}
                className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-all ${
                  panel === id
                    ? "bg-white text-[#0EA5E9] shadow-sm dark:bg-[#0F172A] dark:text-[#0EA5E9]"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Period grid: a row per year, a cell per month ── */}
          {panel === "period" && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className={labelClass}>Select period</span>
                <button
                  role="switch"
                  aria-checked={multi}
                  onClick={() => setMulti(!multi)}
                  className="flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                  title="Add to the selection instead of replacing it (Ctrl/Cmd/Shift-click does the same)"
                >
                  Multi-select
                  <span
                    className={`relative h-4 w-7 rounded-full transition-colors ${
                      multi ? "bg-[#0EA5E9]" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${
                        multi ? "left-3.5" : "left-0.5"
                      }`}
                    />
                  </span>
                </button>
              </div>

              {/* Year: big chips, one click to move to any year. A dot marks a year
                  that holds part of the current selection while you're looking elsewhere. */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {[...availableYears].sort((a, b) => b - a).map((year) => {
                  const hasSelection = yearKeys(year).some((k) => keys.has(k));
                  return (
                    <button
                      key={year}
                      onClick={() => setViewYear(year)}
                      className={`relative px-4 py-2 text-sm font-semibold ${chipBase} ${
                        year === focusYear ? chipOn : chipOff
                      }`}
                    >
                      {year}
                      {hasSelection && year !== focusYear && (
                        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#0EA5E9]" />
                      )}
                    </button>
                  );
                })}
                <button
                  onClick={(e) => applyCells(yearKeys(focusYear), additiveFrom(e))}
                  className={`ml-auto px-3 py-2 text-sm font-semibold ${chipBase} ${
                    yearKeys(focusYear).every((k) => keys.has(k)) ? chipOn : chipOff
                  }`}
                  title={`Select all of ${focusYear}`}
                >
                  Whole year
                </button>
              </div>

              {/* Months, a quarter per row. The row label picks the quarter; drag across
                  cells for any span (Mar → Aug), or use Multi-select for separate ones. */}
              <div className="select-none space-y-2">
                {QUARTERS.map((q) => {
                  const quarter = [1, 2, 3].map((i) => monthKey(focusYear, (q - 1) * 3 + i));
                  const enabled = quarter.filter((k) => k <= nowKey);
                  const wholeQuarter = enabled.length > 0 && enabled.every((k) => keys.has(k));
                  return (
                    <div key={q} className="flex items-stretch gap-2">
                      <button
                        onClick={(e) => applyCells(enabled, additiveFrom(e))}
                        disabled={enabled.length === 0}
                        title={`Select Q${q} ${focusYear}`}
                        className={`w-12 shrink-0 text-sm font-bold ${chipBase} ${
                          wholeQuarter ? chipOn : chipOff
                        } disabled:cursor-not-allowed disabled:opacity-40`}
                      >
                        Q{q}
                      </button>
                      {[1, 2, 3].map((i) => {
                        const month = (q - 1) * 3 + i;
                        const key = monthKey(focusYear, month);
                        const future = key > nowKey;
                        const selected = drag?.year === focusYear ? inDrag(focusYear, month) : keys.has(key);
                        return (
                          <button
                            key={month}
                            disabled={future}
                            onPointerDown={(e) => {
                              if (e.button !== 0) return;
                              setDrag({ year: focusYear, a: month, b: month, additive: additiveFrom(e) });
                            }}
                            onPointerEnter={() =>
                              drag && drag.year === focusYear && !future && setDrag({ ...drag, b: month })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                applyCells([key], additiveFrom(e));
                              }
                            }}
                            aria-pressed={selected}
                            aria-label={`${MONTH_ABBR[month - 1]} ${focusYear}`}
                            className={`h-12 flex-1 text-sm font-semibold ${chipBase} ${
                              future
                                ? "cursor-not-allowed border-transparent text-slate-300 dark:text-slate-600"
                                : selected
                                  ? chipOn
                                  : chipOff
                            }`}
                          >
                            {MONTH_ABBR[month - 1]}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
                Drag across months for a span. To combine separate periods or years, turn on Multi-select.
              </p>
            </div>
          )}

          {/* ── Specific days (pages without a custom range) ── */}
          {panel === "days" && (
            <div className="max-h-[300px] space-y-3 overflow-y-auto custom-scrollbar">
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-400">Select Date</label>
                <input
                  type="date"
                  onChange={(e) => {
                    const d = e.target.value ? fromInputDate(e.target.value, false) : null;
                    if (d) toggleDaySelect(d);
                  }}
                  className={dateInputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-400">Quick Select</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => toggleDaySelect(new Date())} className={`${chipBase} ${chipOff} px-3 py-2 text-xs font-medium`}>
                    Today
                  </button>
                  <button
                    onClick={() => {
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      toggleDaySelect(yesterday);
                    }}
                    className={`${chipBase} ${chipOff} px-3 py-2 text-xs font-medium`}
                  >
                    Yesterday
                  </button>
                </div>
              </div>

              {daysMode && (
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Selected Days ({timeRange.selections.length})
                  </label>
                  <div className="max-h-28 space-y-1 overflow-y-auto custom-scrollbar">
                    {timeRange.selections.map((selection, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg bg-[#0EA5E9]/10 px-3 py-1.5 text-xs text-[#0EA5E9] dark:bg-[#0EA5E9]/20"
                      >
                        <span>{selection.day ? shortDate(selection.day) : ""}</span>
                        <button onClick={() => selection.day && toggleDaySelect(selection.day)} className="ml-2 font-bold hover:text-red-500">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Custom range ── */}
          {panel === "range" && allowCustomRange && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-400">From</span>
                  <input
                    type="date"
                    value={toInputDate(rangeStart)}
                    max={toInputDate(rangeEnd)}
                    onChange={(e) => e.target.value && applyRange(e.target.value, toInputDate(rangeEnd))}
                    className={dateInputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-400">To</span>
                  <input
                    type="date"
                    value={toInputDate(rangeEnd)}
                    min={toInputDate(rangeStart)}
                    onChange={(e) => e.target.value && applyRange(toInputDate(rangeStart), e.target.value)}
                    className={dateInputClass}
                  />
                </label>
              </div>

              <div>
                <span className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-400">Quick Select</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Today", run: () => applyLastDays(1) },
                    { label: "Yesterday", run: () => applyLastDays(1, 1) },
                    { label: "Last 7 days", run: () => applyLastDays(7) },
                    { label: "Last 30 days", run: () => applyLastDays(30) },
                    { label: "Last 90 days", run: () => applyLastDays(90) },
                  ].map(({ label, run }) => (
                    <button key={label} onClick={run} className={`${chipBase} ${chipOff} px-3 py-2 text-xs font-medium`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Only shown once you've moved off the default, so it stays out of the way */}
          {!isDefault && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-white/[0.04]">
              <span className="truncate text-slate-500 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{displayText}</span>
              </span>
              <button
                onClick={resetToDefault}
                className="ml-3 shrink-0 font-semibold text-[#0EA5E9] transition-colors hover:text-[#0284c7]"
              >
                Back to latest year
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
