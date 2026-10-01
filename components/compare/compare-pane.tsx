"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ChevronDown, Filter, RotateCw, X } from "lucide-react";
import { MapProvider, useMapContext } from "@/context/MapContext";
import { usePeriod, PeriodPanel } from "@/components/layout/period-picker";
import CrimeTypeOptions from "@/components/layout/crime-type-options";
import { getCrimeTypeColor } from "@/hooks/useCrimeTypes";
import { THREAT_COLORS } from "@/hooks/useThreatLevels";
import { threatLevelOf, type ThreatThresholds } from "@/lib/geo-threat";
import { OVERLAY_SURFACE } from "@/lib/map-overlay";
import { openingPeriod, type PaneReport, type Side } from "./compare-data";
import { usePaneCounts } from "./use-pane-counts";
import type { MapLink } from "./map-link";

const CompareMap = dynamic(() => import("./compare-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#0f172a]" />,
});

interface ComparePaneProps {
  side: Side;
  thresholds: ThreatThresholds | null;
  hovered: string | null;
  /** Display name of the hovered barangay, from whichever map or ledger row it was pointed at. */
  hoveredName: string | null;
  onHover: (key: string | null) => void;
  onFocus: (key: string) => void;
  onReport: (side: Side, report: PaneReport) => void;
  link: MapLink;
  className?: string;
  /** Extra controls pinned to the pane's bottom-right corner. */
  children?: ReactNode;
}

/**
 * One side of the compare view. Each side runs its own MapProvider, so it owns
 * a period and a crime type exactly as the main map does, and reuses the main
 * map's period picker and crime type list unchanged.
 */
export default function ComparePane(props: ComparePaneProps) {
  return (
    <MapProvider persistPeriod={false} initialPeriod={(years) => openingPeriod(years, props.side)}>
      <PaneBody {...props} />
    </MapProvider>
  );
}

type Dropdown = "period" | "crime" | null;

const TRIGGER =
  "flex h-9 min-w-0 cursor-pointer items-center gap-2 rounded-lg px-2.5 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50";

const DROPDOWN = `absolute left-0 top-[calc(100%+8px)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-left ${OVERLAY_SURFACE}`;

