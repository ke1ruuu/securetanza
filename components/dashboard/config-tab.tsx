"use client";

import React, { useState } from "react";
import { Sidebar, Sun, Moon, Accessibility, Bell, Shield, User } from "lucide-react";
import { useMapContext } from "@/context/MapContext";
import { useTheme } from "@/context/ThemeContext";

export default function ConfigTab() {
  const { theme, setTheme } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState("accessibility");

  const subTabs = [
    { id: "accessibility", label: "Accessibility", icon: Accessibility },
    { id: "notifications", label: "Alerts", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "account", label: "Profile", icon: User },
  ];

  return (
    <div className="flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sub-navigation Sidebar */}
      <div className="w-48 shrink-0 flex flex-col gap-2">
        <h3 className={`text-sm font-black uppercase tracking-[0.3em] mb-6 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>System Config</h3>
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
              activeSubTab === tab.id
                ? (theme === 'dark' ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border border-indigo-100")
                : (theme === 'dark' ? "text-slate-500 hover:text-slate-300 hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100")
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content Area */}
      <div className={`flex-1 rounded-3xl p-8 backdrop-blur-xl border transition-all duration-700 ${
        theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white shadow-xl shadow-slate-200/50 border-slate-200'
      }`}>
        {activeSubTab === "accessibility" && (
          <div className="space-y-8">
            <div>
              <h2 className={`text-xl font-black mb-2 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Visual Interface</h2>
              <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
                Customize the optical appearance of the SECUI. Adjust contrast, themes, and sensory output parameters to match your operational environment.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className={`p-6 rounded-2xl border flex items-center justify-between transition-colors ${
                theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    {theme === "light" ? <Sun className="h-5 w-5 text-indigo-600" /> : <Moon className="h-5 w-5 text-indigo-400" />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-black uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Interface Theme</h4>
                    <p className="text-sm text-slate-500 uppercase font-bold mt-0.5 tracking-wider">Switch between high-contrast light and stealth-mode dark.</p>
                  </div>
                </div>

                <div className={`flex p-1 rounded-xl border transition-colors ${
                  theme === 'dark' ? 'bg-slate-900/50 border-white/5' : 'bg-slate-200/50 border-slate-200'
                }`}>
                  <button 
                    onClick={() => setTheme("light")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${
                      theme === "light" 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <Sun className="h-3 w-3" />
                    Light
                  </button>
                  <button 
                    onClick={() => setTheme("dark")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${
                      theme === "dark" 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Moon className="h-3 w-3" />
                    Dark
                  </button>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border flex items-center justify-between opacity-50 cursor-not-allowed transition-colors ${
                theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-200'}`}>
                    <Sidebar className={`h-5 w-5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-black uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>UI Layout Density</h4>
                    <p className="text-sm text-slate-500 uppercase font-bold mt-0.5 tracking-wider">Toggle between compact and spacious dashboard grids.</p>
                  </div>
                </div>
                <div className="text-sm font-black text-slate-500 uppercase italic">Locked by Admin</div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab !== "accessibility" && (
          <div className="flex flex-col items-center justify-center h-[300px] gap-4">
            <h4 className={`text-sm font-black uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>Section Under Development</h4>
            <div className={`w-12 h-0.5 rounded-full ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-500/40'}`} />
          </div>
        )}
      </div>
    </div>
  );
}
