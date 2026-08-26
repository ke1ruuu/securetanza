"use client";

import { useState, useEffect } from "react";
import { useMapContext } from "@/context/MapContext";
import { useTimeRangeData } from "@/hooks/useTimeRangeData";

export interface CrimeTypeStats {
  type: string;
  count: number;
}

export interface CrimeTypesData {
  stats: CrimeTypeStats[];
  total: number;
  loading: boolean;
}

// Define colors for different crime types
export const CRIME_TYPE_COLORS: Record<string, string> = {
  "Theft": "#EF4444", // red-500
  "Robbery": "#DC2626", // red-600
  "Physical Injury": "#F97316", // orange-500
  "Alarm and Scandal": "#F59E0B", // amber-500
  "Carnapping": "#EAB308", // yellow-500
  "Drugs": "#8B5CF6", // violet-500
  "Buy Bust": "#8B5CF6", // violet-500 (drug operation)
  "Homicide": "#EC4899", // pink-500
  "Rape": "#BE185D", // pink-700
  "Murder": "#991B1B", // red-900
  "Shooting": "#991B1B", // red-900
  "Illegal Gambling": "#F59E0B", // amber-500
  "Other": "#6B7280", // gray-500
};

// Helper function to extract crime type from incident type
// Handles formats like "(Incident) Theft" or "(Operation) Buy Bust"
export function extractCrimeType(incidentType: string): string {
  // Remove "(Incident)" or "(Operation)" prefix
  const cleaned = incidentType.replace(/^\((?:Incident|Operation)\)\s*/i, '').trim();
  return cleaned;
}

// Helper function to get color for a crime type
export function getCrimeTypeColor(type: string): string {
  // Extract the actual crime type (remove prefix)
  const crimeType = extractCrimeType(type);
  
  // Try exact match first
  if (CRIME_TYPE_COLORS[crimeType]) {
    return CRIME_TYPE_COLORS[crimeType];
  }
  
  // Try partial match (for cases like "Physical Injury" matching "Injury")
  for (const [key, color] of Object.entries(CRIME_TYPE_COLORS)) {
    if (crimeType.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(crimeType.toLowerCase())) {
      return color;
    }
  }
  
  return CRIME_TYPE_COLORS["Other"];
}

export function useCrimeTypes(): CrimeTypesData {
  const [stats, setStats] = useState<CrimeTypeStats[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const {
    selectedBarangay,
    timeFilterDate,
    timeFilterHour,
    isTimeFilterActive,
    selectedYear,
    timeRange,
  } = useMapContext();
  const dateRanges = useTimeRangeData();

  useEffect(() => {
    async function fetchCrimeTypes() {
      setLoading(true);
      try {
        const typeCountMap: Record<string, number> = {};
        let totalCount = 0;

        if (isTimeFilterActive && timeFilterDate) {
          // 1. Time Filter takes precedence
          const startDate = new Date(timeFilterDate);
          const endDate = new Date(timeFilterDate);

          if (timeFilterHour !== null) {
            startDate.setHours(timeFilterHour, 0, 0, 0);
            endDate.setHours(timeFilterHour, 59, 59, 999);
          } else {
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
          }

          const params = new URLSearchParams();
          if (selectedBarangay) params.append("barangay", selectedBarangay);
          params.append("startDate", startDate.toISOString());
          params.append("endDate", endDate.toISOString());

          const response = await fetch(`/api/crimes/stats?${params.toString()}`);
          if (!response.ok) throw new Error("Failed to fetch crime types");
          const data = await response.json();

          if (data.success && data.data?.crimesByType) {
            data.data.crimesByType.forEach((c: { type?: string; incidentType?: string; count?: number; _count?: { incidentType: number } }) => {
              const name = c.type || c.incidentType || "Other";
              const count = c.count || c._count?.incidentType || 0;
              typeCountMap[name] = (typeCountMap[name] || 0) + count;
              totalCount += count;
            });
          }
        } else if (dateRanges.length > 0) {
          // 2. Granular TimeRange (Year, Quarter, Month, Half-Year, Day)
          const results = await Promise.all(
            dateRanges.map(async ({ start, end }) => {
              const params = new URLSearchParams();
              if (selectedBarangay) params.append("barangay", selectedBarangay);
              params.append("startDate", start.toISOString());
              params.append("endDate", end.toISOString());

              const res = await fetch(`/api/crimes/stats?${params.toString()}`);
              if (!res.ok) return null;
              return res.json();
            })
          );

          results.forEach((result) => {
            if (result?.success && result.data?.crimesByType) {
              result.data.crimesByType.forEach((c: { type?: string; incidentType?: string; count?: number; _count?: { incidentType: number } }) => {
                const name = c.type || c.incidentType || "Other";
                const count = c.count || c._count?.incidentType || 0;
                typeCountMap[name] = (typeCountMap[name] || 0) + count;
                totalCount += count;
              });
            }
          });
        } else if (selectedYear) {
          // 3. Fallback to Year
          const params = new URLSearchParams();
          if (selectedBarangay) params.append("barangay", selectedBarangay);
          params.append("year", selectedYear.toString());

          const response = await fetch(`/api/crimes/stats?${params.toString()}`);
          if (!response.ok) throw new Error("Failed to fetch crime types");
          const data = await response.json();

          if (data.success && data.data?.crimesByType) {
            data.data.crimesByType.forEach((c: { type?: string; incidentType?: string; count?: number; _count?: { incidentType: number } }) => {
              const name = c.type || c.incidentType || "Other";
              const count = c.count || c._count?.incidentType || 0;
              typeCountMap[name] = (typeCountMap[name] || 0) + count;
              totalCount += count;
            });
          }
        }

        const sortedStats: CrimeTypeStats[] = Object.entries(typeCountMap)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count);

        setStats(sortedStats);
        setTotal(totalCount);
      } catch (error) {
        console.error("Error fetching crime types:", error);
        setStats([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    fetchCrimeTypes();
  }, [
    selectedBarangay,
    timeFilterDate,
    timeFilterHour,
    isTimeFilterActive,
    selectedYear,
    timeRange,
    dateRanges,
  ]);

  return { stats, total, loading };
}
