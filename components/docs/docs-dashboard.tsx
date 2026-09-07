"use client";

import React from "react";
import { BarChart3, FolderOpen } from "lucide-react";
import { DocsCta } from "./docs-cta";

export function DocsDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Overview Dashboard
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          The Executive Dashboard provides an operational summary of incident volume, statutory offense distribution, and recent blotter entries across Tanza, Cavite.
        </p>
      </div>

      {/* Metric Indicators */}
      <section id="kpi-metrics" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Key Performance Indicators
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Total Crimes
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Cumulative count of recorded blotter incidents within the active date range and selected barangay scope.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Top Offense Type
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              The statutory crime classification with the highest recorded frequency during the observation period (e.g., Theft, Physical Injury, Robbery).
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Critical Hotspot
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              The barangay exhibiting the highest crime density within the municipality during the selected timeframe.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Charts & Feeds */}
      <section id="charts-blotter" className="space-y-6 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Charts & Blotter Activity
        </h2>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            12-Month Crime Volume Trajectory
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Displays monthly incident totals over time, highlighting upward or downward momentum and identifying seasonal surges (e.g., holiday or summer peaks).
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Categorical Offense Distribution
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Provides proportional breakdown of index crimes (crimes against persons and property) versus non-index and special law violations.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Recent Blotter Activity
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            A chronological feed of recent blotter recordings displaying Case ID, timestamp, barangay, crime type, and clearance status.
          </p>
        </div>
      </section>

      {/* Next Steps */}
      <DocsCta
        title="Dashboard Navigation"
        suggestion="Filter the dashboard by selecting a specific barangay in the scope selector, or drill down into raw case files."
        actions={[
          {
            label: "Open Dashboard",
            href: "/dashboard/overview",
            icon: BarChart3,
            variant: "primary",
          },
          {
            label: "View Cases",
            href: "/dashboard/cases",
            icon: FolderOpen,
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
