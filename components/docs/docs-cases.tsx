"use client";

import React from "react";

export function DocsCases() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Crime Cases & Blotter Dossier Management
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
          Located at <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">/dashboard/cases</code>, this module provides investigative officers with full blotter case records and geographic context.
        </p>
      </div>

      {/* Key Filters */}
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Search, Filter & Clearance Classifications
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/30">
            <span className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">🟢 Cleared</span>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Identified suspect, case referred to prosecutor.</p>
          </div>
          <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/30">
            <span className="font-semibold text-blue-800 dark:text-blue-300 text-sm">🔵 Under Investigation</span>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Active police investigation ongoing.</p>
          </div>
          <div className="p-3 rounded-xl border border-purple-200 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-950/30">
            <span className="font-semibold text-purple-800 dark:text-purple-300 text-sm">🟣 Filed in Court</span>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Formally docketed in municipal or regional trial court.</p>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">⚪ Archived / Closed</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Case concluded or archived after legal process.</p>
          </div>
        </div>
      </div>

      {/* Dossier Attributes */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Case Dossier Fields & Special Crime Attributes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
              Special Police Classifications
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <li><strong>Heinous Crime Flag:</strong> Flags grave crimes involving murder, rape, or severe offenses.</li>
              <li><strong>Sensational Crime Flag:</strong> Highlights incidents of major public interest or media coverage.</li>
              <li><strong>Threat Group Involvement:</strong> Tracks organized crime syndicates or illicit groups.</li>
            </ul>
          </div>

          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
              EGO & Investigator Attribution
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <li><strong>EGO Tracking:</strong> Flags Elected/Government Official involvement as suspect or victim with position classification.</li>
              <li><strong>Investigator Attribution:</strong> Logs the designated case investigator and supervising officer.</li>
              <li><strong>Geospatial Coordinates:</strong> Exact latitude/longitude mapping for visual pin plotting.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
