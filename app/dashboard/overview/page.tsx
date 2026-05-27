"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MapHeader from "@/components/layout/map-header";
import OverviewTab from "@/components/dashboard/overview-tab";
import DashboardBarangaySelector from "@/components/dashboard/dashboard-barangay-selector";
import { MapProvider } from "@/context/MapContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useAuth } from "@/context/AuthContext";
import { Lock } from "lucide-react";

function OverviewContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const rawParamName = searchParams.get("name");
  const barangayName = rawParamName || "General Dashboard";
  const { loading, error } = useDashboardData(barangayName);
  const { theme } = useTheme();

  if (user && !user.permissions.includes("admin_operational_officer") && !user.permissions.includes("admin") && !user.permissions.includes("privileged_map_view")) {
    return (
      <div className={`flex flex-col h-screen ${theme === "dark" ? "bg-[#0f172a] text-white" : "bg-[#f1f5f9] text-slate-900"}`}>
        <MapHeader isVisible={true} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-slate-500 max-w-md mb-8">
            You do not have the necessary permissions to view the Map Overview. 
            Please contact your system administrator for authorization.
          </p>
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
          {error ? (
            <div className="max-w-[1400px] mx-auto">
              <div className="text-center py-12">
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
          ) : (
            <OverviewTab barangayName={barangayName} />
          )}
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
