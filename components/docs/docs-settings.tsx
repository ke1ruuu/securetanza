"use client";

import React from "react";
import { ShieldCheck, Activity } from "lucide-react";
import { DocsCta } from "./docs-cta";

export function DocsSettings() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          System Administration & Role-Based Access Control
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
          The System Settings suite manages role-based access control (RBAC), user credentials, and operational configuration.
        </p>
      </div>

      {/* RBAC Table */}
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Role Clearances & Permissions Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <th className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Permission / Feature</th>
                <th className="py-3 px-4 font-semibold text-purple-600 dark:text-purple-400">Admin</th>
                <th className="py-3 px-4 font-semibold text-sky-600 dark:text-sky-400">Operational Officer</th>
                <th className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">Privileged User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">Interactive Map & GIS Layers</td>
                <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full</td>
                <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full</td>
                <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">Executive Dashboard & Analytics</td>
                <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full</td>
                <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full</td>
                <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Read-Only</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">Case Blotter Dossiers & EGO Tags</td>
                <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full Access</td>
                <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full Access</td>
                <td className="py-2.5 px-4 text-slate-400">✗ Restricted</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">PDF Report Generation</td>
                <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full Export</td>
                <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Full Export</td>
                <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Basic Export</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">Excel Batch Data Upload</td>
                <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Authorized</td>
                <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Authorized</td>
                <td className="py-2.5 px-4 text-slate-400">✗ Unauthorized</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">User Administration & RBAC Management</td>
                <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Exclusive</td>
                <td className="py-2.5 px-4 text-slate-400">✗ Restricted</td>
                <td className="py-2.5 px-4 text-slate-400">✗ Restricted</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">Notification Alert Engine Configuration</td>
                <td className="py-2.5 px-4 text-emerald-500 font-bold">✓ Exclusive</td>
                <td className="py-2.5 px-4 text-slate-400">✗ Restricted</td>
                <td className="py-2.5 px-4 text-slate-400">✗ Restricted</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">Role-Based Guided Walkthrough</td>
                <td className="py-2.5 px-4 text-purple-600 dark:text-purple-400 font-medium">7 Stages</td>
                <td className="py-2.5 px-4 text-sky-600 dark:text-sky-400 font-medium">6 Stages</td>
                <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-medium">4 Stages</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Config Tabs Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Configuration Tabs Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">My Profile</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Manage account credentials, change password, and view assigned security clearance.</p>
          </div>
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Access & Security (RBAC)</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Create users, assign account numbers, and modify role permissions.</p>
          </div>
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Audit Logs</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Inspect historical batch upload records, imported counts, and error traces.</p>
          </div>
          <div className="p-4 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">Account Preferences</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Configure dark/light theme preferences and interface display settings.</p>
          </div>
        </div>
      </div>

      {/* Action Suggestion & CTA */}
      <DocsCta
        title="System Administration Pro Tip"
        suggestion="Regularly audit user clearances in Access & Security to enforce role-based segregation, and inspect batch upload logs to ensure data integrity across all 41 barangays."
        actions={[
          {
            label: "Open System Settings",
            href: "/dashboard/config",
            icon: ShieldCheck,
            variant: "primary",
          },
          {
            label: "Inspect Audit Logs",
            href: "/dashboard/config",
            icon: Activity,
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
