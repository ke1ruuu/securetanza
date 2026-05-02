"use client";

import { useState, useEffect } from "react";
import { useMapContext } from "@/context/MapContext";

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
  const { selectedBarangay, timeFilterDate, timeFilterHour, isTimeFilterActive, selectedYear } = useMapContext();

  useEffect(() => {
    async function fetchCrimeTypes() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        if (selectedBarangay) {
          params.append("barangay", selectedBarangay);
        }

        // Add time filter if active
        if (isTimeFilterActive && timeFilterDate) {
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
          
          params.append("startDate", startDate.toISOString());
          params.append("endDate", endDate.toISOString());
        } else if (selectedYear) {
          // Add year filter if no time filter is active
          params.append("year", selectedYear.toString());
        }

        const response = await fetch(`/api/crimes/stats?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch crime types");
        }

        const data = await response.json();
        
        if (data.success && data.data.crimesByType) {
          // Sort by count descending and take top 5
          const sortedTypes = data.data.crimesByType
            .sort((a: CrimeTypeStats, b: CrimeTypeStats) => b.count - a.count)
            .slice(0, 5);
          
          setStats(sortedTypes);
          setTotal(data.data.totalCrimes || 0);
        }
      } catch (error) {
        console.error("Error fetching crime types:", error);
        setStats([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    fetchCrimeTypes();
  }, [selectedBarangay, timeFilterDate, timeFilterHour, isTimeFilterActive, selectedYear]);

  return { stats, total, loading };
}
