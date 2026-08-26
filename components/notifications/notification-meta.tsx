"use client";

import { Bell, Clock, FileSpreadsheet, Flame, type LucideIcon } from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "PEAK_HOUR" | "CRIME_ACTIVITY" | "DATASET_PROCESSING" | "SYSTEM";
  severity: "INFO" | "WARNING" | "CRITICAL";
  uploadLogId?: string | null;
  uploadLog?: {
    id: string;
    fileName: string;
    uploadedAt: string;
    recordsImported: number;
  } | null;
  metadata?: Record<string, unknown> | null;
  isRead: boolean;
  readAt?: string | null;
  isArchived?: boolean;
  archivedAt?: string | null;
  createdAt: string;
}

export type NotificationCategory = NotificationItem["category"];
export type NotificationSeverity = NotificationItem["severity"];

interface CategoryMeta {
  label: string;
  icon: LucideIcon;
}

const CATEGORIES: Record<NotificationCategory, CategoryMeta> = {
  PEAK_HOUR: { label: "Peak hour", icon: Clock },
  CRIME_ACTIVITY: { label: "Crime activity", icon: Flame },
  DATASET_PROCESSING: { label: "Dataset", icon: FileSpreadsheet },
  SYSTEM: { label: "System", icon: Bell },
};

/** Filter options shared by the bell popover and the notification center. */
export const CATEGORY_FILTERS = [
  { key: "ALL", label: "All" },
  { key: "PEAK_HOUR", label: "Peak hour" },
  { key: "CRIME_ACTIVITY", label: "Crime activity" },
  { key: "DATASET_PROCESSING", label: "Datasets" },
] as const;

export const SEVERITY_FILTERS = [
  { key: "ALL", label: "Any severity" },
  { key: "CRITICAL", label: "Critical" },
  { key: "WARNING", label: "Warning" },
  { key: "INFO", label: "Info" },
] as const;

interface SeverityMeta {
  label: string;
  /** Severity word — depth chosen so it clears 4.5:1 on both paper-white and #0F172A. */
  text: string;
  /** The row spine: severity is encoded by position + colour + word, never colour alone. */
  spine: string;
}

const SEVERITIES: Record<NotificationSeverity, SeverityMeta> = {
  CRITICAL: {
    label: "Critical",
    text: "text-red-700 dark:text-red-400",
    spine: "bg-red-600 dark:bg-red-500",
  },
  WARNING: {
    label: "Warning",
    text: "text-amber-700 dark:text-amber-400",
    spine: "bg-amber-500",
  },
  INFO: {
    label: "Info",
    text: "text-sky-800 dark:text-sky-400",
    spine: "bg-[#4e86fd] dark:bg-[#0EA5E9]",
  },
};

/** Tolerant lookups — the column is a DB enum, but the client should never blank out on drift. */
export function categoryMeta(category: string): CategoryMeta {
  return CATEGORIES[category as NotificationCategory] ?? CATEGORIES.SYSTEM;
}

export function severityMeta(severity: string): SeverityMeta {
  return SEVERITIES[severity as NotificationSeverity] ?? SEVERITIES.INFO;
}

export function relativeTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Unknown";
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function absoluteTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Unknown date";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatNotifiedDate(dateStr: string): { relative: string; exact: string } {
  return {
    relative: relativeTime(dateStr),
    exact: absoluteTime(dateStr),
  };
}

export function isoTime(dateStr: string): string | undefined {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

/** Written by backend/lib/notification-engine.ts — routing key, not a finding. */
export const HIDDEN_METADATA_KEYS = new Set(["targetUrl"]);

const METADATA_LABELS: Record<string, string> = {
  barangay: "Barangay",
  barangayCoverageCount: "Barangays covered",
  crimeType: "Crime type",
  datasetYear: "Dataset year",
  dateSpan: "Date span",
  densityPercent: "Peak density",
  dominantCrime: "Leading offence",
  errorRate: "Skip rate",
  errorSummary: "Error summary",
  fileName: "Source file",
  incidentCount: "Incidents",
  insertedCount: "Records imported",
  leadingBarangay: "Leading barangay",
  peakWindow: "Peak window",
  primaryCrime: "Primary offence",
  sampleErrors: "Sample errors",
  sharePercent: "Share of records",
  skippedRows: "Rows skipped",
  threshold: "Threshold",
  totalHighRisk: "High-risk incidents",
  totalRows: "Rows in file",
};

const PERCENT_KEYS = new Set(["densityPercent", "errorRate", "sharePercent"]);

export function metadataLabel(key: string): string {
  const known = METADATA_LABELS[key];
  if (known) return known;
  const spaced = key.replace(/([A-Z])/g, " $1").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Returns null for values with nothing to say, so callers can skip the row entirely. */
export function metadataValue(key: string, value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (Array.isArray(value)) {
    const parts = value.map((v) => metadataValue(key, v)).filter(Boolean);
    return parts.length ? parts.join(", ") : null;
  }
  if (typeof value === "number") {
    const formatted = value.toLocaleString("en-US");
    return PERCENT_KEYS.has(key) ? `${formatted}%` : formatted;
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  const str = String(value);
  return PERCENT_KEYS.has(key) && !str.includes("%") ? `${str}%` : str;
}
