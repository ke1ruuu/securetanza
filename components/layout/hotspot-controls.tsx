"use client";

import React from "react";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMapContext } from "@/context/MapContext";

export default function HotspotControls() {
  const {
    hotspotMode,
    setHotspotMode,
    hotspotMonth,
    hotspotYear,
    setHotspotDate,
  } = useMapContext();

  const fullMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentYear = new Date().getFullYear();
  const currentMonthIdx = new Date().getMonth(); // 0-indexed

  const availableYears = ["2024", "2025", "2026"].filter(
    (y) => parseInt(y) <= currentYear,
  );
  const availableMonths =
    hotspotYear === currentYear.toString()
      ? fullMonths.slice(0, currentMonthIdx + 1)
      : fullMonths;

  return (
    <div className="flex flex-col items-center gap-3 pointer-events-auto">
      <div className="glass p-1 rounded-xl border border-white/5 flex flex-col gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setHotspotMode(!hotspotMode)}
          className={`h-10 w-10 rounded-lg transition-all ${
            hotspotMode
              ? "bg-rose-500/10 text-rose-500"
              : "text-slate-500 hover:text-white hover:bg-transparent"
          }`}
          title="Toggle Hotspots"
        >
          <Flame className={`h-4 w-4 ${hotspotMode ? "animate-pulse" : ""}`} />
        </Button>
      </div>

      <div
        className={`flex flex-col items-center gap-2 transition-all duration-500 origin-top ${
          hotspotMode
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-4 scale-90 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-1.5 glass p-1.5 rounded-xl border border-white/5">
          <Select
            value={hotspotMonth}
            onValueChange={(val) => setHotspotDate(val, hotspotYear)}
          >
            <SelectTrigger
              size="sm"
              className="w-14 h-7 text-[9px] font-black border-none bg-white/5 hover:bg-white/10 text-white uppercase focus-visible:ring-0"
            >
              <SelectValue placeholder="Mo" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white min-w-[100px]">
              {availableMonths.map((m) => (
                <SelectItem
                  key={m}
                  value={m}
                  className="text-[10px] uppercase font-bold focus:bg-indigo-500/20 text-slate-100"
                >
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={hotspotYear}
            onValueChange={(val) => setHotspotDate(hotspotMonth, val)}
          >
            <SelectTrigger
              size="sm"
              className="w-14 h-7 text-[9px] font-black border-none bg-white/5 hover:bg-white/10 text-slate-400 uppercase focus-visible:ring-0"
            >
              <SelectValue placeholder="Yr" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10 text-white min-w-[80px]">
              {availableYears.map((y) => (
                <SelectItem
                  key={y}
                  value={y}
                  className="text-[10px] font-bold focus:bg-indigo-500/20 text-slate-100"
                >
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
