"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

export function DocsTroubleshooting() {
  const issues = [
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
  ];

  return (
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
        {issues.map((issue, idx) => (
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
  );
}
