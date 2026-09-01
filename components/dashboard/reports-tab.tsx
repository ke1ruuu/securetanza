"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, Download, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMapContext } from "@/context/MapContext";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useCrimeMatrix } from "@/hooks/useCrimeMatrix";
import { PDFReportGenerator } from "@/lib/pdf-generator";

interface ReportsTabProps {
  barangayName?: string;
}

interface ReportConfig {
  includeExecutiveSummary: boolean;
  includeOverview: boolean;
  includeTrends: boolean;
  includeTimePatterns: boolean;
  includeCrimeTypes: boolean;
  includeBarangayComparison: boolean;
  includeCrimeMatrix: boolean;
  includeRecommendations: boolean;
}

/** Order here is the order the sections appear in the document. */
const SECTIONS: Array<{ key: keyof ReportConfig; label: string; desc: string }> = [
  { key: "includeExecutiveSummary", label: "Executive Summary", desc: "Key findings overview" },
  { key: "includeOverview", label: "Overview", desc: "Current statistics" },
  { key: "includeTrends", label: "Trends", desc: "Historical patterns" },
  { key: "includeTimePatterns", label: "Time Patterns", desc: "Peak hours analysis" },
  { key: "includeCrimeTypes", label: "Classification", desc: "Crime type breakdown" },
  { key: "includeBarangayComparison", label: "Comparison", desc: "Cross-barangay data" },
  { key: "includeCrimeMatrix", label: "Heatmap", desc: "Monthly distribution" },
  { key: "includeRecommendations", label: "Recommendations", desc: "Strategic insights" },
];

const ALL_ON = SECTIONS.reduce(
  (acc, section) => ({ ...acc, [section.key]: true }),
  {} as ReportConfig
);
const ALL_OFF = SECTIONS.reduce(
  (acc, section) => ({ ...acc, [section.key]: false }),
  {} as ReportConfig
);

