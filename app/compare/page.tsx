"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Crosshair, Minus, Plus } from "lucide-react";
import MapHeader from "@/components/layout/map-header";
import ComparePane from "@/components/compare/compare-pane";
import ChangeLedger from "@/components/compare/change-ledger";
import { MapLink } from "@/components/compare/map-link";
import {
  buildLedgerRows,
  countKey,
  sharedThresholds,
  type PaneReport,
  type Side,
} from "@/components/compare/compare-data";
import { MapProvider, useMapContext } from "@/context/MapContext";
import { useAuth } from "@/context/AuthContext";
import type { ThreatThresholds } from "@/lib/geo-threat";
import { OVERLAY_BUTTON } from "@/lib/map-overlay";

const canCompare = (permissions: string[]) =>
  permissions.includes("admin") ||
  permissions.includes("admin_operational_officer") ||
  permissions.includes("privileged_map_view");

interface CompareState {
  reports: Partial<Record<Side, PaneReport>>;
  /** Recomputed only once both sides have counted, so one side reloading never rescales the other mid-way. */
  scale: ThreatThresholds | null;
}

function CompareContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { geoJsonData } = useMapContext();
  const [link] = useState(() => new MapLink());
  const [hovered, setHovered] = useState<string | null>(null);
  const [{ reports, scale }, setCompare] = useState<CompareState>({ reports: {}, scale: null });

  useEffect(() => {
    if (!authLoading && (!user || !canCompare(user.permissions))) router.replace("/login");
  }, [authLoading, user, router]);

  const onReport = useCallback((side: Side, report: PaneReport) => {
    setCompare((prev) => {
      const next = { ...prev.reports, [side]: report };
      const { A, B } = next;
      const bothReady = A?.status === "ready" && B?.status === "ready";
      return { reports: next, scale: bothReady ? sharedThresholds(A.counts, B.counts) : prev.scale };
    });
  }, []);

  const features: Array<{ properties?: { adm4_en?: string }; geometry?: { coordinates?: unknown } }> = useMemo(
    () => geoJsonData?.features ?? [],
    [geoJsonData]
  );

  const rows = useMemo(
    () =>
      buildLedgerRows(
        features.map((f) => f.properties?.adm4_en).filter((name): name is string => Boolean(name)),
        reports.A?.counts ?? {},
        reports.B?.counts ?? {}
      ),
    [features, reports.A?.counts, reports.B?.counts]
  );

  const hoveredName = hovered ? (rows.find((row) => row.key === hovered)?.name ?? null) : null;

  const focusBarangay = useCallback(
    (key: string) => link.focus(features.find((f) => countKey(f.properties?.adm4_en ?? "") === key)?.geometry),
    [features, link]
  );

  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0f172a]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0EA5E9] border-t-transparent" />
      </div>
    );
  }

  if (!user || !canCompare(user.permissions)) return null;

  const paneProps = {
    thresholds: scale,
    hovered,
    hoveredName,
    onHover: setHovered,
    onFocus: focusBarangay,
    onReport,
    link,
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#020617] dark:text-slate-100">
      <Suspense
        fallback={
          <div className="h-16 w-full border-b border-slate-200 bg-white dark:border-white/[0.06] dark:bg-[#0F172A]" />
        }
      >
        <MapHeader isVisible />
      </Suspense>

      <main className="min-h-0 flex-1 overflow-y-auto xl:overflow-hidden">
        <h1 className="sr-only">Compare crime maps</h1>

        {/* A hairline split: the 1px gaps let the grid's own background draw the seams. */}
        <div className="grid gap-px bg-slate-200 dark:bg-white/[0.08] lg:grid-cols-2 xl:h-full xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_360px]">
          <ComparePane side="A" className="h-[52vh] lg:h-[64vh] xl:h-auto" {...paneProps} />
          <ComparePane side="B" className="h-[52vh] lg:h-[64vh] xl:h-auto" {...paneProps}>
            {/* The maps move together, so one set of controls drives both. */}
            <div role="group" aria-label="Both maps" className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => link.zoomIn()}
                aria-label="Zoom both maps in"
                title="Zoom in"
                className={`h-10 w-10 cursor-pointer ${OVERLAY_BUTTON}`}
              >
                <Plus aria-hidden="true" className="h-[18px] w-[18px]" />
              </button>
              <button
                type="button"
                onClick={() => link.zoomOut()}
                aria-label="Zoom both maps out"
                title="Zoom out"
                className={`h-10 w-10 cursor-pointer ${OVERLAY_BUTTON}`}
              >
                <Minus aria-hidden="true" className="h-[18px] w-[18px]" />
              </button>
              <button
                type="button"
                onClick={() => link.fitHome()}
                aria-label="Show all of Tanza on both maps"
                title="Show all of Tanza"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-sky-500 bg-sky-500 text-white shadow-sm transition-colors hover:bg-sky-600"
              >
                <Crosshair aria-hidden="true" className="h-[18px] w-[18px]" />
              </button>
            </div>
          </ComparePane>

          <ChangeLedger
            className="lg:col-span-2 xl:col-span-1 xl:min-h-0"
            reports={reports}
            rows={rows}
            thresholds={scale}
            hovered={hovered}
            onHover={setHovered}
            onFocus={focusBarangay}
          />
        </div>
      </main>
    </div>
  );
}

export default function ComparePage() {
  // The outer provider serves the header and the barangay boundaries; each map
  // runs its own provider inside, so its period never touches the main map's.
  return (
    <MapProvider persistPeriod={false}>
      <CompareContent />
    </MapProvider>
  );
}