function PaneBody({
  side,
  thresholds,
  hovered,
  hoveredName,
  onHover,
  onFocus,
  onReport,
  link,
  className = "",
  children,
}: ComparePaneProps) {
  const { geoJsonData, selectedCrimeType, setSelectedCrimeType } = useMapContext();
  const { counts, total, status, retry } = usePaneCounts();
  const period = usePeriod(true);
  const label = period.displayText;
  const [open, setOpen] = useState<Dropdown>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onReport(side, { label, crimeType: selectedCrimeType, counts, total, status });
  }, [side, label, selectedCrimeType, counts, total, status, onReport]);

  // Close the open dropdown on an outside click or Escape, as the main map's filter bar does.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (stripRef.current && !stripRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = (next: Dropdown) => setOpen((current) => (current === next ? null : next));

  const hoveredCount = hovered ? (counts[hovered] ?? 0) : 0;
  const hoveredLevel = hovered && thresholds ? threatLevelOf(hoveredCount, thresholds) : null;
  const firstLoad = status === "loading" && total === 0 && Object.keys(counts).length === 0;

  return (
    <section aria-label={`Map ${side}`} className={`relative isolate min-h-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 z-0">
        {geoJsonData ? (
          <CompareMap
            side={side}
            geoJsonData={geoJsonData}
            counts={counts}
            thresholds={status === "error" ? null : thresholds}
            hovered={hovered}
            onHover={onHover}
            onFocus={onFocus}
            link={link}
          />
        ) : (
          <div className="h-full w-full bg-[#0f172a]" />
        )}
      </div>

      {/* Counting: an indeterminate line along the top edge, since the request reports no progress. */}
      <div className="absolute inset-x-0 top-0 z-10 h-[2px] overflow-hidden" aria-hidden="true">
        {status === "loading" && <div className="h-full w-1/3 animate-pulse bg-sky-500 dark:bg-sky-400" />}
      </div>

      {/* ── Which side, which period, which crime type ── */}
      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex">
        <div
          ref={stripRef}
          className={`pointer-events-auto relative flex max-w-full flex-wrap items-center gap-0.5 p-1 ${OVERLAY_SURFACE}`}
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-900 font-heading text-[15px] font-bold text-white dark:bg-white dark:text-slate-900"
          >
            {side}
          </span>

          <button
            type="button"
            onClick={() => toggle("period")}
            aria-expanded={open === "period"}
            title="Change this map's period"
            className={`${TRIGGER} ${open === "period" ? "bg-slate-100 dark:bg-white/10" : ""}`}
          >
            <span className="sr-only">Map {side} period: </span>
            <span className="truncate font-heading text-[14px] font-semibold text-slate-900 dark:text-white">
              {label}
            </span>
            <ChevronDown
              aria-hidden="true"
              className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${
                open === "period" ? "rotate-180" : ""
              }`}
            />
          </button>

          <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-slate-200 dark:bg-white/[0.08]" />

          <div className="flex min-w-0 items-center">
            <button
              type="button"
              onClick={() => toggle("crime")}
              aria-expanded={open === "crime"}
              title="Change this map's crime type"
              className={`${TRIGGER} ${open === "crime" ? "bg-slate-100 dark:bg-white/10" : ""}`}
            >
              <span className="sr-only">Map {side} crime type: </span>
              {selectedCrimeType ? (
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: getCrimeTypeColor(selectedCrimeType) }}
                />
              ) : (
                <Filter aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              )}
              <span
                className={`max-w-[160px] truncate text-[13px] font-medium ${
                  selectedCrimeType ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {selectedCrimeType ?? "All crime types"}
              </span>
              <ChevronDown
                aria-hidden="true"
                className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${
                  open === "crime" ? "rotate-180" : ""
                }`}
              />
            </button>
            {selectedCrimeType && (
              <button
                type="button"
                onClick={() => setSelectedCrimeType(null)}
                aria-label={`Show all crime types on map ${side}`}
                title="Show all crime types"
                className="mr-1 grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded-full bg-sky-500/15 text-sky-700 transition-colors hover:bg-red-500 hover:text-white dark:bg-sky-400/20 dark:text-sky-300"
              >
                <X aria-hidden="true" className="h-3 w-3" />
              </button>
            )}
          </div>

          {open === "period" && (
            <div role="dialog" aria-label={`Period for map ${side}`} className={`${DROPDOWN} w-[400px] max-w-[calc(100vw-48px)]`}>
              <div className="p-5">
                <PeriodPanel period={period} allowCustomRange />
              </div>
            </div>
          )}
          {open === "crime" && (
            <div role="dialog" aria-label={`Crime type for map ${side}`} className={`${DROPDOWN} w-[300px] max-w-[calc(100vw-48px)]`}>
              <CrimeTypeOptions onPick={() => setOpen(null)} />
            </div>
          )}
        </div>
      </div>

      {/* ── Readout: the pointed-at barangay on this side, otherwise this side's total ── */}
      <div
        className={`absolute bottom-3 left-3 z-10 min-w-[188px] max-w-[calc(100%-24px)] px-3.5 py-2.5 ${OVERLAY_SURFACE} ${
          status === "error" ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {status === "error" ? (
          <div className="flex items-center gap-3">
            <p className="text-[12.5px] leading-snug text-red-700 dark:text-red-400">
              Counts for this period didn&apos;t load.
            </p>
            <button
              type="button"
              onClick={retry}
              className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-[12.5px] font-semibold text-sky-700 transition-colors hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-400/10"
            >
              <RotateCw aria-hidden="true" className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        ) : hovered && hoveredName ? (
          <>
            <p className="truncate text-[14px] font-semibold text-slate-900 dark:text-white">{hoveredName}</p>
            <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-slate-600 dark:text-slate-300">
              {hoveredLevel && (
                <>
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: THREAT_COLORS[hoveredLevel] }}
                  />
                  <span className="font-semibold capitalize text-slate-800 dark:text-slate-100">{hoveredLevel}</span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                    /
                  </span>
                </>
              )}
              <span className="tabular-nums">
                {hoveredCount.toLocaleString("en-US")} incident{hoveredCount === 1 ? "" : "s"}
              </span>
            </p>
          </>
        ) : firstLoad ? (
          <p className="text-[12.5px] text-slate-500 dark:text-slate-400">Counting incidents…</p>
        ) : (
          <>
            <p className="text-[15px] font-semibold tabular-nums text-slate-900 dark:text-white">
              {total.toLocaleString("en-US")} incident{total === 1 ? "" : "s"}
            </p>
            <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">Point at a barangay for its count</p>
          </>
        )}
      </div>

      {children && <div className="absolute bottom-3 right-3 z-10">{children}</div>}
    </section>
  );
}
