"use client";

import { useState, useEffect } from "react";
import { useMapContext } from "@/context/MapContext";
import { useTimeRangeData } from "@/hooks/useTimeRangeData";

export interface BarangayCrimeTypeCounts {
  [barangay: string]: number;
}

export function useCrimeTypeByBarangay() {
  const [crimeTypeCounts, setCrimeTypeCounts] = useState<BarangayCrimeTypeCounts>({});
  const [loading, setLoading] = useState(false);
  const {
    selectedCrimeType,
    selectedYear,
    timeFilterDate,
    timeFilterHour,
    isTimeFilterActive,
    timeRange,
  } = useMapContext();
  const dateRanges = useTimeRangeData();

  useEffect(() => {
    async function fetchCrimeTypeByBarangay() {
      if (!selectedCrimeType) {
        setCrimeTypeCounts({});
        return;
      }

      // Wait until timeRange selections or selectedYear is initialized (unless time filter is active)
      if (!isTimeFilterActive && dateRanges.length === 0 && selectedYear === null) {
        console.log("⏳ CrimeTypeByBarangay: Waiting for temporal filter initialization...");
        return;
      }

      setLoading(true);
      try {
        const mergedCounts: BarangayCrimeTypeCounts = {};

        if (isTimeFilterActive && timeFilterDate) {
          // 1. Time Filter (Specific Day / Hour) takes precedence
          const startDate = new Date(timeFilterDate);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(timeFilterDate);
          endDate.setHours(23, 59, 59, 999);

          const params = new URLSearchParams();
          params.append("incidentType", selectedCrimeType);
          params.append("startDateCommitted", startDate.toISOString());
          params.append("endDateCommitted", endDate.toISOString());
          if (timeFilterHour !== null) {
            params.append("hour", timeFilterHour.toString());
          }

          const response = await fetch(`/api/crimes/barangay-counts?${params.toString()}`);
          if (!response.ok) throw new Error("Failed to fetch crime data");
          const data = await response.json();
          if (data.success && data.data?.barangayCounts) {
            Object.assign(mergedCounts, data.data.barangayCounts);
          }
        } else if (dateRanges.length > 0) {
          // 2. Multi-Range / Granular TimeRange (Year, Quarter, Month, Half-Year, Day)
          const results = await Promise.all(
            dateRanges.map(async ({ start, end }) => {
              const params = new URLSearchParams();
              params.append("incidentType", selectedCrimeType);
              params.append("startDateCommitted", start.toISOString());
              params.append("endDateCommitted", end.toISOString());

              const res = await fetch(`/api/crimes/barangay-counts?${params.toString()}`);
              if (!res.ok) return null;
              return res.json();
            })
          );

          results.forEach((result) => {
            if (result?.success && result.data?.barangayCounts) {
              Object.entries(result.data.barangayCounts).forEach(([barangay, count]) => {
                mergedCounts[barangay] = (mergedCounts[barangay] || 0) + (count as number);
              });
            }
          });
        } else if (selectedYear) {
          // 3. Fallback to Year Filter
          const params = new URLSearchParams();
          params.append("incidentType", selectedCrimeType);
          params.append("year", selectedYear.toString());

          const response = await fetch(`/api/crimes/barangay-counts?${params.toString()}`);
          if (!response.ok) throw new Error("Failed to fetch crime data");
          const data = await response.json();
          if (data.success && data.data?.barangayCounts) {
            Object.assign(mergedCounts, data.data.barangayCounts);
          }
        }

        setCrimeTypeCounts(mergedCounts);
      } catch (error) {
        console.error("Error fetching crime type by barangay:", error);
        setCrimeTypeCounts({});
      } finally {
        setLoading(false);
      }
    }

    fetchCrimeTypeByBarangay();
  }, [
    selectedCrimeType,
    selectedYear,
    timeRange,
    dateRanges,
    timeFilterDate,
    timeFilterHour,
    isTimeFilterActive,
  ]);

  return { crimeTypeCounts, loading };
}
