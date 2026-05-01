import { useState, useEffect } from "react";
import { fetchCrimes, CrimeIncident } from "@/lib/api";
import { useMapContext } from "@/context/MapContext";

export function useFilteredCrimes() {
  const [crimes, setCrimes] = useState<CrimeIncident[]>([]);
  const [loading, setLoading] = useState(false);
  const { timeFilterDate, timeFilterHour } = useMapContext();

  useEffect(() => {
    const fetchFilteredCrimes = async () => {
      setLoading(true);
      try {
        if (!timeFilterDate) {
          // No filter active, fetch all recent crimes
          const allCrimes = await fetchCrimes({ limit: 1000 });
          setCrimes(allCrimes);
        } else {
          // Filter by date and hour
          const startDate = new Date(timeFilterDate);
          const endDate = new Date(timeFilterDate);
          
          if (timeFilterHour !== null) {
            // Filter by specific hour
            startDate.setHours(timeFilterHour, 0, 0, 0);
            endDate.setHours(timeFilterHour, 59, 59, 999);
          } else {
            // Filter by entire day
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
          }

          const filteredCrimes = await fetchCrimes({
            startDateCommitted: startDate.toISOString(),
            endDateCommitted: endDate.toISOString(),
          });
          
          setCrimes(filteredCrimes);
        }
      } catch (error) {
        console.error("Error fetching filtered crimes:", error);
        setCrimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredCrimes();
  }, [timeFilterDate, timeFilterHour]);

  return { crimes, loading };
}
