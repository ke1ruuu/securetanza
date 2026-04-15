"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import OverviewTab from "@/components/dashboard/overview-tab";
import AnalyticsTab from "@/components/dashboard/analytics-tab";
import IncidentsTab from "@/components/dashboard/incidents-tab";
import ReportsTab from "@/components/dashboard/reports-tab";
import ConfigTab from "@/components/dashboard/config-tab";
import { MapProvider, useMapContext } from "@/context/MapContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { useDashboardData } from "@/hooks/useDashboardData";

import { 
  MOCK_REPORTS 
} from "@/constants/dummy";

type ActiveTab = "overview" | "analytics" | "incidents" | "reports" | "config";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawParamName = searchParams.get("name");
  
  // Use real data from API
  const barangayName = rawParamName || "General Dashboard";
  const { stats, activity, incidents, loading, error } = useDashboardData(barangayName);
  
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  // Show loading state
  if (loading) {
    return (
      <div className={`flex h-screen items-center justify-center transition-colors duration-700 ${
        theme === "dark" ? "bg-[#020617] text-slate-100" : "bg-[#f1f5f9] text-slate-900"
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
        theme === "dark" ? "bg-[#020617] text-slate-100" : "bg-[#f1f5f9] text-slate-900"
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

  const renderContent = () => {
    switch (activeTab) {
      case "overview": 
        return <OverviewTab barangayName={barangayName} />;
      case "analytics": 
        return <AnalyticsTab barangayName={barangayName} />;
      case "incidents": 
        return <IncidentsTab incidents={incidents} />;
      case "reports": 
        return <ReportsTab reports={MOCK_REPORTS} />;
      case "config":
        return <ConfigTab />;
      default: 
        return <OverviewTab barangayName={barangayName} />;
    }
  };

  return (
    <div className={`flex h-screen transition-colors duration-700 overflow-hidden font-sans ${
      theme === "dark" ? "bg-[#020617] text-slate-100" : "bg-[#f1f5f9] text-slate-900"
    }`}>
      <DashboardSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onExit={() => router.push("/")} 
      />

      <main className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-colors duration-700 ${
        theme === "dark" 
          ? "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent" 
          : "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-white to-white"
      }`}>
        <DashboardHeader barangayName={barangayName} />

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar scroll-smooth">
          {renderContent()}
        </div>
      </main>

      {/* Decorative Blur */}
      <div className={`fixed top-0 right-0 w-1/3 h-1/3 blur-[150px] -z-10 pointer-events-none transition-all duration-1000 ${
        theme === "dark" ? "bg-indigo-600/5" : "bg-indigo-600/15"
      }`} />
      <div className={`fixed bottom-0 left-1/4 w-1/4 h-1/4 blur-[120px] -z-10 pointer-events-none transition-all duration-1000 ${
        theme === "dark" ? "bg-blue-600/5" : "bg-blue-600/10"
      }`} />
    </div>
  );
}

export default function BarangayDashboard() {
  return (
    <ThemeProvider>
      <MapProvider>
        <DashboardContent />
      </MapProvider>
    </ThemeProvider>
  );
}
