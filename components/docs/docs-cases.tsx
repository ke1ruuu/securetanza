"use client";

import React from "react";
import { FolderOpen, FileSpreadsheet } from "lucide-react";
import { DocsCta } from "./docs-cta";

export function DocsCases() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Case Blotter
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          The Case Blotter module provides detailed incident dossiers, investigative status tracking, statutory classifications, and geospatial context for individual crime reports.
        </p>
      </div>

      {/* Clearance Classifications */}
      <section id="clearance-status" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Clearance Status Classifications
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Cases are classified by legal and investigative standing:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Status</th>
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Operational Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Cleared</td>
                <td className="py-2 px-3">Suspect has been identified and case referred to the prosecutor or judicial authority.</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Under Investigation</td>
                <td className="py-2 px-3">Active police inquiry, evidence collection, and suspect identification ongoing.</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Filed in Court</td>
                <td className="py-2 px-3">Formal information docketed in the municipal or regional trial court.</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Archived / Closed</td>
                <td className="py-2 px-3">Case concluded or archived following due administrative or judicial process.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Dossier Attributes */}
      <section id="dossier-fields" className="space-y-6 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Dossier Fields & Police Classifications
        </h2>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Special Classifications
          </h3>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <strong>Heinous Crime Flag:</strong> Flags serious capital offenses (e.g., murder, homicide, rape, robbery with homicide).
            </li>
            <li>
              <strong>Sensational Crime Flag:</strong> Highlights incidents of significant public interest, community impact, or media attention.
            </li>
            <li>
              <strong>Threat Group Involvement:</strong> Identifies potential involvement of organized crime syndicates or illicit groups.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Attribution & Geospatial Data
          </h3>
          <ul className="list-disc pl-5 mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <strong>Elected/Government Official (EGO) Tracking:</strong> Records involvement of government officials as either suspect or victim.
            </li>
            <li>
              <strong>Investigator Attribution:</strong> Logs designated lead investigator and officer-in-charge.
            </li>
            <li>
              <strong>Geospatial Coordinates:</strong> Exact latitude and longitude values for mapping pins and spatial queries.
            </li>
          </ul>
        </div>
      </section>

      {/* Next Steps */}
      <DocsCta
        title="Case Directory"
        suggestion="Filter records by clearance status or review the upload history to inspect newly ingested blotter sheets."
        actions={[
          {
            label: "Open Cases",
            href: "/dashboard/cases",
            icon: FolderOpen,
            variant: "primary",
          },
          {
            label: "Upload Logs",
            href: "/dashboard/upload-logs",
            icon: FileSpreadsheet,
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
