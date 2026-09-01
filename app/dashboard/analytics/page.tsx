"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MapHeader from "@/components/layout/map-header";
import AnalyticsTab from "@/components/dashboard/analytics-tab";
import DashboardBarangaySelector from "@/components/dashboard/dashboard-barangay-selector";
import { MapProvider } from "@/context/MapContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

import { useAuth } from "@/context/AuthContext";
import { Lock } from "lucide-react";

function AnalyticsContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawParamName = searchParams.get("name");
  const barangayName = rawParamName || "General Dashboard";
  const { theme } = useTheme();

  useEffect(() => {
    if (!authLoading) {
      if (!user || (!user.permissions.includes("admin_operational_officer") && !user.permissions.includes("admin") && !user.permissions.includes("privileged_analytics_view"))) {
        router.replace("/login");
      }
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f172a]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0EA5E9] border-t-transparent" />
      </div>
    );
  }

  if (!user || (!user.permissions.includes("admin_operational_officer") && !user.permissions.includes("admin") && !user.permissions.includes("privileged_analytics_view"))) {
    return null;
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
            ? "Crime analytics across all barangays" 
            : `Crime analytics for Brgy. ${barangayName}`}
        </span>
      </div>

      <main className={`flex-1 flex flex-col min-w-0 overflow-hidden ${
        theme === "dark" ? "bg-[#0f172a]" : "bg-[#f1f5f9]"
      }`}>
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar scroll-smooth">
          <AnalyticsTab barangayName={barangayName} />
        </div>
      </main>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <ThemeProvider>
      <MapProvider>
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          <AnalyticsContent />
        </Suspense>
      </MapProvider>
    </ThemeProvider>
  );
}
