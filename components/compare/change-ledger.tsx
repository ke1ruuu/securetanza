"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { THREAT_COLORS } from "@/hooks/useThreatLevels";
import type { ThreatLevel, ThreatThresholds } from "@/lib/geo-threat";
import {
  deltaTone,
  formatDelta,
  formatPercent,
  type LedgerRow,
  type PaneReport,
  type Side,
} from "./compare-data";

type Sort = "rises" | "falls" | "all";

interface ChangeLedgerProps {
  reports: Partial<Record<Side, PaneReport>>;
  rows: LedgerRow[];
  thresholds: ThreatThresholds | null;
  hovered: string | null;
  onHover: (key: string | null) => void;
  onFocus: (key: string) => void;
  className?: string;
}

const SECTION = "text-[11.5px] font-semibold uppercase tracking-[0.11em] text-slate-500 dark:text-slate-400";
const COLUMNS = "grid grid-cols-[minmax(0,1fr)_2.75rem_2.75rem_4.75rem] items-center gap-2";

/** Each band's incident range on the shared scale. A band the data leaves empty reads "none". */
function bands(t: ThreatThresholds): { level: ThreatLevel; label: string; range: string }[] {
  const span = (lo: number, hi: number) => (lo > hi ? "none" : lo === hi ? `${lo}` : `${lo}–${hi}`);
  return [
    { level: "secure", label: "Secure", range: "0" },
    { level: "low", label: "Low", range: span(1, t.low) },
    { level: "moderate", label: "Moderate", range: span(t.low + 1, t.moderate) },
    { level: "high", label: "High", range: span(t.moderate + 1, t.high) },
    { level: "critical", label: "Critical", range: `${t.high + 1}+` },
  ];
}

function SideMark({ side }: { side: Side }) {
  return (
    <span
      aria-hidden="true"
      className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-slate-900 font-heading text-[11px] font-bold text-white dark:bg-white dark:text-slate-900"
    >
      {side}
    </span>
  );
}

function SideTotal({ side, report }: { side: Side; report?: PaneReport }) {
  const ready = report?.status === "ready";
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 py-2.5 dark:border-white/[0.06]">
      <dt className="flex min-w-0 items-start gap-2.5">
        <SideMark side={side} />
        <span className="min-w-0">
          <span className="sr-only">Map {side}: </span>
          <span className="block truncate text-[13px] font-semibold text-slate-900 dark:text-white">
            {report?.label || "…"}
          </span>
          <span className="block truncate text-[12px] text-slate-500 dark:text-slate-400">
            {report?.crimeType ?? "All crime types"}
          </span>
        </span>
      </dt>
      <dd className="text-right text-[15px] font-semibold tabular-nums text-slate-900 dark:text-white">
        {ready ? report.total.toLocaleString("en-US") : report?.status === "error" ? "—" : (
          <span className="inline-block h-4 w-10 animate-pulse rounded bg-slate-200 align-middle dark:bg-white/10" />
        )}
      </dd>
    </div>
  );
}

/**
 * The right-hand column of the compare view: both totals and the change between
 * them, the one scale both maps are coloured on, and every barangay ranked by how
 * much it moved. Pointing at a row lights that barangay on both maps; choosing
 * it zooms both maps to it.
 */
