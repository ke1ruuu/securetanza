import { useState, useEffect, useCallback } from "react";
import { fetchCrimes, CrimeIncident } from "@/lib/api";
import { TimeFilterState } from "@/components/layout/time-filter";

export function useTimeFilter(filters: TimeFilterState) {
  const [crimes, setCrimes] = useState<CrimeIncident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilteredCrimes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const endDate = new Date(filters.selectedDate);
      const startDate = new Date(filters.selectedDate);

      // Adjust date range based on selected time range
      if (filters.timeRange === "7d") {
        startDate.setDate(startDate.getDate() - 7);
      } else if (filters.timeRange === "60d") {
        startDate.setDate(startDate.getDate() - 60);
      } else {
        startDate.setDate(startDate.getDate() - 1);
      }

      const params: any = {
        startDateCommitted: startDate.toISOString(),
        endDateCommitted: endDate.toISOString(),
      };

      // Add hour filter if specific hour is selected
      if (filters.selectedHour !== null) {
        params.startHour = filters.selectedHour;
        params.endHour = filters.selectedHour;
      }

      const data = await fetchCrimes(params);
      setCrimes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch crimes");
      console.error("Error fetching filtered crimes:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchFilteredCrimes();
  }, [fetchFilteredCrimes]);

  return {
    crimes,
    loading,
    error,
    refetch: fetchFilteredCrimes,
  };
}
