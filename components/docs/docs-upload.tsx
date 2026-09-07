"use client";

import React from "react";
import { Upload as UploadIcon, FolderOpen } from "lucide-react";
import { DocsCta } from "./docs-cta";

export function DocsUpload() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Data Ingestion
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          SecureTanza supports batch ingestion of police blotter records via standard Excel spreadsheets (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">.xlsx</code> or <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">.xls</code>).
        </p>
      </div>

      {/* Excel Schema Specification */}
      <section id="excel-schema" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Excel Column Schema
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Ensure uploaded spreadsheets contain the following standard column headers:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Column Header</th>
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Requirement</th>
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Format / Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
              <tr>
                <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-white">incident_type / Crime Type</td>
                <td className="py-2 px-3 text-red-600 dark:text-red-400 font-medium">Required</td>
                <td className="py-2 px-3">THEFT, ROBBERY, PHYSICAL INJURY</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-white">barangay</td>
                <td className="py-2 px-3 text-red-600 dark:text-red-400 font-medium">Required</td>
                <td className="py-2 px-3">Amaya 1, Daang Amaya, Julugan 1</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-white">date_committed</td>
                <td className="py-2 px-3 text-red-600 dark:text-red-400 font-medium">Required</td>
                <td className="py-2 px-3 font-mono">YYYY-MM-DD or MM/DD/YYYY</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-white">time_committed</td>
                <td className="py-2 px-3 text-red-600 dark:text-red-400 font-medium">Required</td>
                <td className="py-2 px-3 font-mono">HH:MM:SS or HH:MM (e.g. 14:30:00)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-white">date_reported</td>
                <td className="py-2 px-3 text-red-600 dark:text-red-400 font-medium">Required</td>
                <td className="py-2 px-3 font-mono">YYYY-MM-DD</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono font-medium text-slate-900 dark:text-white">case_status</td>
                <td className="py-2 px-3 text-slate-600 dark:text-slate-300 font-medium">Recommended</td>
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
      </section>

      {/* Validation */}
      <section id="validation-handling" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Validation & Error Handling
        </h2>

        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>
            <strong>Automated Centroid Fallback:</strong> If coordinates are missing, SecureTanza automatically assigns default centroid coordinates based on the designated barangay polygon.
          </li>
          <li>
            <strong>Duplicate Detection:</strong> Identical entries matching Case ID or exact timestamp/type are flagged during ingestion.
          </li>
          <li>
            <strong>Audit Trail:</strong> Ingestion events log record counts, errors, and operator identity in the system audit logs.
          </li>
        </ul>
      </section>

      {/* Next Steps */}
      <DocsCta
        title="Ingestion Actions"
        suggestion="Verify that column headers match mandatory fields before uploading. Review past batch records in Ingestion Logs."
        actions={[
          {
            label: "Ingestion Logs",
            href: "/dashboard/upload-logs",
            icon: UploadIcon,
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
