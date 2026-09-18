"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { CrimeIncident } from "@/lib/api";

// Leaflet touches `window` at import time, so the actual map can only ever be
// loaded in the browser — same treatment app/page.tsx gives the main map.
const SliceMiniMapInner = dynamic(() => import("./slice-mini-map-inner"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-lg animate-pulse bg-slate-200/60 dark:bg-white/[0.04]"
      style={{ height: 220 }}
    />
  ),
});

export default function SliceMiniMap({
  incidents,
  theme,
}: {
  incidents: CrimeIncident[];
  theme: string;
}) {
  const withCoords = incidents.filter(
    (c) => typeof c.latitude === "number" && typeof c.longitude === "number"
  ).length;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-white/[0.06]">
        <SliceMiniMapInner incidents={incidents} theme={theme} />
      </div>
      <p className={`text-[0.68rem] ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
        {withCoords > 0
          ? `Shaded by incident count per barangay · ${withCoords} of ${incidents.length} pinned to exact coordinates`
          : "Shaded by incident count per barangay · no exact coordinates recorded for these incidents"}
      </p>
    </div>
  );
}
