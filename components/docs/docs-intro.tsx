"use client";

import React from "react";
import { Map, BarChart3 } from "lucide-react";
import { DocsCta } from "./docs-cta";
import { UserRoleType } from "@/lib/tour/steps";

interface DocsIntroProps {
  onReplayTour?: (role?: UserRoleType) => void;
}

export function DocsIntro({ onReplayTour }: DocsIntroProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Introduction
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          SecureTanza is a Geographic Information System (GIS) and crime analytics platform built specifically for the Municipality of <strong>Tanza, Cavite</strong>. It provides law enforcement commanders, crime analysts, and municipal officials with real-time spatial intelligence, temporal-spatial hotspot detection, and data-driven reporting.
        </p>
      </div>

      {/* Role-Based Guided Walkthroughs */}
      <section id="walkthroughs" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Interactive Walkthroughs
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Guided interactive tours are available to introduce workflows tailored to each role:
        </p>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <div className="font-medium text-sm text-slate-900 dark:text-white">
                Operational Officer Walkthrough
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tactical workflows including Excel blotter ingestion, peak-hour alert monitoring, case dossiers, and PDF reporting.
              </p>
            </div>
            {onReplayTour && (
              <button
                onClick={() => onReplayTour("operational_officer")}
                className="text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 self-start sm:self-auto cursor-pointer"
              >
                Launch Walkthrough →
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <div className="font-medium text-sm text-slate-900 dark:text-white">
                Privileged Analyst / Viewer Walkthrough
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Analytical tools including 24-hour radar time patterns, monthly crime matrix heatmaps, and case filtering.
              </p>
            </div>
            {onReplayTour && (
              <button
                onClick={() => onReplayTour("privileged_user")}
                className="text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 self-start sm:self-auto cursor-pointer"
              >
                Launch Walkthrough →
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2">
            <div>
              <div className="font-medium text-sm text-slate-900 dark:text-white">
                System Administrator Walkthrough
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Platform administration covering user provisioning, role-based access control (RBAC), and batch upload audit logs.
              </p>
            </div>
            {onReplayTour && (
              <button
                onClick={() => onReplayTour("admin")}
                className="text-xs font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 self-start sm:self-auto cursor-pointer"
              >
                Launch Walkthrough →
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Core Modules */}
      <section id="core-modules" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Core Modules
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Interactive GIS Crime Map
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Visualizes multi-layer geospatial incident pins, 41 barangay polygon boundaries, threat level risk heatmaps, and timeline playback scrubbers for spatial analysis.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Executive Dashboard
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Provides executive KPI metric summaries, monthly volume trajectories, offense type breakdowns, and recent blotter activity for high-level monitoring.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Historical Crime Analytics
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Offers mathematical indicators (Resolution Rate, Safety Index), 24-hour polar time distribution plots, modus operandi patterns, and crime matrix heatmaps.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Incident Blotter & Case Dossiers
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Enables searching and inspecting detailed incident blotter records, clearance statuses, heinous/sensational crime flags, and investigator assignments.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Institutional PDF Reports
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Compiles standardized PDF reports with embedded high-resolution chart captures, analytical observations, and tactical recommendations for official briefings.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Data Ingestion & Administration
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Supports Excel blotter spreadsheet uploads with automated schema verification, coordinate fallback assignment, RBAC permissions, and alert configuration.
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <DocsCta
        title="Ready to get started?"
        suggestion="Explore the GIS Crime Map for spatial incidents, or review key statistics on the Overview Dashboard."
        actions={[
          {
            label: "Open Crime Map",
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
