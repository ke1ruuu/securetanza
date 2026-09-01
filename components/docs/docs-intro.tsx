"use client";

import React from "react";
import {
  Sparkles,
  Map,
  BarChart3,
  Upload,
  FolderOpen,
  FileText,
  ShieldCheck,
  Compass,
  Users,
  Shield,
  Eye,
  Settings,
} from "lucide-react";
import { DocsCta } from "./docs-cta";
import { UserRoleType } from "@/lib/tour/steps";

interface DocsIntroProps {
  onReplayTour?: (role?: UserRoleType) => void;
}

export function DocsIntro({ onReplayTour }: DocsIntroProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          SecureTanza • Crime Mapping & Analytics
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome to SecureTanza
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          SecureTanza is an enterprise-grade Geographic Information System (GIS) and crime analytics intelligence platform built specifically for the Municipality of <strong>Tanza, Cavite</strong>. It empowers law enforcement commanders, crime intelligence analysts, and local government executives with real-time situational awareness, temporal-spatial hotspot detection, and actionable crime intelligence.
        </p>
      </div>

      {/* Role-Based Guided Walkthroughs Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-500" />
              Role-Based Interactive Walkthroughs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any guided tour below to experience tailored workflows for each platform role.
            </p>
          </div>
          {onReplayTour && (
            <button
              onClick={() => onReplayTour()}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-sm hover:shadow-sky-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Auto-Detect My Role Tour
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Operational Officer Walkthrough */}
          <div className="p-5 rounded-2xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 shadow-sm flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Operational Officer Walkthrough
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Tactical • 6 Stages
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Designed for field and station officers: Excel blotter batch ingestion (.xlsx), automated peak-hour spike alerts, case dossier inspections, modus operandi profiling, and institutional PDF report compiling.
              </p>
            </div>
            {onReplayTour && (
              <button
                onClick={() => onReplayTour("operational_officer")}
                className="mt-4 w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white dark:bg-indigo-950/40 dark:hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-200/60 dark:border-indigo-800/40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Launch Officer Tour
              </button>
            )}
          </div>

          {/* Privileged User / Analyst Walkthrough */}
          <div className="p-5 rounded-2xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 shadow-sm flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                    <Eye className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Privileged Analyst / Viewer Walkthrough
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Analytics • 4 Stages
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tailored for crime intelligence analysts and investigators: executive KPI metrics, 24-hour patrol radar time patterns, monthly crime matrix heatmaps, and case search drill-downs.
              </p>
            </div>
            {onReplayTour && (
              <button
                onClick={() => onReplayTour("privileged_user")}
                className="mt-4 w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white dark:bg-emerald-950/40 dark:hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-200/60 dark:border-emerald-800/40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Launch Analyst Tour
              </button>
            )}
          </div>

          {/* System Administrator Walkthrough */}
          <div className="p-5 rounded-2xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 shadow-sm flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-700 transition-all group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                    <Settings className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    System Administrator Walkthrough
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Full Platform • 7 Stages
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Full governance tour: RBAC personnel account provisioning, role clearance assignments, threshold notification rule engine, dataset batch audit logs, and complete module administration.
              </p>
            </div>
            {onReplayTour && (
              <button
                onClick={() => onReplayTour("admin")}
                className="mt-4 w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white dark:bg-purple-950/40 dark:hover:bg-purple-600 text-purple-700 dark:text-purple-300 font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-purple-200/60 dark:border-purple-800/40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Launch Admin Tour
              </button>
            )}
          </div>
        </div>
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
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FolderOpen className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white">3. Incident Blotter & Dossier</h4>
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
              <h4 className="font-semibold text-slate-900 dark:text-white">4. Institutional PDF Reports</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Compiles publication-grade PDF case study reports with embedded high-resolution chart captures, analytical summaries, and tactical recommendations.
            </p>
          </div>

          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Upload className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white">5. Batch Data Ingestion & Schema</h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Seamlessly import bulk Excel blotter records with automatic schema validation, column mapping, coordinate fallback resolution, and ingestion audit logs.
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

      {/* Action Suggestion & CTA */}
      <DocsCta
        title="Ready to explore the platform?"
        suggestion="Jump straight into the live GIS Crime Map to begin exploring spatial incidents, or inspect executive KPI trends on the Overview Dashboard."
        actions={[
          {
            label: "Launch Crime Map",
            href: "/",
            icon: Map,
            variant: "primary",
          },
          {
            label: "Overview Dashboard",
            href: "/dashboard/overview",
            icon: BarChart3,
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
