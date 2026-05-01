"use client";

import React, { useRef, useEffect } from "react";
import { Search, MapPin, X, ChevronDown } from "lucide-react";

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
    <div ref={filterRef} className="pointer-events-auto relative">
      {/* ── Trigger Button ── */}
      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className="flex items-center gap-3 h-12 pl-4 pr-5 rounded-xl bg-[#0F172A]/70 backdrop-blur-xl border border-white/[0.08] hover:border-[#0EA5E9]/20 hover:bg-[#0F172A]/90 transition-all duration-300 cursor-pointer group"
      >
        <MapPin className="h-4 w-4 text-[#0EA5E9] group-hover:scale-110 transition-transform" />
        <span
          className="text-[14px] font-medium text-white/80 whitespace-nowrap"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {selectedBarangay || "Select Barangay"}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-500 group-hover:text-[#0EA5E9] transition-all duration-300 ${
            filterOpen ? "rotate-180" : ""
          }`}
        />

        {/* Clear button when selected */}
        {selectedBarangay && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBarangay(null);
            }}
            className="ml-1 w-5 h-5 rounded-full flex items-center justify-center bg-white/10 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
          >
            <X className="h-3 w-3" />
          </div>
        )}
      </button>

      {/* ── Dropdown ── */}
      <div
        className={`absolute top-[calc(100%+8px)] left-0 min-w-[280px] rounded-2xl border border-white/[0.06] bg-[#0F172A]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 origin-top-left ${
          filterOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#0EA5E9]/40 via-transparent to-transparent" />

        {/* Search */}
        <div className="p-3 border-b border-white/[0.04]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search barangay…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl py-2.5 pl-9 pr-3 text-[13px] text-slate-200 outline-none placeholder:text-slate-600 focus:border-[#0EA5E9]/20 transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-[260px] py-1 custom-scrollbar">
          {filteredBarangays.length === 0 ? (
            <div className="p-4 text-[13px] text-slate-600 text-center" style={{ fontFamily: "var(--font-inter)" }}>
              No results found
            </div>
          ) : (
            filteredBarangays.map((name) => (
              <button
                key={name}
                onClick={() => {
                  setSelectedBarangay(name);
                  setFilterOpen(false);
                  setSearchQuery("");
                }}
                className={`block w-full text-left px-4 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                  selectedBarangay === name
                    ? "text-[#0EA5E9] bg-[#0EA5E9]/[0.08]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
