"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, Archive, Check, CheckCircle2, ChevronDown, Download, Eye, FileText, Image as ImageIcon, Loader2, Minus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMapContext } from "@/context/MapContext";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useCrimeMatrix } from "@/hooks/useCrimeMatrix";
import { PDFReportGenerator, type ReportData } from "@/lib/pdf-generator";
import { ImageExporter, type ExportedImage } from "@/lib/image-export";
import { useAuth } from "@/context/AuthContext";
import BarangayMultiSelect from "@/components/dashboard/barangay-multi-select";

// Force fast refresh 1

interface ReportsTabProps {
  barangayName?: string;
}

export type SectionOptions = {
  enabled: boolean;
  includeText: boolean;
  includeCharts: boolean;
  includeTables: boolean;
};

export interface ReportConfig {
  includeExecutiveSummary: SectionOptions;
  includeOverview: SectionOptions;
  includeTrends: SectionOptions;
  includeTimePatterns: SectionOptions;
  includeCrimeTypes: SectionOptions;
  includeBarangayComparison: SectionOptions;
  includeGeographicHighlights: SectionOptions;
  includeCrimeMatrix: SectionOptions;
  includeRecommendations: SectionOptions;
}

type SubOptionKey = keyof Omit<SectionOptions, "enabled">;

/** Order here is the order the sections appear in the document. `subOptions` lists,
 *  in render order, exactly which granular controls that section supports and what
 *  each one produces in the PDF — sections that don't render a given content type
 *  simply omit it instead of showing an inert checkbox. */
const SECTIONS: Array<{
  key: keyof ReportConfig;
  label: string;
  desc: string;
  subOptions: Array<{ key: SubOptionKey; label: string; desc: string }>;
}> = [
  {
    key: "includeExecutiveSummary",
    label: "Executive Summary",
    desc: "Key findings overview",
    subOptions: [{ key: "includeText", label: "Narrative", desc: "Summary paragraph & findings list" }],
  },
  {
    key: "includeOverview",
    label: "Overview",
    desc: "Current statistics",
    subOptions: [
      { key: "includeText", label: "Narrative", desc: "Overview paragraph" },
      { key: "includeCharts", label: "Chart", desc: "Stat cards & leading-types bar chart" },
    ],
  },
  {
    key: "includeTrends",
    label: "Trends",
    desc: "Historical patterns",
    subOptions: [
      { key: "includeText", label: "Narrative", desc: "Trend paragraph" },
      { key: "includeTables", label: "Table", desc: "Quarter comparison" },
      { key: "includeCharts", label: "Chart", desc: "Monthly trend chart" },
    ],
  },
  {
    key: "includeTimePatterns",
    label: "Time Patterns",
    desc: "Peak hours analysis",
    subOptions: [
      { key: "includeText", label: "Narrative", desc: "Time pattern paragraph" },
      { key: "includeCharts", label: "Chart", desc: "Hourly distribution chart" },
      { key: "includeTables", label: "Table", desc: "Day-part breakdown" },
    ],
  },
  {
    key: "includeCrimeTypes",
    label: "Classification",
    desc: "Crime type breakdown",
    subOptions: [
      { key: "includeText", label: "Narrative", desc: "Classification paragraph" },
      { key: "includeTables", label: "Table", desc: "Full ranked breakdown, every type" },
    ],
  },
  {
    key: "includeBarangayComparison",
    label: "Comparison",
    desc: "Cross-barangay data",
    subOptions: [
      { key: "includeText", label: "Narrative", desc: "Comparison paragraph" },
      { key: "includeCharts", label: "Chart & map", desc: "Barangay bar chart + town-wide threat map" },
      { key: "includeTables", label: "Table", desc: "Barangay ranking" },
    ],
  },
  {
    key: "includeGeographicHighlights",
    label: "Geographic Highlights",
    desc: "Hotspot areas to watch",
    subOptions: [
      { key: "includeText", label: "Narrative", desc: "Which barangay(s) are flagged, plus a concentration summary" },
      { key: "includeCharts", label: "Map", desc: "Zoomed-in map of the flagged area(s)" },
    ],
  },
  {
    key: "includeCrimeMatrix",
    label: "Heatmap",
    desc: "Monthly distribution",
    subOptions: [
      { key: "includeText", label: "Narrative", desc: "Matrix paragraph" },
      { key: "includeCharts", label: "Heatmap", desc: "Monthly heatmap grid" },
    ],
  },
  {
    key: "includeRecommendations",
    label: "Recommendations",
    desc: "Strategic insights",
    subOptions: [{ key: "includeText", label: "Narrative", desc: "Recommendations text" }],
  },
];

