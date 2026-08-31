"use client";

import React from "react";
import { Clock, Sliders, Layers, Table } from "lucide-react";

export function DocsAnalytics() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Historical Crime Analytics & Intelligence
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
          Located at <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">/dashboard/analytics</code>, this module provides tactical intelligence tools for patrol optimization and investigative analysis.
        </p>
      </div>

      {/* Mathematical KPIs */}
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Analytical Formulas & Metric Calculations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
              Resolution Rate (%)
            </div>
            <div className="font-mono text-xs text-slate-800 dark:text-slate-200 p-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-2">
              Resolution Rate = (Cleared Cases + Solved Cases) / Total Incidents × 100%
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Measures investigative efficiency by computing the proportion of reported incidents that have been resolved or referred to court.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              Safety Index Score
            </div>
            <div className="font-mono text-xs text-slate-800 dark:text-slate-200 p-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-2">
              Safety Index = 100 - (Critical Incident Rate Weight + Unresolved Penalty)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              A normalized composite safety rating from 0 to 100 representing relative community security.
            </p>
          </div>
        </div>
      </div>

      {/* Deep Dive Charts */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Advanced Analytical Charts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-500" />
              24-Hour Radar Time Pattern
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Distributes incident frequency across all 24 hours of the day on a polar radar plot. Essential for commanding officers to schedule police roving shifts and patrol car deployment during peak crime hours (e.g. 20:00 - 02:00).
            </p>
          </div>

          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-500" />
              Modus Operandi Breakdown
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Analyzes common criminal methods (e.g. motorcycle riding-in-tandem, forced door entry, snatching) to assist detectives in identifying serial offender patterns.
            </p>
          </div>

          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              Location Type Distribution
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Classifies offenses by environment (Residential, Commercial Establishment, Public Thoroughfare, Highway) to advise targeted CCTV and lighting installation.
            </p>
          </div>

          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Table className="w-4 h-4 text-rose-500" />
              Crime Matrix Heatmap
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              A full cross-tabulated heatmap grid displaying monthly intensity for every crime type, providing instant visual identification of seasonal crime waves.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
