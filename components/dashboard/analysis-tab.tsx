"use client";

import React from "react";
import { useMapContext } from "@/context/MapContext";
import { useTheme } from "@/context/ThemeContext";

interface AnalysisTabProps {
  safetyIndex: string;
  performance: string;
  description: string;
  distribution: { label: string; val: number }[];
}

export default function AnalysisTab({
  safetyIndex,
  performance,
  description,
  distribution,
}: AnalysisTabProps) {
  const { theme } = useTheme();

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className={`flex justify-between items-end border-b pb-6 ${
        theme === 'dark' ? 'border-white/5' : 'border-slate-200'
      }`}>
        <div>
          <h2 className={`text-xl font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Analytics
          </h2>
          <p className="text-slate-500 text-base mt-1 font-bold uppercase tracking-wider">
            Sector vulnerability & density
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Safety Index */}
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className={`w-32 h-32 rounded-full border flex items-center justify-center relative ${
             theme === 'dark' ? 'border-white/5' : 'border-slate-200'
          }`}>
            <div className={`absolute inset-0 border-t rounded-full animate-spin-slow ${
              theme === 'dark' ? 'border-indigo-500' : 'border-indigo-600'
            }`} />
            <div>
              <p className={`text-6xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {safetyIndex}
              </p>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
                Safety Index
              </p>
            </div>
          </div>
          <div>
            <h3 className={`text-base font-bold uppercase tracking-widest transition-colors ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
            }`}>
              {performance}
            </h3>
            <p className="text-base text-slate-500 mt-2 px-6 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Support Analytics */}
        <div className="space-y-6">
          <div className={`p-8 rounded-2xl border transition-colors ${
             theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <h4 className={`text-base font-black uppercase tracking-widest mb-6 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Sector Distribution</h4>
            <div className="space-y-4">
              {distribution.map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-base font-bold uppercase tracking-widest text-slate-500">
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div className={`h-1 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-200'}`}>
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-1000" 
                      style={{ width: `${item.val}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`pt-6 border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
            <h3 className={`text-base font-black uppercase tracking-widest mb-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              Critical Zones
            </h3>
            <div className="flex gap-4">
              {["Sector 4", "East Pier", "Main Plaza"].map((zone) => (
                <div
                  key={zone}
                  className={`px-3 py-1.5 border rounded-lg text-base font-bold uppercase tracking-widest ${
                    theme === 'dark' ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {zone}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
