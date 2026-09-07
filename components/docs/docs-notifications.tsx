"use client";

import React from "react";
import { Bell, FolderOpen } from "lucide-react";
import { DocsCta } from "./docs-cta";

export function DocsNotifications() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Notifications & Alerts
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          SecureTanza includes an automated notification and alerting engine that informs personnel of sudden crime volume spikes, heinous offense detections, and data ingestion anomalies.
        </p>
      </div>

      {/* Severity Levels */}
      <section id="severity-levels" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Alert Severity Levels
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Severity</th>
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Trigger Conditions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Critical</td>
                <td className="py-2 px-3">Heinous crime detection, severe violent crime spikes, or fatal data pipeline ingestion errors.</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Warning</td>
                <td className="py-2 px-3">Peak-hour threshold exceedances (&gt;25% of incidents occurring within a single hour) or sudden barangay volume surges.</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Info</td>
                <td className="py-2 px-3">Standard administrative notices including successful batch file imports, completed PDF reports, and login audits.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Rule Customization */}
      <section id="rule-configuration" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Rule Configuration
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Administrators can configure notification triggers under <strong>System Settings → Notification Rules</strong>. Available rules include <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">HOURLY_PERCENT_EXCEEDS</code> and barangay surge multipliers. Threshold percentages and automatic broadcast settings can be adjusted per rule.
        </p>
      </section>

      {/* Next Steps */}
      <DocsCta
        title="Notification Setup"
        suggestion="Configure automated alert thresholds to receive real-time notifications when critical volume surges occur."
        actions={[
          {
            label: "Notification Rules",
            href: "/dashboard/config",
            icon: Bell,
            variant: "primary",
          },
          {
            label: "Review Cases",
            href: "/dashboard/cases",
            icon: FolderOpen,
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
