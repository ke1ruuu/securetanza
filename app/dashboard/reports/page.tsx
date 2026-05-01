"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import MapHeader from "@/components/layout/map-header";
import ReportsTab from "@/components/dashboard/reports-tab";
import DashboardBarangaySelector from "@/components/dashboard/dashboard-barangay-selector";
import { MapProvider } from "@/context/MapContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

function ReportsContent() {
  const searchParams = useSearchParams();
  const rawParamName = searchParams.get("name");
  const barangayName = rawParamName || "General Dashboard";
  const { theme } = useTheme();

  return (
    <div className={`flex flex-col h-screen transition-colors duration-700 overflow-hidden font-sans ${
      theme === "dark" ? "bg-[#0f172a] text-slate-100" : "bg-[#f1f5f9] text-slate-900"
    }`}>
      <MapHeader isVisible={true} />

      {/* Dashboard Sub-header with Barangay Selector */}
      <div className={`flex items-center gap-4 px-6 py-3 border-b shrink-0 ${
        theme === "dark" ? "bg-[#0f172a]/80 border-white/[0.04]" : "bg-white/60 border-slate-200/60"
      }`}>
        <DashboardBarangaySelector currentBarangay={barangayName} />
        <div className={`h-5 w-px ${theme === "dark" ? "bg-white/10" : "bg-slate-200"}`} />
        <span className={`text-sm font-medium ${
          theme === "dark" ? "text-slate-500" : "text-slate-400"
        }`}>
          {barangayName === "General Dashboard" 
            ? "Crime reports for all barangays" 
            : `Crime reports for Brgy. ${barangayName}`}
        </span>
      </div>

      <main className={`flex-1 flex flex-col min-w-0 overflow-hidden ${
        theme === "dark" ? "bg-[#0f172a]" : "bg-[#f1f5f9]"
      }`}>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar scroll-smooth">
          <ReportsTab barangayName={barangayName} />
        </div>
      </main>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <ThemeProvider>
      <MapProvider>
        <ReportsContent />
      </MapProvider>
    </ThemeProvider>
  );
}
