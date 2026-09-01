"use client";

import React from "react";
import { Layers, Crosshair, Clock, ChevronRight } from "lucide-react";

export function DocsMap() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Interactive GIS Crime Map
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
          The home route (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">/</code>) is the primary spatial intelligence hub, visualizing geographic crime distribution across Tanza, Cavite.
        </p>
      </div>

      {/* Threat Level Matrix */}
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-sky-500" />
          Barangay Threat Level Color Coding
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Each barangay polygon dynamically calculates its threat level based on active incident count in the selected time range:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm" />
              <span className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">Secure</span>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">0 - 5 incidents</span>
          </div>
          <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-sm" />
              <span className="font-semibold text-blue-800 dark:text-blue-300 text-sm">Low</span>
            </div>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">6 - 10 incidents</span>
          </div>
          <div className="p-3 rounded-xl border border-yellow-200 dark:border-yellow-800/50 bg-yellow-50 dark:bg-yellow-950/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 shadow-sm" />
              <span className="font-semibold text-yellow-800 dark:text-yellow-300 text-sm">Moderate</span>
            </div>
            <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">11 - 20 incidents</span>
          </div>
          <div className="p-3 rounded-xl border border-orange-200 dark:border-orange-800/50 bg-orange-50 dark:bg-orange-950/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3.5 h-3.5 rounded-full bg-orange-500 shadow-sm" />
              <span className="font-semibold text-orange-800 dark:text-orange-300 text-sm">High</span>
            </div>
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">21 - 30 incidents</span>
          </div>
          <div className="p-3 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm" />
              <span className="font-semibold text-red-800 dark:text-red-300 text-sm">Critical</span>
            </div>
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">31+ incidents</span>
          </div>
        </div>
      </div>

      {/* Map Controls & Operations */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Map Controls & Spatial Tools
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Crosshair className="w-4 h-4 text-sky-500" />
              Barangay & Crime Filtering
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                <span><strong>Barangay Multi-Select:</strong> Focus on one or multiple specific barangays. The camera smoothly flies and pans to the selected polygon bounds.</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
                <span><strong>Crime Type Filter:</strong> Isolate theft, robbery, physical injury, or specific statutory violations.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-purple-500" />
              Timeline Scrubber & Playback
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                <span><strong>Time Aggregation:</strong> Switch between Quarter (Q1-Q4), Half-Year (H1-H2), Month (Jan-Dec), or specific Days.</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                <span><strong>Animated Playback:</strong> Press the <strong>Play</strong> button to animate crime progression chronologically over months.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barangay Drawer & Inspection */}
        <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
            Barangay Intelligence Drawer
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Clicking on any barangay polygon opens the <strong>Barangay Drawer</strong> on the right. It summarizes total incidents, top crime category, safety score, clearance rate, demographic population density, and quick links to open the filtered dashboard or case list for that barangay.
          </p>
        </div>
      </div>
    </div>
  );
}
