"use client";

import React from "react";
import { Building2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useMapContext } from "@/context/MapContext";

export default function MapHeader() {
  const { setFlyToStation, selectedBarangay, setSelectedBarangay } = useMapContext();
  
  // Create a reset helper that also clears search if needed (though context manages its own state)
  const onReset = () => {
    setSelectedBarangay(null);
  };
  return (
    <header className="flex justify-between items-start pointer-events-auto">
      <div className="glass p-[14px_20px] rounded-2xl flex items-center gap-[14px]">
        <div className="w-10 h-10 bg-indigo-600 rounded-[10px] flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] text-white">
          <span className="font-black text-xl">S</span>
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white leading-none m-0">SECURE Tanza</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest leading-none">System Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
