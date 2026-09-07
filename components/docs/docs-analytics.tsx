"use client";

import React from "react";
import { TrendingUp, FileText } from "lucide-react";
import { DocsCta } from "./docs-cta";

export function DocsAnalytics() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Crime Analytics
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          The Analytics module provides intelligence indicators, temporal patterns, and mathematical calculations for patrol resource allocation and investigative planning.
        </p>
      </div>

      {/* Analytical Metrics */}
      <section id="math-metrics" className="space-y-6 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Mathematical Metrics & Indicators
        </h2>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Resolution Rate (%)
          </h3>
          <div className="my-2 p-2.5 font-mono text-xs bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-800">
            Resolution Rate = (Cleared Cases + Solved Cases) / Total Incidents × 100%
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Measures investigative efficiency by computing the proportion of recorded incidents that have been resolved, identified, or referred to court.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Safety Index Score
          </h3>
          <div className="my-2 p-2.5 font-mono text-xs bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-800">
            Safety Index = 100 - (Critical Incident Rate Weight + Unresolved Penalty)
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            A normalized composite score from 0 to 100 reflecting the relative safety profile of the municipality or individual barangay.
          </p>
        </div>
      </section>

      {/* Visualizations */}
      <section id="visualizations" className="space-y-6 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Analytical Visualizations
        </h2>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            24-Hour Radar Time Pattern
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Distributes incident frequencies across each hour of the day on a circular polar radar plot. Used by station commanders to align roving shifts and vehicle deployments with peak incident windows (e.g., 20:00 to 02:00).
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Modus Operandi Breakdown
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Categorizes recurring criminal methods (e.g., motorcycle riding-in-tandem, forced entry, snatching) to assist detectives in recognizing serial offender patterns.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Location Type Distribution
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Classifies incidents by environment (Residential, Commercial, Public Thoroughfare, Highway) to inform municipal lighting, checkpoint locations, and CCTV camera placements.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Crime Matrix Heatmap
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            A monthly cross-tabulated matrix displaying intensity across statutory crime types, enabling fast identification of seasonal crime surges.
          </p>
        </div>
      </section>

      {/* Next Steps */}
      <DocsCta
        title="Analytics Actions"
        suggestion="Cross-reference peak hours with high-frequency modus operandi, or generate institutional PDF reports summarizing these findings."
        actions={[
          {
            label: "Open Analytics",
            href: "/dashboard/analytics",
            icon: TrendingUp,
            variant: "primary",
          },
          {
            label: "Export PDF Report",
            href: "/dashboard/reports",
            icon: FileText,
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
