"use client";

import React from "react";
import { ShieldAlert, AlertCircle, Info } from "lucide-react";

export function DocsNotifications() {
  return (
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
  );
}
