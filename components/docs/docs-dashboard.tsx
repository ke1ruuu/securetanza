"use client";

import React from "react";

export function DocsDashboard() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Executive Dashboard & Overview
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
          Accessible via <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">/dashboard/overview</code>, this view serves as the high-level operational command center.
        </p>
      </div>

      {/* Metric Cards Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Volume</span>
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500">📊</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Total Crimes</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            Cumulative blotter incident count in the selected geographic scope and time frame.
          </p>
        </div>

        <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prevalence</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">🎯</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Top Offense Type</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            The most statistically frequent crime category (e.g. Theft, Physical Injury, Vehicular Accident).
          </p>
        </div>

        <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hotspot</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">🚨</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Critical Hotspot</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            The barangay exhibiting the highest crime density (visible in General Dashboard view).
          </p>
        </div>
      </div>

      {/* Visual Charts & Recent Activity Blotter */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Visual Charts & Recent Activity Blotter
        </h3>
        
        <div className="space-y-3">
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
              12-Month Crime Volume Trajectory
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Shows monthly incident volume progression with trend markers, identifying seasonal peaks (such as holiday increases or festive months).
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
              Categorical Offense Distribution
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Interactive donut chart presenting proportional breakdowns of index and non-index crimes.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
              Recent Blotter Activity Table
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Live table of recently recorded incidents with Case ID, timestamp, barangay, and status tags. Click <strong>"View Cases →"</strong> to jump directly into the full case investigation directory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
