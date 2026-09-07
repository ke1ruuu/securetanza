"use client";

import React from "react";
import { ShieldCheck, Activity } from "lucide-react";
import { DocsCta } from "./docs-cta";

export function DocsSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings & RBAC
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          The System Settings module manages role-based access control (RBAC), user credentials, batch ingestion audit logs, and interface preferences.
        </p>
      </div>

      {/* RBAC Table */}
      <section id="rbac-matrix" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Role Clearances & Permissions Matrix
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Permission / Feature</th>
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Admin</th>
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Operational Officer</th>
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Privileged User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Interactive Map & GIS Layers</td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Full Access</td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Full Access</td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Full Access</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Executive Dashboard & Analytics</td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Full Access</td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Full Access</td>
                <td className="py-2 px-3 text-slate-500">Read-Only</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Case Blotter Dossiers & Flags</td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Full Access</td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Full Access</td>
                <td className="py-2 px-3 text-slate-400">Restricted</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">PDF Report Generation</td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Full Export</td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Full Export</td>
                <td className="py-2 px-3 text-slate-500">Basic Export</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Batch Excel Ingestion</td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Authorized</td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Authorized</td>
                <td className="py-2 px-3 text-slate-400">Unauthorized</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">User Administration & RBAC</td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Authorized</td>
                <td className="py-2 px-3 text-slate-400">Restricted</td>
                <td className="py-2 px-3 text-slate-400">Restricted</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">Notification Alert Configuration</td>
                <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-medium">Authorized</td>
                <td className="py-2 px-3 text-slate-400">Restricted</td>
                <td className="py-2 px-3 text-slate-400">Restricted</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Config Tabs Breakdown */}
      <section id="config-sections" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Configuration Sections
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Profile
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Manage personal credentials, update password, and inspect your active clearance level.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Access & Security (RBAC)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Provision new accounts, assign officer badge or account numbers, and designate role levels (Admin, Officer, Privileged User).
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Audit Logs
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Inspect historical batch upload runs, ingested record counts, and schema validation traces for auditing purposes.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Account Preferences
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Toggle light or dark theme mode and configure interface display settings.
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <DocsCta
        title="Settings Actions"
        suggestion="Review user clearances in Access & Security to ensure appropriate separation of roles, or inspect upload history in the Audit Logs."
        actions={[
          {
            label: "Open Settings",
            href: "/dashboard/config",
            icon: ShieldCheck,
            variant: "primary",
          },
          {
            label: "Audit Logs",
            href: "/dashboard/config",
            icon: Activity,
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
