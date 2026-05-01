"use client";

import { Plus, Minus, Crosshair } from "lucide-react";
import { useMapContext } from "@/context/MapContext";

export default function RightSidebarControls() {
  const { mapRef, setFlyToStation } = useMapContext();

  const handleZoomIn = () => {
    const map = mapRef.current;
    if (!map) return;
    const currentZoom = map.getZoom();
    const maxZoom = map.getMaxZoom();
    if (currentZoom < maxZoom) {
      map.zoomIn();
    }
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    if (!map) return;
    const currentZoom = map.getZoom();
    const minZoom = map.getMinZoom();
    if (currentZoom > minZoom) {
      map.zoomOut();
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
      {/* Zoom In */}
      <button
        onClick={handleZoomIn}
        className="w-11 h-11 rounded-xl bg-[#1E293B]/90 backdrop-blur-xl border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1E293B] hover:border-white/[0.12] transition-all duration-200 cursor-pointer group"
        title="Zoom In"
      >
        <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* Zoom Out */}
      <button
        onClick={handleZoomOut}
        className="w-11 h-11 rounded-xl bg-[#1E293B]/90 backdrop-blur-xl border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1E293B] hover:border-white/[0.12] transition-all duration-200 cursor-pointer group"
        title="Zoom Out"
      >
        <Minus className="h-5 w-5 group-hover:scale-110 transition-transform" />
      </button>

      {/* Locate / Fly to Station */}
      <button
        onClick={() => setFlyToStation(true)}
        className="w-11 h-11 rounded-xl bg-[#0EA5E9] border border-[#0EA5E9]/60 flex items-center justify-center text-white hover:bg-[#0EA5E9]/90 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all duration-200 cursor-pointer group"
        title="Fly to Police Station"
      >
        <Crosshair className="h-5 w-5 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