export default function ChangeLedger({
  reports,
  rows,
  thresholds,
  hovered,
  onHover,
  onFocus,
  className = "",
}: ChangeLedgerProps) {
  const [sort, setSort] = useState<Sort>("rises");
  const listRef = useRef<HTMLUListElement>(null);
  const pointerInList = useRef(false);

  const { A, B } = reports;
  const bothReady = A?.status === "ready" && B?.status === "ready";
  const anyError = A?.status === "error" || B?.status === "error";
  const delta = bothReady ? B.total - A.total : 0;
  const percent = bothReady ? formatPercent(A.total, B.total) : null;
  const samePeriod = Boolean(A && B && A.label === B.label && A.crimeType === B.crimeType);

  const rises = useMemo(
    () => rows.filter((r) => r.delta > 0).sort((x, y) => y.delta - x.delta || x.name.localeCompare(y.name)),
    [rows]
  );
  const falls = useMemo(
    () => rows.filter((r) => r.delta < 0).sort((x, y) => x.delta - y.delta || x.name.localeCompare(y.name)),
    [rows]
  );
  const all = useMemo(() => [...rows].sort((x, y) => x.name.localeCompare(y.name)), [rows]);
  const visible = sort === "rises" ? rises : sort === "falls" ? falls : all;
  const largest = Math.max(1, ...rows.map((r) => Math.abs(r.delta)));

  // A barangay pointed at on a map scrolls its row into view, but only while
  // the list scrolls on its own (wide screens) and the pointer isn't already in it.
  useEffect(() => {
    const list = listRef.current;
    if (!hovered || !list || pointerInList.current || list.scrollHeight <= list.clientHeight) return;
    list.querySelector<HTMLElement>(`[data-key="${CSS.escape(hovered)}"]`)?.scrollIntoView({ block: "nearest" });
  }, [hovered]);

  const tabs: { id: Sort; label: string; count: number }[] = [
    { id: "rises", label: "Rises", count: rises.length },
    { id: "falls", label: "Falls", count: falls.length },
    { id: "all", label: "All", count: all.length },
  ];

  const emptyMessage =
    sort === "rises"
      ? "No barangay has more incidents in B than in A."
      : sort === "falls"
        ? "No barangay has fewer incidents in B than in A."
        : "No barangays to list yet.";

  return (
    <aside
      aria-labelledby="change-ledger-title"
      className={`flex flex-col bg-white dark:bg-[#0F172A] ${className}`}
    >
      {/* ── Totals ── */}
      <div className="border-b border-slate-200 px-5 pb-4 pt-5 dark:border-white/[0.06]">
        <h2 id="change-ledger-title" className="font-heading text-[16px] font-semibold text-slate-900 dark:text-white">
          Change from A to B
        </h2>

        <dl className="mt-2">
          <SideTotal side="A" report={A} />
          <SideTotal side="B" report={B} />
          <div className="flex items-baseline justify-between gap-4 pt-2.5">
            <dt className="text-[13px] text-slate-500 dark:text-slate-400">Change</dt>
            <dd className={`text-right text-[15px] font-semibold tabular-nums ${bothReady ? deltaTone(delta) : "text-slate-400"}`}>
              {bothReady ? (
                <>
                  {delta === 0 ? "No change" : formatDelta(delta)}
                  {percent && delta !== 0 && <span className="ml-1.5 text-[13px] font-medium">({percent})</span>}
                </>
              ) : anyError ? (
                "—"
              ) : (
                "…"
              )}
            </dd>
          </div>
        </dl>

        {samePeriod && (
          <p className="mt-3 text-[12.5px] leading-relaxed text-amber-800 dark:text-amber-300">
            A and B show the same period and crime type. Change one side to compare.
          </p>
        )}
      </div>

      {/* ── The shared scale ── */}
      <div className="border-b border-slate-200 px-5 py-4 dark:border-white/[0.06]">
        <p className={SECTION}>One scale on both maps</p>
        <ol className="mt-3 grid grid-cols-5 gap-2">
          {(thresholds ? bands(thresholds) : bands({ low: 0, moderate: 0, high: 0, critical: 0 })).map((band) => (
            <li key={band.level} className="min-w-0">
              <span
                aria-hidden="true"
                className={`block h-1.5 rounded-full ${thresholds ? "" : "animate-pulse bg-slate-200 dark:bg-white/10"}`}
                style={thresholds ? { backgroundColor: THREAT_COLORS[band.level] } : undefined}
              />
              <span className="mt-1.5 block truncate text-[12px] font-semibold text-slate-800 dark:text-slate-100">
                {band.label}
              </span>
              <span className="block text-[12px] tabular-nums text-slate-500 dark:text-slate-400">
                {thresholds ? band.range : "…"}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Barangays ranked by change ── */}
      <div className="flex flex-col xl:min-h-0 xl:flex-1">
        <div className="px-5 pt-4">
          <div
            role="group"
            aria-label="Which barangays to list"
            className="flex gap-1 rounded-xl border border-slate-200/50 bg-slate-100 p-1 dark:border-white/[0.04] dark:bg-slate-800/60"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSort(tab.id)}
                aria-pressed={sort === tab.id}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12.5px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 ${
                  sort === tab.id
                    ? "bg-white text-sky-700 shadow-sm shadow-slate-900/5 dark:bg-[#0F172A] dark:text-sky-300"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {tab.label}
                <span className="tabular-nums text-[11.5px] opacity-70">{bothReady ? tab.count : "–"}</span>
              </button>
            ))}
          </div>

          <div className={`${COLUMNS} mt-3 px-3 pb-1.5 ${SECTION} text-[11px]`} aria-hidden="true">
            <span>Barangay</span>
            <span className="text-right">A</span>
            <span className="text-right">B</span>
            <span className="text-right">Change</span>
          </div>
        </div>

        <ul
          ref={listRef}
          onPointerEnter={() => (pointerInList.current = true)}
          onPointerLeave={() => (pointerInList.current = false)}
          className="custom-scrollbar px-2 pb-2 xl:min-h-0 xl:flex-1 xl:overflow-y-auto"
        >
          {!bothReady ? (
            anyError ? (
              <li className="px-3 py-6 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                One of the periods couldn&apos;t be counted. Retry from that map&apos;s corner.
              </li>
            ) : (
              Array.from({ length: 8 }, (_, i) => (
                <li key={i} className={`${COLUMNS} px-3 py-2.5`} aria-hidden="true">
                  <span className="h-3.5 w-24 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
                  <span className="ml-auto h-3.5 w-6 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
                  <span className="ml-auto h-3.5 w-6 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
                  <span className="ml-auto h-3.5 w-8 animate-pulse rounded bg-slate-200 dark:bg-white/10" />
                </li>
              ))
            )
          ) : visible.length === 0 ? (
            <li className="px-3 py-6 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{emptyMessage}</li>
          ) : (
            visible.map((row) => {
              const isHovered = hovered === row.key;
              const barWidth = (Math.abs(row.delta) / largest) * 100;
              return (
                <li key={row.key}>
                  <button
                    type="button"
                    data-key={row.key}
                    onMouseEnter={() => onHover(row.key)}
                    onMouseLeave={() => onHover(null)}
                    onFocus={() => onHover(row.key)}
                    onBlur={() => onHover(null)}
                    onClick={() => onFocus(row.key)}
                    aria-label={`${row.name}: ${row.a} in A, ${row.b} in B, change ${formatDelta(row.delta)}. Zoom both maps to ${row.name}.`}
                    className={`${COLUMNS} w-full cursor-pointer rounded-lg px-3 py-1.5 text-left text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 ${
                      isHovered ? "bg-slate-100 dark:bg-white/[0.08]" : "hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="truncate font-medium text-slate-800 dark:text-slate-100">{row.name}</span>
                    <span className="text-right tabular-nums text-slate-500 dark:text-slate-400">{row.a}</span>
                    <span className="text-right tabular-nums text-slate-800 dark:text-slate-100">{row.b}</span>
                    <span className="relative flex h-6 items-center justify-end">
                      {/* Size of the change against the largest on the list, grown from the right edge of its own column. */}
                      {row.delta !== 0 && (
                        <span
                          aria-hidden="true"
                          className={`absolute inset-y-0 right-0 rounded-md ${
                            row.delta > 0
                              ? "bg-red-500/[0.1] dark:bg-red-400/[0.14]"
                              : "bg-emerald-500/[0.1] dark:bg-emerald-400/[0.14]"
                          }`}
                          style={{ width: `${Math.max(barWidth, 12)}%` }}
                        />
                      )}
                      <span className={`relative pr-1.5 font-semibold tabular-nums ${deltaTone(row.delta)}`}>
                        {formatDelta(row.delta)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <p className="border-t border-slate-200 px-5 py-3 text-[12px] leading-relaxed text-slate-500 dark:border-white/[0.06] dark:text-slate-400">
          Point at a barangay to light it on both maps. Choose a row to zoom both maps to it.
        </p>
      </div>
    </aside>
  );
}
