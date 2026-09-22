"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Filter, Clock, Search, X, ChevronDown, Check, RotateCcw } from "lucide-react";
import { useMapContext } from "@/context/MapContext";
import { useCrimeTypes, getCrimeTypeColor } from "@/hooks/useCrimeTypes";
import { usePeriod, PeriodPanel } from "./period-picker";
import {
  OVERLAY_SURFACE,
  OVERLAY_LABEL,
  OVERLAY_ITEM,
  OVERLAY_ITEM_ACTIVE,
} from "@/lib/map-overlay";

type ActiveDropdown = "barangay" | "crime" | "time" | null;

/** A filter segment's trigger: quiet by default, sky-tinted once it holds a filter. */
function segmentClass(active: boolean, open: boolean) {
  return `flex items-center gap-2 h-10 sm:h-11 px-3 sm:px-3.5 rounded-lg border transition-colors duration-200 cursor-pointer text-[13px] sm:text-[14px] font-medium ${
    active
      ? "border-sky-500/30 bg-sky-50 text-sky-700 dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-300"
      : open
        ? "border-transparent bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white"
        : "border-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
  }`;
}

/** The small ✕ inside an active segment. */
const CLEAR_CHIP =
  "ml-0.5 w-4 h-4 rounded-full flex items-center justify-center bg-sky-500/15 text-sky-700 transition-colors hover:bg-red-500 hover:text-white dark:bg-sky-400/20 dark:text-sky-300";

const DROPDOWN =
  `absolute top-[calc(100%+8px)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${OVERLAY_SURFACE}`;

