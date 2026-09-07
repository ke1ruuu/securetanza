"use client";

import React from "react";
import { FileText, TrendingUp } from "lucide-react";
import { DocsCta } from "./docs-cta";

export function DocsReports() {
  const reportSections = [
    { title: "Executive Summary", desc: "High-level overview and critical operational takeaways." },
    { title: "Current Statistics", desc: "Total incident volume and clearance rates." },
    { title: "Temporal Trends", desc: "12-month historical crime progression." },
    { title: "Time Patterns (Radar)", desc: "24-hour peak incident hours analysis." },
    { title: "Crime Classification", desc: "Detailed breakdown of offense categories." },
    { title: "Barangay Comparison", desc: "Cross-barangay rankings and comparative metrics." },
    { title: "Crime Heatmap Matrix", desc: "Monthly distribution matrix across crime types." },
    { title: "Tactical Recommendations", desc: "Actionable patrol and security interventions." },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          PDF Reports
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          The Report Generator compiles structured, publication-grade PDF documentation for command briefings, municipal peace and order councils, and official records.
        </p>
      </div>

      {/* Available Sections */}
      <section id="report-sections" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Configurable Report Sections
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Individual modules can be toggled on or off to tailor the report for specific audiences:
        </p>

        <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
          {reportSections.map((sec, idx) => (
            <li key={idx}>
              <strong className="text-slate-900 dark:text-white">{sec.title}</strong> — {sec.desc}
            </li>
          ))}
        </ol>
      </section>

      {/* Step by Step Generation */}
      <section id="exporting-reports" className="space-y-4 scroll-mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
          Generating and Exporting Reports
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li>Navigate to <strong>Dashboard → Reports</strong>.</li>
          <li>Select the desired barangay scope (or General Dashboard for all barangays).</li>
          <li>Toggle sections on or off based on your briefing requirements.</li>
          <li>Review the real-time publication cover preview in the side panel.</li>
          <li>Click <strong>Export Report</strong> to generate the PDF with embedded vector charts and trigger automatic download.</li>
        </ol>
      </section>

      {/* Next Steps */}
      <DocsCta
        title="Report Generation"
        suggestion="Tailor PDF outputs for specific council briefings by omitting optional sections — for example, exporting an Executive Summary plus 24-Hour Time Radar for shift commanders."
        actions={[
          {
            label: "Open Reports",
            href: "/dashboard/reports",
            icon: FileText,
            variant: "primary",
          },
          {
            label: "View Analytics",
            href: "/dashboard/analytics",
            icon: TrendingUp,
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
