"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import MapHeader from "@/components/layout/map-header";
import BarangayFilter from "@/components/layout/barangay-filter";
import MapDock from "@/components/layout/map-dock";

import RealTimeClock from "@/components/layout/real-time-clock";

import { MapProvider, useMapContext } from "@/context/MapContext";

import RightSidebarControls from "@/components/layout/right-sidebar-controls";
import MapLegend from "@/components/map/map-legend";

const TanzaMap = dynamic(() => import("../components/map/tanza-map-root"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#0f172a] flex items-center justify-center">
      <span className="text-[#818cf8] text-sm font-semibold tracking-widest animate-pulse">
        Initializing SECURE OS…
      </span>
    </div>
  ),
});

function HomeContent() {
  const router = useRouter();
  const {
    geoJsonData,
    selectedBarangay,
    setSelectedBarangay,
    flyToStation,
    setFlyToStation,
    filterOpen,
    setFilterOpen,
    searchQuery,
    setSearchQuery,
    filteredBarangays,
    onFlyToStationComplete,
  } = useMapContext();

  return (
    <main className="relative h-screen w-screen bg-[#020617] overflow-hidden text-slate-100 font-sans">
      <div className="absolute top-[-250px] right-[-250px] w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-250px] left-[-250px] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute inset-0 z-0">
        <TanzaMap />
      </div>

      <div className="relative z-10 p-10 h-full flex flex-col pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20">
          <RealTimeClock />
        </div>

        <MapHeader />

        <RightSidebarControls />

        <div className="mt-auto flex justify-between items-end gap-6 mb-4">
          <BarangayFilter />

          <MapDock
            onDashboard={() =>
              router.push(
                `/dashboard${selectedBarangay ? `?name=${selectedBarangay}` : ""}`,
              )
            }
          />

          <div className="flex items-center gap-3">
            <MapLegend />
          </div>
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