const DEFAULT_SECTION: SectionOptions = {
  enabled: true,
  includeText: true,
  includeCharts: true,
  includeTables: true,
};

const ALL_ON = SECTIONS.reduce(
  (acc, section) => ({ ...acc, [section.key]: { ...DEFAULT_SECTION } }),
  {} as ReportConfig
);
const ALL_OFF = SECTIONS.reduce(
  (acc, section) => ({ ...acc, [section.key]: { ...DEFAULT_SECTION, enabled: false } }),
  {} as ReportConfig
);

type ImageItemKey =
  | "trend"
  | "timeOfDay"
  | "crimeType"
  | "barangayComparison"
  | "matrixHeatmap"
  | "tanzaMap"
  | "hotspotsMap";

/** Standalone chart/map PNGs an admin can pick individually for a PPT — kept
 *  separate from the PDF's SECTIONS above since "export this one image" is a
 *  different mental model from "assemble a document". */
const IMAGE_ITEMS: Array<{ key: ImageItemKey; label: string; desc: string }> = [
  { key: "trend", label: "Trend chart", desc: "Incidents by month" },
  { key: "timeOfDay", label: "Time-of-day chart", desc: "Incidents by hour, peak highlighted" },
  { key: "crimeType", label: "Crime-type chart", desc: "Leading incident types, ranked" },
  { key: "barangayComparison", label: "Barangay comparison chart", desc: "Highest-volume barangays, ranked" },
  { key: "matrixHeatmap", label: "Monthly heatmap", desc: "Incidence matrix grid" },
  { key: "tanzaMap", label: "Tanza-wide map", desc: "Whole-town barangay risk map" },
  { key: "hotspotsMap", label: "Hotspot highlights map", desc: "Flagged high/critical barangays" },
];

