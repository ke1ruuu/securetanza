"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MapHeader from "@/components/layout/map-header";
import OverviewTab from "@/components/dashboard/overview-tab";
import DashboardBarangaySelector from "@/components/dashboard/dashboard-barangay-selector";
import { MapProvider } from "@/context/MapContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { useDashboardData } from "@/hooks/useDashboardData";

function OverviewContent() {
  const searchParams = useSearchParams();
  const rawParamName = searchParams.get("name");
  const barangayName = rawParamName || "General Dashboard";
  const { loading, error } = useDashboardData(barangayName);
  const { theme } = useTheme();

  // Show loading state
  if (loading) {
    return (
      <div className={`flex h-screen items-center justify-center transition-colors duration-700 ${
        theme === "dark" ? "bg-[#0f172a] text-slate-100" : "bg-[#f1f5f9] text-slate-900"
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`flex h-screen items-center justify-center transition-colors duration-700 ${
        theme === "dark" ? "bg-[#0f172a] text-slate-100" : "bg-[#f1f5f9] text-slate-900"
      }`}>
        <div className="text-center">
          <p className="text-lg font-semibold text-red-500 mb-4">Error loading data</p>
          <p className="text-sm text-slate-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            ? "Viewing all crime incidents across Tanza, Cavite" 
            : `Viewing crime data for Brgy. ${barangayName}`}
        </span>
      </div>

      <main className={`flex-1 flex flex-col min-w-0 overflow-hidden ${
        theme === "dark" ? "bg-[#0f172a]" : "bg-[#f1f5f9]"
      }`}>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar scroll-smooth">
          <OverviewTab barangayName={barangayName} />
        </div>
      </main>
    </div>
  );
}

export default function OverviewPage() {
  return (
    <ThemeProvider>
      <MapProvider>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          <OverviewContent />
        </Suspense>
      </MapProvider>
    </ThemeProvider>
  );
}
