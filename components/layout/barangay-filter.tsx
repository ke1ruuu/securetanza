"use client";

import React, { useRef, useEffect } from "react";
import { Search, MapPin, X, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useMapContext } from "@/context/MapContext";

export default function BarangayFilter() {
  const {
    selectedBarangay,
    setSelectedBarangay,
    filterOpen,
    setFilterOpen,
    searchQuery,
    setSearchQuery,
    filteredBarangays,
  } = useMapContext();
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setFilterOpen]);

  return (
    <div ref={filterRef} className="pointer-events-auto relative min-w-[280px]">
      {filterOpen && (
        <Card className="glass absolute bottom-full left-0 right-0 mb-3 border-white/10 overflow-hidden backdrop-blur-xl">
          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search barangay…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 outline-none placeholder:text-slate-500"
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-[240px] py-1.5 custom-scrollbar">
            {filteredBarangays.length === 0 ? (
              <div className="p-3 text-xs text-slate-500 text-center">No results found</div>
            ) : (
              filteredBarangays.map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    setSelectedBarangay(name);
                    setFilterOpen(false);
                    setSearchQuery("");
                  }}
                  className={`block w-full text-left px-4 py-2.5 text-xs font-medium transition-all ${
                    selectedBarangay === name 
                      ? "text-indigo-400 bg-indigo-500/10" 
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {name}
                </button>
              ))
            )}
          </div>
        </Card>
      )}

      <Card className="glass border-l-4 border-l-indigo-500/50 border-y-0 border-r-0 rounded-2xl overflow-hidden shadow-2xl">
        <CardContent className="p-5">
          {selectedBarangay ? (
            <>
              <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                Active Focus
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-md hover:bg-white/10 text-slate-500"
                  onClick={() => setSelectedBarangay(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-lg font-bold text-slate-100 mb-4">{selectedBarangay}</p>
            </>
          ) : (
            <>
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Navigation</h3>
              <p className="text-[11px] text-slate-400 mb-4 leading-relaxed italic">
                Select a sector to initialize deep inspection.
              </p>
            </>
          )}
          <Button 
            onClick={() => setFilterOpen(!filterOpen)}
            className="w-full bg-white/5 hover:bg-white/10 border-white/5 flex justify-between items-center px-4 h-10 rounded-xl group transition-all"
            variant="outline"
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="h-3.5 w-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-300">
                {selectedBarangay ? "Change Area" : "Select Barangay"}
              </span>
            </div>
            <ChevronUp className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-300 ${filterOpen ? "rotate-180" : ""}`} />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
