"use client";

import dynamic from "next/dynamic";
import { useState, useCallback, Suspense } from "react";

import MapHeader from "@/components/layout/map-header";
import BarangayFilter from "@/components/layout/barangay-filter";
import CrimeTypeFilter from "@/components/layout/crime-type-filter";
import RealTimeClock from "@/components/layout/real-time-clock";
import TimeFilter from "@/components/layout/time-filter";

import { MapProvider, useMapContext } from "@/context/MapContext";

import RightSidebarControls from "@/components/layout/right-sidebar-controls";
import MapLegend from "@/components/map/map-legend";

const TanzaMap = dynamic(() => import("../components/map/tanza-map-root"), {
  ssr: false,
});

function HomeContent() {
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { setIsTimeFilterActive, setTimeFilter } = useMapContext();

  const handleFilterToggle = useCallback((isActive: boolean) => {
    console.log('Filter toggle:', isActive);
    setIsFilterActive(isActive);
    setIsTimeFilterActive(isActive);
    
    // Clear time filter when closing
    if (!isActive) {
      console.log('Clearing time filter');
      setTimeFilter(null, null, 0);
    }
  }, [setIsTimeFilterActive, setTimeFilter]);

  const handleFilterChange = useCallback((filters: any) => {
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
        {/* Top Left Filters */}
        <div className={`absolute left-3 sm:left-4 lg:left-6 transition-all duration-500 ease-in-out flex flex-col sm:flex-row gap-2 sm:gap-3 ${
          isFilterActive ? 'top-3 sm:top-4 lg:top-6' : 'top-[72px] sm:top-20'
        }`}>
          <BarangayFilter />
          <CrimeTypeFilter />
        </div>

        {/* Top Right Legend */}
        <div className={`absolute right-3 sm:right-4 lg:right-6 transition-all duration-500 ease-in-out ${
          isFilterActive ? 'top-3 sm:top-4 lg:top-6' : 'top-[72px] sm:top-20'
        }`}>
          <MapLegend />
        </div>

        {/* Bottom Right Controls */}
        <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 right-3 sm:right-4 lg:right-6">
          <RightSidebarControls />
        </div>

        {/* Time Filter - appears at bottom when filter is active */}
        <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out px-3 sm:px-0 ${
          isFilterActive ? 'bottom-3 sm:bottom-4 lg:bottom-6 opacity-100' : '-bottom-32 opacity-0'
        }`}>
          {isFilterActive && (
            <TimeFilter
              key="time-filter-active"
              onFilterChange={handleFilterChange}
              isPlaying={isPlaying}
              onPlayPauseToggle={handlePlayPauseToggle}
            />
          )}
        </div>

        {/* Real Time Clock */}
        <div className={`absolute left-3 sm:left-4 lg:left-6 transition-all duration-500 ease-in-out ${
          isFilterActive ? 'bottom-[100px] sm:bottom-[120px]' : 'bottom-3 sm:bottom-4 lg:bottom-6'
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
