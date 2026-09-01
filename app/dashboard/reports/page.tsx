"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MapHeader from "@/components/layout/map-header";
import ReportsTab from "@/components/dashboard/reports-tab";
import DashboardBarangaySelector from "@/components/dashboard/dashboard-barangay-selector";
import { MapProvider } from "@/context/MapContext";
import { ThemeProvider } from "@/context/ThemeContext";

import { useAuth } from "@/context/AuthContext";
import { Lock } from "lucide-react";

function ReportsContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawParamName = searchParams.get("name");
  const barangayName = rawParamName || "General Dashboard";

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
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
    return (
      <div className="flex flex-col h-screen bg-[#f1f5f9] text-slate-900 dark:bg-[#0f172a] dark:text-white">
        <MapHeader isVisible={true} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-slate-500 max-w-md mb-8">
            You do not have the necessary permissions to view the Reports module.
            Please contact your system administrator for authorization.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen transition-colors duration-700 overflow-hidden font-sans bg-[#f1f5f9] text-slate-900 dark:bg-[#0f172a] dark:text-slate-100">
      <MapHeader isVisible={true} />

      {/* Dashboard Sub-header with Barangay Selector */}
      <div className="flex items-center gap-4 px-6 py-3 border-b shrink-0 bg-white/60 border-slate-200/60 dark:bg-[#0f172a]/80 dark:border-white/[0.04]">
        <DashboardBarangaySelector currentBarangay={barangayName} />
        <div className="h-5 w-px bg-slate-200 dark:bg-white/10" />
        <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
          {barangayName === "General Dashboard"
            ? "Crime reports for all barangays"
            : `Crime reports for Brgy. ${barangayName}`}
        </span>
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f1f5f9] dark:bg-[#0f172a]">
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
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          <ReportsContent />
        </Suspense>
      </MapProvider>
    </ThemeProvider>
  );
}
