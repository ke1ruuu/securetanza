"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, ChevronDown, Globe, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useMapContext } from "@/context/MapContext";

interface DashboardBarangaySelectorProps {
  currentBarangay: string;
}

export default function DashboardBarangaySelector({ currentBarangay }: DashboardBarangaySelectorProps) {
  const { theme } = useTheme();
  const { barangayNames, setSelectedBarangay } = useMapContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isGeneralDashboard = !currentBarangay || currentBarangay === "General Dashboard";

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filter barangays based on search
  const filteredBarangays = barangayNames.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (barangayName: string | null) => {
    setIsOpen(false);
    setSearchQuery("");
    setSelectedBarangay(barangayName);

    // Build new URL with updated barangay param
    const params = new URLSearchParams();
    if (barangayName && barangayName !== "General Dashboard") {
      params.set("name", barangayName);
    }
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 h-11 pl-4 pr-3 rounded-xl border transition-all duration-300 cursor-pointer group ${
          theme === "dark"
            ? "bg-white/[0.04] border-white/[0.08] hover:border-blue-500/30 hover:bg-white/[0.06]"
            : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-sm"
        }`}
      >
        {isGeneralDashboard ? (
          <Globe className={`h-4 w-4 ${theme === "dark" ? "text-blue-400" : "text-blue-500"}`} />
        ) : (
          <MapPin className={`h-4 w-4 ${theme === "dark" ? "text-blue-400" : "text-blue-500"}`} />
        )}
        <span
          className={`text-sm font-semibold whitespace-nowrap ${
            theme === "dark" ? "text-slate-200" : "text-slate-700"
          }`}
        >
          {isGeneralDashboard ? "All Barangays" : currentBarangay}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-all duration-300 ${
            isOpen ? "rotate-180" : ""
          } ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}
        />

        {/* Clear to General button */}
        {!isGeneralDashboard && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(null);
            }}
            className={`ml-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
              theme === "dark"
                ? "bg-white/10 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                : "bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500"
            }`}
          >
            <X className="h-3 w-3" />
          </div>
        )}
      </button>

      {/* Dropdown */}
      <div
        className={`absolute top-[calc(100%+8px)] left-0 min-w-[300px] rounded-2xl border overflow-hidden transition-all duration-300 origin-top-left z-50 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        } ${
          theme === "dark"
            ? "bg-[#0F172A]/95 backdrop-blur-2xl border-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            : "bg-white backdrop-blur-xl border-slate-200 shadow-xl shadow-slate-300/30"
        }`}
      >
        {/* Top glow accent */}
        <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${
          theme === "dark" 
            ? "from-blue-500/40 via-transparent to-transparent" 
            : "from-blue-400/50 via-transparent to-transparent"
        }`} />

        {/* General Dashboard Option */}
        <div className={`border-b ${theme === "dark" ? "border-white/[0.04]" : "border-slate-100"}`}>
          <button
            onClick={() => handleSelect(null)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all duration-150 ${
              isGeneralDashboard
                ? theme === "dark"
                  ? "text-blue-400 bg-blue-500/[0.08]"
                  : "text-blue-600 bg-blue-50"
                : theme === "dark"
                  ? "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Globe className={`h-4 w-4 ${
              isGeneralDashboard 
                ? theme === "dark" ? "text-blue-400" : "text-blue-500"
                : theme === "dark" ? "text-slate-500" : "text-slate-400"
            }`} />
            <div className="text-left">
              <div>General Dashboard</div>
              <div className={`text-xs font-normal mt-0.5 ${
                theme === "dark" ? "text-slate-500" : "text-slate-400"
              }`}>
                All crime incidents across Tanza
              </div>
            </div>
          </button>
        </div>

        {/* Search */}
        <div className={`p-3 border-b ${theme === "dark" ? "border-white/[0.04]" : "border-slate-100"}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search barangay…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={isOpen}
              className={`w-full rounded-xl py-2.5 pl-9 pr-3 text-[13px] outline-none transition-colors ${
                theme === "dark"
                  ? "bg-white/[0.04] border border-white/[0.06] text-slate-200 placeholder:text-slate-600 focus:border-blue-500/20"
                  : "bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400"
              }`}
            />
          </div>
        </div>

        {/* Barangay List */}
        <div className="overflow-y-auto max-h-[260px] py-1 custom-scrollbar">
          {filteredBarangays.length === 0 ? (
            <div className={`p-4 text-[13px] text-center ${
              theme === "dark" ? "text-slate-600" : "text-slate-400"
            }`}>
              No results found
            </div>
          ) : (
            filteredBarangays.map((name) => (
              <button
                key={name}
                onClick={() => handleSelect(name)}
                className={`block w-full text-left px-4 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                  currentBarangay === name
                    ? theme === "dark"
                      ? "text-blue-400 bg-blue-500/[0.08]"
                      : "text-blue-600 bg-blue-50"
                    : theme === "dark"
                      ? "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
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
