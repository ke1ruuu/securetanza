"use client";

import React from "react";
import { Map as MapIcon, BarChart3 } from "lucide-react";
import { DocsCta } from "./docs-cta";

export function DocsMap() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          GIS Crime Map
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          The Interactive Crime Map is the primary spatial intelligence interface, visualizing geographic crime distribution, hot-spot clusters, and historical trends across all 41 barangays of Tanza, Cavite.
        </p>
      </div>

      {/* Threat Level Classifications */}
      <section id="threat-levels" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Barangay Threat Levels
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Barangay polygon boundaries dynamically calculate threat levels based on incident counts within the active time filter. The platform uses quartile distributions (0–25th, 25–50th, 50–75th, and 75th+ percentiles) with standard base fallback thresholds:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Threat Level</th>
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Base Threshold</th>
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Dynamic Quartile Rule</th>
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Color</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Secure</td>
                <td className="py-2 px-3">0 incidents</td>
                <td className="py-2 px-3">Exactly 0 incidents recorded in the period</td>
                <td className="py-2 px-3 text-sky-600 dark:text-sky-400 font-medium">Sky Blue (#0ea5e9)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Low</td>
                <td className="py-2 px-3">1 – 2 incidents</td>
                <td className="py-2 px-3">1 to Q1 (25th percentile)</td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Emerald (#10b981)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Moderate</td>
                <td className="py-2 px-3">3 – 5 incidents</td>
                <td className="py-2 px-3">Q1 to Q2 (25th–50th percentile / median)</td>
                <td className="py-2 px-3 text-yellow-600 dark:text-yellow-400 font-medium">Yellow (#eab308)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">High</td>
                <td className="py-2 px-3">6 – 10 incidents</td>
                <td className="py-2 px-3">Q2 to Q3 (50th–75th percentile)</td>
                <td className="py-2 px-3 text-orange-600 dark:text-orange-400 font-medium">Orange (#f97316)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Critical</td>
                <td className="py-2 px-3">11+ incidents</td>
                <td className="py-2 px-3">Above Q3 (75th+ percentile)</td>
                <td className="py-2 px-3 text-red-600 dark:text-red-400 font-medium">Red (#ef4444)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Map Controls & Spatial Tools */}
      <section id="map-controls" className="space-y-6 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Map Controls & Spatial Tools
        </h2>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Barangay & Crime Filtering
          </h3>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <strong>Barangay Multi-Select:</strong> Focus on one or multiple specific barangays. The camera smoothly pans and fits to the selected polygon bounds.
            </li>
            <li>
              <strong>Crime Type Filter:</strong> Isolate specific crime categories such as theft, robbery, physical injury, or vehicular accidents.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Timeline Scrubber & Temporal Playback
          </h3>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <strong>Time Aggregation:</strong> Switch between Quarter (Q1–Q4), Half-Year (H1–H2), Month (Jan–Dec), or custom date selections.
            </li>
            <li>
              <strong>Animated Playback:</strong> Press the Play button to animate chronological crime distribution across months automatically.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Barangay Intelligence Drawer
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            Clicking any barangay polygon opens the slide-out intelligence drawer. It details the barangay incident count, top offense category, safety index, clearance rate, and demographic population density, with direct links to filtered dashboards.
          </p>
        </div>
      </section>

      {/* Next Steps */}
      <DocsCta
        title="Explore the Map"
        suggestion="Use the timeline scrubber at the bottom to review monthly trends, or click any barangay to open its localized profile."
        actions={[
          {
            label: "Open Crime Map",
            href: "/",
            icon: MapIcon,
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
