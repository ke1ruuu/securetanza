"use client";

import React from "react";
import { FileText, TrendingUp } from "lucide-react";
import { DocsCta } from "./docs-cta";

export function DocsReports() {
  const reportSections = [
    { icon: "📋", title: "1. Executive Summary", desc: "High-level overview and critical takeaways." },
    { icon: "📊", title: "2. Current Statistics", desc: "Total incident volume and clearance rates." },
    { icon: "📈", title: "3. Temporal Trends", desc: "12-month historical crime progression." },
    { icon: "⏰", title: "4. Time Patterns (Radar)", desc: "24-hour peak incident hours analysis." },
    { icon: "🔍", title: "5. Crime Classification", desc: "Detailed breakdown of offense categories." },
    { icon: "📍", title: "6. Barangay Comparison", desc: "Cross-barangay rankings and comparative metrics." },
    { icon: "🔥", title: "7. Crime Heatmap Matrix", desc: "Monthly distribution matrix across crime types." },
    { icon: "💡", title: "8. Tactical Recommendations", desc: "Actionable patrol and security interventions." },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Institutional PDF Report Generator
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
          The Report Generator compiles structured, publication-grade PDF documentation for command briefings, LGU peace and order councils, and official submissions.
        </p>
      </div>

      {/* Available Sections */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Configurable Report Sections (Toggle On/Off)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reportSections.map((sec, idx) => (
            <div key={idx} className="p-4 rounded-xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
              <span className="text-2xl shrink-0">{sec.icon}</span>
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{sec.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{sec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step by Step Generation */}
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Steps to Generate & Download Reports
        </h3>
        <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal list-inside">
          <li>Navigate to <strong>Dashboard → Reports</strong>.</li>
          <li>Select desired barangay scope (or General Dashboard for all barangays).</li>
          <li>Toggle the section cards to include or omit specific analytical modules.</li>
          <li>Review the real-time publication cover preview in the right panel.</li>
          <li>Click <strong>"Export Report"</strong> to generate the PDF with embedded vector charts and automatic download.</li>
        </ol>
      </div>

      {/* Action Suggestion & CTA */}
      <DocsCta
        title="Document Publication Pro Tip"
        suggestion="Tailor PDF outputs for specific council briefings by toggling off optional modules — e.g. export an Executive Summary + 24-Hour Time Radar brief for shift commanders."
        actions={[
          {
            label: "Open Report Generator",
            href: "/dashboard/reports",
            icon: FileText,
            variant: "primary",
          },
          {
            label: "Explore Analytics Visuals",
            href: "/dashboard/analytics",
            icon: TrendingUp,
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
