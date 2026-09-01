"use client";

import React from "react";
import { AlertCircle, Map, Sparkles } from "lucide-react";
import { DocsCta } from "./docs-cta";

interface DocsTroubleshootingProps {
  onReplayTour?: () => void;
}

export function DocsTroubleshooting({ onReplayTour }: DocsTroubleshootingProps) {
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
      problem: "Cannot access Crime Cases Blotter or Settings page",
      cause: "User session token expired or user role lacks required administrative or operational clearance.",
      solutions: [
        "Log in again with valid credentials via the User Menu.",
        "Verify your account number and password.",
        "Contact a System Administrator to assign 'admin' or 'operational_officer' role in Access & Security settings."
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

      {/* Action Suggestion & CTA */}
      <DocsCta
        title="Operational Assistance & Diagnostics"
        suggestion="If you encounter persistent permission restrictions or display anomalies, verify your role clearance in System Settings or restart the interactive guided tour."
        actions={[
          {
            label: "Return to Home Map",
            href: "/",
            icon: Map,
            variant: "primary",
          },
          ...(onReplayTour
            ? [
                {
                  label: "Restart Guided Tour",
                  onClick: onReplayTour,
                  icon: Sparkles,
                  variant: "secondary" as const,
                },
              ]
            : []),
        ]}
      />
    </div>
  );
}
