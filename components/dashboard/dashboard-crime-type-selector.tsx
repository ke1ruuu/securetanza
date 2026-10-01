"use client";

import React, { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown, Check, X } from "lucide-react";
import { useMapContext } from "@/context/MapContext";
import { useCrimeTypes, getCrimeTypeColor, extractCrimeType } from "@/hooks/useCrimeTypes";
import { CRIME_GROUPS } from "@/lib/crime-groups";

/**
 * Crime type control for the dashboard sub-header, sitting beside the barangay and
 * period selectors. Writes `selectedCrimeType` on the shared map context, which the
 * analytics hooks read — so picking a type (or the 8 Focus Crimes / Special Laws
 * groups) scopes every chart on the page.
 */
export default function DashboardCrimeTypeSelector() {
  const { selectedCrimeType, setSelectedCrimeType } = useMapContext();
  const { stats, loading } = useCrimeTypes();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = Boolean(selectedCrimeType);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const choose = (type: string | null) => {
    setSelectedCrimeType(type);
    setIsOpen(false);
  };

  const rowClass = (selected: boolean) =>
    `flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-[13px] font-medium transition-colors cursor-pointer ${
      selected
        ? "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300"
        : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04]"
    }`;

  return (
    <div ref={ref} data-tour="crime-type-selector" className="relative">
      <div
        className={`group flex h-11 items-center gap-3 rounded-xl border bg-white pl-4 pr-3 transition-all duration-300 hover:border-blue-400 hover:shadow-sm dark:bg-white/[0.04] dark:hover:bg-white/[0.06] dark:hover:border-[#0EA5E9]/30 ${
          isActive ? "border-[#0EA5E9]/40 dark:border-[#0EA5E9]/30" : "border-slate-200 dark:border-white/[0.08]"
        }`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex min-w-0 flex-1 items-center gap-3 cursor-pointer"
          title={selectedCrimeType || "Filter by crime type"}>
          {isActive ? (
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: getCrimeTypeColor(selectedCrimeType || "") }}
            />
          ) : (
            <Filter className="h-4 w-4 text-[#0EA5E9]" />
          )}
          <span
            className="max-w-[160px] truncate whitespace-nowrap text-[14px] font-medium text-slate-700 dark:text-white/80"
            style={{ fontFamily: "var(--font-inter)" }}>
            {selectedCrimeType ? extractCrimeType(selectedCrimeType) : "All crime types"}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-slate-500 transition-all duration-300 group-hover:text-[#0EA5E9] ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isActive && (
          <button
            type="button"
            onClick={() => choose(null)}
            className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-red-100 hover:text-red-500 dark:bg-white/10 dark:text-slate-400 dark:hover:bg-red-500/20 dark:hover:text-red-400"
            title="Show all crime types"
            aria-label="Show all crime types">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div
        className={`absolute left-0 top-[calc(100%+8px)] z-50 w-[300px] max-w-[calc(100vw-24px)] origin-top-left overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-[0_20px_60px_rgba(0,0,0,0.1)] backdrop-blur-2xl transition-all duration-300 dark:border-white/[0.06] dark:bg-[#0F172A]/95 dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] ${
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}>
        <div className="dropdown-scroll max-h-[340px] overflow-y-auto overscroll-contain p-1">
          <button type="button" onClick={() => choose(null)} className={rowClass(!isActive)}>
            <span className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-400/50" />
              All crime types
            </span>
            {!isActive && <Check className="h-3.5 w-3.5" />}
          </button>

          {CRIME_GROUPS.map((group) => (
            <button
              key={group.label}
              type="button"
              onClick={() => choose(group.label)}
              title={group.description}
              className={rowClass(selectedCrimeType === group.label)}>
              <span className="flex items-center gap-2.5 truncate">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: group.color }} />
                <span className="truncate">{group.label}</span>
              </span>
              {selectedCrimeType === group.label && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
          <div className="my-1 h-px bg-slate-100 dark:bg-white/[0.06]" />

          {loading ? (
            <div className="p-4 text-center text-[13px] text-slate-400">Loading crime types...</div>
          ) : stats.length === 0 ? (
            <div className="p-4 text-center text-[13px] text-slate-400">No crime types recorded</div>
          ) : (
            stats.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => choose(item.type)}
                className={rowClass(selectedCrimeType === item.type)}>
                <span className="flex items-center gap-2.5 truncate">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: getCrimeTypeColor(item.type) }}
                  />
                  <span className="truncate">{extractCrimeType(item.type)}</span>
                </span>
                <span className="shrink-0 text-[12px] font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                  {item.count}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
