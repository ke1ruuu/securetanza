"use client";

import React from "react";
import {
  Sparkles,
  Map,
  BarChart3,
  Brain,
  FolderOpen,
  FileText,
  ShieldCheck,
} from "lucide-react";

interface DocsIntroProps {
  onReplayTour?: () => void;
}

export function DocsIntro({ onReplayTour }: DocsIntroProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          SecureTanza v1.2.0 • Crime Mapping & Analytics
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome to SecureTanza
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          SecureTanza is an enterprise-grade Geographic Information System (GIS) and crime analytics intelligence platform built specifically for the Municipality of <strong>Tanza, Cavite</strong>. It empowers law enforcement commanders, crime intelligence analysts, and local government executives with real-time situational awareness, temporal-spatial hotspot detection, and AI-driven predictive forecasting.
        </p>
      </div>

      {/* Quick Action Card for Tour */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-200 dark:border-sky-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-500" />
            Interactive System Tour
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            New to the platform? Launch the guided visual tour across all modules.
          </p>
        </div>
        {onReplayTour && (
          <button
            onClick={onReplayTour}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm shadow-md hover:shadow-sky-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Launch Guided Tour
          </button>
        )}
      </div>

      {/* Module Architecture Cards */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Platform Architecture & Core Modules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Map className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white">1. Interactive GIS Crime Map</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Visualizes multi-layer geospatial incident pins, barangay polygon boundaries, density clusters, and timeline animation scrubbers across all 41 barangays of Tanza.
            </p>
          </div>

          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white">2. Executive Analytics & KPIs</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Delivers dynamic executive KPIs, 24-hour radar time patterns, modus operandi profiling, seasonal trends, and cross-barangay risk rankings.
            </p>
          </div>

          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white">3. Predictive AI Forecasting</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Utilizes mathematical ARIMA time-series models with 95% confidence intervals and automated parameter tuning to anticipate crime volume.
            </p>
          </div>

          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FolderOpen className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white">4. Incident Blotter & Dossier</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Search, filter, and inspect detailed blotter records, heinous/sensational crime flags, Elected/Govt Official (EGO) tracking, and investigator assignments.
            </p>
          </div>

          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <FileText className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white">5. Institutional PDF Reports</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Compiles publication-grade PDF case study reports with embedded high-resolution chart captures, analytical summaries, and tactical recommendations.
            </p>
          </div>

          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white">6. Security, RBAC & Alerts</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Role-based access control (Admin, Officer, Privileged User), intelligent threshold notifications, and comprehensive data batch audit logging.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
