"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, Suspense } from "react";

import MapHeader from "@/components/layout/map-header";
import BarangayFilter from "@/components/layout/barangay-filter";
import CrimeTypeFilter from "@/components/layout/crime-type-filter";

import RealTimeClock from "@/components/layout/real-time-clock";
import TimeFilter, { TimeFilterState } from "@/components/layout/time-filter";

import { MapProvider, useMapContext } from "@/context/MapContext";

import RightSidebarControls from "@/components/layout/right-sidebar-controls";
import MapLegend from "@/components/map/map-legend";

const TanzaMap = dynamic(() => import("../components/map/tanza-map-root"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#0f172a] flex items-center justify-center">
      <span className="text-[#0EA5E9] text-sm font-semibold tracking-widest animate-pulse">
        Initializing SECURE OS…
      </span>
    </div>
  ),
});

function HomeContent() {
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeFilters, setTimeFilters] = useState<TimeFilterState>({
    selectedDate: new Date(),
    timeRange: "24h",
    selectedHour: null,
  });
  
  const { setIsTimeFilterActive, setTimeFilter } = useMapContext();

  const handleFilterToggle = useCallback((isActive: boolean) => {
    console.log('Filter toggle:', isActive);
    setIsFilterActive(isActive);
    setIsTimeFilterActive(isActive);
    
    // Clear time filter when closing
    if (!isActive) {
      console.log('Clearing time filter');
      setTimeFilter(null, null);
    }
  }, [setIsTimeFilterActive, setTimeFilter]);

  const handleFilterChange = useCallback((filters: TimeFilterState) => {
    setTimeFilters(filters);
    // You can use these filters to update the map data
    console.log("Filter changed:", filters);
  }, []);

  const handlePlayPauseToggle = useCallback(() => {
    setIsPlaying((prev) => {
      const newIsPlaying = !prev;
      // Activate time filter when starting playback
      if (newIsPlaying) {
        console.log('▶️ Starting playback - activating time filter');
        setIsTimeFilterActive(true);
      }
      return newIsPlaying;
    });
  }, [setIsTimeFilterActive]);

  return (
    <main className="relative h-screen w-screen bg-[#020617] overflow-hidden text-slate-100 font-sans">
      <div className="fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out">
        <Suspense fallback={
          <div className="w-full h-16 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/[0.06]" />
        }>
          <MapHeader isVisible={!isFilterActive} />
        </Suspense>
      </div>

      <div className={`absolute inset-0 z-0 transition-all duration-500 ease-in-out ${
        isFilterActive ? 'pt-0' : 'pt-16'
      }`}>
        <TanzaMap />
      </div>

      <div className={`fixed inset-0 z-10 pointer-events-none transition-all duration-500 ease-in-out ${
        isFilterActive ? 'pt-0' : 'pt-16'
      }`}>
        <div className={`absolute left-6 transition-all duration-500 ease-in-out flex gap-3 ${
          isFilterActive ? 'top-6' : 'top-20'
        }`}>
          <BarangayFilter />
          <CrimeTypeFilter />
        </div>

        <div className={`absolute right-6 transition-all duration-500 ease-in-out ${
          isFilterActive ? 'top-6' : 'top-20'
        }`}>
          <MapLegend />
        </div>

        <div className="absolute bottom-6 right-6">
          <RightSidebarControls />
        </div>

        {/* Time Filter - appears at bottom when filter is active with slide up animation */}
        <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out ${
          isFilterActive ? 'bottom-6 opacity-100' : '-bottom-32 opacity-0'
        }`}>
          <TimeFilter
            onFilterChange={handleFilterChange}
            isPlaying={isPlaying}
            onPlayPauseToggle={handlePlayPauseToggle}
          />
        </div>

        <div className={`absolute left-6 transition-all duration-500 ease-in-out ${
          isFilterActive ? 'bottom-[120px]' : 'bottom-6'
        }`}>
          <RealTimeClock
            onFilterToggle={handleFilterToggle}
            isFilterActive={isFilterActive}
          />
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <MapProvider>
      <HomeContent />
    </MapProvider>
  );
}