export default function ReportsTab({ barangayName }: ReportsTabProps) {
  const { selectedYear, timeRange } = useMapContext();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [today, setToday] = useState<string | null>(null);
  const analyticsData = useAnalyticsData(barangayName);
  const { matrixData, loading: matrixLoading } = useCrimeMatrix(barangayName);

  const [reportConfig, setReportConfig] = useState<ReportConfig>(ALL_ON);

  const isGeneralDashboard = !barangayName || barangayName === "General Dashboard";
  const locationName = isGeneralDashboard ? "All Barangays" : barangayName || "Unknown";
  const locationSlug = isGeneralDashboard
    ? "All-Barangays"
    : barangayName?.replace(/\s+/g, "-") || "Unknown";

  // Resolved after mount so the server and client agree on the date.
  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

  // Get time range display text
  const getTimeRangeText = () => {
    if (timeRange.selections.length === 0) {
      return selectedYear ? `Year ${selectedYear}` : "All Time";
    }

    const count = timeRange.selections.length;
    const firstSelection = timeRange.selections[0];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    switch (timeRange.mode) {
      case 'quarter':
        return count === 1
          ? `Q${firstSelection.quarter} ${firstSelection.year}`
          : `${count} Quarters (${firstSelection.year})`;
      case 'half-year':
        return count === 1
          ? `H${firstSelection.halfYear} ${firstSelection.year}`
          : `${count} Half-years (${firstSelection.year})`;
      case 'month':
        return count === 1
          ? `${monthNames[firstSelection.month! - 1]} ${firstSelection.year}`
          : `${count} Months (${firstSelection.year})`;
      case 'day':
        return count === 1
          ? firstSelection.day?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || ''
          : `${count} Days`;
      default:
        return selectedYear ? `Year ${selectedYear}` : "All Time";
    }
  };

  const timeRangeText = getTimeRangeText();
  const totalCrimes = useMemo(
    () => analyticsData.crimesByType.reduce((sum, item) => sum + item.count, 0),
    [analyticsData.crimesByType]
  );

  const selectedSections = SECTIONS.filter((section) => reportConfig[section.key]);
  const selectedCount = selectedSections.length;
  const needsMatrix = reportConfig.includeCrimeMatrix;
  const waitingForData = analyticsData.loading || (needsMatrix && matrixLoading);
  const fileName = today ? `Crime-Report-${locationSlug}-${today}.pdf` : null;

  const handleExportReport = async () => {
    setLoading(true);
    setError(null);

    try {
      setStep("Checking data");
      if (analyticsData.loading) {
        throw new Error('Analytics data is still loading. Please wait and try again.');
      }
      if (analyticsData.error) {
        throw new Error(`Analytics data error: ${analyticsData.error}`);
      }

      setStep("Building document");
      const pdfGenerator = new PDFReportGenerator();
      const pdfBlob = await pdfGenerator.generateReport(reportConfig, {
        barangayName: locationName,
        timeRange: timeRangeText,
        analyticsData: {
          crimesByType: analyticsData.crimesByType,
          crimesByMonth: analyticsData.crimesByMonth,
          crimesByBarangay: analyticsData.crimesByBarangay,
          crimeMatrix: matrixData,
          timePatterns: analyticsData.timePatterns,
          trends: analyticsData.trends,
        },
        totalCrimes,
      });

      setStep("Saving");
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Crime-Report-${locationSlug}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting report:', err);
      setError(err instanceof Error ? err.message : 'Failed to export the report. Please try again.');
    } finally {
      setLoading(false);
      setStep("");
    }
  };

  const toggleSection = (section: keyof ReportConfig) => {
    setReportConfig(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header data-tour="reports-header" className="flex flex-wrap items-end justify-between gap-6 pb-6">
        <div className="max-w-lg">
          <h2 className="text-3xl font-bold tracking-tight mb-1 text-slate-900 dark:text-white">
            Generate Report
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Create comprehensive case study with analytics and recommendations
          </p>
        </div>

        <dl className="text-right">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
            Period
          </dt>
          <dd className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
            {timeRangeText}
          </dd>
        </dl>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Contents manifest — numbering mirrors the document's own section numbers */}
        <Card data-tour="reports-sections" className="gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 ring-0 dark:border-white/[0.06] dark:bg-white/[0.02]">
          <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-white/[0.06]">
            <div>
              <h3 className="font-heading text-base font-medium text-slate-900 dark:text-white">
                Report Sections
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="tabular-nums font-medium text-slate-700 dark:text-slate-200">
                  {selectedCount}
                </span>{" "}
                of {SECTIONS.length} included
              </p>
            </div>
            <div className="-mr-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setReportConfig(ALL_ON)}
                disabled={selectedCount === SECTIONS.length}
                className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                Select all
              </button>
              <span aria-hidden className="h-3 w-px bg-slate-200 dark:bg-white/10" />
              <button
                type="button"
                onClick={() => setReportConfig(ALL_OFF)}
                disabled={selectedCount === 0}
                className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>

          <ul className="divide-y divide-slate-200 dark:divide-white/[0.06]">
            {SECTIONS.map((section) => {
              const on = reportConfig[section.key];
              const order = on
                ? selectedSections.findIndex((item) => item.key === section.key) + 1
                : null;

              return (
                <li key={section.key}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleSection(section.key)}
                    className="group relative flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-y-0 left-0 w-[2px] transition-colors ${
                        on ? "bg-[#4e86fd] dark:bg-[#0EA5E9]" : "bg-transparent"
                      }`}
                    />
                    <span
                      aria-hidden
                      className={`w-5 shrink-0 text-xs font-semibold tabular-nums ${
                        on
                          ? "text-[#4e86fd] dark:text-[#0EA5E9]"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    >
                      {order !== null ? String(order).padStart(2, "0") : "—"}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-medium transition-colors ${
                          on
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {section.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-500">
                        {section.desc}
                      </span>
                    </span>

                    <span
                      aria-hidden
                      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                        on
                          ? "border-[#4e86fd] bg-[#4e86fd] dark:border-[#0EA5E9] dark:bg-[#0EA5E9]"
                          : "border-slate-300 group-hover:border-slate-400 dark:border-slate-600 dark:group-hover:border-slate-500"
                      }`}
                    >
                      {on && <Check className="h-3 w-3 stroke-[3] text-white" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Export panel */}
        <div className="lg:sticky lg:top-0 lg:self-start">
          <Card data-tour="reports-export-panel" className="gap-0 rounded-xl border border-slate-200 bg-white p-5 ring-0 dark:border-white/[0.06] dark:bg-white/[0.02]">
            {/* Cover preview — always paper, because that is what gets produced */}
            <div data-tour="reports-preview" className="overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-900/10 dark:shadow-lg dark:shadow-black/40">
              <div className="h-[3px] bg-[#0f172a]" />
              <div className="flex aspect-[1/1.24] flex-col px-4 pb-3 pt-5">
                <p className="text-[6px] font-bold uppercase tracking-[0.2em] text-[#0369a1]">
                  Crime analytics case study
                </p>
                <p className="mt-2 font-heading text-[15px] font-bold leading-[1.12] tracking-tight text-[#0f172a]">
                  Incident Pattern and Trend Report
                </p>
                <p className="mt-2 text-[7px] leading-relaxed text-slate-600">
                  {isGeneralDashboard
                    ? "Tanza, Cavite — all barangays"
                    : `Barangay ${locationName}, Tanza, Cavite`}
                  <br />
                  Reporting period: {timeRangeText}
                </p>
                <div className="mt-2 h-[2px] w-8 bg-[#0EA5E9]" />

                <dl className="mt-auto border-t border-slate-400 pt-1.5">
                  {[
                    {
                      label: "Total incidents",
                      value: analyticsData.loading ? "—" : totalCrimes.toLocaleString(),
                    },
                    { label: "Sections included", value: String(selectedCount) },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between border-b border-slate-200 py-1 last:border-0"
                    >
                      <dt className="text-[6px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        {row.label}
                      </dt>
                      <dd className="text-[7px] font-bold text-[#0f172a] tabular-nums">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <dl className="mt-5 space-y-0 text-xs">
              {[
                { label: "Format", value: "PDF · A4 portrait" },
                { label: "File", value: fileName ?? "—" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-3 border-b border-slate-200 py-2 last:border-0 dark:border-white/[0.06]"
                >
                  <dt className="shrink-0 text-slate-500 dark:text-slate-400">{row.label}</dt>
                  <dd className="truncate font-medium text-slate-800 dark:text-slate-200">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <Button
              data-tour="reports-export"
              onClick={handleExportReport}
              disabled={selectedCount === 0 || loading || waitingForData}
              className="mt-5 h-11 w-full text-sm font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {step || "Generating"}
                </>
              ) : waitingForData ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading data
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export Report
                </>
              )}
            </Button>

            {error ? (
              <p
                role="alert"
                className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-red-600 dark:text-red-400"
              >
                <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            ) : selectedCount === 0 && !waitingForData ? (
              <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-500">
                Select at least one section
              </p>
            ) : waitingForData ? (
              <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-500">
                Waiting for analytics data...
              </p>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
