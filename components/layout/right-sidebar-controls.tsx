"use client";

import { Building2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMapContext } from "@/context/MapContext";
import HotspotControls from "./hotspot-controls";

export default function RightSidebarControls() {
  const { setFlyToStation, selectedBarangay, setSelectedBarangay } =
    useMapContext();

  return (
    <div className="absolute right-10 top-10 z-20 flex flex-col gap-4 items-center pointer-events-auto">
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setFlyToStation(true)}
          className="glass border-white/10 text-slate-400 hover:text-white hover:bg-white/5 h-12 w-12 rounded-xl transition-all duration-300"
          title="Fly to Police Station"
        >
          <Building2 className="h-5 w-5" />
        </Button>

        {selectedBarangay && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedBarangay(null)}
            className="glass border-white/10 text-slate-400 hover:text-white hover:bg-white/5 h-12 w-12 rounded-xl animate-in zoom-in fade-in transition-all duration-300"
            title="Reset View"
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="h-[1px] w-8" />
      <HotspotControls />
    </div>
  );
}
