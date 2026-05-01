"use client";

import { useState, useEffect } from "react";
import { useMapContext } from "@/context/MapContext";

export interface BarangayCrimeTypeCounts {
  [barangay: string]: number;
}

export function useCrimeTypeByBarangay() {
  const [crimeTypeCounts, setCrimeTypeCounts] = useState<BarangayCrimeTypeCounts>({});
  const [loading, setLoading] = useState(false);
  const { selectedCrimeType, timeFilterDate, timeFilterHour, isTimeFilterActive } = useMapContext();

  useEffect(() => {
    async function fetchCrimeTypeByBarangay() {
      if (!selectedCrimeType) {
        setCrimeTypeCounts({});
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("incidentType", selectedCrimeType);

        // Add time filter if active
        if (isTimeFilterActive && timeFilterDate) {
          const startDate = new Date(timeFilterDate);
          const endDate = new Date(timeFilterDate);
          
          if (timeFilterHour !== null) {
            // Filter by specific hour
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            params.append("hour", timeFilterHour.toString());
          } else {
            // Filter by entire day
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
          }
          
          params.append("startDateCommitted", startDate.toISOString());
          params.append("endDateCommitted", endDate.toISOString());
        }

        const response = await fetch(`/api/crimes?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch crime data");
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          // Count crimes by barangay
          const counts: BarangayCrimeTypeCounts = {};
          data.data.forEach((crime: any) => {
            const barangay = crime.barangay;
            counts[barangay] = (counts[barangay] || 0) + 1;
          });
          
          setCrimeTypeCounts(counts);
        }
      } catch (error) {
        console.error("Error fetching crime type by barangay:", error);
        setCrimeTypeCounts({});
      } finally {
        setLoading(false);
      }
    }

    fetchCrimeTypeByBarangay();
  }, [selectedCrimeType, timeFilterDate, timeFilterHour, isTimeFilterActive]);

  return { crimeTypeCounts, loading };
}
