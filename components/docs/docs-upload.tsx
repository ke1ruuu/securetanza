"use client";

import React from "react";
import { FileSpreadsheet, CheckCircle2, Upload as UploadIcon, FolderOpen } from "lucide-react";
import { DocsCta } from "./docs-cta";

export function DocsUpload() {
  return (
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
            <span><strong>Instant Notification & Audit:</strong> On upload completion, an audit record is logged to the system audit trail and a notification alert is triggered.</span>
          </li>
        </ul>
      </div>

      {/* Action Suggestion & CTA */}
      <DocsCta
        title="Data Ingestion Pro Tip"
        suggestion="Verify that column headers exactly match mandatory fields (incident_type, barangay, date_committed, time_committed). Missing coordinates will automatically receive barangay centroid fallbacks."
        actions={[
          {
            label: "View Ingestion Logs",
            href: "/dashboard/upload-logs",
            icon: UploadIcon,
            variant: "primary",
          },
          {
            label: "Explore Case Directory",
            href: "/dashboard/cases",
            icon: FolderOpen,
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
