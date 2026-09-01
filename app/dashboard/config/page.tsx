"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MapProvider } from "@/context/MapContext";
import {
  ArrowLeft,
  ShieldCheck,
  Activity,
  FileSpreadsheet,
  Settings,
  Bell,
  UserCircle,
} from "lucide-react";

import AccessSecurityTab from "./components/AccessSecurityTab";
import AuditLogsTab from "./components/AuditLogsTab";
import DataExportsTab from "./components/DataExportsTab";
import AccountSettingsTab from "./components/AccountSettingsTab";
import NotificationSettingsTab from "./components/NotificationSettingsTab";
import ProfileTab from "./components/ProfileTab";

function ConfigContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>("profile");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  const isAdmin = user && (user.permissions.includes("admin_operational_officer") || user.permissions.includes("admin"));

  const allSidebarNavItems = [
    { id: "profile", label: "My Profile", icon: UserCircle, description: "Account & credentials", adminOnly: false },
    { id: "access-security", label: "Access & Security", icon: ShieldCheck, description: "Personnel & clearances", adminOnly: true },
    { id: "notifications", label: "Notification Rules", icon: Bell, description: "Analytical alert engine", adminOnly: true },
    { id: "audit-logs", label: "Audit Logs", icon: Activity, description: "Uploads & batch records", adminOnly: true },
    { id: "data-exports", label: "Data Exports", icon: FileSpreadsheet, description: "Scheduled reports", adminOnly: true },
    { id: "account", label: "Account Preferences", icon: Settings, description: "Theme & display settings", adminOnly: false },
  ];

  const sidebarNavItems = allSidebarNavItems.filter(item => !item.adminOnly || isAdmin);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f172a]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0EA5E9] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen transition-colors duration-700 overflow-hidden font-sans bg-[#f1f5f9] text-slate-900 dark:bg-[#0f172a] dark:text-slate-100">
      {/* Header */}
      <header className="w-full backdrop-blur-xl border-b pointer-events-auto z-50 flex-none bg-white/80 border-slate-200 dark:bg-[#0F172A]/80 dark:border-white/[0.06]">
        <div className="flex items-center h-16 px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 transition-colors duration-200 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="ml-8 flex items-center gap-3">
            <Settings className="h-5 w-5 text-[#0EA5E9]" />
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">System Settings & Configuration</h1>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r border-slate-200 dark:border-white/[0.06] bg-white/50 dark:bg-slate-900/20 overflow-y-auto">
          <div className="p-6">
            <nav className="space-y-1.5" data-tour="settings-nav">
              {sidebarNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    data-tour={
                      item.id === "access-security"
                        ? "settings-access-security"
                        : item.id === "notifications"
                        ? "settings-notifications"
                        : undefined
                    }
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-[#0EA5E9]/10 text-[#0EA5E9] shadow-sm border border-[#0EA5E9]/20"
                        : "hover:bg-slate-200/50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isActive ? "bg-[#0EA5E9]/20 text-[#0EA5E9]" : "bg-slate-100 dark:bg-white/5 text-slate-500"}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className={`font-semibold text-sm ${isActive ? "text-[#0EA5E9]" : "text-slate-700 dark:text-slate-300"}`}>
                        {item.label}
                      </div>
                      <div className="text-[11px] mt-0.5 text-slate-400 dark:text-slate-500">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <div data-tour="settings-workspace" className="flex-1 overflow-y-auto p-8 custom-scrollbar scroll-smooth">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "access-security" && <AccessSecurityTab />}
          {activeTab === "notifications" && <NotificationSettingsTab />}
          {activeTab === "audit-logs" && <AuditLogsTab />}
          {activeTab === "data-exports" && <DataExportsTab />}
          {activeTab === "account" && <AccountSettingsTab />}
        </div>
      </main>
    </div>
  );
}

export default function ConfigPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-[#0F172A]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0EA5E9] border-t-transparent" />
        </div>
      }
    >
      <MapProvider>
        <ConfigContent />
      </MapProvider>
    </Suspense>
  );
}
