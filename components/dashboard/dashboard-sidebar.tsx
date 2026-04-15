"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Shield, 
  BarChart3, 
  ClipboardList, 
  UserCheck, 
  Settings, 
  LogOut 
} from "lucide-react";
import { useMapContext } from "@/context/MapContext";
import { useTheme } from "@/context/ThemeContext";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onExit: () => void;
}

export default function DashboardSidebar({ activeTab, setActiveTab, onExit }: SidebarProps) {
  const { theme } = useTheme();
  
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "incidents", label: "Cases", icon: Shield },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "reports", label: "Archive", icon: ClipboardList },
  ];

  return (
    <aside className={`w-64 border-r transition-all duration-700 flex flex-col z-20 ${
      theme === "dark" ? "bg-slate-950 border-white/5" : "bg-white border-slate-200"
    }`}>
      <div className="p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className={`w-10 h-10 border rounded-lg flex items-center justify-center ${
            theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
          }`}>
            <span className={`font-black text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>S</span>
          </div>
          <h2 className={`text-sm font-black tracking-[0.2em] uppercase transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-slate-800'
          }`}>Secure Dashboard</h2>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${
                activeTab === item.id 
                  ? (theme === 'dark' ? "text-indigo-400 bg-white/5" : "text-indigo-600 bg-indigo-50")
                  : (theme === 'dark' ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-800")
              }`}
            >
              <item.icon className={`h-4 w-4 ${activeTab === item.id ? (theme === 'dark' ? "text-indigo-400" : "text-indigo-600") : ""}`} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4">
        <button 
          onClick={() => setActiveTab("config")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${
            activeTab === "config" 
              ? (theme === 'dark' ? "text-indigo-400 bg-white/5" : "text-indigo-600 bg-indigo-50")
              : (theme === 'dark' ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-800")
          }`}
        >
          <Settings className={`h-4 w-4 ${activeTab === "config" ? (theme === 'dark' ? "text-indigo-400" : "text-indigo-600") : ""}`} />
          Settings
        </button>
        <button onClick={onExit} className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-black uppercase tracking-widest transition-all ${
          theme === 'dark' ? "text-rose-500/60 hover:text-rose-500" : "text-rose-600/70 hover:text-rose-700"
        }`}>
          <LogOut className="h-4 w-4" />
            Exit
        </button>
      </div>
    </aside>
  );
}
