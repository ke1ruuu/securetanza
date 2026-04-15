"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { BARANGAY_NAMES, generateBarangayData, getHotspotSectorForDate } from "../constants/dummy";

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
  
  // Actions
  setSelectedBarangay: (name: string | null) => void;
  setHoveredBarangay: (name: string | null) => void;
  setFlyToStation: (value: boolean) => void;
  setFilterOpen: (value: boolean) => void;
  setSearchQuery: (query: string) => void;
  setHotspotMode: (value: boolean) => void;
  setHotspotDate: (month: string, year: string) => void;
  setHoveredThreatLevel: (level: string | null) => void;
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

  const setHotspotDate = useCallback((month: string, year: string) => {
    setHotspotMonth(month);
    setHotspotYear(year);
  }, []);

  const hotspotBarangay = hotspotMode ? getHotspotSectorForDate(hotspotMonth, hotspotYear) : null;

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
    setSelectedBarangay,
    setHoveredBarangay,
    setFlyToStation,
    setFilterOpen,
    setSearchQuery,
    setHotspotMode,
    setHotspotDate,
    setHoveredThreatLevel,
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