export default function UnifiedFilterBar() {
  const {
    selectedBarangay,
    setSelectedBarangay,
    searchQuery,
    setSearchQuery,
    filteredBarangays,
    selectedCrimeType,
    setSelectedCrimeType,
  } = useMapContext();

  const { stats: crimeStats, loading: crimeLoading } = useCrimeTypes();
  // The map has no exact-date range, so the picker offers Period + Specific days.
  const period = usePeriod(false);
  const { isDefault: isTimeDefault, displayText: timeText, resetToDefault: resetTime } = period;
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
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

  const isBarangayActive = Boolean(selectedBarangay);
  const isCrimeActive = Boolean(selectedCrimeType);
  // Sitting on the latest year is the default, not a filter — only a deliberate change counts.
  const isTimeActive = !isTimeDefault;

  const activeFiltersCount = (isBarangayActive ? 1 : 0) + (isCrimeActive ? 1 : 0) + (isTimeActive ? 1 : 0);

  const clearAllFilters = useCallback(() => {
    setSelectedBarangay(null);
    setSelectedCrimeType(null);
    resetTime();
    setActiveDropdown(null);
  }, [setSelectedBarangay, setSelectedCrimeType, resetTime]);

  const toggleDropdown = (section: ActiveDropdown) => {
    setActiveDropdown((prev) => (prev === section ? null : section));
  };

  if (!mounted) {
    return (
      <div className={`h-12 w-80 animate-pulse ${OVERLAY_SURFACE}`} />
    );
  }

  return (
    <div
      ref={containerRef}
      data-tour="map-filters"
      className={`pointer-events-auto relative flex flex-wrap items-center gap-1 p-1 sm:p-1.5 transition-all duration-300 max-w-[calc(100vw-24px)] ${OVERLAY_SURFACE}`}
    >
      {/* ── 1. BARANGAY FILTER SEGMENT ── */}
      <div className="relative" data-tour="barangay-filter">
        <button
          onClick={() => toggleDropdown("barangay")}
          className={segmentClass(isBarangayActive, activeDropdown === "barangay")}
          title={selectedBarangay || "Filter by Barangay"}
        >
          <MapPin className={`h-4 w-4 shrink-0 ${isBarangayActive ? "" : "text-slate-400"}`} />
          <span className="truncate max-w-[110px] sm:max-w-[140px]" style={{ fontFamily: "var(--font-inter)" }}>
            {selectedBarangay || "Barangay"}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
              isBarangayActive ? "" : "text-slate-400"
            } ${activeDropdown === "barangay" ? "rotate-180" : ""}`}
          />

          {isBarangayActive && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBarangay(null);
              }}
              className={CLEAR_CHIP}
              title="Clear barangay filter"
            >
              <X className="h-2.5 w-2.5" />
            </div>
          )}
        </button>

        {/* Barangay Dropdown */}
        {activeDropdown === "barangay" && (
          <div className={`${DROPDOWN} left-0 min-w-[280px] sm:min-w-[300px] origin-top-left`}>
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
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-[13px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 dark:border-white/10 dark:bg-[#0f172a] dark:text-slate-100 dark:placeholder:text-slate-500"
                  style={{ fontFamily: "var(--font-inter)" }}
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[260px] p-1 custom-scrollbar">
              {/* Option to clear / All */}
              <button
                onClick={() => {
                  setSelectedBarangay(null);
                  setActiveDropdown(null);
                  setSearchQuery("");
                }}
                className={`flex items-center justify-between w-full text-left px-3 py-2 text-[13px] ${
                  !selectedBarangay ? OVERLAY_ITEM_ACTIVE : `${OVERLAY_ITEM} font-medium`
                }`}
              >
                <span>All Barangays (Municipality Wide)</span>
                {!selectedBarangay && <Check className="h-3.5 w-3.5" />}
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
                    className={`flex items-center justify-between w-full text-left px-3 py-2 text-[13px] ${
                      selectedBarangay === name ? OVERLAY_ITEM_ACTIVE : `${OVERLAY_ITEM} font-medium`
                    }`}
                  >
                    <span>{name}</span>
                    {selectedBarangay === name && <Check className="h-3.5 w-3.5" />}
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
          className={segmentClass(isCrimeActive, activeDropdown === "crime")}
          title={selectedCrimeType || "Filter by Crime Type"}
        >
          {isCrimeActive ? (
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: getCrimeTypeColor(selectedCrimeType || "") }}
            />
          ) : (
            <Filter className="h-4 w-4 shrink-0 text-slate-400" />
          )}
          <span className="truncate max-w-[110px] sm:max-w-[140px]" style={{ fontFamily: "var(--font-inter)" }}>
            {selectedCrimeType || "Crime Type"}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
              isCrimeActive ? "" : "text-slate-400"
            } ${activeDropdown === "crime" ? "rotate-180" : ""}`}
          />

          {isCrimeActive && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCrimeType(null);
              }}
              className={CLEAR_CHIP}
              title="Clear crime type filter"
            >
              <X className="h-2.5 w-2.5" />
            </div>
          )}
        </button>

        {/* Crime Type Dropdown */}
        {activeDropdown === "crime" && (
          <div className={`${DROPDOWN} left-0 sm:left-auto sm:right-0 min-w-[280px] sm:min-w-[300px] origin-top-left sm:origin-top-right`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/[0.06]">
              <span className={OVERLAY_LABEL}>Incident Classification</span>
              {selectedCrimeType && (
                <button
                  onClick={() => setSelectedCrimeType(null)}
                  className="text-xs font-semibold text-sky-600 transition-colors hover:text-sky-500 dark:text-sky-400"
                >
                  Reset
                </button>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[300px] p-1 custom-scrollbar">
              {/* All Crime Types option */}
              <button
                onClick={() => {
                  setSelectedCrimeType(null);
                  setActiveDropdown(null);
                }}
                className={`flex items-center justify-between w-full text-left px-3 py-2.5 text-[13px] ${
                  !selectedCrimeType ? OVERLAY_ITEM_ACTIVE : `${OVERLAY_ITEM} font-medium`
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400/50" />
                  <span>All Crime Types</span>
                </div>
                {!selectedCrimeType && <Check className="h-3.5 w-3.5" />}
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
                      className={`flex items-center justify-between w-full text-left px-3 py-2.5 text-[13px] ${
                        isSelected ? OVERLAY_ITEM_ACTIVE : `${OVERLAY_ITEM} font-medium`
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate pr-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="truncate">{item.type}</span>
                      </div>
                      <span
                        className={`shrink-0 text-[12px] font-semibold tabular-nums ${
                          isSelected ? "" : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {item.count}
                      </span>
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
          className={segmentClass(isTimeActive, activeDropdown === "time")}
          title={isTimeDefault ? "Showing the latest year — click to change the time range" : timeText}
        >
          <Clock className={`h-4 w-4 shrink-0 ${isTimeActive ? "" : "text-slate-400"}`} />
          <span className="truncate max-w-[110px] sm:max-w-[160px]" style={{ fontFamily: "var(--font-inter)" }}>
            {isTimeDefault ? "Latest year" : timeText}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
              isTimeActive ? "" : "text-slate-400"
            } ${activeDropdown === "time" ? "rotate-180" : ""}`}
          />

          {isTimeActive && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                resetTime();
              }}
              className={CLEAR_CHIP}
              title="Back to the latest year"
            >
              <X className="h-2.5 w-2.5" />
            </div>
          )}
        </button>

        {/* Time Selector Dropdown — the same picker the dashboard pages use */}
        {activeDropdown === "time" && (
          <div
            className={`${DROPDOWN} left-0 sm:left-auto sm:right-0 w-[360px] sm:w-[420px] max-w-[calc(100vw-24px)] origin-top-left sm:origin-top-right`}
          >
            <div className="p-5">
              <PeriodPanel period={period} />
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
            className="flex items-center gap-1.5 h-10 sm:h-11 px-2.5 sm:px-3 rounded-lg text-xs font-semibold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-500/15 dark:hover:text-red-400 cursor-pointer shrink-0"
            title="Clear all applied filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Reset</span>
            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold tabular-nums flex items-center justify-center dark:bg-white/10 dark:text-slate-200">
              {activeFiltersCount}
            </span>
          </button>
        </>
      )}
    </div>
  );
}
