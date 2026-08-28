"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useTour } from "@/context/TourContext";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  BookOpen,
  Map,
  BarChart3,
  FileText,
  Brain,
  Settings,
  Upload,
  Search,
  ChevronRight,
  Home,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Bell,
  ShieldCheck,
  FolderOpen,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Table,
  Sliders,
  Layers,
  FileSpreadsheet,
  Clock,
  Crosshair,
  TrendingUp,
  ShieldAlert,
  Info,
  Calendar,
  X
} from "lucide-react";

export default function DocsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { replayTour } = useTour();
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState("intro");
  const [searchQuery, setSearchQuery] = useState("");

  const sections = useMemo(() => [
    {
      id: "intro",
      title: "1. Introduction & Overview",
      icon: BookOpen,
      badge: "Core",
      tags: ["welcome", "overview", "system", "architecture", "tanza", "gis"],
      content: (
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
            <button
              onClick={() => replayTour()}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm shadow-md hover:shadow-sky-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Launch Guided Tour
            </button>
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
      )
    },
    {
      id: "map",
      title: "2. Interactive GIS Crime Map",
      icon: Map,
      badge: "Map",
      tags: ["gis", "map", "barangay", "filters", "time", "playback", "threat", "legend", "export"],
      content: (
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
      )
    },
    {
      id: "dashboard",
      title: "3. Executive Dashboard & Overview",
      icon: BarChart3,
      badge: "Dashboard",
      tags: ["overview", "dashboard", "kpi", "trends", "distribution", "blotter"],
      content: (
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

          {/* Visualizations Explained */}
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
      )
    },
    {
      id: "analytics",
      title: "4. Historical Crime Analytics",
      icon: TrendingUp,
      badge: "Analytics",
      tags: ["analytics", "radar", "peak", "hours", "modus", "location", "heatmap", "matrix", "safety"],
      content: (
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
      )
    },
    {
      id: "predictive",
      title: "5. Predictive Analytics & ARIMA",
      icon: Brain,
      badge: "AI Forecasting",
      tags: ["predictive", "arima", "forecast", "confidence", "mape", "mae", "rmse", "ai"],
      content: (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Predictive Analytics & ARIMA Forecasting
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
              SecureTanza integrates an AutoRegressive Integrated Moving Average (<strong>ARIMA</strong>) time-series forecasting engine to forecast monthly crime counts up to 12 months ahead.
            </p>
          </div>

          {/* Model Metrics */}
          <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Model Performance & Validation Metrics
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              The ARIMA model is trained on multi-year historical monthly aggregations and evaluated using standard statistical accuracy metrics:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="font-semibold text-slate-900 dark:text-white text-sm">MAPE (Mean Absolute % Error)</div>
                <div className="text-xs text-slate-500 mt-1">Measures average relative prediction error:</div>
                <ul className="text-xs text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                  <li className="text-emerald-600 dark:text-emerald-400 font-medium">🟢 &lt; 15%: Highly Accurate</li>
                  <li className="text-sky-600 dark:text-sky-400 font-medium">🔵 15% - 25%: Good Accuracy</li>
                  <li className="text-yellow-600 dark:text-yellow-400 font-medium">🟡 25% - 40%: Moderate</li>
                  <li className="text-red-600 dark:text-red-400 font-medium">🔴 &gt; 40%: Low Accuracy</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="font-semibold text-slate-900 dark:text-white text-sm">MAE (Mean Absolute Error)</div>
                <div className="text-xs text-slate-500 mt-1">Average absolute incident deviation:</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Represents the exact average number of incidents by which the forecast deviates from actual ground truth.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="font-semibold text-slate-900 dark:text-white text-sm">95% Confidence Bounds</div>
                <div className="text-xs text-slate-500 mt-1">Upper & Lower Bounds:</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Provides statistically derived upper and lower limits to account for variability and unexpected anomalies.
                </p>
              </div>
            </div>
          </div>

          {/* Operational Application */}
          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Strategic Application of Forecasts
            </h3>
            <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal list-inside">
              <li><strong>Budget & Logistics Planning:</strong> Justify fuel, checkpoint personnel, and patrol equipment allocations before seasonal crime surges.</li>
              <li><strong>Targeted Interventions:</strong> Launch community awareness programs and barangay curfew enforcement in areas showing rising trend lines.</li>
              <li><strong>Validation Tracking:</strong> Review the month-by-month validation table to inspect actual counts versus forecast accuracy.</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: "cases",
      title: "6. Case Blotter & Dossier",
      icon: FolderOpen,
      badge: "Cases",
      tags: ["cases", "blotter", "investigation", "dossier", "heinous", "sensational", "ego", "suspect"],
      content: (
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
      )
    },
    {
      id: "reports",
      title: "7. Institutional PDF Reports",
      icon: FileText,
      badge: "Reports",
      tags: ["reports", "pdf", "export", "download", "executive", "summary", "print"],
      content: (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Institutional PDF Report Generator
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
              Accessible at <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">/dashboard/reports</code>, this module generates formatted PDF documentation for command briefings, LGU peace and order councils, and court submissions.
            </p>
          </div>

          {/* Available Sections */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Configurable Report Sections (Toggle On/Off)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: "📋", title: "1. Executive Summary", desc: "High-level overview and critical takeaways." },
                { icon: "📊", title: "2. Current Statistics", desc: "Total incident volume and clearance rates." },
                { icon: "📈", title: "3. Temporal Trends", desc: "12-month historical crime progression." },
                { icon: "⏰", title: "4. Time Patterns (Radar)", desc: "24-hour peak incident hours analysis." },
                { icon: "🔍", title: "5. Crime Classification", desc: "Detailed breakdown of offense categories." },
                { icon: "📍", title: "6. Barangay Comparison", desc: "Cross-barangay rankings and comparative metrics." },
                { icon: "🔥", title: "7. Crime Heatmap Matrix", desc: "Monthly distribution matrix across crime types." },
                { icon: "💡", title: "8. Tactical Recommendations", desc: "Actionable patrol and security interventions." },
              ].map((sec, idx) => (
                <div key={idx} className="p-4 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                  <span className="text-2xl shrink-0">{sec.icon}</span>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{sec.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{sec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step by Step Generation */}
          <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Steps to Generate & Download Reports
            </h3>
            <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal list-inside">
              <li>Navigate to <strong>Dashboard → Reports</strong>.</li>
              <li>Select desired barangay scope (or General Dashboard for all barangays).</li>
              <li>Toggle the section cards to include or omit specific analytical modules.</li>
              <li>Review the real-time publication cover preview in the right panel.</li>
              <li>Click <strong>"Export Report"</strong> to generate the PDF with embedded vector charts and automatic download.</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: "notifications",
      title: "8. Alert & Notification Intelligence",
      icon: Bell,
      badge: "Alerts",
      tags: ["notifications", "alerts", "rules", "critical", "warning", "threshold", "heinous"],
      content: (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Alert & Notification Intelligence Engine
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
              SecureTanza includes an automated notification and analytical alert engine to notify personnel of critical crime spikes, heinous offenses, or dataset ingest anomalies.
            </p>
          </div>

          {/* Severity Levels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/30">
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-red-800 dark:text-red-300 text-sm">CRITICAL</span>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">
                Triggered by heinous crime detection, sudden surge in violent crimes, or severe data pipeline failures.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-yellow-200 dark:border-yellow-800/50 bg-yellow-50 dark:bg-yellow-950/30">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold text-yellow-800 dark:text-yellow-300 text-sm">WARNING</span>
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Alerts on peak hour threshold exceedances (&gt;25% of incidents in a single hour) or barangay percentage increases.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-800/50 bg-sky-50 dark:bg-sky-950/30">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-4 h-4 text-sky-500" />
                <span className="font-semibold text-sky-800 dark:text-sky-300 text-sm">INFO</span>
              </div>
              <p className="text-xs text-sky-600 dark:text-sky-400">
                General updates regarding successful dataset batch imports, scheduled report completions, or user login audits.
              </p>
            </div>
          </div>

          {/* Rule Customization */}
          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Configuring Notification Rules in Settings
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Administrators can configure rules at <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">/dashboard/config</code> under the <strong>Notification Rules</strong> tab. You can enable or disable rule conditions such as <code className="text-xs font-mono">HOURLY_PERCENT_EXCEEDS</code>, adjust percentage thresholds, and toggle automated alerts.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "settings",
      title: "9. System Settings & RBAC Clearances",
      icon: ShieldCheck,
      badge: "Security",
      tags: ["settings", "rbac", "permissions", "roles", "admin", "clearance", "audit", "security"],
      content: (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              System Administration & Role-Based Access Control
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
              Located at <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">/dashboard/config</code>, the security and configuration suite enforces granular clearance levels.
            </p>
          </div>

          {/* RBAC Table */}
          <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Role Clearances & Permissions Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <th className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Permission / Feature</th>
                    <th className="py-3 px-4 font-semibold text-purple-600 dark:text-purple-400">Admin</th>
                    <th className="py-3 px-4 font-semibold text-sky-600 dark:text-sky-400">Operational Officer</th>
                    <th className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">Privileged User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">Interactive Map & GIS Layers</td>
                    <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full</td>
                    <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full</td>
                    <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">Executive Dashboard & Analytics</td>
                    <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full</td>
                    <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full</td>
                    <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Read-Only</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">Case Blotter Dossiers & EGO Tags</td>
                    <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full Access</td>
                    <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full Access</td>
                    <td className="py-2.5 px-4 text-slate-400">✗ Restricted</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">PDF Report Generation</td>
                    <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full Export</td>
                    <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full Export</td>
                    <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Basic Export</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">Excel Batch Data Upload</td>
                    <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Authorized</td>
                    <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Authorized</td>
                    <td className="py-2.5 px-4 text-slate-400">✗ Unauthorized</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">User Administration & RBAC Management</td>
                    <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Exclusive</td>
                    <td className="py-2.5 px-4 text-slate-400">✗ Restricted</td>
                    <td className="py-2.5 px-4 text-slate-400">✗ Restricted</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">Notification Alert Engine Configuration</td>
                    <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Exclusive</td>
                    <td className="py-2.5 px-4 text-slate-400">✗ Restricted</td>
                    <td className="py-2.5 px-4 text-slate-400">✗ Restricted</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Config Tabs Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Configuration Tabs Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">My Profile</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Manage account credentials, change password, and view assigned security clearance.</p>
              </div>
              <div className="p-4 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Access & Security (RBAC)</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Create users, assign account numbers, and modify role permissions.</p>
              </div>
              <div className="p-4 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Audit Logs</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Inspect historical batch upload records, imported counts, and error traces.</p>
              </div>
              <div className="p-4 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Account Preferences</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Configure dark/light theme preferences and interface display settings.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "upload",
      title: "10. Batch Data Ingestion & Schema",
      icon: Upload,
      badge: "Ingestion",
      tags: ["upload", "excel", "xlsx", "schema", "columns", "import", "data", "pipeline"],
      content: (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Batch Data Ingestion & Excel Schema
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
              SecureTanza supports batch ingestion of crime blotter records via standard Excel spreadsheets (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">.xlsx</code> or <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">.xls</code>).
            </p>
          </div>

          {/* Excel Schema Specification */}
          <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              Standard Excel Column Schema
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ensure your uploaded file includes the following mandatory and optional column headers:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Column Header</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Requirement</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Format / Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                  <tr>
                    <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-white">incident_type / Crime Type</td>
                    <td className="py-2 px-3 text-red-500 font-semibold">Required</td>
                    <td className="py-2 px-3">THEFT, ROBBERY, PHYSICAL INJURY</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-white">barangay</td>
                    <td className="py-2 px-3 text-red-500 font-semibold">Required</td>
                    <td className="py-2 px-3">Amaya 1, Daang Amaya, Julugan 1</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-white">date_committed</td>
                    <td className="py-2 px-3 text-red-500 font-semibold">Required</td>
                    <td className="py-2 px-3 font-mono">YYYY-MM-DD or MM/DD/YYYY</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-white">time_committed</td>
                    <td className="py-2 px-3 text-red-500 font-semibold">Required</td>
                    <td className="py-2 px-3 font-mono">HH:MM:SS or HH:MM (e.g. 14:30:00)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-white">date_reported</td>
                    <td className="py-2 px-3 text-red-500 font-semibold">Required</td>
                    <td className="py-2 px-3 font-mono">YYYY-MM-DD</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-white">case_status</td>
                    <td className="py-2 px-3 text-sky-600 dark:text-sky-400 font-medium">Recommended</td>
                    <td className="py-2 px-3">Cleared, Under Investigation, Filed in Court</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-white">modus</td>
                    <td className="py-2 px-3 text-slate-500">Optional</td>
                    <td className="py-2 px-3">Force entry, Snatching, Riding-in-tandem</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-white">type_of_place</td>
                    <td className="py-2 px-3 text-slate-500">Optional</td>
                    <td className="py-2 px-3">Residential, Commercial, Street, Highway</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-white">lat / lng</td>
                    <td className="py-2 px-3 text-slate-500">Optional</td>
                    <td className="py-2 px-3 font-mono">14.3942 / 120.8523</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Upload Process & Validation */}
          <div className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Data Pipeline Validation & Error Handling
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span><strong>Automated Coordinates Fallback:</strong> If coordinates are missing, SecureTanza assigns default centroid coordinates based on the designated barangay.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span><strong>Instant Notification & Audit:</strong> On upload completion, an audit record is stored in <code className="font-mono text-xs">/dashboard/upload-logs</code> and a notification alert is triggered.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "troubleshooting",
      title: "11. System Diagnostics & Troubleshooting",
      icon: AlertCircle,
      badge: "Diagnostics",
      tags: ["troubleshooting", "faq", "error", "map", "charts", "arima", "browser"],
      content: (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              System Diagnostics & Troubleshooting
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
              Reference guide for resolving common operational anomalies and system errors.
            </p>
          </div>

          {/* Issue Cards */}
          <div className="space-y-4">
            {[
              {
                problem: "Interactive Crime Map appears blank or tiles do not load",
                cause: "Temporary network timeout or WebGL hardware acceleration disabled in browser.",
                solutions: [
                  "Verify internet connection to allow OpenStreetMap tile fetching.",
                  "Ensure Hardware Acceleration is enabled under browser Settings > System.",
                  "Perform a hard browser refresh (Ctrl + F5 or Cmd + Shift + R).",
                  "Clear browser cache and reload the application."
                ]
              },
              {
                problem: "Predictive Analytics displays 'Forecast Unavailable'",
                cause: "The Python ARIMA backend service (FastAPI on port 8000) is unreachable or historical dataset is insufficient.",
                solutions: [
                  "Verify that the backend analytics microservice is active on port 8000.",
                  "Ensure at least 24 to 36 months of continuous historical data have been imported.",
                  "Check NEXT_PUBLIC_FORECAST_API_URL in .env.local configuration."
                ]
              },
              {
                problem: "PDF Report Generation times out or fails to download",
                cause: "Browser pop-up blocker triggered or high-resolution chart capture buffer overflow.",
                solutions: [
                  "Allow automatic file downloads from the SecureTanza domain in browser settings.",
                  "Desensitise export scope by unchecking 1 or 2 optional sections.",
                  "Wait for all analytics charts on the page to finish rendering before triggering export."
                ]
              },
              {
                problem: "Batch Excel Upload reports schema error",
                cause: "Missing mandatory column headers or invalid date/time cell formatting.",
                solutions: [
                  "Verify that column headers match the exact names: incident_type, barangay, date_committed, time_committed.",
                  "Ensure dates are formatted as YYYY-MM-DD and times as HH:MM:SS in Excel.",
                  "Verify that the file size is under 10 MB and file extension is .xlsx or .xls."
                ]
              }
            ].map((issue, idx) => (
              <div key={idx} className="p-5 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 space-y-2">
                <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  {issue.problem}
                </h4>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <strong>Probable Cause:</strong> {issue.cause}
                </div>
                <div className="mt-2 space-y-1.5 pl-6 border-l-2 border-sky-500/30">
                  {issue.solutions.map((sol, sIdx) => (
                    <div key={sIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                      <span className="text-sky-500 font-bold">•</span>
                      <span>{sol}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ], [replayTour]);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter((s) => {
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchTags = s.tags?.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchTags;
    });
  }, [sections, searchQuery]);

  const activeContent = sections.find((s) => s.id === activeSection) || sections[0];

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans bg-[#f8fafc] text-slate-900 dark:bg-[#0b1120] dark:text-slate-100 transition-colors duration-500">
      {/* Top Header */}
      <header className="w-full backdrop-blur-xl border-b z-50 flex-none bg-white/90 border-slate-200/80 dark:bg-[#0F172A]/90 dark:border-white/[0.08] shadow-sm">
        <div className="flex items-center justify-between h-16 px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-sm font-medium cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            <div className="h-5 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Documentation & User Manual
                  <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-semibold border border-sky-500/20">
                    v1.2.0
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Complete operational manual for SecureTanza
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => replayTour()}
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-medium text-xs border border-sky-500/20 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Start Tour</span>
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-sm hover:shadow-sky-500/20 transition-all cursor-pointer"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Home Map</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-80 border-r border-slate-200/80 dark:border-white/[0.08] bg-white/70 dark:bg-slate-900/40 flex flex-col overflow-hidden">
          {/* Search Box */}
          <div className="p-4 border-b border-slate-200/80 dark:border-white/[0.08]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search topics, modules, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Item List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {filteredSections.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No matching documentation topics found for "{searchQuery}".
              </div>
            ) : (
              filteredSections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all cursor-pointer ${
                      isActive
                        ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-semibold shadow-sm"
                        : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isActive
                            ? "bg-sky-500/20 text-sky-600 dark:text-sky-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs truncate">{sec.title}</span>
                    </div>
                    {sec.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold shrink-0 ml-2 ${
                          isActive
                            ? "bg-sky-500/20 text-sky-700 dark:text-sky-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {sec.badge}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Quick Offline PDF / User Guide Link */}
          <div className="p-4 border-t border-slate-200/80 dark:border-white/[0.08] bg-slate-50/50 dark:bg-slate-900/20">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
              Offline Markdown Reference
            </div>
            <div className="text-[11px] font-mono text-sky-600 dark:text-sky-400 truncate">
              docs/USER_GUIDE.md
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 overflow-y-auto bg-white/40 dark:bg-slate-950/40 custom-scrollbar p-6 lg:p-10">
          <div className="max-w-4xl mx-auto pb-16">
            {activeContent && activeContent.content}
          </div>
        </main>
      </div>
    </div>
  );
}
