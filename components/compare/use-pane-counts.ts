"use client";

import { useEffect, useState } from "react";
import { useMapContext } from "@/context/MapContext";
import { useTimeRangeData } from "@/hooks/useTimeRangeData";
import { toIncidentTypeParam } from "@/lib/crime-groups";
import { countKey, type PaneStatus } from "./compare-data";

interface PaneResult {
  /** The request this answer belongs to; an answer for an older request means the current one is still loading. */
  key: string;
  counts: Record<string, number>;
  total: number;
  failed: boolean;
}

/**
 * Incidents per barangay for one side of the compare view: that side's period
 * (every range in it, summed) and crime type, read from its own MapProvider.
 * A superseded request is aborted, so a slow answer for an old period can never
 * overwrite the current one. While a new period loads, the last counts stay up.
 */
export function usePaneCounts() {
  const { selectedCrimeType } = useMapContext();
  const dateRanges = useTimeRangeData();
  const [result, setResult] = useState<PaneResult | null>(null);
  const [attempt, setAttempt] = useState(0);

  const requestKey = `${dateRanges.map(({ start, end }) => `${start.getTime()}-${end.getTime()}`).join(",")}|${
    selectedCrimeType ?? ""
  }|${attempt}`;

  useEffect(() => {
    // The provider hasn't picked an opening period yet.
    if (dateRanges.length === 0) return;

    const controller = new AbortController();

    Promise.all(
      dateRanges.map(async ({ start, end }) => {
        const params = new URLSearchParams({
          startDateCommitted: start.toISOString(),
          endDateCommitted: end.toISOString(),
        });
        if (selectedCrimeType) params.set("incidentType", toIncidentTypeParam(selectedCrimeType));

        const res = await fetch(`/api/crimes/barangay-counts?${params}`, { signal: controller.signal });
        const body = await res.json();
        if (!res.ok || !body?.success) throw new Error(body?.error || `Counts request failed (${res.status})`);
        return (body.data?.barangayCounts ?? {}) as Record<string, number>;
      })
    )
      .then((results) => {
        const counts: Record<string, number> = {};
        let total = 0;
        results.forEach((counted) =>
          Object.entries(counted).forEach(([name, count]) => {
            const key = countKey(name);
            counts[key] = (counts[key] ?? 0) + count;
            total += count;
          })
        );
        setResult({ key: requestKey, counts, total, failed: false });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("Could not load barangay counts for the compare view:", error);
        setResult((prev) => ({ key: requestKey, counts: prev?.counts ?? {}, total: prev?.total ?? 0, failed: true }));
      });

    return () => controller.abort();
    // requestKey already encodes dateRanges, selectedCrimeType and attempt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  const status: PaneStatus = !result || result.key !== requestKey ? "loading" : result.failed ? "error" : "ready";

  return {
    counts: result?.counts ?? EMPTY,
    total: result?.total ?? 0,
    status,
    retry: () => setAttempt((n) => n + 1),
  };
}

const EMPTY: Record<string, number> = {};