export default function ReportsTab({ barangayName }: ReportsTabProps) {
  const { user } = useAuth();
  const { selectedYear, timeRange } = useMapContext();
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [step, setStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [archived, setArchived] = useState<string | null>(null);
  const [today, setToday] = useState<string | null>(null);
  const analyticsData = useAnalyticsData(barangayName);
  const { matrixData, loading: matrixLoading } = useCrimeMatrix(barangayName);

  const [reportConfig, setReportConfig] = useState<ReportConfig>(ALL_ON);
  const [expandedOptions, setExpandedOptions] = useState<Set<keyof ReportConfig>>(new Set());

  const [activeView, setActiveView] = useState<"document" | "images">("document");

  const [selectedImages, setSelectedImages] = useState<Set<ImageItemKey>>(new Set());
  const [barangayNames, setBarangayNames] = useState<string[]>([]);
  const [selectedBarangayMaps, setSelectedBarangayMaps] = useState<Set<string>>(new Set());
  const [exportingImages, setExportingImages] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Barangay list for the per-barangay map picker — independent of whatever
  // barangay this report itself is scoped to, so an admin can pull any map.
  useEffect(() => {
    let cancelled = false;
    new ImageExporter().listBarangayNames().then((names) => {
      if (!cancelled) setBarangayNames(names);
    }).catch(() => {
      if (!cancelled) setBarangayNames([]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

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

  const selectedSections = SECTIONS.filter((section) => reportConfig[section.key].enabled);
  const selectedCount = selectedSections.length;
  const needsMatrix = reportConfig.includeCrimeMatrix.enabled;
  const waitingForData = analyticsData.loading || (needsMatrix && matrixLoading);
  const imagesWaitingForData = analyticsData.loading || (selectedImages.has("matrixHeatmap") && matrixLoading);
  const fileName = today ? `Crime-Report-${locationSlug}-${today}.pdf` : null;

  /** Same data the PDF is built from — shared with the image exporter below
   *  so a chart or map image reflects exactly the same numbers the report would. */
  const getReportData = (): ReportData => {
    if (analyticsData.loading) {
      throw new Error('Analytics data is still loading. Please wait and try again.');
    }
    if (analyticsData.error) {
      throw new Error(`Analytics data error: ${analyticsData.error}`);
    }

    return {
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
      generatedBy: user?.fullName || user?.accountNumber || 'System',
    };
  };

  /** Builds the document. Both the download and the archive start here. */
  const buildReportBlob = async (): Promise<Blob> => {
    setStep("Checking data");
    const data = getReportData();
    setStep("Building document");
    const pdfGenerator = new PDFReportGenerator();
    return pdfGenerator.generateReport(reportConfig, data);
  };

  const selectedImageCount = selectedImages.size + selectedBarangayMaps.size;

  const toggleImageItem = (key: ImageItemKey) => {
    setSelectedImages((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleBarangayMap = (name: string) => {
    setSelectedBarangayMaps((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectAllBarangayMaps = (names: string[]) => {
    setSelectedBarangayMaps((prev) => new Set([...prev, ...names]));
  };

  const clearBarangayMaps = () => setSelectedBarangayMaps(new Set());

  /** Selects every fixed chart/map item — not the per-barangay maps, since
   *  picking all ~40 of those isn't something anyone wants by default. */
  const selectAllImages = () => {
    setSelectedImages(new Set(IMAGE_ITEMS.map((item) => item.key)));
  };

  const clearImages = () => {
    setSelectedImages(new Set());
    clearBarangayMaps();
  };

  const handleExportImages = async () => {
    if (!selectedImageCount) return;
    setExportingImages(true);
    setImageError(null);
    try {
      const data = getReportData();
      const exporter = new ImageExporter();
      const images: ExportedImage[] = [];

      if (selectedImages.has("trend")) images.push(await exporter.exportTrendChart(data));
      if (selectedImages.has("timeOfDay")) images.push(await exporter.exportTimeOfDayChart(data));
      if (selectedImages.has("crimeType")) images.push(await exporter.exportCrimeTypeChart(data));
      if (selectedImages.has("barangayComparison")) images.push(await exporter.exportBarangayComparisonChart(data));
      if (selectedImages.has("matrixHeatmap")) images.push(await exporter.exportMatrixHeatmap(data));
      if (selectedImages.has("tanzaMap")) images.push(await exporter.exportTanzaMap(data));
      if (selectedImages.has("hotspotsMap")) images.push(await exporter.exportHotspotsMap(data));
      for (const name of selectedBarangayMaps) {
        images.push(await exporter.exportBarangayMap(data, name));
      }

      await exporter.downloadAsZip(images, `Crime-Report-Images-${locationSlug}-${today || ""}.zip`);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Failed to export images. Please try again.");
    } finally {
      setExportingImages(false);
    }
  };

  /** Keeps the report on the server instead of on whichever machine generated it. */
  const handleArchiveReport = async () => {
    setArchiving(true);
    setError(null);
    setArchived(null);

    try {
      const pdfBlob = await buildReportBlob();

      setStep("Archiving");
      const body = new FormData();
      const name = `Crime-Report-${locationSlug}-${new Date().toISOString().split('T')[0]}.pdf`;
      body.append("file", new File([pdfBlob], name, { type: "application/pdf" }));
      body.append("label", isGeneralDashboard ? "All barangays" : `Brgy. ${locationName}`);
      if (!isGeneralDashboard) body.append("barangay", locationName);
      body.append("periodLabel", timeRangeText);

      const res = await fetch("/api/backups", { method: "POST", body });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Could not archive the report.");
      }

      setArchived(`Saved to Backups as ${data.data.fileName}`);
    } catch (err) {
      console.error('Error archiving report:', err);
      setError(err instanceof Error ? err.message : 'Failed to archive the report. Please try again.');
    } finally {
      setArchiving(false);
      setStep("");
    }
  };

  const handlePreviewReport = async () => {
    setPreviewing(true);
    setError(null);
    setArchived(null);

    try {
      const pdfBlob = await buildReportBlob();
      setStep("Opening");
      const url = URL.createObjectURL(pdfBlob);
      setPreviewUrl(url);
    } catch (err) {
      console.error('Error previewing report:', err);
      setError(err instanceof Error ? err.message : 'Failed to preview the report. Please try again.');
    } finally {
      setPreviewing(false);
      setStep("");
    }
  };

  const closePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleExportReport = async () => {
    setLoading(true);
    setError(null);
    setArchived(null);

    try {
      const pdfBlob = await buildReportBlob();

      setStep("Saving");
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Crime-Report-${locationSlug}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Audit log
      try {
        await fetch('/api/audit-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'Export',
            user: user?.accountNumber || 'system',
            resource: `Report:${locationSlug}`,
            details: `Generated and downloaded PDF report for ${locationName}`,
            outcome: 'success',
          }),
        });
      } catch (e) {
        console.error('Failed to log audit event', e);
      }
    } catch (err) {
      console.error('Error exporting report:', err);
      setError(err instanceof Error ? err.message : 'Failed to export the report. Please try again.');
    } finally {
      setLoading(false);
      setStep("");
    }
  };

  const toggleSection = (key: keyof ReportConfig) => {
    setReportConfig((prev) => {
      const nowEnabled = !prev[key].enabled;
      return {
        ...prev,
        [key]: nowEnabled
          ? { ...DEFAULT_SECTION, enabled: true }
          : { ...prev[key], enabled: false },
      };
    });
  };

  const toggleSubOption = (sectionKey: keyof ReportConfig, optionKey: keyof Omit<SectionOptions, 'enabled'>) => {
    setReportConfig((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [optionKey]: !prev[sectionKey][optionKey],
      },
    }));
  };

  const toggleOptionsExpanded = (key: keyof ReportConfig) => {
    setExpandedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
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
          <dt className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
            Period
          </dt>
          <dd className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
            {timeRangeText}
          </dd>
        </dl>
      </header>

      <div
        role="tablist"
        aria-label="Report output"
        className="mb-6 inline-flex gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-white/[0.06] dark:bg-white/[0.02]"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeView === "document"}
          onClick={() => setActiveView("document")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeView === "document"
              ? "bg-[#4e86fd] text-white dark:bg-[#0EA5E9]"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.06]"
          }`}
        >
          <FileText className="h-4 w-4" />
          PDF Report
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeView === "images"}
          onClick={() => setActiveView("images")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeView === "images"
              ? "bg-[#4e86fd] text-white dark:bg-[#0EA5E9]"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.06]"
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          Export Images
          {selectedImageCount > 0 && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none ${
                activeView === "images" ? "bg-white/25 text-white" : "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-300"
              }`}
            >
              {selectedImageCount}
            </span>
          )}
        </button>
      </div>

      {activeView === "document" && (
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
              const config = reportConfig[section.key];
              const on = config.enabled;
              const order = on
                ? selectedSections.findIndex((item) => item.key === section.key) + 1
                : null;
              const allSubOptionsOn = section.subOptions.every((opt) => config[opt.key]);
              const partiallySelected = on && !allSubOptionsOn;

              return (
                <li key={section.key} className="flex flex-col border-b border-slate-100 last:border-0 dark:border-white/[0.05]">
                  <div className="group relative flex w-full items-center gap-4 px-5 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                    <span
                      aria-hidden
                      className={`absolute inset-y-0 left-0 w-[2px] transition-colors ${
                        on ? "bg-[#4e86fd] dark:bg-[#0EA5E9]" : "bg-transparent"
                      }`}
                    />
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleSection(section.key)}
                      className="flex min-w-0 flex-1 items-center gap-4 text-left"
                    >
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
                        title={partiallySelected ? "Some granular options are deselected" : undefined}
                        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                          on
                            ? partiallySelected
                              ? "border-[#4e86fd] bg-white dark:border-[#0EA5E9] dark:bg-transparent"
                              : "border-[#4e86fd] bg-[#4e86fd] dark:border-[#0EA5E9] dark:bg-[#0EA5E9]"
                            : "border-slate-300 group-hover:border-slate-400 dark:border-slate-600 dark:group-hover:border-slate-500"
                        }`}
                      >
                        {on && (partiallySelected ? (
                          <Minus className="h-3 w-3 stroke-[3] text-[#4e86fd] dark:text-[#0EA5E9]" />
                        ) : (
                          <Check className="h-3 w-3 stroke-[3] text-white" />
                        ))}
                      </span>
                    </button>

                    <button
                      type="button"
                      aria-expanded={expandedOptions.has(section.key)}
                      aria-label="Toggle granular options"
                      onClick={() => toggleOptionsExpanded(section.key)}
                      className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-white/[0.06] dark:hover:text-white"
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedOptions.has(section.key) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Sub-options panel (stays mounted across the main checkbox toggle so it doesn't jump) */}
                  {expandedOptions.has(section.key) && (
                    <div className="bg-slate-50/50 px-5 pb-3 pl-14 dark:bg-black/10">
                      <div className="flex flex-col gap-0.5">
                        {section.subOptions.map(({ key: optionKey, label: optionLabel, desc: optionDesc }) => {
                          const checked = config[optionKey];
                          return (
                            <label
                              key={optionKey}
                              className={`group/sub flex items-start gap-2.5 rounded-md px-1.5 py-1.5 -mx-1.5 text-left transition-colors ${
                                on ? "cursor-pointer hover:bg-white dark:hover:bg-white/[0.05]" : "cursor-not-allowed"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                disabled={!on}
                                onChange={() => toggleSubOption(section.key, optionKey)}
                                className="sr-only"
                              />
                              <span
                                aria-hidden
                                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                                  checked
                                    ? on
                                      ? "border-[#4e86fd] bg-[#4e86fd] dark:border-[#0EA5E9] dark:bg-[#0EA5E9]"
                                      : "border-slate-300 bg-slate-300 dark:border-slate-600 dark:bg-slate-600"
                                    : `border-slate-300 dark:border-slate-600 ${on ? "group-hover/sub:border-slate-400 dark:group-hover/sub:border-slate-500" : ""}`
                                }`}
                              >
                                {checked && <Check className="h-2.5 w-2.5 stroke-[3] text-white" />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span
                                  className={`block text-xs font-medium leading-snug ${
                                    on ? "text-slate-700 dark:text-slate-300" : "text-slate-400 dark:text-slate-600"
                                  }`}
                                >
                                  {optionLabel}
                                </span>
                                <span className="block text-[11px] leading-snug text-slate-500 dark:text-slate-500">
                                  {optionDesc}
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Export panel */}
        <div className="lg:sticky lg:top-0 lg:self-start">
          <Card data-tour="reports-export-panel" className="gap-0 rounded-xl border border-slate-200 bg-white p-5 ring-0 dark:border-white/[0.06] dark:bg-white/[0.02]">
            {/* Cover preview — always paper, because that is what gets produced */}
            <button
              type="button"
              data-tour="reports-preview"
              onClick={handlePreviewReport}
              disabled={selectedCount === 0 || loading || archiving || previewing || waitingForData}
              className="group relative w-full text-left overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-900/10 transition-all hover:ring-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] disabled:opacity-50 disabled:pointer-events-none dark:shadow-lg dark:shadow-black/40 dark:hover:ring-[#0EA5E9]"
            >
              <div className="transition-all duration-300 group-hover:blur-[1.5px] group-hover:opacity-75">
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

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-black/40">
                {previewing ? (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/40 backdrop-blur-md text-slate-900 shadow-sm ring-1 ring-black/5 dark:bg-white/10 dark:text-white dark:ring-white/10">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                    <span className="mt-2 text-xs font-semibold text-slate-900 drop-shadow-sm dark:text-white">
                      {step || "Preparing"}...
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/40 backdrop-blur-md text-slate-900 shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-110 dark:bg-white/10 dark:text-white dark:ring-white/10">
                      <Eye className="h-5 w-5" />
                    </div>
                    <span className="mt-2 text-xs font-semibold text-slate-900 drop-shadow-sm dark:text-white">
                      Preview Report
                    </span>
                  </>
                )}
              </div>
            </button>

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
              disabled={selectedCount === 0 || loading || archiving || previewing || waitingForData}
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

            {/* Same document, kept on the server instead of this machine */}
            <Button
              variant="outline"
              onClick={handleArchiveReport}
              disabled={selectedCount === 0 || loading || archiving || previewing || waitingForData}
              className="mt-2 h-11 w-full text-sm font-semibold"
            >
              {archiving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {step || "Archiving"}
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4" />
                  Save to Backups
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
            ) : archived ? (
              <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0" />
                <span>{archived} — retrieve it from Settings → Backups.</span>
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
      )}

      {activeView === "images" && (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Contents manifest — same numbered-list language as Report Sections */}
        <Card data-tour="reports-export-images" className="gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 ring-0 dark:border-white/[0.06] dark:bg-white/[0.02]">
          <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-white/[0.06]">
            <div>
              <h3 className="font-heading text-base font-medium text-slate-900 dark:text-white">
                Export Images
              </h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="tabular-nums font-medium text-slate-700 dark:text-slate-200">
                  {selectedImageCount}
                </span>{" "}
                selected · pick individual charts and maps for a slide deck
              </p>
            </div>
            <div className="-mr-2 flex items-center gap-1">
              <button
                type="button"
                onClick={selectAllImages}
                disabled={selectedImages.size === IMAGE_ITEMS.length}
                className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                Select all
              </button>
              <span aria-hidden className="h-3 w-px bg-slate-200 dark:bg-white/10" />
              <button
                type="button"
                onClick={clearImages}
                disabled={selectedImageCount === 0}
                className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-40 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>

          <ul className="divide-y divide-slate-200 dark:divide-white/[0.06]">
            {IMAGE_ITEMS.map((item) => {
              const checked = selectedImages.has(item.key);
              const order = checked
                ? IMAGE_ITEMS.filter((it) => selectedImages.has(it.key)).findIndex((it) => it.key === item.key) + 1
                : null;
              return (
                <li key={item.key} className="flex flex-col border-b border-slate-100 last:border-0 dark:border-white/[0.05]">
                  <button
                    type="button"
                    aria-pressed={checked}
                    onClick={() => toggleImageItem(item.key)}
                    className="group relative flex w-full items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-y-0 left-0 w-[2px] transition-colors ${
                        checked ? "bg-[#4e86fd] dark:bg-[#0EA5E9]" : "bg-transparent"
                      }`}
                    />
                    <span
                      aria-hidden
                      className={`w-5 shrink-0 text-xs font-semibold tabular-nums ${
                        checked ? "text-[#4e86fd] dark:text-[#0EA5E9]" : "text-slate-300 dark:text-slate-600"
                      }`}
                    >
                      {order !== null ? String(order).padStart(2, "0") : "—"}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-medium transition-colors ${
                          checked ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-500">
                        {item.desc}
                      </span>
                    </span>

                    <span
                      aria-hidden
                      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                        checked
                          ? "border-[#4e86fd] bg-[#4e86fd] dark:border-[#0EA5E9] dark:bg-[#0EA5E9]"
                          : "border-slate-300 group-hover:border-slate-400 dark:border-slate-600 dark:group-hover:border-slate-500"
                      }`}
                    >
                      {checked && <Check className="h-3 w-3 stroke-[3] text-white" />}
                    </span>
                  </button>
                </li>
              );
            })}

            {/* Per-barangay map — a bucket of picks rather than a single toggle,
                so it reuses the granular-options expand pattern instead of a
                numbered row. */}
            <li className="flex flex-col border-b border-slate-100 last:border-0 dark:border-white/[0.05] px-5 py-3">
              <BarangayMultiSelect
                names={barangayNames}
                selected={selectedBarangayMaps}
                onToggle={toggleBarangayMap}
                onSelectAll={selectAllBarangayMaps}
                onClear={clearBarangayMaps}
              />
            </li>
          </ul>
        </Card>

        {/* Export panel — mirrors the PDF's cover-preview sidebar */}
        <div className="lg:sticky lg:top-0 lg:self-start">
          <Card className="gap-0 rounded-xl border border-slate-200 bg-white p-5 ring-0 dark:border-white/[0.06] dark:bg-white/[0.02]">
            <div className="w-full overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-900/10 dark:shadow-lg dark:shadow-black/40">
              <div className="h-[3px] bg-[#0f172a]" />
              <div className="flex aspect-[1/1.24] flex-col items-center justify-center gap-3 bg-slate-50 px-4 py-6 dark:bg-white/[0.02]">
                <div className="relative h-14 w-14 shrink-0">
                  <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-md bg-slate-200 dark:bg-white/10" />
                  <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-md bg-slate-300 ring-1 ring-white dark:bg-white/20 dark:ring-[#0f172a]" />
                  <div className="absolute inset-0 flex items-center justify-center rounded-md bg-white ring-1 ring-slate-900/10 dark:bg-[#0f172a] dark:ring-white/10">
                    <ImageIcon className="h-6 w-6 text-[#4e86fd] dark:text-[#0EA5E9]" />
                  </div>
                </div>
                <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-[#0369a1]">
                  {selectedImageCount === 0 ? "Nothing selected" : `${selectedImageCount} image${selectedImageCount === 1 ? "" : "s"}`}
                </p>
                <p className="text-center text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {isGeneralDashboard ? "Tanza, Cavite — all barangays" : `Barangay ${locationName}, Tanza, Cavite`}
                  <br />
                  {timeRangeText}
                </p>
              </div>
            </div>

            <dl className="mt-5 space-y-0 text-xs">
              {[
                { label: "Format", value: "PNG · high-resolution" },
                { label: "Bundle", value: selectedImageCount > 1 ? "ZIP archive" : "Single file" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-3 border-b border-slate-200 py-2 last:border-0 dark:border-white/[0.06]"
                >
                  <dt className="shrink-0 text-slate-500 dark:text-slate-400">{row.label}</dt>
                  <dd className="truncate font-medium text-slate-800 dark:text-slate-200">{row.value}</dd>
                </div>
              ))}
            </dl>

            <Button
              onClick={handleExportImages}
              disabled={selectedImageCount === 0 || exportingImages || imagesWaitingForData}
              className="mt-5 h-11 w-full text-sm font-semibold"
            >
              {exportingImages ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exporting
                </>
              ) : imagesWaitingForData ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading data
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  {selectedImageCount > 1 ? "Download as ZIP" : "Download Image"}
                </>
              )}
            </Button>

            {imageError ? (
              <p role="alert" className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-red-600 dark:text-red-400">
                <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
                <span>{imageError}</span>
              </p>
            ) : selectedImageCount === 0 && !imagesWaitingForData ? (
              <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-500">
                Select at least one item
              </p>
            ) : null}
          </Card>
        </div>
      </div>
      )}

      <Dialog open={!!previewUrl} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent showCloseButton={false} className="max-w-none sm:max-w-none w-screen h-[100dvh] flex flex-col p-0 gap-0 overflow-hidden rounded-none border-0">
          <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-white/[0.06] shrink-0">
            <DialogTitle className="text-lg font-bold">Report Preview</DialogTitle>
            <Button variant="ghost" onClick={closePreview}>
              <X className="h-5 w-5 mr-2" />
              Close Preview
            </Button>
          </div>
          <div className="flex-1 min-h-0 bg-slate-100 dark:bg-black">
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="Report Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
