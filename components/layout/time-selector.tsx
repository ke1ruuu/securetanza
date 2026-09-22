"use client";

import { useState, useRef, useEffect } from "react";
import { Clock, ChevronDown, X } from "lucide-react";
import { usePeriod, PeriodPanel } from "./period-picker";

interface TimeSelectorProps {
  /** Adds a "Custom range" tab for picking exact start/end dates. Only pages
   *  whose data respects `customDateRange` should turn this on. Without it the
   *  dropdown offers "Specific days" instead. */
  allowCustomRange?: boolean;
}

/**
 * Period control for the dashboard pages: a trigger that stays quiet on the
 * latest year ("Latest year") and lights up once you've moved off it, and a
 * dropdown holding the shared period picker (see period-picker.tsx).
 */
export default function TimeSelector({ allowCustomRange = false }: TimeSelectorProps) {
  const period = usePeriod(allowCustomRange);
  const { availableYears, isDefault, displayText, resetToDefault } = period;
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

  return (
    <div ref={dropdownRef} data-tour="time-selector" className="pointer-events-auto relative">
      {/* ── Trigger + reset: two sibling buttons in one styled wrapper, not a
          <div onClick> nested inside the trigger — that was invalid HTML and
          unreachable by keyboard regardless of any tabIndex, since a button's
          contents don't get their own tab stop in the browser. ── */}
      <div
        className={`flex items-center gap-3 h-11 pl-4 pr-3 rounded-xl border transition-all duration-300 group bg-white hover:border-blue-400 hover:shadow-sm dark:bg-white/[0.04] dark:hover:bg-white/[0.06] dark:hover:border-[#0EA5E9]/30 ${
          isDefault
            ? "border-slate-200 dark:border-white/[0.08]"
            : "border-[#0EA5E9]/40 dark:border-[#0EA5E9]/30"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex min-w-0 flex-1 items-center gap-3 cursor-pointer"
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
        </button>

        {/* Back to the latest year — only offered once you've moved off it */}
        {!isDefault && (
          <button
            type="button"
            onClick={() => resetToDefault()}
            className="ml-1 w-5 h-5 shrink-0 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
            title="Back to the latest year"
            aria-label="Back to the latest year"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* ── Dropdown ── */}
      <div
        className={`absolute top-[calc(100%+8px)] left-0 w-[360px] sm:w-[420px] max-w-[calc(100vw-24px)] rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 origin-top-left z-50 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="p-5">
          <PeriodPanel period={period} allowCustomRange={allowCustomRange} />
        </div>
      </div>
    </div>
  );
}
