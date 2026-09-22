"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CalendarClock } from "lucide-react";
import { OVERLAY_SURFACE } from "@/lib/map-overlay";

interface LastUploadData {
  latestIncident: {
    dateCommitted: string;
  } | null;
  lastUpload: {
    fileName?: string;
    recordsImported?: number;
    createdAt: string;
  } | null;
}

export default function LastUploadIndicator() {
  const router = useRouter();
  const [data, setData] = useState<LastUploadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchLastUpload = useCallback(async (showRefreshingState = false) => {
    if (showRefreshingState) setRefreshing(true);
    try {
      const res = await fetch("/api/crimes/latest");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      }
    } catch (err) {
      console.error("Error fetching last upload data:", err);
    } finally {
      setLoading(false);
      if (showRefreshingState) {
        setTimeout(() => setRefreshing(false), 600);
      }
    }
  }, []);

  useEffect(() => {
    fetchLastUpload();
    // Uploads happen occasionally, not continuously — poll infrequently, this
    // is a batch record, not a live feed.
    const interval = setInterval(() => {
      fetchLastUpload();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchLastUpload]);

  if (!mounted) return null;

  // Helper to format relative time
  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "unknown";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "yesterday";
      if (diffDays < 30) return `${diffDays}d ago`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString ?? "unknown";
    }
  };

  const formatExactDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return null;
    }
  };

  // The calendar month of the most recent incident on record — the period the
  // dataset actually covers, not when it was imported.
  const formatAsOfMonth = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return null;
    }
  };

  const lastUpload = data?.lastUpload;
  const asOfMonth = formatAsOfMonth(data?.latestIncident?.dateCommitted);

  const tooltip = lastUpload
    ? [
        lastUpload.fileName && `File: ${lastUpload.fileName}`,
        typeof lastUpload.recordsImported === "number" &&
          `${lastUpload.recordsImported.toLocaleString()} records imported`,
        formatExactDate(lastUpload.createdAt) && `Uploaded ${formatExactDate(lastUpload.createdAt)}`,
        "Click to view raw data table in Cases",
      ]
        .filter(Boolean)
        .join("\n")
    : "No uploads yet";

  return (
    <button
      onClick={() => router.push("/dashboard/cases")}
      disabled={loading || !lastUpload}
      title={tooltip}
      className={`pointer-events-auto group relative flex items-center gap-2.5 h-11 pl-2.5 pr-3.5 transition-colors duration-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#273449] disabled:cursor-default disabled:hover:bg-transparent ${OVERLAY_SURFACE}`}
    >
      <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-400/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
        <CalendarClock className="h-4 w-4" />
      </div>

      <div className="flex flex-col text-left leading-tight">
        {loading ? (
          <span className="text-[12.5px] font-medium text-slate-400">Checking for data…</span>
        ) : asOfMonth ? (
          <>
            <span className="text-[13px] font-bold text-slate-900 dark:text-white whitespace-nowrap">
              As of {asOfMonth}
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Synced {formatTimeAgo(lastUpload?.createdAt)}
            </span>
          </>
        ) : (
          <span className="text-[12.5px] font-semibold text-slate-500 dark:text-slate-400">No uploads yet</span>
        )}
      </div>

      {lastUpload && (
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            fetchLastUpload(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              fetchLastUpload(true);
            }
          }}
          title="Refresh"
          className={`ml-0.5 p-1.5 -mr-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-opacity duration-150 shrink-0 ${
            refreshing ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          }`}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-[#0EA5E9]" : ""}`} />
        </div>
      )}
    </button>
  );
}
