"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import L from "leaflet";
import { BARANGAY_NAMES, generateBarangayData, getHotspotSectorForDate } from "../constants/dummy";

// Time range selection types
export type FilterMode = 'day' | 'month' | 'quarter' | 'half-year' | 'year';

export interface TimeSelection {
  year: number;
  quarter?: number;
  halfYear?: number;
  month?: number;
  day?: Date;
}

export interface TimeRange {
  mode: FilterMode;
  selections: TimeSelection[];
}

interface MapContextType {
  geoJsonData: any;
  barangayNames: string[];
  selectedBarangay: string | null;
  hoveredBarangay: string | null;
  flyToStation: boolean;
  filterOpen: boolean;
  searchQuery: string;
  filteredBarangays: string[];
  hotspotMode: boolean;
  hotspotMonth: string;
  hotspotYear: string;
  hoveredThreatLevel: string | null;
  mapRef: React.MutableRefObject<L.Map | null>;
  initialBounds: L.LatLngBounds | null;
  timeFilterDate: Date | null;
  timeFilterHour: number | null;
  timeFilterHourCrimeCount: number;
  isTimeFilterActive: boolean;
  selectedCrimeType: string | null;
  selectedYear: number | null;
  availableYears: number[];
  timeRange: TimeRange;
  
  // Actions
  setSelectedBarangay: (name: string | null) => void;
  setHoveredBarangay: (name: string | null) => void;
  setFlyToStation: (value: boolean) => void;
  setFilterOpen: (value: boolean) => void;
  setSearchQuery: (query: string) => void;
  setHotspotMode: (value: boolean) => void;
  setHotspotDate: (month: string, year: string) => void;
  setHoveredThreatLevel: (level: string | null) => void;
  setInitialBounds: (bounds: L.LatLngBounds | null) => void;
  setTimeFilter: (date: Date | null, hour: number | null, hourCrimeCount?: number) => void;
  setIsTimeFilterActive: (isActive: boolean) => void;
  setSelectedCrimeType: (crimeType: string | null) => void;
  setSelectedYear: (year: number | null) => void;
  setTimeRange: (timeRange: TimeRange) => void;
  onFlyToStationComplete: () => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [barangayNames, setBarangayNames] = useState<string[]>([]);
  const [selectedBarangay, setSelectedBarangay] = useState<string | null>(null);
  const [hoveredBarangay, setHoveredBarangay] = useState<string | null>(null);
  const [flyToStation, setFlyToStation] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hotspotMode, setHotspotMode] = useState(false);
  const [hotspotMonth, setHotspotMonth] = useState("Apr");
  const [hotspotYear, setHotspotYear] = useState("2026");
  const [hoveredThreatLevel, setHoveredThreatLevel] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [timeFilterDate, setTimeFilterDate] = useState<Date | null>(null);
  const [timeFilterHour, setTimeFilterHour] = useState<number | null>(null);
  const [timeFilterHourCrimeCount, setTimeFilterHourCrimeCount] = useState<number>(0);
  const [isTimeFilterActive, setIsTimeFilterActive] = useState(false);
  const [selectedCrimeType, setSelectedCrimeType] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [timeRange, setTimeRangeState] = useState<TimeRange>({ mode: 'year', selections: [] });
  const [initialBounds, setInitialBounds] = useState<L.LatLngBounds | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Wrapper for setTimeRange that also saves to localStorage
  const setTimeRange = useCallback((newTimeRange: TimeRange) => {
    setTimeRangeState(newTimeRange);
    
    // Save to localStorage (serialize Date objects)
    const serialized = {
      mode: newTimeRange.mode,
      selections: newTimeRange.selections.map(s => ({
        year: s.year,
        quarter: s.quarter,
        halfYear: s.halfYear,
        month: s.month,
        day: s.day ? s.day.toISOString() : undefined
      }))
    };
    localStorage.setItem('timeRange', JSON.stringify(serialized));
    
    console.log('💾 Saved timeRange to localStorage:', serialized);
  }, []);

  // Wrapper for setSelectedYear that also saves to localStorage
  const setSelectedYearWithPersistence = useCallback((year: number | null) => {
    setSelectedYear(year);
    if (year !== null) {
      localStorage.setItem('selectedYear', year.toString());
    } else {
      localStorage.removeItem('selectedYear');
    }
  }, []);

  const setHotspotDate = useCallback((month: string, year: string) => {
    setHotspotMonth(month);
    setHotspotYear(year);
  }, []);

  const setTimeFilter = useCallback((date: Date | null, hour: number | null, hourCrimeCount: number = 0) => {
    setTimeFilterDate(date);
    setTimeFilterHour(hour);
    setTimeFilterHourCrimeCount(hourCrimeCount);
  }, []);

  const hotspotBarangay = hotspotMode ? getHotspotSectorForDate(hotspotMonth, hotspotYear) : null;

  // Fetch available years from database
  useEffect(() => {
    fetch("/api/crimes/years")
      .then((r) => r.json())
      .then((data) => {
        if (data.years && data.years.length > 0) {
          setAvailableYears(data.years);
          
          // Try to restore timeRange from localStorage first
          const savedTimeRange = localStorage.getItem('timeRange');
          if (savedTimeRange) {
            try {
              const parsed = JSON.parse(savedTimeRange);
              // Deserialize Date objects
              const restored: TimeRange = {
                mode: parsed.mode,
                selections: parsed.selections.map((s: any) => ({
                  year: s.year,
                  quarter: s.quarter,
                  halfYear: s.halfYear,
                  month: s.month,
                  day: s.day ? new Date(s.day) : undefined
                }))
              };
              
              // Validate that the restored selections are still valid
              const validSelections = restored.selections.filter(s => {
                if (restored.mode === 'year') {
                  return data.years.includes(s.year);
                }
                return data.years.includes(s.year);
              });
              
              if (validSelections.length > 0) {
                console.log('📅 Restored timeRange from localStorage:', restored);
                setTimeRangeState({ ...restored, selections: validSelections });
                
                // Also restore selectedYear for backward compatibility
                if (validSelections.length > 0) {
                  setSelectedYear(validSelections[0].year);
                }
                return;
              }
            } catch (e) {
              console.error('Failed to restore timeRange from localStorage:', e);
            }
          }
          
          // Try to restore selectedYear from localStorage
          const savedYear = localStorage.getItem('selectedYear');
          if (savedYear) {
            const yearNum = parseInt(savedYear);
            if (data.years.includes(yearNum)) {
              console.log('📅 Restored year from localStorage:', yearNum);
              setSelectedYear(yearNum);
              setTimeRangeState({ mode: 'year', selections: [{ year: yearNum }] });
              return;
            }
          }
          
          // Otherwise, set current year as default if available, or use the most recent year
          const currentYear = new Date().getFullYear();
          if (data.years.includes(currentYear)) {
            setSelectedYear(currentYear);
            setTimeRangeState({ mode: 'year', selections: [{ year: currentYear }] });
          } else {
            setSelectedYear(data.years[0]); // Most recent year
            setTimeRangeState({ mode: 'year', selections: [{ year: data.years[0] }] });
          }
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/tanza_cavite.geojson")
      .then((r) => r.json())
      .then((data) => {
        setGeoJsonData(data);
        setBarangayNames(
          data.features.map((f: any) => f.properties.adm4_en).filter(Boolean).sort()
        );
      })
      .catch(console.error);
  }, []);

  const onFlyToStationComplete = useCallback(() => setFlyToStation(false), []);

  const filteredBarangays = barangayNames.filter((n) =>
    n.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const value = {
    geoJsonData,
    barangayNames,
    selectedBarangay,
    hoveredBarangay,
    flyToStation,
    filterOpen,
    searchQuery,
    filteredBarangays,
    hotspotMode,
    hotspotMonth,
    hotspotYear,
    hotspotBarangay,
    hoveredThreatLevel,
    timeFilterDate,
    timeFilterHour,
    timeFilterHourCrimeCount,
    isTimeFilterActive,
    selectedCrimeType,
    selectedYear,
    availableYears,
    timeRange,
    mapRef,
    initialBounds,
    setSelectedBarangay,
    setHoveredBarangay,
    setFlyToStation,
    setFilterOpen,
    setSearchQuery,
    setHotspotMode,
    setHotspotDate,
    setHoveredThreatLevel,
    setInitialBounds,
    setTimeFilter,
    setIsTimeFilterActive,
    setSelectedCrimeType,
    setSelectedYear: setSelectedYearWithPersistence,
    setTimeRange,
    onFlyToStationComplete,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMapContext() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
}
