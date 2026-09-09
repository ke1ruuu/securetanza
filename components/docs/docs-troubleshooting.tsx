"use client";

import React from "react";
import { Map, Sparkles } from "lucide-react";
import { DocsCta } from "./docs-cta";

interface DocsTroubleshootingProps {
  onReplayTour?: () => void;
}

export function DocsTroubleshooting({ onReplayTour }: DocsTroubleshootingProps) {
  const issues = [
    {
      problem: "Interactive Crime Map appears blank or tiles do not load",
      cause: "Network timeout or WebGL hardware acceleration disabled in browser.",
      solutions: [
        "Verify internet connection to allow OpenStreetMap tile fetching.",
        "Ensure Hardware Acceleration is enabled under browser Settings > System.",
        "Perform a hard browser refresh (Ctrl + F5 or Cmd + Shift + R).",
        "Clear browser cache and reload the application."
      ]
    },
    {
      problem: "Cannot access Crime Cases Blotter or Settings page",
      cause: "User session token expired or account lacks administrative or operational clearance.",
      solutions: [
        "Log in again with valid credentials via the User Menu.",
        "Verify your account number and password.",
        "Contact a System Administrator to assign 'admin' or 'operational_officer' clearance in Access & Security settings."
      ]
    },
    {
      problem: "PDF Report Generation times out or fails to download",
      cause: "Browser pop-up blocker triggered or high-resolution chart capture buffer delay.",
      solutions: [
        "Allow automatic file downloads from the SecureTanza domain in browser settings.",
        "Reduce report scope by unchecking 1 or 2 optional sections.",
        "Ensure all analytics charts on the page finish rendering before initiating export."
      ]
    },
    {
      problem: "Batch Excel Upload reports schema error",
      cause: "Missing mandatory column headers or invalid date/time cell formatting.",
      solutions: [
        "Verify that column headers match exact names: incident_type, barangay, date_committed, time_committed.",
        "Ensure dates are formatted as YYYY-MM-DD and times as HH:MM:SS in Excel.",
        "Verify file size is under 10 MB and file extension is .xlsx or .xls."
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Troubleshooting
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          Frequently encountered operational issues, diagnostic causes, and step-by-step resolutions.
        </p>
      </div>

      {/* Issues List */}
      <section id="troubleshooting-issues" className="space-y-6 scroll-mt-6">
        {issues.map((issue, idx) => (
          <div key={idx} className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6 last:border-b-0">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {issue.problem}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-300">Cause:</strong> {issue.cause}
            </p>
            <div className="pt-1">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Resolution:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                {issue.solutions.map((sol, sIdx) => (
                  <li key={sIdx}>{sol}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      {/* Next Steps */}
      <DocsCta
        title="Need further help?"
        suggestion="If problems persist, verify your role clearance in System Settings or restart the guided walkthrough."
        actions={[
          {
            label: "Home Map",
            href: "/",
            icon: Map,
            variant: "primary",
          },
          ...(onReplayTour
            ? [
                {
                  label: "Guided Tour",
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
